import { sendVerificationEmail } from "@/helpers/sendVerficationemail";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";
import VerificationEmail from "../../../../emails/VerificationEmail";

export async function POST(request:NextRequest){
    await dbConnect()

    try {

        const  {email,password,username}= await request.json()

        const existingUserVerifiedByUsername = await User.findOne({username,isVerified:true})

        if(existingUserVerifiedByUsername){
            return NextResponse.json({
                success:false,
                message:"user already exist"
            },{status:400})
        }

        const existingUserByEmail = await User.findOne({email,isVerified:true})

        const verifyCode = Math.floor(100000+ Math.random() * 900000 ).toString()
        
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                    return NextResponse.json({
                    success:true,
                    message:"user already registered successfully with this email"
                },{status:400})
            }
            else{
                const hashedpasword = await bcrypt.hash(password,10)
                existingUserByEmail.password=hashedpasword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)

                await existingUserByEmail.save()
            }
        }
        else{
            const hashedpasword=await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new User({
                    username,
                    email,
                    password:hashedpasword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMessage:true,
                    messages:[]
            })

            await newUser.save()
        }

        //send verification email

        const emailResponse =await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse.success){
            return NextResponse.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }

    return NextResponse.json({
        success:true,
        message:"user registered successfully please verify email"
    },{status:200})
        
    } catch (error) {
        console.log('Error while registering',error);
        return NextResponse.json({
            success:false,
            message:"Error while registering user "
        },{status:500})
    }

}