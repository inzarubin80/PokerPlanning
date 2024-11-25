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
	serviceAddTargetTask interface {
		AddTargetTask(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) (error) 
	}
	AddTargetTaskHandler struct {
		name    string
		service serviceAddTargetTask
	}
)

func NewAddTargetTaskHandler(service serviceAddTargetTask, name string) *AddTargetTaskHandler {
	return &AddTargetTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *AddTargetTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context();
	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
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
	
	err = h.service.AddTargetTask(ctx, pokerID, model.TaskID(taskId))

	if err!=nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, []byte("{}"))
}
