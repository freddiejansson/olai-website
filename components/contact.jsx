'use client';

import { useState } from 'react';
import { ArrowIcon } from './icons';
import { postContactLead } from '@/lib/contact-lead';

export default function Contact() {
  const [val, setVal] = useState('');
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState(null);

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="section-label" style={{ justifyContent: 'center' }}>
          <span className="line" style={{ maxWidth: 60 }}></span>
          <span className="lbl">Let&apos;s talk</span>
          <span className="line" style={{ maxWidth: 60 }}></span>
        </div>
        <h2>Tell us what&apos;s <em>noisy.</em><br />We&apos;ll show you the signal.</h2>
        <p>Send us a line about your data, your media, or the question keeping you up at night. We&apos;ll come back with sharp questions and a concrete next step — regardless of whether we end up working together.</p>
        <form
          className="contact-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!val.trim() || pending || sent) return;
            setErr(null);
            setPending(true);
            try {
              await postContactLead({ email: val, source: 'contact-section' });
              setSent(true);
            } catch (er) {
              setErr(er instanceof Error ? er.message : 'Something went wrong.');
            } finally {
              setPending(false);
            }
          }}
        >
          <input
            type="email"
            placeholder="you@company.com"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            disabled={pending || sent}
            required
          />
          <button type="submit" className="btn" disabled={pending || sent}>
            {sent
              ? 'Thanks — we\'ll be in touch ✓'
              : pending
                ? 'Sending…'
                : <>Contact us <span className="arr"><ArrowIcon size={13} /></span></>}
          </button>
        </form>
        {err ? <p className="contact-form-error">{err}</p> : null}
        <p className="contact-alt">
          Or reach us at <a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a>
        </p>
      </div>
    </section>
  );
}
