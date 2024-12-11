package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"

	"github.com/gorilla/sessions"
)

type (
	serviceLogin interface {
		Login(ctx context.Context, providerKey string, authorizationCode string) (*model.AuthData, error)
	}
	LoginHandler struct {
		name    string
		service serviceLogin
		store   *sessions.CookieStore
	}

	ResponseLoginData struct {
		token  string
		userID model.UserID
	}

	RequestLoginData struct {
		authorizationCode string  `json:"authorization_code"`
		ProviderKey string        `json:"provider_key"`
	}
)

func NewLoginHandler(service serviceLogin, name string, store *sessions.CookieStore) *LoginHandler {
	return &LoginHandler{
		name:    name,
		service: service,
		store:   store,
	}
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var loginData *RequestLoginData
	err = json.Unmarshal(body, &loginData)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	authData, err := h.service.Login(ctx, loginData.ProviderKey, loginData.authorizationCode)

	session, _ := h.store.Get(r, defenitions.SessionAuthenticationName)
	session.Values[defenitions.Token] = string(authData.RefreshToken)
	err = session.Save(r, w)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	responseLoginData := &ResponseLoginData{
		token:  authData.AccessToken,
		userID: authData.UserID,
	}

	jsonResponseLoginData, err := json.Marshal(responseLoginData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	uhttp.SendSuccessfulResponse(w, jsonResponseLoginData)

}
