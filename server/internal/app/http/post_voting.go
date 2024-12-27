package http

import (
	"context"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"
)

type (
	serviceSetVoting interface {
		SetVoting(ctx context.Context, userEstimate *model.UserEstimate) error 
	}
	SetVotingHandler struct {
		name    string
		service serviceSetVoting
	}
)

func NewSetVotingHandler(service serviceSetVoting, name string) *SetVotingHandler {
	return &SetVotingHandler{
		name:    name,
		service: service,
	}
}

func (h *SetVotingHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context();
	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	estimate := string(body)
	if estimate == "" {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, "not  estimate")
		return
	}

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
		return
	}

	userEstimate := &model.UserEstimate{
		ID: -1,
		PokerID:  pokerID,
		UserID:   userID,
		Estimate: model.Estimate(estimate),
	}

	err = h.service.SetVoting(ctx, userEstimate)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	uhttp.SendSuccessfulResponse(w,  []byte("{}"))

}
