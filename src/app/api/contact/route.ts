import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  fullName?: string;
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

  const name = (payload.fullName || payload.name)?.trim();
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

  if (!isValidEmail(email)) {
    return Response.json(
      { message: "Please enter a valid email address." },
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

  const callbackHref = createCallbackEmailHref({
    company,
    email,
    message,
    name,
    phone,
  });
  const recipients = normalizeEmailList(process.env.CONTACT_MAIL_TO);
  const subject = `New lead from ${name} - SUME website`;

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_MAIL_FROM || process.env.SMTP_USER,
      to: recipients,
      replyTo: email,
      subject,
      text: formatLeadText({ company, email, message, name, phone }),
      html: formatLeadHtml({
        callbackHref,
        company,
        email,
        message,
        name,
        phone,
      }),
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

type LeadEmailData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

type LeadEmailHtmlData = LeadEmailData & {
  callbackHref: string;
};

function normalizeEmailList(value?: string) {
  return (value || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createCallbackEmailHref({
  company,
  email,
  name,
  phone,
}: LeadEmailData) {
  const params = new URLSearchParams({
    subject: `Callback from SUME - ${name}`,
    body: [
      `Hi ${name},`,
      "",
      "Thank you for contacting SUME. We would like to schedule a callback with you.",
      "",
      `Full Name: ${name}`,
      `Email Address: ${email}`,
      `Phone Number: ${phone}`,
      `Company: ${company}`,
    ].join("\n"),
  });

  return `mailto:${email}?${params.toString()}`;
}

function formatLeadText({ company, email, message, name, phone }: LeadEmailData) {
  return [
    "New lead from SUME website",
    "",
    `Full Name: ${name}`,
    `Email Address: ${email}`,
    `Phone Number: ${phone}`,
    `Company: ${company}`,
    "",
    "Message:",
    message,
    "",
    `Callback email: ${email}`,
  ].join("\n");
}

function formatLeadHtml({
  callbackHref,
  company,
  email,
  message,
  name,
  phone,
}: LeadEmailHtmlData) {
  const rows = [
    ["Full Name", name],
    ["Email Address", email],
    ["Phone Number", phone],
    ["Company", company],
  ];

  return `
    <div style="margin:0;padding:32px;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e9f2;border-radius:8px;overflow:hidden;">
        <div style="padding:28px 32px;background:#0b4f9f;color:#ffffff;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;">SUME Website Lead</p>
          <h1 style="margin:0;font-size:24px;line-height:1.3;">New lead from ${escapeHtml(name)}</h1>
        </div>
        <div style="padding:28px 32px;">
          <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin:0 0 24px;">
            <tbody>
              ${rows
                .map(
                  ([label, value]) => `
                    <tr>
                      <td style="width:160px;padding:12px 16px 12px 0;border-bottom:1px solid #edf0f5;color:#667085;font-size:13px;font-weight:700;">${escapeHtml(label)}</td>
                      <td style="padding:12px 0;border-bottom:1px solid #edf0f5;color:#172033;font-size:15px;">${escapeHtml(value)}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
          <div style="margin:0 0 24px;">
            <p style="margin:0 0 10px;color:#667085;font-size:13px;font-weight:700;">Message</p>
            <div style="padding:16px;border-radius:6px;background:#f8fafc;color:#172033;font-size:15px;line-height:1.65;">
              ${escapeHtml(message).replace(/\n/g, "<br />")}
            </div>
          </div>
          <a href="${escapeHtml(callbackHref)}" style="display:inline-block;padding:13px 18px;border-radius:6px;background:#0b4f9f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
            Email Lead for Callback
          </a>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
