package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

type (
	serviceGetPoker interface {
		GetPoker(ctx context.Context, pokerID model.PokerID) (*model.Poker, error) 
	}
	GetPokerHandler struct {
		name    string
		service serviceGetPoker
	}
)

func NewGetPokerHandler(service serviceGetPoker, name string) *GetPokerHandler {
	return &GetPokerHandler{
		name:    name,
		service: service,
	}
}

func (h *GetPokerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	poker_id := r.PathValue("poker_id")

	ctx:= r.Context();
	poker, _:= h.service.GetPoker(ctx, model.PokerID(poker_id))
	jsonContent,_ := json.Marshal(poker)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)


}
