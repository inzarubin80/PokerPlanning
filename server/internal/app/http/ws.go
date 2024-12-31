

package http

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	ws "inzarubin80/PokerPlanning/internal/app/ws"
	
)

type (
	servicePoker interface {
		GetPoker(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.Poker, error) 
	}
	WSPokerHandler struct {
		name    string
		service serviceGetPoker
		hub *ws.Hub
	}
)

func NewWSPokerHandler(service serviceGetPoker, name string, hub *ws.Hub) *WSPokerHandler {
	
	return &WSPokerHandler{
		name:    name,
		service: service,
		hub: hub,
	}

}

func (h *WSPokerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ws.ServeWs(h.hub, w, r)
}
