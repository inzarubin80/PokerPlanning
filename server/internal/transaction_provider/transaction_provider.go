package tp

import (
	"context"
	"errors"
	pgx "github.com/jackc/pgx/v5"
	repository "inzarubin80/PokerPlanning/internal/repository"
	stor "inzarubin80/PokerPlanning/internal/storage"
)

type TransactionProvider struct {
	conn stor.DB
}

func NewTransactionProvider(conn stor.DB) *TransactionProvider {
	return &TransactionProvider{
		conn: conn,
	}
}

func (p *TransactionProvider) Transact(ctx context.Context, txFunc func(adapters stor.Adapters) error) error {
	return runInTx(ctx, p.conn, func(tx pgx.Tx) error {
		adapters := stor.Adapters{
			Repository: repository.NewPokerRepository(1, tx),
		}
		return txFunc(adapters)
	})
}

func runInTx(ctx context.Context, conn stor.DB, fn func(tx pgx.Tx) error) error {

	tx, err := conn.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.ReadCommitted})
	if err != nil {
		return err
	}

	err = fn(tx)
	if err == nil {
		return tx.Commit(ctx)
	}

	rollbackErr := tx.Rollback(ctx)
	if rollbackErr != nil {
		return errors.Join(err, rollbackErr)
	}

	return err
}
