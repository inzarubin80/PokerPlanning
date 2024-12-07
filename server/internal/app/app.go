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

	a.mux.Handle(a.config.path.createPoker, middleware.NewAuthMiddleware(appHttp.NewCreatePoker(a.pokerService, a.config.path.createPoker), a.store))
	a.mux.Handle(a.config.path.getPoker,  middleware.NewAuthMiddleware(appHttp.NewGetPokerHandler(a.pokerService, a.config.path.getPoker), a.store))
	a.mux.Handle(a.config.path.createTask, middleware.NewAuthMiddleware(appHttp.NewAddTaskHandler(a.pokerService, a.config.path.createPoker), a.store))
	a.mux.Handle(a.config.path.getTasks, middleware.NewAuthMiddleware(appHttp.NewGetTasksHandler(a.pokerService, a.config.path.getTasks), a.store))
	a.mux.Handle(a.config.path.getTask, middleware.NewAuthMiddleware(appHttp.NewGetTaskHandler(a.pokerService, a.config.path.getTask), a.store))
	a.mux.Handle(a.config.path.deleteTask, middleware.NewAuthMiddleware(appHttp.NewDeleteTaskHandler(a.pokerService, a.config.path.deleteTask), a.store))
	a.mux.Handle(a.config.path.updateTask, middleware.NewAuthMiddleware(appHttp.NewUpdateTaskHandler(a.pokerService, a.config.path.updateTask), a.store))

	a.mux.Handle(a.config.path.addComent,  middleware.NewAuthMiddleware(appHttp.NewAddCommentHandler(a.pokerService, a.config.path.addComent), a.store))
	a.mux.Handle(a.config.path.getComents,  middleware.NewAuthMiddleware(appHttp.NewGetCommentsHandler(a.pokerService, a.config.path.getComents), a.store))

	a.mux.Handle(a.config.path.addVotingTask,  middleware.NewAuthMiddleware(appHttp.NewAddVotingTaskHandler(a.pokerService, a.config.path.addVotingTask), a.store))
	a.mux.Handle(a.config.path.getVotingTask,  middleware.NewAuthMiddleware(appHttp.NewGetVotingTaskHandler(a.pokerService, a.config.path.getVotingTask), a.store))
	a.mux.Handle(a.config.path.ws,  middleware.NewAuthMiddleware(appHttp.NewWSPokerHandler(a.pokerService, a.config.path.ws, a.hub), a.store))
	
	a.mux.Handle(a.config.path.login,  appHttp.NewLoginHandler(a.pokerService, a.config.path.login, a.oauthConfig, a.store))
	a.mux.Handle(a.config.path.session,  appHttp.NewGetSessionHandler(a.store, a.config.path.session))

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
		store       = sessions.NewCookieStore([]byte("415d2aa8f8e6453f92f050b937588b25")) 
		
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

