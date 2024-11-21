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
		index, getPoker,  createPoker, createTask, getTasks, getTask, updateTask, ws string
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
			createPoker: "POST /poker",
			createTask:  fmt.Sprintf("POST /poker/{%s}/task", defenitions.ParamPokerID),
			getTasks:  	 fmt.Sprintf("GET /poker/{%s}/tasks", defenitions.ParamPokerID),
			getTask:  	 fmt.Sprintf("GET /poker/{%s}/task/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			updateTask:  fmt.Sprintf("PUT /poker/{%s}/task/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),		
			getPoker:    fmt.Sprintf("GET /poker/{%s}", defenitions.ParamPokerID),
			ws:    		 fmt.Sprintf("GET /ws/{%s}", defenitions.ParamPokerID),		
		},
	}
}
