package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"sort"
)

func (s *Storage) ClearComments(ctx context.Context, pokerID model.PokerID) error {
	
	s.mx.Lock()
	defer s.mx.Unlock()

	_, ok := s.comments[pokerID]
	if !ok {
		return nil
	}
	delete(s.comments, pokerID)

	return nil
}

func (r *Repository) GetComments(ctx context.Context, pokerID model.PokerID) ([]*model.Comment, error) {

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
}

func (r *Repository) GetComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) (*model.Comment, error) {

	r.storage.mx.RLock()
	defer r.storage.mx.RUnlock()

	commentsRepo, ok := r.storage.comments[pokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	comment, ok := commentsRepo[commentID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	return comment, nil
}

func (r *Repository) AddComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

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

}

func (r *Repository) UpdateComment(ctx context.Context, comment *model.Comment) (*model.Comment, error) {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	commentsRepo, ok := r.storage.comments[comment.PokerID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	_, ok = commentsRepo[comment.ID]
	if !ok {
		return nil, model.ErrorNotFound
	}
	commentsRepo[comment.ID].Text = comment.Text
	return commentsRepo[comment.ID], nil
}

func (r *Repository) RemoveComment(ctx context.Context, pokerID model.PokerID, commentID model.CommentID) error {

	r.storage.mx.Lock()
	defer r.storage.mx.Unlock()

	commentsRepo, ok := r.storage.comments[pokerID]
	if !ok {
		return nil
	}

	delete(commentsRepo, commentID)

	return nil

}
