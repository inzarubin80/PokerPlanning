package middleware

import (
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"net/http"
	"context"
	"github.com/gorilla/sessions"
)

type AuthMiddleware struct {
    h     http.Handler
    store *sessions.CookieStore
}

func NewAuthMiddleware(h http.Handler, store *sessions.CookieStore) *AuthMiddleware {

	return &AuthMiddleware{h: h, store: store}

}

func (m *AuthMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	session, err := m.store.Get(r, "session-name")
    if err != nil {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    userID, ok := session.Values[defenitions.UserID].(string)
    if !ok || userID == "" {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

	ctx = context.WithValue(ctx, defenitions.UserID, userID)

    m.h.ServeHTTP(w, r)

}
