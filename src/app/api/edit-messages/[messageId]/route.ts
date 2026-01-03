import dbConnect from "@/lib/dbConnect";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession, User as USER } from "next-auth";
import mongoose from "mongoose";
import User from "@/model/User";

export async function PUT(
    request: NextRequest, { params }: { params: Promise<{ messageId: string }> }
) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user as USER;

    if (!session || !user) {
        return NextResponse.json(
            { success: false, message: "Not Authenticated" },
            { status: 401 }
        );
    }

    const { messageId } = await params;
    const { content } = await request.json();

    if (!content || content.trim().length < 1) {
        return NextResponse.json(
            { success: false, message: "Message content is required" },
            { status: 400 }
        );
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return NextResponse.json(
            { success: false, message: "Invalid message id" },
            { status: 400 }
        );
    }

    try {
        const result = await User.updateOne(
            {
                _id: user._id,
                "messages._id": messageId,
            },
            {
                $set: {
                    "messages.$.content": content,
                },
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { success: false, message: "Message not found or not updated" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Message updated successfully",
        });


    } catch (error) {
        console.error("Edit error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );

    }


}