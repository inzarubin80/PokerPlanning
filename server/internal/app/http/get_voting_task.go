package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/model"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"net/http"
)

type (
	serviceTargetTask interface {
		GetVotingTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) 
	}
	GetVotingTaskHandler struct {
		name    string
		service serviceTargetTask
	}
)

func NewGetVotingTaskHandler(service serviceTargetTask, name string) *GetVotingTaskHandler {
	return &GetVotingTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *GetVotingTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context();
	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	taskID, err:= h.service.GetVotingTask(ctx, model.PokerID(pokerID))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	} 
	
	jsonData, err := json.Marshal(taskID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w,  jsonData)
	
}
