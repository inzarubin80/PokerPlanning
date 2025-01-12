package middleware

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"net/url"
	"github.com/gorilla/sessions"
)

type (
	AuthMiddleware struct {
		h       http.Handler
		store   *sessions.CookieStore
		service serviceAuth
	}

	serviceAuth interface {
		Authorization(ctx context.Context, accessToken string) (*model.Claims, error)
	}
)

func NewAuthMiddleware(h http.Handler, store *sessions.CookieStore, service serviceAuth) *AuthMiddleware {
	return &AuthMiddleware{h: h, store: store, service: service}
}

func (m *AuthMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	var accessToken string
	var err error

	accessToken, err = m.extractTokenFromHeader(r)

	if err != nil {
		http.Error(w, "Unauthorized not access token", http.StatusUnauthorized)
		return
	}

	claims, err := m.service.Authorization(ctx, accessToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	ctx = context.WithValue(ctx, defenitions.UserID, claims.UserID)
	newRequest := r.WithContext(ctx)
	m.h.ServeHTTP(w, newRequest)

}

func (m *AuthMiddleware) extractTokenFromHeader(r *http.Request) (string, error) {

	token := ""
	u, err := url.Parse(r.RequestURI)
	if err == nil {
		queryParams := u.Query()
		token = queryParams.Get("accessToken")
		if token != "" {
			return token, nil
		}
	}

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("отсутствует заголовок Authorization")
	}

	const prefix = "Bearer "
	if len(authHeader) < len(prefix) || authHeader[:len(prefix)] != prefix {
		return "", fmt.Errorf("неверный формат заголовка Authorization")
	}

	token = authHeader[len(prefix):]
	return token, nil
}
