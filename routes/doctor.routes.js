const express=require("express");
const router=express.Router();
const validate=require("../middleware/validation");
const DoctorSchema=require("../validators/doctor.validator");
const asyncHandler = require("../utils/asyncHandler");
const {createDoctor, getDoctors,getDoctorById,updateDoctor,deleteDoctor}=require("../controllers/doctor.controller");
router.post("/",validate(DoctorSchema),asyncHandler(createDoctor));
router.get("/",asyncHandler(getDoctors));
router.get("/:id",asyncHandler(getDoctorById));
router.put("/:id",validate(DoctorSchema),asyncHandler(updateDoctor));
router.delete("/:id",asyncHandler(deleteDoctor));

module.exports=router;