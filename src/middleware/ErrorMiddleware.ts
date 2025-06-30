import {AppError} from "../utils/AppError";
import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';


const errorMiddleware:ErrorRequestHandler=(err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof AppError){
         res.status(err.statusCode).json({
            message:err.message,
            status:'error'
        });
         return;
    }

    console.error(`EM [${req.path}] :`,err);

     res.status(500).json({
       message:'Something went wrong!',
       status:'error',
       err:err.message
    });

}

export default errorMiddleware;