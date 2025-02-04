package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	sqlc_repository "inzarubin80/PokerPlanning/internal/repository_sqlc"
	"sort"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func (r *Repository) GetComments(ctx context.Context, pokerID model.PokerID, taskID model.TaskID) ([]*model.Comment, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(pokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.GetCommentsParams{
		PokerID: pgUUID,
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

	/*
	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	comments := []*model.Comment{}
	commentsRepo, ok := r.storage.comments[pokerID]
	if ok {
		for _, value := range commentsRepo {
			comments = append(comments, value)
		}
	}

	sort.Slice(comments, func(i, j int) bool {
		return comments[i].ID < comments[j].ID
	})

	return comments, nil
	*/

}


func (r *Repository) CreateComent(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	reposqlsc := sqlc_repository.New(r.conn)

	pgUUID := pgtype.UUID{
		Bytes: uuid.MustParse(string(comment.PokerID)),
		Valid: true,
	}

	arg := &sqlc_repository.CreateComentParams{
		PokerID: pgUUID,
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


	/*
	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	comment.ID = r.storage.nextCommentID
	commentsRepo, ok := r.storage.comments[comment.PokerID]
	if !ok {
		commentsRepo = make(map[model.CommentID]*model.Comment)
		r.storage.comments[comment.PokerID] = commentsRepo
	}
	commentsRepo[r.storage.nextCommentID] = comment
	r.storage.nextCommentID++
	return comment, nil
    */

}




