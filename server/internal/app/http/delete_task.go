package http

import (
	"context"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"math"
	"net/http"

	"github.com/google/uuid"
)

type (
	serviceDeleteTask interface {
		DeleteTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
	}
	DeleteTaskHandler struct {
		name    string
		service serviceDeleteTask
	}
)

func NewDeleteTaskHandler(service serviceDeleteTask, name string) *DeleteTaskHandler {
	return &DeleteTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *DeleteTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	validateParameters := []uhttp.ValidateParameter{{defenitions.ParamTaskID, 1, math.MaxInt64}}
	parameterValues, err := uhttp.ValidatePatchNumberParameters(r, validateParameters)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	taskId, _ := parameterValues[defenitions.ParamTaskID]

	err = h.service.DeleteTask(ctx, model.PokerID(pokerID), model.TaskID(taskId))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, []byte("{}"))

}
