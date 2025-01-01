package http

import (
	"context"
	"encoding/json"
	"errors"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"time"
)

type (
	serviceGetPoker interface {
		GetPoker(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.Poker, error)
	}

	GetPokerHandler struct {
		name    string
		service serviceGetPoker
	}

	PokerToFrontend struct {
		ID        model.PokerID
		CreatedAt time.Time
		Name      string
		Autor     model.UserID
		IsAdmin   bool
		ActiveUsersID []model.UserID
		Users         map[model.UserID]*model.User
		
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


	ctx := r.Context()
	
	
	
	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		http.Error(w, "not user ID", http.StatusInternalServerError)
		return
	}
	
	poker, err := h.service.GetPoker(ctx, model.PokerID(poker_id), userID)

	if err != nil {
		if errors.Is(err, model.ErrorNotFound) {
			http.Error(w, "poker not Found", http.StatusNotFound)
			return
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	
	usersMap := make(map[model.UserID]*model.User)
	for _,v:=range poker.Users {
		usersMap[v.ID] = v
	}
	
	jsonContent, err := json.Marshal(&PokerToFrontend{
		ID:        model.PokerID(poker_id),
		CreatedAt: poker.CreatedAt,
		Name:      poker.Name,
		Autor:     poker.Autor,
		IsAdmin:   userID == poker.Autor,
		ActiveUsersID: poker.ActiveUsersID,
		Users: usersMap,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)

}
