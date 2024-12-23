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
		GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteState, model.Estimate, error) 
	}
	
	GetVotingStateHandler struct {
		name    string
		service serviceTargetTask
	}

	VotingState struct {
		VoteState    *model.VoteState `json:"VoteState"`
		Estimate  model.Estimate   `json:"Estimate"`
	}

)

func NewGetVotingStateHandler(service serviceTargetTask, name string) *GetVotingStateHandler {
	return &GetVotingStateHandler{
		name:    name,
		service: service,
	}
}

func (h *GetVotingStateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	state, estimate, err:= h.service.GetVotingState(ctx, model.PokerID(pokerID), model.UserID(userID))
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	} 
	
	jsonData, err := json.Marshal(&VotingState{VoteState: state, Estimate: estimate})
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w,  jsonData)
		
}
