import {z} from "zod";


const nicknameCheckSchema = z
        .string()
        .trim()
        .min(3, '')


export {nicknameCheckSchema}

