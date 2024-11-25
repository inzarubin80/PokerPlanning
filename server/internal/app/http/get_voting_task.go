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
		GetTargetTask(ctx context.Context, pokerID model.PokerID) (model.TaskID, error) 
	}
	GetTargetTaskHandler struct {
		name    string
		service serviceTargetTask
	}
)

func NewGetTargetTaskHandler(service serviceTargetTask, name string) *GetTargetTaskHandler {
	return &GetTargetTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *GetTargetTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context();
	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	taskID, err:= h.service.GetTargetTask(ctx, model.PokerID(pokerID))
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
