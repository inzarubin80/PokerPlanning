package model

import "time"

type IDtask int64
type IDpoker string
type IDuser string
type Estimate int

type Task struct {
	ID          IDtask
	Title       string
	Description string
	StoryPoint  int
	Status      string 
}

type User struct {
	ID   IDuser
	Name string
}

type UserEstimate struct {
	IDuser   IDuser
	Estimate Estimate
	TaskID   IDtask 
}

type Poker struct {
	ID           IDpoker
	Tasks        []Task
	TargetTask   Task
	Start        time.Time
	End          time.Time 
	Estimates    []UserEstimate
	FinalEstimate Estimate 
	Participants []IDuser 
}