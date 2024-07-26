import mongoose from "mongoose"
const conn=()=>{mongoose.connect("mongodb+srv://fathynassef2025:sezar2028@cloudstore.ycfayog.mongodb.net/?retryWrites=true&w=majority&appName=cloudstore")
.then(()=>{
    console.log("connected")
}).catch((err)=>{
console.log(err);
})
}
export default conn;