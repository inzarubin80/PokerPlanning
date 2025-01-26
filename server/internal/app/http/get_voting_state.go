package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

	"github.com/google/uuid"
)

type (
	serviceTargetTask interface {
		GetVotingState(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VoteControlState, error)
	}

	GetVotingStateHandler struct {
		name    string
		service serviceTargetTask
	}
)

func NewGetVotingStateHandler(service serviceTargetTask, name string) *GetVotingStateHandler {
	return &GetVotingStateHandler{
		name:    name,
		service: service,
	}
}

func (h *GetVotingStateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
		return
	}

	state, err := h.service.GetVotingState(ctx, model.PokerID(pokerID), model.UserID(userID))
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
