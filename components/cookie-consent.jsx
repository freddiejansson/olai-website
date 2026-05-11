'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'olai_cookie_consent_v1';
const CONSENT_EVENT = 'olai:open-cookie-settings';

const defaultPrefs = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readStored() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(prefs) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...prefs,
        necessary: true,
        timestamp: new Date().toISOString(),
        version: 1,
      })
    );
  } catch {
    /* storage disabled — silently ignore */
  }
}

function pushConsentUpdate(prefs) {
  if (typeof window === 'undefined') return;
  const marketing = prefs.marketing ? 'granted' : 'denied';
  const analytics = prefs.analytics ? 'granted' : 'denied';
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  window.gtag('consent', 'update', {
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    analytics_storage: analytics,
  });
  window.gtag('set', 'ads_data_redaction', marketing === 'granted' ? false : true);
  window.dataLayer.push({ event: 'consent_update', consent: prefs });
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    const stored = readStored();
    if (!stored) {
      setOpen(true);
    }
    const handler = () => {
      const current = readStored();
      if (current) {
        setPrefs({
          necessary: true,
          analytics: !!current.analytics,
          marketing: !!current.marketing,
        });
      }
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  if (!open) return null;

  const save = (next) => {
    const final = { ...defaultPrefs, ...next, necessary: true };
    writeStored(final);
    pushConsentUpdate(final);
    setPrefs(final);
    setOpen(false);
    setShowDetails(false);
  };

  const acceptAll = () => save({ analytics: true, marketing: true });
  const rejectAll = () => save({ analytics: false, marketing: false });
  const savePrefs = () => save(prefs);

  return (
    <div
      className="cc-root"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cc-title"
      aria-describedby="cc-desc"
    >
      <div className="cc-card">
        {!showDetails ? (
          <>
            <div className="cc-head">
              <span className="mono">Cookies</span>
              <h2 id="cc-title" className="cc-title">
                We respect your privacy
              </h2>
              <p id="cc-desc" className="cc-body">
                We use strictly necessary cookies to run this site. With your
                consent, we may also use analytics and marketing cookies to
                understand how the site is used and to measure our campaigns.
                You can accept all, reject non-essential, or choose your
                preferences. Read our{' '}
                <a href="/privacy">Privacy Policy</a>.
              </p>
            </div>
            <div className="cc-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={rejectAll}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => setShowDetails(true)}
              >
                Customise
              </button>
              <button type="button" className="btn" onClick={acceptAll}>
                Accept all
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cc-head">
              <span className="mono">Cookie preferences</span>
              <h2 id="cc-title" className="cc-title">
                Choose what you allow
              </h2>
              <p id="cc-desc" className="cc-body">
                Toggle each category. Strictly necessary cookies are required
                for the site to function and cannot be disabled.
              </p>
            </div>

            <ul className="cc-list">
              <CategoryRow
                title="Strictly necessary"
                description="Required for core site functionality such as security, network management, and remembering your cookie choices. Always active."
                checked={true}
                disabled
                onChange={() => {}}
              />
              <CategoryRow
                title="Analytics"
                description="Help us understand how visitors use the site so we can improve it. Anonymous and aggregated."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <CategoryRow
                title="Marketing"
                description="Used to measure the effectiveness of our advertising and to show relevant content. Includes ad-platform pixels when active."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </ul>

            <div className="cc-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={rejectAll}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={savePrefs}
              >
                Save preferences
              </button>
              <button type="button" className="btn" onClick={acceptAll}>
                Accept all
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryRow({ title, description, checked, disabled, onChange }) {
  return (
    <li className="cc-row">
      <div className="cc-row-text">
        <h3 className="cc-row-title">{title}</h3>
        <p className="cc-row-desc">{description}</p>
      </div>
      <label
        className={'cc-switch' + (disabled ? ' is-disabled' : '')}
        aria-label={title}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="cc-switch-track" aria-hidden="true">
          <span className="cc-switch-thumb" />
        </span>
      </label>
    </li>
  );
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
