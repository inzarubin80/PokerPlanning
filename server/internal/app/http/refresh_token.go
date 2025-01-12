package http

import (
	"context"
	"encoding/json"
	"github.com/gorilla/sessions"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

type (
	serviceRefreshToken interface {
		RefreshToken(ctx context.Context, refreshToken string) (*model.AuthData, error)
	}

	RefreshTokenHandler struct {
		name    string
		service serviceRefreshToken
		store   *sessions.CookieStore
	}
)

func NewRefreshTokenHandler(service serviceRefreshToken, name string, store *sessions.CookieStore) *RefreshTokenHandler {
	return &RefreshTokenHandler{
		name:    name,
		service: service,
		store:   store,
	}
}

func (h *RefreshTokenHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	session, err := h.store.Get(r, defenitions.SessionAuthenticationName)
	if err != nil {
		http.Error(w, "Unauthorized not session", http.StatusUnauthorized)
		return
	}

	tokenString, ok := session.Values[defenitions.Token].(string)
	if !ok {
		http.Error(w, "Unauthorized not Token", http.StatusUnauthorized)
		return
	}

	authData, err := h.service.RefreshToken(ctx, tokenString)
	if err != nil {
		http.Error(w, "Unauthorized not session", http.StatusUnauthorized)
		return
	}

	session.Values[defenitions.Token] = string(authData.RefreshToken)
	err = session.Save(r, w)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	responseLoginData := &ResponseLoginData{
		Token:  authData.AccessToken,
		UserID: authData.UserID,
	}

	jsonResponseLoginData, err := json.Marshal(responseLoginData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonResponseLoginData)

}
