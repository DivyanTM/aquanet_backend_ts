import {AppError} from "../utils/AppError";
import {Request,Response} from "express";
import {SensorData} from "../models/sensorData"
import {emitData} from "../utils/SocketUtil";
import {SafeLimits} from "../utils/SafeLimits";

export async function createRecord(req:Request,res:Response):Promise<void>{

    const data=req.body;

    if(!data) throw new AppError("Please Provide Valid Data",400);
    if(!data.ph || isNaN(data.ph)) throw new AppError("Please Provide Valid PH",400);
    if(!data.temperature || isNaN(data.temperature)) throw new AppError("Please Provide Valid Temperature",400);
    if(!data.turbidity || isNaN(data.turbidity)) throw new AppError("Please Provide Valid Turbidity",400);
    if(!data.conductivity || isNaN(data.conductivity)) throw new AppError("Please Provide Valid Conductivity",400);

    let createdData=await SensorData.createRecord(data.ph,data.temperature,data.turbidity,data.conductivity);

    let unsafeParams =[];

    if(data.ph < SafeLimits.PH_MIN || data.ph > SafeLimits.PH_MAX) unsafeParams.push("PH");
    if(data.turbidity > SafeLimits.TURBIDITY_MAX) unsafeParams.push("Turbidity");
    if(data.temperature < SafeLimits.TEMP_MIN || data.temperature > SafeLimits.TEMP_MAX) unsafeParams.push("Temperature");
    if(data.conductivity < SafeLimits.CONDUCTIVITY_MIN || data.conductivity > SafeLimits.CONDUCTIVITY_MAX) unsafeParams.push("Conductivity");

    if(unsafeParams.length){
       emitData("limitAlert",unsafeParams);
    }

    emitData("data",JSON.stringify(createdData));


    res.status(200).send({
        message:"Record created successfully",
        data:createdData,
        status:"success"
    });

}

export async function getAllRecords(req:Request,res:Response):Promise<void>{
    let data=await SensorData.getAllRecords();
    res.status(200).send({
        message:"records fetched successfully",
        data:data,
        status:"success"
    })
}

export async function getLastRecord(req:Request,res:Response):Promise<void>{
    let records=await SensorData.getLastRecord();
    res.status(200).send({
        message:"record fetched successfully",
        data:records,
        status:"success"
    });
}

export async function getLastFew(req:Request,res:Response):Promise<void>{
    let records=await SensorData.getAllRecords();
    let data=[];
    data = records.length >= 5 ? records.slice(0, 5) : records;

    res.status(200).send({
        message:"records fetched successfully",
        data:records,
        status:"success"
    });

}

