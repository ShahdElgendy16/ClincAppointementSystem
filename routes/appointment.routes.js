const express=require("express");
const router=express.Router();
const validate=require("../middleware/validation");
const AppointmentSchema=require("../validators/appointment.validator");
const asyncHandler = require("../utils/asyncHandler");
const  { createAppointment ,getAppointments,getAppointmentById,updateAppointment,deleteAppointment}=require("../controllers/appointment.controller");
router.post("/",validate(AppointmentSchema),asyncHandler(createAppointment));
router.get("/",asyncHandler(getAppointments));
router.get("/:id",asyncHandler(getAppointmentById));
router.put("/:id",validate(AppointmentSchema),asyncHandler(updateAppointment));
router.delete("/:id",asyncHandler(deleteAppointment));

module.exports=router;