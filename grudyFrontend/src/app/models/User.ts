import { Course } from "./Course";

export interface User {
    _id?: string,
    email: string;
    password: string;
    displayName: string;
    photoURL?: string;
    courses?: Course[]
}