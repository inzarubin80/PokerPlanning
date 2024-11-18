package main

import (
	"context"
	"fmt"
	"inzarubin80/PokerPlanning/internal/app"
   
)

func main() {

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

/*
package main

import (
    "fmt"
    "net/http"

    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer ws.Close()

    for {
        // Читаем сообщение от клиента
        _, msg, err := ws.ReadMessage()
        if err != nil {
            fmt.Println(err)
            break
        }

        // Отправляем ответ клиенту
        err = ws.WriteMessage(websocket.TextMessage, []byte("Echo: "+string(msg)))
        if err != nil {
            fmt.Println(err)
            break
        }
    }
}

func main() {
    http.HandleFunc("/ws", handleConnections)
    fmt.Println("WebSocket server started at ws://localhost:8080/ws")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Println("ListenAndServe: ", err)
    }
}
*/