const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const createAppointment = async (req, res) => {
  const doctor = await Doctor.findById(req.body.doctor);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  const patient = await Patient.findById(req.body.patient);
  if (!patient) {
    return res.status(404).json({ message: "patient not found" });
  }

  const existingAppointment = await Appointment.findOne({
    doctor: req.body.doctor,
    date: req.body.date,
    time: req.body.time,
  });
  if (existingAppointment) {
    return res.status(409).json({
      message: "Doctor is already booked at this date and time"
    });
  }
  const appointment = await Appointment.create({
    doctor: req.body.doctor,
    patient: req.body.patient,
    date: req.body.date,
    time: req.body.time,
    status: req.body.status,
    notes: req.body.notes,
  });
  res.status(201).json(appointment);
};

const getAppointments =async(req,res)=>{
  const filter={};
  if(req.query.status){
    filter.status=req.query.status;
  }
    const appointments=await Appointment.find(filter).populate("doctor").populate("patient");
    res.json(appointments);
};

const getAppointmentById=async(req,res)=>{
    const appointment=await Appointment.findById(req.params.id).populate("doctor").populate("patient");
    if(!appointment){
        return res.status(404).json({message:"appointment not found"})
    }
    res.json(appointment)
};
const updateAppointment=async(req,res)=>{

  const existingAppointment = await Appointment.findOne({
    doctor: req.body.doctor,
    date: req.body.date,
    time: req.body.time,
    _id: { $ne: req.params.id }
  });
  if (existingAppointment) {
    return res.status(409).json({
      message: "Doctor is already booked at this date and time",
    });
  }
    const appointment=await Appointment.findByIdAndUpdate(req.params.id,
        {    doctor: req.body.doctor,
    patient: req.body.patient,
    date: req.body.date,
    time: req.body.time,
    status: req.body.status,
    notes: req.body.notes,},{new:true}
    )
    if(!appointment){
        return res.status(404).json({message:"appointment not found"})
    }
    res.json(appointment)
};

const deleteAppointment=async(req,res)=>{
    const appointment=await Appointment.findByIdAndDelete(req.params.id);
    if(!appointment){
        return res.status(404).json({message:"appointment not found"})
    }
    res.json({message:"appointment has Been Deleted"})}
module.exports = { createAppointment ,getAppointments,getAppointmentById,updateAppointment,deleteAppointment};
