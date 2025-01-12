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
	serviceAddComment interface {
		AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error)
	}
	AddCommentHandler struct {
		name    string
		service serviceAddComment
	}

	CommentFrontend struct {
		PokerID model.PokerID 
		Text    string       
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

	userID, ok := ctx.Value(defenitions.UserID).(model.UserID)
	if !ok {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, "not user ID")
	}

	var comment *CommentFrontend
	err = json.Unmarshal(body, &comment)
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = validation.ValidateStruct(comment,
		validation.Field(&comment.PokerID, validation.Required),
		validation.Field(&comment.Text, validation.Required))

	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	_, err = h.service.AddComment(ctx, &model.Comment{ID: -1, PokerID: comment.PokerID, UserID: model.UserID(userID), Text:comment.Text })
	if err != nil {
		uhttp.SendErrorResponse(w, http.StatusInternalServerError, err.Error())
	} else {
		uhttp.SendSuccessfulResponse(w, []byte("{}"))
	}

}
