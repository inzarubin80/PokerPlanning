export interface Task {
  ID: number;
  PokerID: string;
  Title: string;
  Description: string;
  StoryPoint: number;
  Status: string;
  Completed: boolean;
  Estimate: string;
}

export interface CommentItem {
  ID: number;
  Text: string;
  UserID: string;
  PokerID: string;
}

export interface VoteControlState {
  TaskID: number;
  StartDate: string;
  EndDate: string;
  PokerID: string;
}

export interface UserEstimate {
  ID:        number
  PokerID:   string  
  UserID:    number
  Estimate:  string
}

export interface LoginData{
  Token:  string,
  UserID: number,
}