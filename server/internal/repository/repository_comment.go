package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"sort"

)

func (r *Repository) GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	arg := &sqlc_repository.GetCommentsParams{
		PokerID: pokerID.UUID(),
		TaskID: int64(taskID),
	}

	comments, err := reposqlsc.GetComments(ctx, arg)

	if err != nil {
			return nil, err
	}
	
	commentsRes := make([]*model.Comment, len(comments))
    for i, v:= range comments {
		commentsRes[i] = &model.Comment{
		ID: model.CommentID(v.CommentID),
		TaskID: model.TaskID(v.TaskID),
		PokerID: model.PokerID(v.PokerID.String()),
		UserID: model.UserID(v.UserID),
		Text: v.Text,	
		}
	}

	sort.Slice(commentsRes, func(i, j int) bool {
		return commentsRes[i].ID < commentsRes[j].ID
	})

	return commentsRes, nil
}


func (r *Repository) CreateComent(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	
	arg := &sqlc_repository.CreateComentParams{
		PokerID: comment.PokerID.UUID(),
		UserID: int64(comment.UserID),
		TaskID: int64(comment.TaskID),
		Text: comment.Text,
	}

	id, err := reposqlsc.CreateComent(ctx, arg)

	if err != nil {
		return nil, err
	}
	
	return &model.Comment{
        ID: model.CommentID(id),
		TaskID: comment.TaskID,
		PokerID: comment.PokerID,
		Text: comment.Text,
	}, nil

}




