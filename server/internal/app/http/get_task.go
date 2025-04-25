package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"math"
	"net/http"

)

type (
	serviceGetTask interface {
		GetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (*model.Task, error)
	}
	GetTaskHandler struct {
		name    string
		service serviceGetTask
	}
)

func NewGetTaskHandler(service serviceGetTask, name string) *GetTaskHandler {
	return &GetTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *GetTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	
	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	validateParameters := []uhttp.ValidateParameter{{defenitions.ParamTaskID, 1, math.MaxInt64}}
	parameterValues, err := uhttp.ValidatePatchNumberParameters(r, validateParameters)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	taskId, _ := parameterValues[defenitions.ParamTaskID]

	task, err := h.service.GetTask(ctx, model.PokerID(pokerID), model.TaskID(taskId))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonData, err := json.Marshal(task)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, jsonData)

}
