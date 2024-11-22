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
	serviceAddComment interface {
		AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error)
	}
	AddCommentHandler struct {
		name    string
		service serviceAddComment
	}
)

func NewAddCommentHandler(service serviceAddComment, name string) *AddCommentHandler {
	return &AddCommentHandler{
		name:    name,
		service: service,
	}
}

func (h *AddCommentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
		return
	}

	var comment *model.Comment
	err = json.Unmarshal(body, &comment)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = validation.ValidateStruct(comment,
		validation.Field(&comment.PokerID, validation.Required),
		validation.Field(&comment.Text, validation.Required))
		validation.Field(&comment.UserID, validation.Required)

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err = h.service.AddComment(ctx, comment)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	} else {
		uhttp.SendSuccessfulResponse(w, []byte("{}"))
	}

}
