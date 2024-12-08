package middleware

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"

	"github.com/golang-jwt/jwt"
	"github.com/gorilla/sessions"
	oauth2 "golang.org/x/oauth2"
)

type AuthMiddleware struct {
	h           http.Handler
	store       *sessions.CookieStore
	oauthConfig *oauth2.Config
	jwtSecret   string
}

func NewAuthMiddleware(h http.Handler, store *sessions.CookieStore, oauthConfig *oauth2.Config, jwtSecret string) *AuthMiddleware {

	return &AuthMiddleware{h: h, store: store, oauthConfig: oauthConfig, jwtSecret: jwtSecret}
}

func (m *AuthMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	session, err := m.store.Get(r, defenitions.SessionAuthenticationName)
	if err != nil {
		http.Error(w, "Unauthorized not session", http.StatusUnauthorized)
		return
	}

	tokenString, ok := session.Values[defenitions.Token].(string)
	if !ok {
		http.Error(w, "Unauthorized not Token", http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(m.jwtSecret), nil
	})

	if err != nil {
		http.Error(w, "Unauthorized not valid token", http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
	
		userId, ok := claims[defenitions.UserID]
		if !ok {
			http.Error(w, "Unauthorized not userId", http.StatusUnauthorized)
			return
		}
		userID := model.TaskID(userId.(float64))
		context.WithValue(r.Context(), defenitions.UserID, userID)
		m.h.ServeHTTP(w, r)
	} else {
		http.Error(w, "Unauthorized not userId", http.StatusUnauthorized)
	}

}
