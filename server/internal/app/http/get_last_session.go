package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"math"
	"net/http"
)

type (
	serviceGetLastSession interface {
		GetLastSession(ctx context.Context, userID model.UserID, page int32, pageSize int32) ([]*model.LastSessionPoker, error)
	}
	GetLastSessionHandler struct {
		name    string
		service serviceGetLastSession
	}
)

func NewGetLastSessionHandler(service serviceGetLastSession, name string) *GetLastSessionHandler {
	return &GetLastSessionHandler{
		name:    name,
		service: service,
	}
}

func (h *GetLastSessionHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	
	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
	}

	validateParameters := []uhttp.ValidateParameter{{defenitions.Page, 1, math.MaxInt32}, {defenitions.PageSize, 1, math.MaxInt32}}
	parameterValues, err := uhttp.ValidatePatchNumberParameters(r, validateParameters)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	res, err := h.service.GetLastSession(ctx,  userID, int32(parameterValues[defenitions.Page]), int32(parameterValues[defenitions.PageSize])) 
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	jsonData, err := json.Marshal(res)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonData)
}
