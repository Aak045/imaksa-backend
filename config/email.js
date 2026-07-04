// config/email.js — Resend Email Setup
// Switched from Nodemailer/SMTP to Resend's HTTPS API because Railway
// blocks outbound SMTP ports (25/465/587) on this plan, causing every
// email to time out. Resend sends over HTTPS (port 443), which is
// never blocked, since that's how the whole app already talks to MongoDB/APIs.
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Default "from" address. Resend's free shared address works with zero setup.
// Once imaksa.ae is connected + verified in Resend, change this to
// something like 'IMAKSA Properties <noreply@imaksa.ae>' for full branding.
const FROM_ADDRESS = process.env.RESEND_FROM || 'IMAKSA Properties <onboarding@resend.dev>';

// ── Send Enquiry Email to Client ──
const sendEnquiryEmail = async (enquiry) => {
  if (!process.env.CLIENT_EMAIL) {
    throw new Error('CLIENT_EMAIL environment variable is not set — cannot send notification');
  }
  const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border:1px solid #DDD3C0;">
        
        <!-- HEADER -->
        <div style="background:#0D4F4A;padding:28px 32px;">
          <h1 style="color:#F5EFE4;font-size:22px;margin:0;letter-spacing:3px;">IMAKSA</h1>
          <p style="color:rgba(245,239,228,.6);font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">New Website Enquiry</p>
        </div>

        <!-- BODY -->
        <div style="padding:32px;">
          <h2 style="color:#0D4F4A;font-size:20px;margin:0 0 24px;">You have a new enquiry!</h2>
          
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;width:35%;">Full Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;font-weight:600;">${enquiry.name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;"><a href="mailto:${enquiry.email}" style="color:#0D4F4A;">${enquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Phone</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;"><a href="tel:${enquiry.phone}" style="color:#0D4F4A;">${enquiry.phone}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Interest</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${enquiry.interest || '—'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Budget</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${enquiry.budget || '—'}</td>
            </tr>
          </table>

          <!-- MESSAGE -->
          <div style="margin-top:24px;">
            <p style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:10px;">Message</p>
            <div style="background:#F5EFE4;border-left:3px solid #0D4F4A;padding:16px;font-size:14px;color:#0A0A0A;line-height:1.7;">
              ${enquiry.message || 'No message provided'}
            </div>
          </div>

          <!-- CTA BUTTONS -->
          <div style="margin-top:28px;display:flex;gap:12px;">
            <a href="mailto:${enquiry.email}?subject=Re: Your Property Enquiry - IMAKSA" 
               style="display:inline-block;background:#0D4F4A;color:#F5EFE4;padding:12px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">
              ✉️ Reply by Email
            </a>
            <a href="https://wa.me/${enquiry.phone?.replace(/\D/g, '')}?text=Hi ${enquiry.name}, thank you for your enquiry about IMAKSA Properties."
               style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="background:#EDE5D8;padding:20px 32px;text-align:center;">
          <p style="font-size:11px;color:#888;margin:0;">This email was sent automatically by your IMAKSA website</p>
          <p style="font-size:11px;color:#888;margin:4px 0 0;">© 2025 IMAKSA Properties LLC. RERA Licensed.</p>
        </div>
      </div>
    `;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: process.env.CLIENT_EMAIL,
    subject: `🏡 New Property Enquiry from ${enquiry.name}`,
    html,
  });
};

// ── Send Sell Request Email to Client (admin) ──
const sendSellRequestEmail = async (req) => {
  if (!process.env.CLIENT_EMAIL) {
    throw new Error('CLIENT_EMAIL environment variable is not set — cannot send notification');
  }
  const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border:1px solid #DDD3C0;">

        <!-- HEADER -->
        <div style="background:#0D4F4A;padding:28px 32px;">
          <h1 style="color:#F5EFE4;font-size:22px;margin:0;letter-spacing:3px;">IMAKSA</h1>
          <p style="color:rgba(245,239,228,.6);font-size:12px;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase;">New Sell Request</p>
        </div>

        <!-- BODY -->
        <div style="padding:32px;">
          <h2 style="color:#0D4F4A;font-size:20px;margin:0 0 24px;">Someone wants to sell a property!</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;width:35%;">Full Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;font-weight:600;">${req.name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;"><a href="mailto:${req.email}" style="color:#0D4F4A;">${req.email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Phone</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;"><a href="tel:${req.phone}" style="color:#0D4F4A;">${req.phone}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Property Type</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${req.propertyType || '—'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Location</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${req.location || '—'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Size</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${req.size || '—'}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;">Asking Price</td>
              <td style="padding:12px 0;border-bottom:1px solid #DDD3C0;font-size:14px;color:#0A0A0A;">${req.askingPrice || 'Not specified'}</td>
            </tr>
          </table>

          <!-- NOTES -->
          <div style="margin-top:24px;">
            <p style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;margin-bottom:10px;">Notes from Seller</p>
            <div style="background:#F5EFE4;border-left:3px solid #0D4F4A;padding:16px;font-size:14px;color:#0A0A0A;line-height:1.7;">
              ${req.notes || 'No notes provided'}
            </div>
          </div>

          <!-- CTA BUTTONS -->
          <div style="margin-top:28px;display:flex;gap:12px;">
            <a href="mailto:${req.email}?subject=Re: Your Property Sell Request - IMAKSA"
               style="display:inline-block;background:#0D4F4A;color:#F5EFE4;padding:12px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">
              ✉️ Reply by Email
            </a>
            <a href="https://wa.me/${req.phone?.replace(/\D/g, '')}?text=Hi ${req.name}, thank you for reaching out about selling your property with IMAKSA."
               style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;font-size:12px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="background:#EDE5D8;padding:20px 32px;text-align:center;">
          <p style="font-size:11px;color:#888;margin:0;">This email was sent automatically by your IMAKSA website</p>
        </div>
      </div>
    `;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: process.env.CLIENT_EMAIL,
    subject: `🏷️ New Sell Request from ${req.name}`,
    html,
  });
};

