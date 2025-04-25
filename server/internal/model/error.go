package model

import "errors"

var ErrorNotFound = errors.New("not found")
var ErrorTargetTaskNotEmpty = errors.New("target task not empty")
var ErrInvalidParameter = errors.New("Invalid parameter value")
