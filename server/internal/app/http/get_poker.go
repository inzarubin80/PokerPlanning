package http

import (
	"context"
	"encoding/json"
	"errors"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"time"

	"github.com/google/uuid"
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
		ID                 model.PokerID
		CreatedAt          time.Time
		Name               string
		Autor              model.UserID
		IsAdmin            bool
		ActiveUsersID      []model.UserID
		Admins             []model.UserID
		Users              []*model.User
		EvaluationStrategy string
		MaximumScore       int
	}
)

func NewGetPokerHandler(service serviceGetPoker, name string) *GetPokerHandler {
	return &GetPokerHandler{
		name:    name,
		service: service,
	}
}

func (h *GetPokerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	

	strPokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}


	pokerID, err := uuid.Parse(strPokerID)
    if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest,"Error parsing UUID:")
		     return
    }


	ctx := r.Context()

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		http.Error(w, "not user ID", http.StatusInternalServerError)
		return
	}

	poker, err := h.service.GetPoker(ctx, model.PokerID(pokerID), userID)

	if err != nil {
		if errors.Is(err, model.ErrorNotFound) {
			http.Error(w, "poker not Found", http.StatusNotFound)
			return
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	isAdmin := false
	for _, id := range poker.Admins {
		if id == userID {
			isAdmin = true
			break
		}
	}

	jsonContent, err := json.Marshal(&PokerToFrontend{
		ID:                 model.PokerID(pokerID),
		CreatedAt:          poker.CreatedAt,
		Name:               poker.Name,
		Autor:              poker.Autor,
		IsAdmin:            isAdmin,
		ActiveUsersID:      poker.ActiveUsersID,
		Users:              poker.Users,
		EvaluationStrategy: poker.EvaluationStrategy,
		MaximumScore:       poker.MaximumScore,
	})

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)

}
