package http

import (
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"net/http"

	"github.com/gorilla/sessions"
)

type (
	GetSessionHandler struct {
		name    string
		store       *sessions.CookieStore
	}	
)

func NewGetSessionHandler(store *sessions.CookieStore, name string) *GetSessionHandler {
	return &GetSessionHandler{
		name:    name,
		store:   store,
	}
}

func (h *GetSessionHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	session, err := h.store.Get(r, defenitions.SessionAuthenticationName)
    if err != nil {
       uhttp.SendSuccessfulResponse(w, []byte("{0}"))
        return
    }

	userID, ok := session.Values[defenitions.UserID].(string)
    if !ok || userID == "" {
		uhttp.SendSuccessfulResponse(w, []byte("{0}"))
        return
	}

	jsonData, err := json.Marshal(userID)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	uhttp.SendSuccessfulResponse(w,  jsonData)

}
