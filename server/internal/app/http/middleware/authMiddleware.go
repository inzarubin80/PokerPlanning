package middleware

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"net/http"

	"github.com/gorilla/sessions"
	oauth2 "golang.org/x/oauth2"
)

type AuthMiddleware struct {
	h           http.Handler
	store       *sessions.CookieStore
	oauthConfig *oauth2.Config
}

func NewAuthMiddleware(h http.Handler, store *sessions.CookieStore, oauthConfig *oauth2.Config) *AuthMiddleware {

	return &AuthMiddleware{h: h, store: store, oauthConfig: oauthConfig}
}

func (m *AuthMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	session, err := m.store.Get(r, defenitions.SessionAuthenticationName)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tokenByte, ok := session.Values[defenitions.Token].(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID, ok := session.Values[defenitions.UserID].(int64)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var token *oauth2.Token
	err = json.Unmarshal([]byte(tokenByte), token)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	newToken, err := m.oauthConfig.TokenSource(ctx, token).Token()
	if err != nil || newToken == nil  {
		uhttp.SendErrorResponse(w, http.StatusUnauthorized, err.Error())
		return
	}

	if newToken.AccessToken != token.AccessToken {

		jsonToken, err := json.Marshal(newToken)
		if err != nil {
			uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
			return
		}

		session, _ := m.store.Get(r, defenitions.SessionAuthenticationName)
		session.Values[defenitions.UserID] = userID
		session.Values[defenitions.Token] = jsonToken
		err = session.Save(r, w)
	}

	ctx = context.WithValue(ctx, defenitions.UserID, userID)
	m.h.ServeHTTP(w, r)

}
