import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as USER } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../options";
import User from "@/model/User";
import { success } from "zod";

export async function POST(request: NextRequest) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: USER = session?.user as USER

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 200 })
        }
        else {
            return NextResponse.json({
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            }, { status: 200 })
        }
    } catch (error) {

        console.log('failed to update user status to accept messages')
        return NextResponse.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 401 }
        )

    }


}

export async function GET(request: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: USER = session?.user as USER

    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 }
        )
    }
    const userId = user._id;
    const foundUser = await User.findById(userId);
    try{
        if(!foundUser){
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
    }
    catch(error){
        console.log('error is getting message acceptance status',error);
        return NextResponse.json({
            success:true,
            message: 'error is getting message acceptance status'
    },{status:500})
    }

    return NextResponse.json({
        success:true,
        isAcceptingMessages: foundUser.isAcceptingMessage
    },{status:200})

}