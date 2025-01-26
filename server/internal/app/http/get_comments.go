package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

	"github.com/google/uuid"
)

type (
	serviceGetComments interface {
		GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error)
	}
	GetCommentsHandler struct {
		name    string
		service serviceGetComments
	}
)

func NewGetCommentsHandler(service serviceGetComments, name string) *GetCommentsHandler {
	return &GetCommentsHandler{
		name:    name,
		service: service,
	}
}

func (h *GetCommentsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
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

	comments, err := h.service.GetComments(ctx, model.PokerID(pokerID), 1)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonData, err := json.Marshal(comments)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, jsonData)
}
