const {z}=require("zod");

const AppointmentSchema=z.object({
    doctor:z.string(),
    patient:z.string(),
    date:z.coerce.date(),
    time:z.string(),
    status:z.enum(["Scheduled", "Completed", "Cancelled"]).optional(),
    notes:z.string().optional()
});
module.exports = AppointmentSchema;