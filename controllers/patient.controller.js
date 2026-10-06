const Patient=require("../models/Patient");

const createPatient=async(req,res)=>{
    const patient=await Patient.create({
        name:req.body.name,
        phone:req.body.phone,
        age:req.body.age,
        gender:req.body.gender
    });
    res.status(201).json(patient);
};
const getPatients=async(req,res)=>{
  const filter = {};
  if(req.query.name){
    filter.name={$regex:req.query.name,$options:"i"};
  }
  if(req.query.gender){
    filter.gender=req.query.gender;
  }
  if(req.query.age){
    filter.age={$gte:parseInt(req.query.age)};
  }
    const patient=await Patient.find(filter);
    res.json(patient);
};
const getPatientById=async(req,res)=>{
    const patient=await Patient.findById(req.params.id);
    if(!patient){
        return res.status(404).json({message:"patient not found"});
    }
    res.json(patient)
};
const updatePatient=async(req,res)=>{
    const patient=await Patient.findByIdAndUpdate(
        req.params.id,{        name:req.body.name,
        phone:req.body.phone,
        age:req.body.age,
        gender:req.body.gender},{new:true}
    );
    if(!patient){
        return res.status(404).json({message:"patient not found"});
    }
    res.json(patient)
};
const deletePatient=async(req,res)=>{
    const patient=await Patient.findByIdAndDelete(
        req.params.id
    )
    if(!patient){
        return res.status(404).json({message:"patient not found"});
    }
    res.json({Message:"The patient Has Been Deleted"})
}
module.exports= {createPatient, getPatients,getPatientById,updatePatient,deletePatient};