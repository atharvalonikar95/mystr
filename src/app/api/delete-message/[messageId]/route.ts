import dbConnect from "@/lib/dbConnect";
import { getServerSession, User as USER } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import { success } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string}> }
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
  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return NextResponse.json(
      { success: false, message: "Invalid message id"},
      { status: 400 }
    );
  }

  try {
    const updatedResult = await User.updateOne(
      { _id: user._id }, // FILTER
      { $pull: { messages: { _id: messageId } } } // UPDATE
    );

    if (updatedResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found or already deleted",
          
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while deleting message",
      },
      { status: 500 }
    );
  }
}
