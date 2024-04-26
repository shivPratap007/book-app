import bcrypt from "bcrypt"
export const hashThePassword=async(password:string)=>{
    return await bcrypt.hash(password,10);
}