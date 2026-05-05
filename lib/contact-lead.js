/**
 * POST a lead email to the site API (sends notification via Resend).
 * @param {{ email: string; source?: string }} params
 */
export async function postContactLead({ email, source = "website" }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), source }),
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(
      data.error || "Could not send. Try again or email us directly.",
    );
  }
  return data;
}
