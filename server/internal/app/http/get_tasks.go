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
	serviceGetTasks interface {
		GetTasks(ctx context.Context, pokerID model.PokerID) ([]*model.Task, error)
	}
	GetTasksHandler struct {
		name    string
		service serviceGetTasks
	}
)

func NewGetTasksHandler(service serviceGetTasks, name string) *GetTasksHandler {
	return &GetTasksHandler{
		name:    name,
		service: service,
	}
}

func (h *GetTasksHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	tasks, err := h.service.GetTasks(ctx, model.PokerID(pokerID))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonData, err := json.Marshal(tasks)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, jsonData)
}
