package uhttp

import (
	"fmt"
	"github.com/go-ozzo/ozzo-validation"
	"inzarubin80/PokerPlanning/internal/model"
	"net/http"
	"strconv"
)

type ValidateParameter struct {
	Fild string
	Min  int64
	Max  int64
}

func ValidatePatchStringParameter(r *http.Request, param string) (string, error) {
	stringValue := r.PathValue(param)
	if stringValue == "" {
		return "", fmt.Errorf("%w: %s is missing", param, model.ErrInvalidParameter)
	}
	return stringValue, nil
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
