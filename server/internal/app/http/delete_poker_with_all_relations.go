package http

import (
	"context"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"

	"net/http"
)

type (
	serviceDeletePokerWithAllRelations interface {
		DeletePokerWithAllRelations(ctx context.Context, pokerID model.PokerID) error 
	}
	DeletePokerWithAllRelationsHandler struct {
		name    string
		service serviceDeletePokerWithAllRelations
	}
)

func NewDeletePokerWithAllRelationsHandler (service serviceDeletePokerWithAllRelations, name string) *DeletePokerWithAllRelationsHandler {
	return &DeletePokerWithAllRelationsHandler{
		name:    name,
		service: service,
	}
}

func (h *DeletePokerWithAllRelationsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	
	ctx := r.Context()
	
	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = h.service.DeletePokerWithAllRelations(ctx, model.PokerID(pokerID))
	
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w, []byte("{}"))
	
}
