package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

type (
	serviceCreatePoker interface {
		CreatePoker(ctx context.Context, userID model.UserID) (model.PokerID, error) 
	}
	CreatePokerHandler struct {
		name    string
		service serviceCreatePoker
	}
)

func NewCreatePoker(service serviceCreatePoker, name string) *CreatePokerHandler {
	return &CreatePokerHandler{
		name:    name,
		service: service,
	}
}

func (h *CreatePokerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx:= r.Context();
	poker, _:= h.service.CreatePoker(ctx, "123")
	jsonContent,_ := json.Marshal(poker)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)

}
