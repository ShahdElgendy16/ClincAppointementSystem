const {z}=require("zod");
const DoctorSchema=z.object({
    name:z.string().trim(),
    specialization:z.string().trim(),
    phone:z.string(),
    experience:z.number().min(0)
});

module.exports=DoctorSchema;