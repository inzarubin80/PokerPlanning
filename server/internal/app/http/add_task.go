package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"

	validation "github.com/go-ozzo/ozzo-validation"
)

type (
	serviceAddTask interface {
		AddTask(ctx context.Context, task *model.Task) (model.TaskID, error)
	}
	AddTaskHandler struct {
		name    string
		service serviceAddTask
	}

	BodyRequest struct {
		Title string `json:"title"`
		Description string `json:"description"`
	}

)

func NewAddTaskHandler(service serviceAddTask, name string) *AddTaskHandler {
	return &AddTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *AddTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx:= r.Context();

	pokerID, err := ValidatePatchParameterPokerID(r)
	if err != nil {
		sendResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	
	body, err := io.ReadAll(r.Body)
	if err != nil {
		sendResponse(w, http.StatusInternalServerError, []byte("{}"))
		return
	}

	var bodyRequest BodyRequest
	err = json.Unmarshal(body, &bodyRequest)
	if err != nil {
		sendResponse(w, http.StatusBadRequest, []byte("{}"))
		return
	}

	err = validation.ValidateStruct(&bodyRequest, 
		validation.Field(&bodyRequest.Title, validation.Required), 
		validation.Field(&bodyRequest.Description, validation.Required))
	
	if err!=nil {
		sendResponse(w, http.StatusBadRequest, []byte(err.Error()))
		return
	}

	task := &model.Task{
		PokerID: model.PokerID(pokerID),
		Title: bodyRequest.Title,
		Description: bodyRequest.Description,
	}

	_, err = h.service.AddTask(ctx, task)
	if err!=nil {
		sendResponse(w, http.StatusInternalServerError, []byte(err.Error()))	
	} else {
		sendResponse(w, http.StatusOK, []byte("{}"))	
	}
	
}
