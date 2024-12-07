package app

import (
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
)

type (
	Options struct {
		Addr string
	}
	path struct {
		index, getPoker, createPoker, createTask, getTasks, getTask, updateTask, deleteTask, getComents, addComent, addVotingTask, getVotingTask, ws, login, session string
	}
	config struct {
		addr string
		path path
	}
)

func NewConfig(opts Options) config {
	return config{
		addr: opts.Addr,
		path: path{

			index:       "/",
			createPoker: "POST /api/poker",
			login:       fmt.Sprintf("GET /api/user/login/{%s}", defenitions.AuthorizationCode),
			session:     fmt.Sprintf("GET /api/user/session"),
			createTask:  fmt.Sprintf("POST /api/poker/{%s}/tasks", defenitions.ParamPokerID),
			getTasks:    fmt.Sprintf("GET /api/poker/{%s}/tasks", defenitions.ParamPokerID),
			getTask:     fmt.Sprintf("GET /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			updateTask:  fmt.Sprintf("PUT /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			deleteTask:  fmt.Sprintf("DELETE /api/poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),

			getComents: fmt.Sprintf("GET /api/poker/{%s}/comments", defenitions.ParamPokerID),
			addComent:  fmt.Sprintf("POST /api/poker/{%s}/comments", defenitions.ParamPokerID),

			addVotingTask: fmt.Sprintf("POST /api/poker/{%s}/votingtask/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			getVotingTask: fmt.Sprintf("GET /api/poker/{%s}/votingtask", defenitions.ParamPokerID),

			getPoker: fmt.Sprintf("GET /api/poker/{%s}", defenitions.ParamPokerID),
			ws:       fmt.Sprintf("GET /api/ws/{%s}", defenitions.ParamPokerID),
		},
	}
}
