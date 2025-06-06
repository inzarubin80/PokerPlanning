export interface Task {
  ID: number;
  PokerID: string;
  Title: string;
  Description: string;
  StoryPoint: number;
  Status: string;
  Completed: boolean;
  Estimate: number;
}

export interface CommentItem {
  ID: number;
  Text: string;
  UserID: number;
  PokerID: string;  
  TaskID: number;
}

export interface VoteControlState {
  TaskID: number;
  StartDate: string;
  EndDate: string;
  PokerID: string;
}

export interface UserEstimate {
  ID: number
  PokerID: string
  UserID: number
  Estimate: number
}

export interface LoginData {
  Token: string,
  UserID: number,
}

export interface User{
  ID:   number,
  Name: string,		
  EvaluationStrategy: string,
  MaximumScore: number
}

export interface UserSettings{
  ID:   number,
  EvaluationStrategy: string,
  MaximumScore: number
}

export interface PokerSettings{
  EvaluationStrategy: string,
  MaximumScore: number,
  Name: string
}

export interface Poker{
  ID:        string,
  CreatedAt: string,
  Name:      string,
  Autor:     number,
  IsAdmin:   boolean,
  ActiveUsersID: number[],
  Users:  User[],
  EvaluationStrategy: string,
  MaximumScore: number
}

export interface VotingResult {
  UserEstimates: UserEstimate[]
  FinalResult: number
}

export interface LastSessionPoker {
  PokerID:     string,
  UserID:      number,
  Name:        string,
  IsAdmin:     boolean
}
