// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
package ws

import (
	"encoding/json"
	"fmt"
	"inzarubin80/PokerPlanning/internal/model"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type (	
	Message struct {
		pokerID model.PokerID
		data    []byte
		userID model.UserID

	}

	DataMessage struct {
		action  string
		data    string
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

	
	USERS_MESSAGE struct {
		Action string
		Users []model.UserID
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

			go h.SendActiveUsers(client.pokerID) 

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

			go h.SendActiveUsers(client.pokerID) 

		case message := <-h.broadcast:

			if clientsPoker, ok := h.clients[message.pokerID]; ok {
				for client := range clientsPoker {
	
					if message.userID != 0 && client.userID != message.userID{
						continue
					}

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

func (h *Hub) AddMessage(pokerID model.PokerID,  payload any) (error) {

	data, err := json.Marshal(payload)
	if err != nil {
		return  err
	}

	message := &Message{pokerID: pokerID, data: data}
	h.broadcast<-message
	return nil

}

func (h *Hub) AddMessageForUser(pokerID model.PokerID, userID model.UserID, payload any) (error) {

	data, err := json.Marshal(payload)
	if err != nil {
		return  err
	}

	message := &Message{pokerID: pokerID, userID:userID, data: data}
	h.broadcast<-message
	return nil
	
}

func (h *Hub) GetActiveUsersID(pokerID model.PokerID) ([] model.UserID, error) {
	
	usersID := make([]model.UserID, 0)
	
	IDs:= make(map[model.UserID]bool)
	clients, ok := h.clients[pokerID]

	if !ok {
		return usersID, nil
	}
	
	for k,_ := range clients {
		_,ok:= IDs[ k.userID]
		if !ok {
			usersID = append(usersID, k.userID)	
			IDs[ k.userID] = true
		}
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
		Users : usersID})

}
