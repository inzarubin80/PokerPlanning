package uhttp

import (
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
)

func ValidatePatchParameterPokerID(r *http.Request) (model.PokerID, error) {
	pokerID := r.PathValue(defenitions.ParamPokerID)
	if pokerID == "" {
		return "", fmt.Errorf("%w: %s is missing", model.ErrInvalidParameter, defenitions.ParamPokerID)
	}
	return model.PokerID(pokerID), nil
}