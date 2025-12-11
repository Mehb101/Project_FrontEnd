export interface User {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  user: string; 
}

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  _id: string;
  name: string;
  description: string;
  status: TaskStatus;
  project: string; 
}
