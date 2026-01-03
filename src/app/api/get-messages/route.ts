import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as USER } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import { success } from "zod";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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
    const objectId = mongoose.Types.ObjectId.isValid(userId!)
        ? new mongoose.Types.ObjectId(userId)
        : userId;
    // new mongoose.Types.ObjectId(user._id);

    try {
        const user = await User.aggregate([
            { $match: { _id: objectId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                session,
                message: "User not found "
            }, { status: 401 }
            )
        }

        // ✅ DTO TRANSFORMATION (THE KEY FIX)
        const messages = user[0].messages.map((msg: any) => ({
            _id: msg._id.toString(),
            content: msg.content,
            createdAt: msg.createdAt,
        }));

        return NextResponse.json({
            success: true,
            messages: messages
        }, { status: 200 }
        )

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'unexpected error', error
        }, { status: 500 }
        )
    }

}