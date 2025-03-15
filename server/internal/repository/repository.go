package repository

import (
	"context"
	"inzarubin80/PokerPlanning/internal/model"
	"sync"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type (

	Repository struct {
		storage Storage
		conn    DBTX
	}

	DBTX interface {
		Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
		Query(context.Context, string, ...interface{}) (pgx.Rows, error)
		QueryRow(context.Context, string, ...interface{}) pgx.Row
	}

	Voting            map[model.PokerID]map[model.UserID]model.Estimate	
	
	Storage struct {
		mx                  *sync.RWMutex
		voting              Voting
	}

)

func NewPokerRepository(capacity int, conn DBTX) *Repository {
	return &Repository{
		storage: Storage{
			mx:                  &sync.RWMutex{},
			voting:              make(Voting),
		},
		conn: conn,
	}
}

