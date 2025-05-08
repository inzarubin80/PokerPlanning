package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

)

type (
	serviceGetLastSession interface {
		GetLastSession(ctx context.Context, UserID model.UserID) ([]*model.LastSessionPoker, error)
	}
	GetLastSessionHandler struct {
		name    string
		service serviceGetLastSession
	}
)

func NewGetLastSessionHandler(service serviceGetLastSession, name string) *GetLastSessionHandler {
	return &GetLastSessionHandler{
		name:    name,
		service: service,
	}
}

func (h *GetLastSessionHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	
	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
	}

	res, err := h.service.GetLastSession(ctx,  userID) 
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	jsonData, err := json.Marshal(res)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonData)
}
