import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    const saltRounds:number=12;
    const salt:string=await bcrypt.genSalt(saltRounds);

    return await bcrypt.hash(password, salt);

}

export async function verifyHash(hashedPassword : string,password:string){
    return await bcrypt.compare(password,hashedPassword);
}