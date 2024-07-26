import bcrypt from "bcrypt"
export const hashpassword= async(password)=>{
try {
    const slat=10;
    const hashed= await bcrypt.hash(password,slat)
    return hashed;
} catch (error) {
    console.log(error)
}
}
export const comparepassword=async(password,hashed)=>{
try {
    return await bcrypt.compare(password,hashed);
} catch (error) {
    console.log(error)
}
}