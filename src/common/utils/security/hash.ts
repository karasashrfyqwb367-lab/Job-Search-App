import bcrypt from "bcrypt"
 
 export const hash= async ({plaintext,
    salt=Number(process.env.SALT)})=>{
        return await bcrypt.hash(plaintext,salt)
    }

    export const compare= async ({plaintext,hash})=>{
        return await bcrypt.hash(plaintext,hash)
    }