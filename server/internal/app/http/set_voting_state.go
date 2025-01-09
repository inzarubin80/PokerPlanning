package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"
)

type (
	serviceSetVotingState interface {
		SetVotingState(ctx context.Context, pokerID model.PokerID, actionVotingState string, estimate ...model.Estimate) (*model.VoteControlState, error)
	}

	SetVotingStateHandler struct {
		name    string
		service serviceSetVotingState
	}


	RequestBody struct {
		Result int `json:"result"`
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

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var requestBody RequestBody
	err = json.Unmarshal(body, &requestBody)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	state, err := h.service.SetVotingState(ctx, model.PokerID(pokerID), votingControlAction, model.Estimate(requestBody.Result))
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
