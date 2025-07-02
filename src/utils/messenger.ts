import dotenv from "dotenv";
import twilio from "twilio";
import {MessageInstance} from "twilio/lib/rest/api/v2010/account/message";

dotenv.config();

// const sendOTP=(phone,message)=>{
//     const client=require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN);
//     client.messages
//         .create({
//             body:message,
//             from:process.env.TWILIO_PHONE_NUMBER,
//             to:phone
//         })
//         .then(msg=>{
//             console.log(msg);
//         });
// }
//
// module.exports=sendOTP;

export const sendAlert=(phone:string,message:string)=>{

    const client =  twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN);
    client.messages
    .create({
        body:message,
        from:process.env.TWILIO_PHONE_NUMBER,
        to:phone
    })
    .then((response:MessageInstance) => {
        console.log(response);
    });
}