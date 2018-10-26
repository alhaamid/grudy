export interface Discussion {
    _id?: string,
    subject: string,
    content: string,
    postedWhen?: any,
    startedBy: string,
    isResolved?: boolean
}