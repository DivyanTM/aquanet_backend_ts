import { getConnection } from "../config/dbconfig";
import sql from "mssql";
import {hashPassword} from "../utils/hashUtil";
import {AppError} from "../utils/AppError";

export class User {
    id: number;
    email: string;
    password: string;
    userName: string;
    phoneNumber: string;

    constructor(id: number, email: string, password: string, userName: string, phoneNumber: string) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
    }

    private static fromRow(row: any): User {
        return new User(row.id, row.email, row.password, row.userName, row.phoneNumber);
    }

    static async findUserById(id: number): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM users WHERE id = @id');

        const row = result.recordset[0];
        return row ? User.fromRow(row) : null;
    }

    static async findUserByEmail(email: string): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM users WHERE mail = @email');

        const row = result.recordset[0];
        return row ? User.fromRow(row) : null;
    }

    static async findUserByUsername(userName: string): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('userName', sql.VarChar, userName)
            .query('SELECT * FROM users WHERE userName = @userName');

        const row = result.recordset[0];
        return row ? User.fromRow(row) : null;
    }

    static async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .query('SELECT * FROM users WHERE phoneNumber = @phoneNumber');

        const row = result.recordset[0];
        return row ? User.fromRow(row) : null;
    }

    static async registerUser(
        email: string,
        password: string,
        userName: string,
        phoneNumber: string
    ): Promise<User> {
        try {
            const pool = await getConnection();

            let hashedPassword = await hashPassword(password);

            const result = await pool
                .request()
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, hashedPassword)
                .input("userName", sql.VarChar, userName)
                .input("phoneNumber", sql.VarChar, phoneNumber)
                .query(
                    `INSERT INTO users (mail, password, userName, phoneNumber)
           OUTPUT INSERTED.*
           VALUES (@email, @password, @userName, @phoneNumber)`
                );

            const row = result.recordset[0];
            if(!row) throw new AppError("Can't create user", 400);
            return this.fromRow(row);
        } catch (err) {
            console.log(err);
            throw new AppError("Can't create user", 400);
        }

    }


}
