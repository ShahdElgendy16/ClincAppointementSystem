const Doctor = require("../models/Doctor");

const createDoctor = async (req, res) => {
  const doctor = await Doctor.create({
    name: req.body.name,
    specialization: req.body.specialization,
    phone: req.body.phone,
    experience: req.body.experience,
  });
  res.status(201).json(doctor);
};
const getDoctors = async (req, res) => {
  const filter = {};
  if(req.query.name){
    filter.name={$regex:req.query.name,$options:"i"};
  }
  if(req.query.specialization){
    filter.specialization=req.query.specialization;
  }
  const doctors = await Doctor.find(filter);
  res.json(doctors);
};
const getDoctorById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  res.json(doctor);
};
const updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      specialization: req.body.specialization,
      phone: req.body.phone,
      experience: req.body.experience,
    },
    { new: true },
  );
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  res.json(doctor);
};
const deleteDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }
  res.json({ Message: "The Doctor Has Been Deleted" });
};
module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
