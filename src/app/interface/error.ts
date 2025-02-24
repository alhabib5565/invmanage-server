export type TErrorPath = {
    path: string | number
    message: string
}

export type TErrorResponse = {
    statusCode: number
    message: string,
    errorPaths: TErrorPath[]
}