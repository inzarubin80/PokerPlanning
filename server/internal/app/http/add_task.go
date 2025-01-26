package http

import (
	"context"
	"encoding/json"
	"inzarubin80/PokerPlanning/internal/app/defenitions"
	"inzarubin80/PokerPlanning/internal/app/uhttp"
	"inzarubin80/PokerPlanning/internal/model"
	"io"
	"net/http"

	validation "github.com/go-ozzo/ozzo-validation"
)

type (
	serviceAddTask interface {
		AddTask(ctx context.Context, task *model.Task) (*model.Task, error)
	}
	AddTaskHandler struct {
		name    string
		service serviceAddTask
	}
)

func NewAddTaskHandler(service serviceAddTask, name string) *AddTaskHandler {

	return &AddTaskHandler{
		name:    name,
		service: service,
	}

}

func (h *AddTaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	pokerID, err := uhttp.ValidatePatchStringParameter(r, defenitions.ParamPokerID)
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

	if task.PokerID != model.PokerID(pokerID) {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, "")
		return
	}
	_, err = h.service.AddTask(ctx, task)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	} else {
		uhttp.SendSuccessfulResponse(w, []byte("{}"))
	}

}
