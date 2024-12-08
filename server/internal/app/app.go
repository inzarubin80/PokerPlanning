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
	"golang.org/x/oauth2/yandex"		
)

const (
	readHeaderTimeoutSeconds = 3
	storeSecret = "415d2aa8f8e6453f92f050b937588b25"
	jwtSecret = "415d2aa8f8e6453dddddddf92f050b937588b25"
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
		GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID ) (*model.Task, error)
		UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) 
		DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID ) (error) 

		AddComment(ctx context.Context,    comment *model.Comment) (*model.Comment, error) 
		GetComments(ctx context.Context,   pokerID model.PokerID) ([]*model.Comment, error)
		UpdateComment(ctx context.Context, comment *model.Comment) (*model.Comment, error)
		RemoveComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) error 
	
		GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) 
		AddVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (error) 

		GetUserByEmail(ctx context.Context, userData *model.UserData) (*model.User, error) 
	}

	App struct {
		mux          mux
		server       server
		pokerService PokerService
		config       config
		hub 		*ws.Hub
		oauthConfig *oauth2.Config
		store *sessions.CookieStore
	}
)

func (a *App) ListenAndServe() error {
	go a.hub.Run()

	handlers := map[string]http.Handler{
		a.config.path.createPoker: appHttp.NewCreatePoker(a.pokerService, a.config.path.createPoker),
		a.config.path.getPoker:    appHttp.NewGetPokerHandler(a.pokerService, a.config.path.getPoker),
		a.config.path.createTask:  appHttp.NewAddTaskHandler(a.pokerService, a.config.path.createPoker),
		a.config.path.getTasks:    appHttp.NewGetTasksHandler(a.pokerService, a.config.path.getTasks),
		a.config.path.getTask:     appHttp.NewGetTaskHandler(a.pokerService, a.config.path.getTask),
		a.config.path.deleteTask:  appHttp.NewDeleteTaskHandler(a.pokerService, a.config.path.deleteTask),
		a.config.path.updateTask:  appHttp.NewUpdateTaskHandler(a.pokerService, a.config.path.updateTask),
		a.config.path.addComent:   appHttp.NewAddCommentHandler(a.pokerService, a.config.path.addComent),
		a.config.path.getComents:  appHttp.NewGetCommentsHandler(a.pokerService, a.config.path.getComents),
		a.config.path.addVotingTask: appHttp.NewAddVotingTaskHandler(a.pokerService, a.config.path.addVotingTask),
		a.config.path.getVotingTask: appHttp.NewGetVotingTaskHandler(a.pokerService, a.config.path.getVotingTask),
		a.config.path.ws:          appHttp.NewWSPokerHandler(a.pokerService, a.config.path.ws, a.hub),
	}

	for path, handler := range handlers {
		a.mux.Handle(path, middleware.NewAuthMiddleware(handler, a.store, a.oauthConfig, jwtSecret))
	}

	a.mux.Handle(a.config.path.login, appHttp.NewLoginHandler(a.pokerService, a.config.path.login, a.oauthConfig, a.store, jwtSecret))
	a.mux.Handle(a.config.path.session, appHttp.NewGetSessionHandler(a.store, a.config.path.session))

	fmt.Println("start server")
	return a.server.ListenAndServe()
}

func NewApp(ctx context.Context, config config) (*App, error) {

	var (
		mux            = http.NewServeMux()
		pokerRepository = repository.NewPokerRepository(100)
		hub = ws.NewHub()
		pokerService    = service.NewPokerService(pokerRepository, hub)

		oauthConfig = &oauth2.Config{
			ClientID:     "415d2aa8f8e6453f92f050b937588b25",
			ClientSecret: "1d4a98b4709146e19f138fee68b9d46f",
			RedirectURL:  "http://localhost:8000/YandexAuthCallback",
			Scopes:       []string{"login:email", "login:info"},
			Endpoint:     yandex.Endpoint,
			
		}

		store       = sessions.NewCookieStore([]byte(storeSecret)) 
	)

	return &App{
		mux:         mux,
		server:      &http.Server{Addr: config.addr, Handler: middleware.NewLogMux(mux), ReadHeaderTimeout: readHeaderTimeoutSeconds * time.Second},
		pokerService: pokerService,
		config:config,
		hub: hub,
		oauthConfig:oauthConfig,
		store: store,
	}, nil

}
