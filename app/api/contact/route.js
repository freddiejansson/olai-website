import { Resend } from "resend";

const NOTIFY_DEFAULT = "freddiejansson@gmail.com";

function isValidEmail(s) {
  if (typeof s !== "string") return false;
  const t = s.trim();
  if (t.length < 3 || t.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return Response.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body?.email;
  const source =
    typeof body?.source === "string" && body.source.length <= 80
      ? body.source.trim()
      : "website";

  if (!isValidEmail(email)) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  const clean = email.trim().toLowerCase();
  const to = process.env.CONTACT_NOTIFY_EMAIL || NOTIFY_DEFAULT;
  const from =
    process.env.RESEND_FROM || "Olai Website <onboarding@resend.dev>";

  const subject = `[Olai] Get in touch — ${source}`;
  const text = `Someone submitted the get-in-touch form.\n\nEmail: ${clean}\nSource: ${source}\nTime (server): ${new Date().toISOString()}\n`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: clean,
    subject,
    text,
    html: `<p><strong>Get in touch</strong></p><p>Email: <a href="mailto:${clean}">${clean}</a></p><p>Source: ${escapeHtml(source)}</p><p><small>${escapeHtml(new Date().toISOString())}</small></p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Failed to send notification" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
