import {z} from "zod";

const nameField = z.string().min(3).max(100);
const descriptionField = z.string().min(3).max(500)

export {nameField, descriptionField};