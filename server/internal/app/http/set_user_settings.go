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
	serviceSetUserSettings interface {
		SetUserSettings(ctx context.Context, userID model.UserID, userSettings *model.UserSettings) error
	}
	SetUserSettingsHandler struct {
		name    string
		service serviceSetUserSettings
	}
)

func NewSetUserSettingsHandler(service serviceSetUserSettings, name string) *SetUserSettingsHandler {
	return &SetUserSettingsHandler{
		name:    name,
		service: service,
	}
}

func (h *SetUserSettingsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

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

	var userSettings *model.UserSettings
	err = json.Unmarshal(body, &userSettings)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = h.service.SetUserSettings(ctx, model.UserID(userID), userSettings)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	}

	uhttp.SendSuccessfulResponse(w, []byte("{}"))

}
