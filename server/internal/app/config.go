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
		index, getPoker,  createPoker, createTask, getTasks, getTask, updateTask, deleteTask,getComents, addComent,ws string
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
			
			createTask:  fmt.Sprintf("POST /poker/{%s}/tasks", defenitions.ParamPokerID),
			getTasks:  	 fmt.Sprintf("GET /poker/{%s}/tasks", defenitions.ParamPokerID),
			getTask:  	 fmt.Sprintf("GET /poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			updateTask:  fmt.Sprintf("PUT /poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),	
			deleteTask:  fmt.Sprintf("DELETE /poker/{%s}/tasks/{%s}", defenitions.ParamPokerID, defenitions.ParamTaskID),
			
			getComents:  	 fmt.Sprintf("GET /poker/{%s}/comments", defenitions.ParamPokerID),
			addComent:  	 fmt.Sprintf("POST /poker/{%s}/comments", defenitions.ParamPokerID),
			
			getPoker:    fmt.Sprintf("GET /poker/{%s}", defenitions.ParamPokerID),
			ws:    		 fmt.Sprintf("GET /ws/{%s}", defenitions.ParamPokerID),		

		},
	}
}
