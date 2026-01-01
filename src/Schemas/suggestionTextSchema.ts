import {z} from "zod"

export const suggestionTextSchema = z.object({
    text: z.string().min(3,{message:"atleast 3 chars"}).max(100,{message:"max 100  chars"})
})