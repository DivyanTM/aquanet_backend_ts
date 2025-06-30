import {getConnection} from "../config/dbconfig";
import {AppError} from "../utils/AppError";

export class SensorData{

    id?:number;
    ph:number;
    temperature:number;
    conductivity:number;
    turbidity:number;
    timeStamp?:number;

    constructor(ph:number,temperature:number,turbidity:number,conductivity:number,timeStamp?:number,id?:number,) {
        this.id = id;
        this.ph=ph;
        this.temperature=temperature;
        this.turbidity=turbidity;
        this.conductivity=conductivity;
        this.timeStamp=timeStamp;
    }

    private static fromRow(row: any): SensorData {
        return new SensorData(row.ph, row.temperature, row.turbidity, row.conductivity,row.createdAt,row.id);
    }

    static async createRecord(ph:number,temperature:number,turbidity:number,conductivity:number):Promise<SensorData | null> {

        try{
            const pool=await getConnection();

            const result=await pool
                .request()
                .input("ph", ph)
                .input("temperature", temperature)
                .input("turbidity", turbidity)
                .input("conductivity", conductivity)
                .query(`
                    insert into sensorData(ph,temperature,turbidity,conductivity)
                    OUTPUT INSERTED.*
                    values(@ph,@temperature,@turbidity,@conductivity);
            `);
            const row = result.recordset[0];
            if(!row) throw new AppError("Can't create record",400);
            return this.fromRow(row);
        }catch(err){
            console.log(err);
            throw new AppError("Can't create record", 400);
        }

    }

    static async getAllRecords():Promise<SensorData[]>{
        const pool=await getConnection();
        const result=await pool
        .request()
            .query("SELECT * FROM sensorData ORDER BY createdAt desc");
        return result.recordset;

    }

    static async getLastRecord():Promise<SensorData>{
        const pool=await getConnection();
        const result=await pool
            .request()
            .query("SELECT  * FROM sensorData ORDER BY createdAt desc");

        const rows = result.recordset[0];
        return this.fromRow(rows);
    }

}