import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "CONTACT_MAIL_TO",
] as const;

export async function POST(request: Request) {
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    return Response.json(
      { message: `Missing email configuration: ${missingEnv.join(", ")}` },
      { status: 500 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const phone = payload.phone?.trim() || "-";
  const company = payload.company?.trim() || "-";
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    return Response.json(
      { message: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const smtpPort = Number(process.env.SMTP_PORT);

  if (!Number.isInteger(smtpPort)) {
    return Response.json(
      { message: "SMTP_PORT must be a valid number." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_MAIL_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_MAIL_TO,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New inquiry from PT. SUME website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return Response.json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Failed to send contact email:", error);

    return Response.json(
      { message: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
