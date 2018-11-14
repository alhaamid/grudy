import { Discussion } from "./Discussion";

export interface Post {
  _id?: string,
  course: string,
  topicId: string,
  subject: string,
  content: string,
  postedWhen?: any,
  postedBy: any,
  isResolved?: boolean,
  discussions?: Discussion[]
}