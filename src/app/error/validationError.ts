// validation error or mongoosh error

import mongoose from "mongoose";
import { TErrorPath } from "../interface/error";

export const handleValidationError = (err: mongoose.Error.ValidationError) => {
    const errorPaths: TErrorPath[] = Object.values(err.errors).map((error) => ({
        path: error.path,
        message: error.message
    }))

    return {
        statusCode: 400,
        message: 'Validation Error',
        errorPaths
    }
}