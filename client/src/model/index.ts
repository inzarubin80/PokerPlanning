export interface Task {
    id: number;
    poker_id: string;
    title: string;
    description: string;
    story_point:number;
    status: string; 
    completed: boolean;
    estimate: string;
  }

  export interface CommentItem {
    id: number;
    text: string;
    user_id: string;
    poker_id: string;  
  }


