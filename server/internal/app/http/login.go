package http

import (
	"context"
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
		jwtSecret  string
	}
)

func NewLoginHandler(service serviceLogin, name string, oauthConfig *oauth2.Config, store *sessions.CookieStore, jwtSecret string) *LoginHandler {
	return &LoginHandler{
		name:        name,
		service:     service,
		oauthConfig: oauthConfig,
		store:       store,
		jwtSecret: jwtSecret,
	}
}

func (h *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {


	fmt.Println("Зашли в обработчик Login")
	ctx := r.Context()
	authorizationCode := r.PathValue(defenitions.AuthorizationCode)

	if authorizationCode == "" {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, "Authorization code must be filled in")
		return
	}

	fmt.Println("authorizationCode" + authorizationCode)
	

	token, err := h.oauthConfig.Exchange(context.Background(), authorizationCode)
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


	tokenString,err := generateJWT(user, h.jwtSecret)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}
	

	session, _ := h.store.Get(r, defenitions.SessionAuthenticationName)
	session.Values[defenitions.Token] = string(tokenString)
	err = session.Save(r, w)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	uhttp.SendSuccessfulResponse(w, []byte(`{"success": true}`))

}


func generateJWT(user *model.User, jwtSecret string) (string, error) {
   
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        defenitions.UserID:user.ID,
        "exp":    time.Now().Add(time.Hour * 100).Unix(), 
    })

    tokenString, err := token.SignedString([]byte(jwtSecret))
    if err != nil {
        return "", err
    }

    return tokenString, nil
}