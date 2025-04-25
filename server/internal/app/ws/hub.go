// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package ws

import (
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
	"sync"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type (
	Message struct {
		pokerID model.PokerID
		data    []byte
		userID  model.UserID
	}

	DataMessage struct {
		action string
		data   string
	}

	Hub struct {
		// Registered clients with sync.Map for concurrent access
		clients   sync.Map // map[model.PokerID]map[*Client]bool
		// Inbound messages from the clients.
		broadcast chan *Message
		// Register requests from the clients.
		register chan *Client
		// Unregister requests from clients.
		unregister chan *Client
	}

	USERS_MESSAGE struct {
		Action string
		Users  []model.UserID
	}
)

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan *Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
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
			// Load or create the poker room's client map
			value, _ := h.clients.LoadOrStore(client.pokerID, &sync.Map{})
			clientsPoker := value.(*sync.Map)
			clientsPoker.Store(client, true)

			go h.SendActiveUsers(client.pokerID)

		case client := <-h.unregister:
			if value, ok := h.clients.Load(client.pokerID); ok {
				clientsPoker := value.(*sync.Map)
				clientsPoker.Delete(client)
				close(client.send)

				// Check if poker room is empty and delete it
				isEmpty := true
				clientsPoker.Range(func(_, _ interface{}) bool {
					isEmpty = false
					return false
				})
				if isEmpty {
					h.clients.Delete(client.pokerID)
				}
			}

			go h.SendActiveUsers(client.pokerID)

		case message := <-h.broadcast:
			if value, ok := h.clients.Load(message.pokerID); ok {
				clientsPoker := value.(*sync.Map)
				
				// Process all clients in the poker room
				clientsPoker.Range(func(key, _ interface{}) bool {
					client := key.(*Client)
					
					if message.userID != 0 && client.userID != message.userID {
						return true // continue
					}

					select {
					case client.send <- message:
					default:
						clientsPoker.Delete(client)
						close(client.send)
					}
					return true
				})
			}
		}
	}
}

func (h *Hub) AddMessage(pokerID model.PokerID, payload any) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	message := &Message{pokerID: pokerID, data: data}
	h.broadcast <- message
	return nil
}

func (h *Hub) AddMessageForUser(pokerID model.PokerID, userID model.UserID, payload any) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	message := &Message{pokerID: pokerID, userID: userID, data: data}
	h.broadcast <- message
	return nil
}

func (h *Hub) GetActiveUsersID(pokerID model.PokerID) ([]model.UserID, error) {
	usersID := make([]model.UserID, 0)
	IDs := make(map[model.UserID]bool)

	if value, ok := h.clients.Load(pokerID); ok {
		clientsPoker := value.(*sync.Map)
		
		clientsPoker.Range(func(key, _ interface{}) bool {
			client := key.(*Client)
			if _, ok := IDs[client.userID]; !ok {
				usersID = append(usersID, client.userID)
				IDs[client.userID] = true
			}
			return true
		})
	}

	return usersID, nil
}

func (h *Hub) SendActiveUsers(pokerID model.PokerID) {
	usersID, err := h.GetActiveUsersID(pokerID)
	if err != nil {
		return
	}

	h.AddMessage(pokerID, &USERS_MESSAGE{
		Action: model.CHANGE_ACTIVE_USERS_POKER,
		Users:  usersID,
	})
}