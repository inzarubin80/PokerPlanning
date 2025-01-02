package middleware

import (

	"context"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

type (
	AdminMiddleware struct {
		h       http.Handler
		service serviceAdmin
	}

	serviceAdmin interface {
		UserIsAdmin(ctx context.Context, pokerID model.PokerID, userID model.UserID) (bool, error) 
	}
)

func NewAdminMiddleware(h http.Handler, service serviceAdmin) *AdminMiddleware {

	return &AdminMiddleware{h: h, service: service}
}

func (m *AdminMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
		return
	}


	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}


	isAdmin, err :=m.service.UserIsAdmin(ctx, model.PokerID(pokerID), userID)

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	if !isAdmin {
		uhttp.SendErrorResponse(w, http.StatusForbidden, "user is not admin")
		return
	}
	m.h.ServeHTTP(w, r)

}

