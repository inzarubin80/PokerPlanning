package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
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

	ctx := r.Context();
	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
	if err != nil {
		uhttp.SendResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	tasks, err := h.service.GetTasks(ctx, pokerID)
	if err != nil {
		uhttp.SendResponse(w, http.StatusInternalServerError, []byte("{}"))
		return
	}

	jsonData, err := json.Marshal(tasks)
	if err != nil {
		uhttp.SendResponse(w, http.StatusInternalServerError, []byte("{}"))
		return
	}

	uhttp.SendResponse(w, http.StatusOK, jsonData)

}
