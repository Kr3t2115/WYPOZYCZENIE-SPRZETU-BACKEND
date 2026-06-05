import {z} from "zod";

const createAttributeSchema = z.object({
    name: z
        .string()
        .min(3),
    type: z
        .enum(["TEXT","NUMBER", "SELECT", "DATE", "BOOLEAN"]),
    unit: z
        .string()
        .min(1)
        .max(5)
        .optional(),
})

export {createAttributeSchema}
