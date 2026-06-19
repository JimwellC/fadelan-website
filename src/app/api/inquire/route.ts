import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY" },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  const body = await req.json();

  const { name, email, bag, message, _gotcha, _ts } = body as {
    name: string;
    email: string;
    bag: string;
    message: string;
    _gotcha?: string;
    _ts?: number;
  };

  // Honeypot tripped — a bot filled in a field real users never see.
  // Return a fake success so the bot doesn't learn the field is being
  // checked; never actually send the email.
  if (_gotcha) {
    return NextResponse.json({ success: true });
  }

  // Submitted faster than any human could realistically fill the form —
  // likely a scripted bot. Same fake-success response.
  if (typeof _ts === "number" && Date.now() - _ts < 2000) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const { error } = await resend.emails.send({
    from: 'Fadelan Inquiry <onboarding@resend.dev>',
    to: process.env.RESEND_TO_EMAIL!,
    replyTo: email,
    subject: `New inquiry${bag ? ` — ${bag}` : ""} from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Interested in:</strong> ${bag || "Not specified"}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}