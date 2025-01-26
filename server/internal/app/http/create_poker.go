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
	serviceCreatePoker interface {
		CreatePoker(ctx context.Context, userID model.UserID, pokerSettings *model.PokerSettings) (model.PokerID, error)
	}
	CreatePokerHandler struct {
		name    string
		service serviceCreatePoker
	}
)

func NewCreatePoker(service serviceCreatePoker, name string) *CreatePokerHandler {
	return &CreatePokerHandler{
		name:    name,
		service: service,
	}
}

func (h *CreatePokerHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var pokerSettings *model.PokerSettings
	err = json.Unmarshal(body, &pokerSettings)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	poker, err := h.service.CreatePoker(ctx, userID, pokerSettings)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonContent, err := json.Marshal(poker)

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}


	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)

}
