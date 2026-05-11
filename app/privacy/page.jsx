import Footer from '@/components/footer';

export const metadata = {
  title: 'Privacy Policy — Olai',
  description:
    'How Olai Business Consulting AB collects, uses, stores, and protects personal data — including data accessed via Google APIs.',
};

export default function PrivacyPage() {
  return (
    <>
      <header className="legal-nav">
        <div className="wrap legal-nav-inner">
          <a href="/" className="logo">
            <span className="logo-mark"></span>Olai
          </a>
          <a href="/" className="legal-back">← Back to site</a>
        </div>
      </header>

      <main className="legal">
        <div className="wrap legal-wrap">
          <span className="mono">Legal</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-meta">
            Last updated: 11 May 2026 · Effective date: 11 May 2026
          </p>

          <section className="legal-section">
            <h2>1. Who we are</h2>
            <p>
              This Privacy Policy describes how <strong>Olai Business Consulting AB</strong>
              {' '}("Olai", "we", "us", or "our") collects, uses, stores, and shares
              personal data when you visit our website at{' '}
              <a href="https://olaibusiness.se">olaibusiness.se</a>, contact us, or
              engage us for consulting, performance media, analytics, or platform
              services (including our product Quiver).
            </p>
            <p>
              Olai Business Consulting AB is a Swedish limited company based in
              Sundsvall, Sweden. We act as a data controller for the personal data we
              process about our website visitors, prospects, and direct clients. When
              we process personal data on behalf of a client (for example, when
              operating advertising or analytics on their behalf), we act as a data
              processor under that client's instructions.
            </p>
            <p>
              For any questions about this policy or your personal data, contact us
              at <a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. What data we collect</h2>
            <p>We collect the following categories of personal data:</p>
            <ul>
              <li>
                <strong>Contact data</strong> you provide when you reach out — name,
                email address, company, phone number, and the content of your message.
              </li>
              <li>
                <strong>Client and engagement data</strong> — account details,
                billing information, and information shared during the course of an
                engagement.
              </li>
              <li>
                <strong>Usage and device data</strong> — IP address, browser type,
                device type, pages viewed, referring URL, and timestamps, collected
                via standard server logs and privacy-respecting analytics.
              </li>
              <li>
                <strong>Marketing platform data</strong> — when authorised, we access
                advertising and analytics data from third-party platforms (such as
                Google Ads, Google Analytics, Meta, LinkedIn, TikTok) on behalf of
                our clients in order to operate, measure, and report on campaigns.
              </li>
              <li>
                <strong>Cookies and similar technologies</strong> — see Section 7.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How we use your data</h2>
            <p>We use personal data to:</p>
            <ul>
              <li>Respond to inquiries and provide requested information.</li>
              <li>Deliver our consulting, media, analytics, and platform services.</li>
              <li>Operate, secure, maintain, and improve our website and Quiver.</li>
              <li>
                Manage advertising and measurement on behalf of our clients,
                including connecting to and reading from APIs such as the Google Ads
                API, Google Analytics Data API, and similar platforms.
              </li>
              <li>Send service-related communications and, where permitted, relevant updates.</li>
              <li>Comply with legal, accounting, and regulatory obligations.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Legal bases (GDPR)</h2>
            <p>
              We process personal data on the following legal bases under the EU
              General Data Protection Regulation (GDPR):
            </p>
            <ul>
              <li><strong>Contract</strong> — to enter into or perform an agreement with you or your organisation.</li>
              <li><strong>Legitimate interest</strong> — to operate our business, secure our systems, and communicate with prospects and clients in a proportionate way.</li>
              <li><strong>Consent</strong> — where required, for example for non-essential cookies or marketing communications.</li>
              <li><strong>Legal obligation</strong> — to comply with applicable laws, including bookkeeping and tax requirements.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Google API Services and Google user data</h2>
            <p>
              When a client authorises Olai to access their Google accounts (for
              example, Google Ads or Google Analytics), we access that data
              exclusively to deliver the services the client has engaged us for —
              such as campaign management, reporting, measurement, and platform
              integration via Quiver.
            </p>
            <p>
              Olai's use and transfer of information received from Google APIs
              adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Specifically:
            </p>
            <ul>
              <li>We only use Google user data to provide or improve the user-facing features the client has authorised.</li>
              <li>We do not sell Google user data.</li>
              <li>We do not use Google user data for advertising, including retargeting or personalised or interest-based advertising.</li>
              <li>We do not allow humans to read Google user data unless we have the client's affirmative agreement for specific data, it is necessary for security purposes (such as investigating abuse), to comply with applicable law, or for our internal operations where the data has been aggregated and anonymised.</li>
              <li>We do not transfer Google user data to third parties except as necessary to provide or improve user-facing features, to comply with applicable law, or as part of a merger, acquisition, or sale of assets, in each case with notice to affected clients.</li>
            </ul>
            <p>
              Clients can revoke our access to their Google accounts at any time
              through their Google account settings at{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
              >
                myaccount.google.com/permissions
              </a>{' '}
              or by contacting us.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Sharing and sub-processors</h2>
            <p>
              We share personal data only with parties that help us run our business
              and deliver our services. These currently include:
            </p>
            <ul>
              <li><strong>Cloud and hosting providers</strong> for hosting, storage, and infrastructure (e.g. Vercel, AWS, Google Cloud).</li>
              <li><strong>Advertising and analytics platforms</strong> such as Google, Meta, LinkedIn, and TikTok, when operated on behalf of a client.</li>
              <li><strong>Business tools</strong> for email, CRM, billing, and productivity.</li>
              <li><strong>Professional advisors</strong> such as accountants and legal counsel.</li>
              <li><strong>Authorities</strong> where we are legally required to disclose data.</li>
            </ul>
            <p>
              We do not sell personal data. Where sub-processors are located outside
              the European Economic Area, we rely on appropriate safeguards such as
              the EU Standard Contractual Clauses.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Cookies</h2>
            <p>
              Our website uses a minimal set of cookies and similar technologies for
              core functionality and aggregated, privacy-respecting analytics. Where
              required, we ask for your consent before setting non-essential
              cookies. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Data retention</h2>
            <p>
              We retain personal data only as long as needed for the purposes
              described in this policy or as required by law. Contact and inquiry
              data is typically retained for up to 24 months from last contact.
              Client engagement and billing records are retained for the period
              required by applicable Swedish accounting law (currently seven years).
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Security</h2>
            <p>
              We apply technical and organisational measures designed to protect
              personal data against unauthorised access, loss, alteration, or
              disclosure. These include access controls, encryption in transit,
              least-privilege principles, and audit logging for systems that handle
              client and platform data.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Your rights</h2>
            <p>
              Under the GDPR you have the right to access, rectify, erase, restrict,
              and port your personal data, and to object to processing based on our
              legitimate interests. Where processing is based on consent, you may
              withdraw consent at any time. To exercise these rights, contact us at{' '}
              <a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a>.
            </p>
            <p>
              You also have the right to lodge a complaint with the Swedish
              Authority for Privacy Protection (Integritetsskyddsmyndigheten, IMY)
              or your local supervisory authority.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The "Last updated" date
              at the top of this page reflects the most recent revision. Material
              changes will be communicated through the website or by direct notice
              where appropriate.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Contact</h2>
            <p>
              Olai Business Consulting AB<br />
              Sundsvall, Sweden<br />
              Email: <a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
