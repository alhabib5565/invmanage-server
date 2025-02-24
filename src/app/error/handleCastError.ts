import mongoose from "mongoose";
import { TErrorPath, TErrorResponse } from "../interface/error";

export const handleCastError = (err: mongoose.Error.CastError): TErrorResponse => {
    const errorPaths: TErrorPath[] = [
        {
            path: err.path,
            message: err.message
        }
    ]

    return {
        statusCode: 400,
        message: 'Invalid Id',
        errorPaths
    }
}