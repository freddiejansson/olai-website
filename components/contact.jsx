'use client';

import { useState } from 'react';
import { ArrowIcon } from './icons';

export default function Contact() {
  const [val, setVal] = useState('');
  const [sent, setSent] = useState(false);

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
          onSubmit={(e) => {
            e.preventDefault();
            if (val) setSent(true);
          }}
        >
          <input
            type="email"
            placeholder="you@company.com"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            required
          />
          <button type="submit" className="btn">
            {sent ? 'Thanks — we\'ll be in touch ✓' : <>Contact us <span className="arr"><ArrowIcon size={13} /></span></>}
          </button>
        </form>
        <p className="contact-alt">
          Or reach us at <a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a>
        </p>
      </div>
    </section>
  );
}
