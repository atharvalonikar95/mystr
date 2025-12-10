import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as USER } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import { success } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest, { params }: { params: { messageid: string } }) {
    const messageid = params.messageid
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

    try {
        const updatedResult = await User.updateOne({ _id: user._id, $pull: { messages: { _id: messageid } } });

        if (updatedResult.modifiedCount == 0) {
            return NextResponse.json({
                success: false,
                message: "Message Not Deleted or Already Deleted"
            }, { status: 404 })
        }
        return NextResponse.json({
            success: true,
            message: "Message  Deleted "
        }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "error while deleting",
            error
        }, { status: 500 })
    }




}