// ── Send Confirmation to Client/Lead ──
const sendConfirmationEmail = async (enquiry) => {
  const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF8;border:1px solid #DDD3C0;">
        <div style="background:#0D4F4A;padding:28px 32px;">
          <h1 style="color:#F5EFE4;font-size:22px;margin:0;letter-spacing:3px;">IMAKSA</h1>
          <p style="color:rgba(245,239,228,.6);font-size:12px;margin:4px 0 0;">Luxury Real Estate Dubai</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0D4F4A;font-size:20px;margin:0 0 16px;">Thank you, ${enquiry.name}!</h2>
          <p style="font-size:14px;color:#4A4A4A;line-height:1.8;margin-bottom:20px;">
            We've received your enquiry and one of our property consultants will contact you within <strong>24 hours</strong>.
          </p>
          <div style="background:#F5EFE4;border:1px solid #DDD3C0;padding:20px;margin-bottom:24px;">
            <p style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;margin:0 0 8px;">Your Enquiry Summary</p>
            <p style="font-size:14px;color:#0A0A0A;margin:4px 0;"><strong>Property Interest:</strong> ${enquiry.interest || '—'}</p>
            <p style="font-size:14px;color:#0A0A0A;margin:4px 0;"><strong>Budget Range:</strong> ${enquiry.budget || '—'}</p>
          </div>
          <p style="font-size:13px;color:#4A4A4A;line-height:1.8;">
            In the meantime, browse our latest listings at <a href="${process.env.FRONTEND_URL}/properties.html" style="color:#0D4F4A;">imaksa.ae/properties</a>
          </p>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #DDD3C0;">
            <p style="font-size:12px;color:#888;margin:0;">📞 <a href="tel:+97142669295" style="color:#888;text-decoration:none;">+971 4 2669295</a> &nbsp;|&nbsp; ✉️ <a href="mailto:sales@imaksa.ae" style="color:#888;text-decoration:none;">sales@imaksa.ae</a></p>
            <p style="font-size:12px;color:#888;margin:4px 0 0;">📍 Business Village, Dubai, UAE &nbsp;|&nbsp; Mon–Sat: 9am–7pm</p>
          </div>
        </div>
        <div style="background:#EDE5D8;padding:16px 32px;text-align:center;">
          <p style="font-size:11px;color:#888;margin:0;">© 2025 IMAKSA Properties LLC. RERA Licensed.</p>
        </div>
      </div>
    `;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: enquiry.email,
    subject: `Thank you for your enquiry — IMAKSA Properties`,
    html,
  });
};

// ── Verify connection (just checks the API key is present; Resend has no persistent connection to test) ──
const verifyEmail = async () => {
  if (!process.env.RESEND_API_KEY) {
    console.log('⚠️  Email not configured: RESEND_API_KEY missing');
    return;
  }
  console.log('✅ Email ready (Resend API)');
};

module.exports = { sendEnquiryEmail, sendConfirmationEmail, sendSellRequestEmail, verifyEmail };
