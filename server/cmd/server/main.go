package main

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"inzarubin80/PokerPlanning/internal/app"
)

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

	server, err := app.NewApp(ctx, conf)

	if err != nil {
		panic(err.Error())
	}
	err = server.ListenAndServe()
	if err != nil {
		fmt.Println(err.Error())
	}

}
