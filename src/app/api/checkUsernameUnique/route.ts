import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";
import z, { success } from "zod";


const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:NextRequest){
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam ={
            username:searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0 ? usernameErrors.join(', ') : 'Invalid query parameters '
            }, {status:400})
        }

        const {username} = result.data
        const existingVerifiedUser = await User.findOne({username , isVerified:true })

        if(existingVerifiedUser){
            return NextResponse.json({
                message:"Username already taken",
                success:false
            },{status:500})

        }

        return NextResponse.json({
            message:"Username is  Unique ",
            success:true
        },{status:200})

    } catch (error) {
        console.log('Error checking username', error)
        return NextResponse.json({
            message:"Error while checking username",
            success:false
        },{status:500})
    }

}