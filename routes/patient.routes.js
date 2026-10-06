const express=require("express");
const router=express.Router();
const validate=require("../middleware/validation");
const PatientSchema=require("../validators/patient.validator");
const asyncHandler = require("../utils/asyncHandler");
const {createPatient, getPatients,getPatientById,updatePatient,deletePatient}=require("../controllers/patient.controller");
router.post("/",validate(PatientSchema),asyncHandler(createPatient));
router.get("/",asyncHandler(getPatients));
router.get("/:id",asyncHandler(getPatientById));
router.put("/:id",validate(PatientSchema),asyncHandler(updatePatient));
router.delete("/:id",asyncHandler(deletePatient));

module.exports=router;