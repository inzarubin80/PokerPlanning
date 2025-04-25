package http

import (
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"net/http"
)

type (
	PingHandler struct {
		name string
	}
)

func NewPingHandlerHandler(name string) *PingHandler {
	return &PingHandler{
		name: name,
	}
}

func (h *PingHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	uhttp.SendSuccessfulResponse(w, []byte("{}"))

}
