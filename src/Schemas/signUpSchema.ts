import { z } from "zod";

export const usernameValidation=z.string().min(2,'username must be atleast 2 char')
                                .max(20,'no more than 20 chars')
                                .regex(/^[a-zA-Z0-9_]+$/,'username must not contain special charcters')


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email"}),
    password:z.string().min(6,{message:"min 6 chars"})
})