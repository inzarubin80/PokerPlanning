package app

import (
	"context"
	"fmt"
	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
	providerUserData "inzarubin80/PokerPlanning/internal/app/clients/provider_user_data"
	appHttp "inzarubin80/PokerPlanning/internal/app/http"
	middleware "inzarubin80/PokerPlanning/internal/app/http/middleware"
	tokenservice "inzarubin80/PokerPlanning/internal/app/token_service"
	ws "inzarubin80/PokerPlanning/internal/app/ws"
	"inzarubin80/PokerPlanning/internal/model"
	repository "inzarubin80/PokerPlanning/internal/repository"
	service "inzarubin80/PokerPlanning/internal/service"
	"net/http"
	"time"

	"github.com/gorilla/sessions"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
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
		CreatePoker(ctx context.Context, userID model.UserID, pokerSettings *model.PokerSettings) (model.PokerID, error)
		GetPoker(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.Poker, error)
		AddTask(ctx context.Context, task *model.Task) (*model.Task, error)
		GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
		GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error)
		UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error)
		DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
		CreateComent(ctx context.Context, comment *model.Comment) (*model.Comment, error)
		GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error)
		GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteControlState, error)
		SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
		SetVotingState(ctx context.Context, pokerID model.PokerID, actionVotingState string, estimate ...model.Estimate) (*model.VoteControlState, error)
		GetUser(ctx context.Context, userID model.UserID) (*model.User, error)
		Login(ctx context.Context, providerKey string, authorizationCode string) (*model.AuthData, error)
		Authorization(context.Context, string) (*model.Claims, error)
		RefreshToken(ctx context.Context, refreshToken string) (*model.AuthData, error)
		GetPokerUsers(ctx context.Context, pokerID model.PokerID) ([]*model.User, error)
		SetVoting(ctx context.Context, userEstimate *model.UserEstimate, userID model.UserID) error
		GetVotingResults(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.VotingResult, error)
		UserIsAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) (bool, error)
		SetUserName(ctx context.Context, userID model.UserID, name string) error
		SetUserSettings(ctx context.Context, userID model.UserID, userSettings *model.UserSettings) error
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
		a.config.path.createPoker:           appHttp.NewCreatePoker(a.pokerService, a.config.path.createPoker),
		a.config.path.getPoker:              appHttp.NewGetPokerHandler(a.pokerService, a.config.path.getPoker),
		a.config.path.createTask:            middleware.NewAdminMiddleware(appHttp.NewAddTaskHandler(a.pokerService, a.config.path.createPoker), a.pokerService),
		a.config.path.getTasks:              appHttp.NewGetTasksHandler(a.pokerService, a.config.path.getTasks),
		a.config.path.getTask:               appHttp.NewGetTaskHandler(a.pokerService, a.config.path.getTask),
		a.config.path.deleteTask:            middleware.NewAdminMiddleware(appHttp.NewDeleteTaskHandler(a.pokerService, a.config.path.deleteTask), a.pokerService),
		a.config.path.updateTask:            middleware.NewAdminMiddleware(appHttp.NewUpdateTaskHandler(a.pokerService, a.config.path.updateTask), a.pokerService),
		a.config.path.addComent:             appHttp.NewAddCommentHandler(a.pokerService, a.config.path.addComent),
		a.config.path.getComents:            appHttp.NewGetCommentsHandler(a.pokerService, a.config.path.getComents),
		a.config.path.getUser:               appHttp.NewGetUserHandler(a.store, a.config.path.getUser, a.pokerService),
		a.config.path.setVotingTask:         middleware.NewAdminMiddleware(appHttp.NewSetVotingTaskHandler(a.pokerService, a.config.path.setVotingTask), a.pokerService),
		a.config.path.getVotingControlState: appHttp.NewGetVotingStateHandler(a.pokerService, a.config.path.getVotingControlState),
		a.config.path.getUserEstimates:      appHttp.NewGetUserEstimatesHandler(a.pokerService, a.config.path.getUserEstimates),
		a.config.path.setVotingControlState: middleware.NewAdminMiddleware(appHttp.NewSetVotingStateHandler(a.pokerService, a.config.path.setVotingControlState), a.pokerService),
		a.config.path.ping:                  appHttp.NewPingHandlerHandler(a.config.path.ping),
		a.config.path.vote:                  appHttp.NewSetVotingHandler(a.pokerService, a.config.path.vote),
		a.config.path.ws:                    appHttp.NewWSPokerHandler(a.pokerService, a.config.path.ws, a.hub),
		a.config.path.setUserName:           appHttp.NewSetUserNameHandler(a.pokerService, a.config.path.setUserName),
		a.config.path.setUserSettings:       appHttp.NewSetUserSettingsHandler(a.pokerService, a.config.path.setUserSettings),
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

func NewApp(ctx context.Context, config config, dbConn *pgxpool.Pool) (*App, error) {

	var (
		mux             = http.NewServeMux()
		pokerRepository = repository.NewPokerRepository(100, dbConn)
		hub             = ws.NewHub()
		store           = sessions.NewCookieStore([]byte(config.sectrets.storeSecret))
	)

	accessTokenService := tokenservice.NewtokenService([]byte(config.sectrets.accessTokenSecret), 1*time.Hour, model.Access_Token_Type)
	refreshTokenService := tokenservice.NewtokenService([]byte(config.sectrets.refreshTokenSecret), 24*time.Hour, model.Refresh_Token_Type)

	providerOauthConfFrontend := []authinterface.ProviderOauthConfFrontend{}
	providers := make(authinterface.ProvidersUserData)
	for key, value := range config.provadersConf {

		providers[key] = providerUserData.NewProviderUserData(value.UrlUserData, value.Oauth2Config, key)

		providerOauthConfFrontend = append(providerOauthConfFrontend,
			authinterface.ProviderOauthConfFrontend{
				Provider:    key,
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
