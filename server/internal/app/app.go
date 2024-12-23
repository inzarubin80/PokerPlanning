package app

import (
	"context"
	"fmt"
	appHttp "inzarubin80/PokerPlanning/internal/app/http"
	ws "inzarubin80/PokerPlanning/internal/app/ws"
	"time"
	middleware "inzarubin80/PokerPlanning/internal/app/http/middleware"
	"inzarubin80/PokerPlanning/internal/model"
	repository "inzarubin80/PokerPlanning/internal/repository"
	service "inzarubin80/PokerPlanning/internal/service"
	"net/http"
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"
	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
	providerUserData "inzarubin80/PokerPlanning/internal/app/clients/provider_user_data"
	tokenservice "inzarubin80/PokerPlanning/internal/app/token_service"
)

const (
	readHeaderTimeoutSeconds = 3
)

type (
	mux interface {
		Handle(pattern string, handler http.Handler)
	}
	server interface {
		ListenAndServe() error
		Close() error
	}

	PokerService interface {
		CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error)
		GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error)

		AddTask(ctx context.Context, task *model.Task) (*model.Task, error)
		GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
		GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error)
		UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error)
		DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error

		AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error)
		GetComments(ctx context.Context, pokerID model.PokerID) ([]*model.Comment, error)
		UpdateComment(ctx context.Context, comment *model.Comment) (*model.Comment, error)
		RemoveComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) error

	    GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteState, model.Estimate, error) 
		AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error

		GetUserByEmail(ctx context.Context, userData *model.UserData) (*model.User, error)

		Login(ctx context.Context, providerKey string, authorizationCode string) (*model.AuthData, error)
		Authorization(context.Context, string) (*model.Claims, error)
		RefreshToken(ctx context.Context, refreshToken string) (*model.AuthData, error)

		AddVoting(ctx context.Context, userEstimate *model.UserEstimate) error 

	}

	TokenService interface {
		GenerateToken(userID model.UserID) (string, error)
		ValidateToken(tokenString string) (*model.Claims, error)
	}

	App struct {
		mux                        mux
		server                     server
		pokerService               PokerService
		config                     config
		hub                        *ws.Hub
		oauthConfig                *oauth2.Config
		store                      *sessions.CookieStore
		providersOauthConfFrontend []authinterface.ProviderOauthConfFrontend
	}
)

func (a *App) ListenAndServe() error {
	go a.hub.Run()

	handlers := map[string]http.Handler{
	
		a.config.path.createPoker:   appHttp.NewCreatePoker(a.pokerService, a.config.path.createPoker),
		a.config.path.getPoker:      appHttp.NewGetPokerHandler(a.pokerService, a.config.path.getPoker),
		a.config.path.createTask:    appHttp.NewAddTaskHandler(a.pokerService, a.config.path.createPoker),
		a.config.path.getTasks:      appHttp.NewGetTasksHandler(a.pokerService, a.config.path.getTasks),
		a.config.path.getTask:       appHttp.NewGetTaskHandler(a.pokerService, a.config.path.getTask),
		a.config.path.deleteTask:    appHttp.NewDeleteTaskHandler(a.pokerService, a.config.path.deleteTask),
		a.config.path.updateTask:    appHttp.NewUpdateTaskHandler(a.pokerService, a.config.path.updateTask),
		a.config.path.addComent:     appHttp.NewAddCommentHandler(a.pokerService, a.config.path.addComent),
		a.config.path.getComents:    appHttp.NewGetCommentsHandler(a.pokerService, a.config.path.getComents),
		a.config.path.setVotingTask: appHttp.NewAddVotingTaskHandler(a.pokerService, a.config.path.setVotingTask),
		a.config.path.getVotingState: appHttp.NewGetVotingStateHandler(a.pokerService, a.config.path.getVotingState),
	
		a.config.path.ping: appHttp.NewPingHandlerHandler(a.config.path.ping),
		a.config.path.vote: appHttp.NewAddVotingHandler(a.pokerService, a.config.path.vote),	
		a.config.path.ws:  appHttp.NewWSPokerHandler(a.pokerService, a.config.path.ws, a.hub),	
	}

	for path, handler := range handlers {
		a.mux.Handle(path, middleware.NewAuthMiddleware(handler, a.store, a.pokerService))
	}

	a.mux.Handle(a.config.path.login, appHttp.NewLoginHandler(a.pokerService, a.config.path.login, a.store))
	a.mux.Handle(a.config.path.session, appHttp.NewGetSessionHandler(a.store, a.config.path.session))
	a.mux.Handle(a.config.path.refreshToken, appHttp.NewRefreshTokenHandler(a.pokerService, a.config.path.refreshToken, a.store))
	a.mux.Handle(a.config.path.getProviders, appHttp.NewProvadersHandler(a.providersOauthConfFrontend, a.config.path.refreshToken))

	fmt.Println("start server")
	return a.server.ListenAndServe()
}

func NewApp(ctx context.Context, config config) (*App, error) {

	var (
		mux             = http.NewServeMux()
		pokerRepository = repository.NewPokerRepository(100)
		hub             = ws.NewHub()
		store           = sessions.NewCookieStore([]byte(config.sectrets.storeSecret))
	)

	accessTokenService := tokenservice.NewtokenService([]byte(config.sectrets.accessTokenSecret), 1*time.Hour, model.Access_Token_Type)
	refreshTokenService := tokenservice.NewtokenService([]byte(config.sectrets.refreshTokenSecret), 24*time.Hour, model.Refresh_Token_Type)

	providerOauthConfFrontend := []authinterface.ProviderOauthConfFrontend{}
	providers := make(authinterface.ProvidersUserData)
	for key, value := range config.provadersConf {

		providers[key] = providerUserData.NewProviderUserData(value.UrlUserData, value.Oauth2Config)

		providerOauthConfFrontend = append(providerOauthConfFrontend,
			authinterface.ProviderOauthConfFrontend{
				Provider: key,
				ClientId:    value.Oauth2Config.ClientID,
				RedirectUri: value.Oauth2Config.RedirectURL,
				AuthURL:     value.Oauth2Config.Endpoint.AuthURL,
				ImageBase64: value.ImageBase64,
			},
		)
	}

	pokerService := service.NewPokerService(pokerRepository, hub, accessTokenService, refreshTokenService, providers)

	return &App{
		mux:                        mux,
		server:                     &http.Server{Addr: config.addr, Handler: middleware.NewLogMux(mux), ReadHeaderTimeout: readHeaderTimeoutSeconds * time.Second},
		pokerService:               pokerService,
		config:                     config,
		hub:                        hub,
		store:                      store,
		providersOauthConfFrontend: providerOauthConfFrontend,
	}, nil

}
