package uhttp

import (
	"fmt"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"strconv"
	"github.com/go-ozzo/ozzo-validation"

)

type ValidateParameter struct {
	Fild string
	Min  int64
	Max  int64
}

func ValidatePatchParameterPokerID(r *http.Request) (model.PokerID, error) {
	pokerID := r.PathValue(defenitions.ParamPokerID)
	if pokerID == "" {
		return "", fmt.Errorf("%w: %s is missing", model.ErrInvalidParameter, defenitions.ParamPokerID)
	}
	return model.PokerID(pokerID), nil
}


func ValidatePatchNumberParameters(r *http.Request, parameters []ValidateParameter) (map[string]int64, error) {

	m := make(map[string]int64)

	for _, item := range parameters {

		valueStr := r.PathValue(item.Fild)
		if valueStr == "" {
			return nil, fmt.Errorf("%w: %s is missing", model.ErrInvalidParameter, item.Fild)
		}

		value, err := strconv.ParseInt(valueStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("%w: %s is invalid", model.ErrInvalidParameter, item.Fild)
		}

		err = validation.Validate(value, validation.Required, validation.Min(item.Min), validation.Max(item.Max))
		if err != nil {
			return nil, fmt.Errorf("%w: %s (%s)", model.ErrInvalidParameter, item.Fild, err.Error())
		}

		m[item.Fild] = value

	}

	return m, nil
}