import { Course } from "./Course";

export interface User {
    id?: string,
    email: string;
    password: string;
    displayName: string;
    photoURL?: string;
    courses: Course[]
}