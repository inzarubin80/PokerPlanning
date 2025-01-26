package http

import (
	"context"
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

	"github.com/google/uuid"
)

type (
	serviceGetUserEstimates interface {
		GetVotingResults(ctx context.Context, pokerID model.PokerID, userID model.UserID) (*model.VotingResult, error)
	}

	GetUserEstimatesHandler struct {
		name    string
		service serviceGetUserEstimates
	}
)

func NewGetUserEstimatesHandler(service serviceGetUserEstimates, name string) *GetUserEstimatesHandler {
	return &GetUserEstimatesHandler{
		name:    name,
		service: service,
	}
}

func (h *GetUserEstimatesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	fmt.Println(userID)

	votingResults, err := h.service.GetVotingResults(ctx, model.PokerID(pokerID), userID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonData, err := json.Marshal(votingResults)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonData)

}
