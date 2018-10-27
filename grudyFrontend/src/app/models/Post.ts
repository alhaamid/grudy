import { Discussion } from "./Discussion";

export interface Post {
  _id?: string,
  topicId: string,
  subject: string,
  content: string,
  postedWhen?: any,
  postedBy: string,
  isResolved?: boolean,
  discussions: Discussion[]
}