import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/User";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json(
            {
                message: "Unauthorized access",
            }, {
            status: 401
            }
        )
    }

    if(session.user.role!=='admin'){
        return NextResponse.json(
            {message:"sorry admin access not granted ",session },
            {status:403}
        )
    }
    const userCount = await User.countDocuments({role:'admin'})
    return NextResponse.json(
        {message:"user count fetched ",userCount},
        {status:200}
    )

}