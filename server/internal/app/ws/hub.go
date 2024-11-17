// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package ws

import (
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type (
	Message struct {
		pokerID model.PokerID
		data    []byte
	}

	Hub struct {
		// Registered clients.
		clients map[model.PokerID]map[*Client]bool
		// Inbound messages from the clients.
		broadcast chan *Message
		// Register requests from the clients.
		register chan *Client
		// Unregister requests from clients.
		unregister chan *Client
	}
)

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan *Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[model.PokerID]map[*Client]bool),
	}
}

func (h *Hub) Run() {

	fmt.Println("Run Hub")

	defer func() {
		fmt.Println("Close Hub")
	}()

	for {
		select {
		case client := <-h.register:

			clientsPoker, ok := h.clients[client.pokerID]
			if !ok {
				clientsPoker = make(map[*Client]bool)
				h.clients[client.pokerID] = clientsPoker
			}
			clientsPoker[client] = true

		case client := <-h.unregister:

			if clientsPoker, ok := h.clients[client.pokerID]; ok {
				if _, ok := clientsPoker[client]; ok {

					delete(clientsPoker, client)
					close(client.send)
					if len(clientsPoker) == 0 {
						delete(h.clients, client.pokerID)
					}
				}
			}
		case message := <-h.broadcast:

			if clientsPoker, ok := h.clients[message.pokerID]; ok {
				for client := range clientsPoker {
					select {
					case client.send <- message:
					default:
						close(client.send)
						delete(clientsPoker, client)
					}

				}
			}

		}
	}
}
