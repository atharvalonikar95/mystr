import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({ username: decodedUsername })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Error verifying issue"
            },
                { status: 500 }
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save()
            return NextResponse.json({
                success: true,
                message: "Account Verified successfully"
            }, { status: 200 }
            )
        }
        else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: true,
                message: "code Expired , please signin again"
            }, { status: 400 }
            )
        }
        else {
            return NextResponse.json({
                success: true,
                message: "Incorrect verification code"
            }, { status: 500 })
        }


    } catch (error) {
        console.error('Error while verifying user', error)
        return Response.json({
            success: false,
            message: "Error verifying issue"
        },
            { status: 500 }
        )

    }
}