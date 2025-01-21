package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"inzarubin80/PokerPlanning/internal/app"
	"github.com/jackc/pgx/v5/pgxpool"
	"os"
)

//мое исправление
func main() {

	err := godotenv.Load()
	if err != nil {
		fmt.Printf("Error loading .env file")
		return
	}

	ctx := context.Background()
	options := app.Options{
		Addr: ":8080",
	}

	conf := app.NewConfig(options)

	databaseUrl := os.Getenv("DATABASE_URL")

	cfg, err := pgxpool.ParseConfig(databaseUrl)
	if err != nil {
		panic(err.Error())

	}
	dbConn, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		panic(err.Error())
	}

	server, err := app.NewApp(ctx, conf, dbConn)
	if err != nil {
		panic(err.Error())
	}
	err = server.ListenAndServe()
	if err != nil {
		fmt.Println(err.Error())
	}

}
