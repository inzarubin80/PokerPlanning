package http

import (
	"context"
	"encoding/json"
	validation "github.com/go-ozzo/ozzo-validation"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"
)

type (
	serviceUpdateTask interface {
		UpdateTask(ctx context.Context, pokerID model.PokerID, task *model.Task) (*model.Task, error) 
	}
	UpdateTaskHandler struct {
		name    string
		service serviceUpdateTask
	}
)

func NewUpdateTaskHandler(service serviceUpdateTask, name string) *UpdateTaskHandler {
	return &UpdateTaskHandler{
		name:    name,
		service: service,
	}
}

func (h *UpdateTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	pokerID, err := uhttp.ValidatePatchParameterPokerID(r)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var task *model.Task
	err = json.Unmarshal(body, &task)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = validation.ValidateStruct(task,
		validation.Field(&task.Title, validation.Required),
		validation.Field(&task.Description, validation.Required))

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	if task.PokerID!=pokerID {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, "")
		return
	}
	
	_, err = h.service.UpdateTask(ctx, pokerID, task)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	} else {
		uhttp.SendSuccessfulResponse(w, []byte("{}"))
	}

}
