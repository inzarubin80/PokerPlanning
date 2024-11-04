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
		index, getPoker,  createPoker string
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
			index:          "/",
			createPoker:   fmt.Sprintf("POST /poker"),
			getPoker:    fmt.Sprintf("GET /poker/{%s}", defenitions.ParamPokerID),
		},
	}
}
