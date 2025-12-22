import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/Message";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
    await dbConnect();

    const { username, content } = await request.json()
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "no user found"
            }, { status: 404 }
            )
        }
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "user is not accepting messages"
            }, { status: 403 })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save();

        return NextResponse.json({
            success: true,
            message: "message sent successfully"
        }, { status: 200 })

    } catch (error) {
        console.log('unexpected error', error)
        return NextResponse.json({
            success: false,
            message: "unexpected error"
        }, { status: 500 }
        )
    }
}