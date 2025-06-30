import { User } from "../models/user";
import { AppError } from "../utils/AppError";
import { Request, Response } from "express";
import {verifyHash} from "../utils/hashUtil";

export async function register(req: Request, res: Response): Promise<void> {

    const user = req.body;

    if(!user) throw new AppError("Provide Valid User Details",400);
    if(!user.userName) throw new AppError("Provide a username",400);
    if(!user.password) throw new AppError("Provide a password",400);
    if(!user.email) throw new AppError("Provide a valid email",400);
    if(!user.phoneNumber) throw new AppError("Provide a valid phone Number",400);


    const existingByUsername = await User.findUserByUsername(user.userName);
    if (existingByUsername) throw new AppError("Username already taken", 400);

    const existingByEmail = await User.findUserByEmail(user.email);
    if (existingByEmail) throw new AppError("Email already exists", 400);

    const existingByPhoneNumber = await User.findUserByPhoneNumber(user.phoneNumber);
    if (existingByPhoneNumber) throw new AppError("Phone number already exists", 400);

    const newUser = await User.registerUser(
        user.email,
        user.password,
        user.userName,
        user.phoneNumber
    );

     res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser.id,
            userName: newUser.userName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
        },
    });
}

export async function login(req:Request,res:Response):Promise<void> {

    const loginRequest=req.body;

    if(!loginRequest) throw new AppError("Provide Valid Credentials",400);
    if(!loginRequest.userName) throw new AppError("Provide a username",400);
    if(!loginRequest.password) throw new AppError("Provide a password",400);

    let user=await User.findUserByUsername(loginRequest.userName);

    if(!user) throw new AppError("Invalid Credentials",400);

    let passwordMatch=await verifyHash(user.password, loginRequest.password);
    if(!passwordMatch) throw new AppError("Incorrect username or password",400);


    res.status(200).json({
        message: "Login Successful",
        user: user,
    })


}