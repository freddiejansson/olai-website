import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const STORAGE_KEY = 'olai_cookie_consent_v1';

export default function ConsentMode() {
  return (
    <>
      <Script id="consent-mode-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          window.gtag = gtag;

          var stored = null;
          try {
            var raw = window.localStorage.getItem('${STORAGE_KEY}');
            if (raw) stored = JSON.parse(raw);
          } catch (e) {}

          var analyticsGranted = stored && stored.analytics ? 'granted' : 'denied';
          var marketingGranted = stored && stored.marketing ? 'granted' : 'denied';

          gtag('consent', 'default', {
            ad_storage:            marketingGranted,
            ad_user_data:          marketingGranted,
            ad_personalization:    marketingGranted,
            analytics_storage:     analyticsGranted,
            functionality_storage: 'granted',
            security_storage:      'granted',
            wait_for_update:       500
          });

          gtag('set', 'ads_data_redaction', marketingGranted === 'granted' ? false : true);
          gtag('set', 'url_passthrough', true);

          gtag('js', new Date());
        `}
      </Script>

      {GTM_ID ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      ) : null}

      {GA_ID ? (
        <>
          <Script
            id="ga-loader"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}

export function GtmNoscript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
