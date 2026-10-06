const {z}=require("zod");

const validatePatient=z.object({
    name:z.string().trim(),
    phone:z.string(),
    age:z.number().min(0),
    gender:z.string()
});
module.exports=validatePatient;