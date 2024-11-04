package app

import (
	"context"
	"fmt"
	appHttp "inzarubin80/PokerPlanning/internal/app/http"
	middleware "inzarubin80/PokerPlanning/internal/app/http/middleware"
	"inzarubin80/PokerPlanning/internal/model"
	repository "inzarubin80/PokerPlanning/internal/repository"
	service "inzarubin80/PokerPlanning/internal/service"
	"net/http"
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
		AddComment(ctx context.Context, pokerID model.PokerID, comment *model.Comment) (model.CommentID, error)
		SetUserEstimate(ctx context.Context, pokerID model.PokerID, userID model.UserID, userEstimate *model.UserEstimate) (model.EstimateID, error)
		SetTargetTask(ctx context.Context, pokerID model.PokerID, userID model.UserID, taskID model.TaskID) error
	}

	App struct {
		mux          mux
		server       server
		pokerService PokerService
		config       config
	}
)

func (a *App) ListenAndServe() error {
	a.mux.Handle(a.config.path.createPoker, appHttp.NewCreatePoker(a.pokerService, a.config.path.createPoker))
	a.mux.Handle(a.config.path.getPoker, appHttp.NewGetPokerHandler(a.pokerService, a.config.path.getPoker))
	fmt.Println("start server")
	return a.server.ListenAndServe()
}


func NewApp(ctx context.Context, config config) (*App, error) {

	var (
		mux            = http.NewServeMux()
		pokerRepository = repository.NewPokerRepository(100)
		pokerService    = service.NewPokerService(pokerRepository)
	)

	return &App{
		mux:         mux,
		server:      &http.Server{Addr: config.addr, Handler: middleware.NewLogMux(mux)},
		pokerService: pokerService,
		config:config,
	}, nil

}

