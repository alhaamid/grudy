import { Topic } from "./Topic";

export interface Course {
  _id: string,
  courseCode: string,
  courseName: string,
  topics: Topic[]
}