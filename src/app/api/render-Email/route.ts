// "use server";

// import { NextRequest, NextResponse } from "next/server";
// import ReactDOMServer from "react-dom/server";
// import VerificationEmail from "../../../../emails/VerificationEmail"; // adjust path

// export async function POST(req: NextRequest) {
//   try {
//     const { username, otp } = await req.json();

//     const html = ReactDOMServer.renderToStaticMarkup(
//       // <VerificationEmail username={username} otp={otp} />
//     );

//     return NextResponse.json({ success: true, html });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { success: false, message: "Failed to render email" },
//       { status: 500 }
//     );
//   }
// }
