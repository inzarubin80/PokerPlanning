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
	serviceSetVotingState interface {
		SetVotingState(ctx context.Context, pokerID model.PokerID, actionVotingState string) (*model.VoteControlState, error)
	}

	SetVotingStateHandler struct {
		name    string
		service serviceSetVotingState
	}
)

func NewSetVotingStateHandler(service serviceSetVotingState, name string) *SetVotingStateHandler {
	return &SetVotingStateHandler{
		name:    name,
		service: service,
	}
}

func (h *SetVotingStateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	votingControlAction, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamVotingControlAction)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	state, err := h.service.SetVotingState(ctx, model.PokerID(pokerID), votingControlAction)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonData, err := json.Marshal(state)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonData)

}
