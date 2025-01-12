package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

	"github.com/gorilla/sessions"
)

type (
	GetUserService interface {
		GetUser(ctx context.Context, userID model.UserID) (*model.User, error)
	}

	GetUserHandler struct {
		name    string
		store   *sessions.CookieStore
		service GetUserService
	}
)

func NewGetUserHandler(store *sessions.CookieStore, name string, service GetUserService) *GetUserHandler {
	return &GetUserHandler{
		name:    name,
		store:   store,
		service: service,
	}
}

func (h *GetUserHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
	}

	user, err := h.service.GetUser(ctx, model.UserID(userID))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())

	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, jsonData)

}
