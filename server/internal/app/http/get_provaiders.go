package http

import (
	"encoding/json"
	authinterface "inzarubin80/PokerPlanning/internal/app/authinterface"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"net/http"
)

type (
	GetProvadersHandler struct {
		name                      string
		providerOauthConfFrontend []authinterface.ProviderOauthConfFrontend
	}
)

func NewProvadersHandler(providerOauthConfFrontend []authinterface.ProviderOauthConfFrontend, name string) *GetProvadersHandler {
	return &GetProvadersHandler{
		name:                      name,
		providerOauthConfFrontend: providerOauthConfFrontend,
	}
}

func (h *GetProvadersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	jsonContent, err := json.Marshal(h.providerOauthConfFrontend)

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonContent)

}
