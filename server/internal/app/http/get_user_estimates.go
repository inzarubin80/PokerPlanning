package http

import (
	"context"
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

type (
	serviceGetUserEstimates interface {
		GetVotingResults(ctx context.Context, pokerID model.PokerID) (*model.VotingResult, error)
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
	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
		return
	}

	fmt.Println(userID)

	votingResults, err := h.service.GetVotingResults(ctx, model.PokerID(pokerID))
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
