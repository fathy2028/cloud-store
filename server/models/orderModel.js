import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
products:[
    {
        type:mongoose.ObjectId,
        ref:"products"
    }
],
customer:{
        type:mongoose.ObjectId,
        ref:"users"
},
status:{
    type:String,
    default:"Not processed",
    enum:["Not processed","processing","Shipped","Out For Delivery","Delivered","Canceled"]
},
totalcash:{
type:Number
}
},{timestamps:true})

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;