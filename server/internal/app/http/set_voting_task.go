package http

import (
	"context"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"math"
	"net/http"
)

type (
	serviceSetVotingTask interface {
		SetVotingTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) error
	}
	SetVotingTaskHandler struct {
		name    string
		service serviceSetVotingTask
	}
)

func NewSetVotingTaskHandler(service serviceSetVotingTask, name string) *SetVotingTaskHandler {
	return &SetVotingTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *SetVotingTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	validateParameters := []uhttp.ValidateParameter{{Fild: defenitions.ParamTaskID, Min: 1, Max: math.MaxInt64}}
	parameterValues, err := uhttp.ValidatePatchNumberParameters(r, validateParameters)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	taskId, _ := parameterValues[defenitions.ParamTaskID]

	err = h.service.SetVotingTask(ctx, model.PokerID(pokerID), model.TaskID(taskId))

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, []byte("{}"))
}
