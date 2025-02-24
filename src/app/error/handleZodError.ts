import { ZodError } from "zod";
import { TErrorPath, TErrorResponse } from "../interface/error";


export const handleZodError = (error: ZodError): TErrorResponse => {
    const errorPaths: TErrorPath[] = error.issues.map(issue => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message
    }))


    return {
        statusCode: 400,
        message: 'Validation Error',
        errorPaths
    }
}