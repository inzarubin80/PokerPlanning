package repository_pg

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type (
	RepositoryPG struct {
		conn DBTX
	}
	DBTX interface {
		Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
		Query(context.Context, string, ...interface{}) (pgx.Rows, error)
		QueryRow(context.Context, string, ...interface{}) pgx.Row
	}
)

func NewPokerRepository(conn DBTX) *RepositoryPG {
	return &RepositoryPG{
		conn: conn,
	}
}
