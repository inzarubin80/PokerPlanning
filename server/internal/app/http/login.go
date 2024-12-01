package http

import (
	"context"
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"github.com/gorilla/sessions"
	"golang.org/x/oauth2"
)

type (
	serviceLogin interface {
		GetUserByEmail(ctx context.Context, userData *model.UserData) (*model.User, error) 
	}
	LoginHandler struct {
		name        string
		service     serviceLogin
		oauthConfig *oauth2.Config
		store       *sessions.CookieStore
	}
)

func NewLoginHandler(service serviceLogin, name string, oauthConfig *oauth2.Config, store *sessions.CookieStore) *LoginHandler {
	return &LoginHandler{
		name:        name,
		service:     service,
		oauthConfig: oauthConfig,
		store:       store,
	}
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	authorizationCode := r.PathValue(defenitions.AuthorizationCode)

	if authorizationCode == "" {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, "Authorization code must be filled in")
		return
	}

	code := r.FormValue("code")
	token, err := h.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, fmt.Errorf("Code exchange failed with '%s'\n", err).Error())
		return
	}

	client := h.oauthConfig.Client(context.Background(), token)
	response, err := client.Get("https://login.yandex.ru/info?format=json")
	if err != nil {	
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "Failed to get user info")
		return
	}
	defer response.Body.Close()

	var profile map[string]interface{}
	if err := json.NewDecoder(response.Body).Decode(&profile); err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "Failed to decode user info")		
		return
	}

	displayName, ok := profile[defenitions.DisplayName].(string)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "Display name not found")
		return
	}

	default_email, ok := profile[defenitions.DefaultEmail].(string)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "Default email not found")
		return
	}

	userData := &model.UserData{
		Name: displayName,
		Email: default_email,
	}

	user, err:= h.service.GetUserByEmail(ctx, userData)

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	
	session, _ := h.store.Get(r, "session-name")
	session.Values[defenitions.UserID] = user.ID
	session.Save(r, w)

	uhttp.SendSuccessfulResponse(w, []byte("{}"))

}
