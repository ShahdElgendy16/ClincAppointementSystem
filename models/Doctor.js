const mongoose =require("mongoose");

const doctorSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    specialization:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
    },
    experience:{
        type:Number,
        required:true,
        min:0
    },
},
{
    timestamps:true,
}
);

const Doctor =mongoose.model("Doctor",doctorSchema)
module.exports =Doctor ;