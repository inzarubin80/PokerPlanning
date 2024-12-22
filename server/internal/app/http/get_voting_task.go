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
	serviceTargetTask interface {
		GetVotingTask(ctx context.Context, pokerID model.PokerID, userID model.UserID)  (model.TaskID, model.Estimate, error) 
	}
	GetVotingTaskHandler struct {
		name    string
		service serviceTargetTask
	}

	VotingTask struct {
		TaskID    model.TaskID `json:"TaskID"`
		Estimate  model.Estimate `json:"Estimate"`
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

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
		return
	}

	taskID, estimate, err:= h.service.GetVotingTask(ctx, model.PokerID(pokerID), model.UserID(userID))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	} 
	
	jsonData, err := json.Marshal(&VotingTask{TaskID: taskID, Estimate: estimate})
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w,  jsonData)
	
}
