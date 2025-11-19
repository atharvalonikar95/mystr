import {z} from "zod"

export const messageSchema = z.object({
    content: z.string().min(10,{message:"atleast 10 chars"}).max(300,{message:"max 300  chars"})
})