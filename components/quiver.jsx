import { ArrowIcon, CheckIcon } from './icons';

function QuiverDashboard() {
  const channels = [
    { ch: 'Meta', val: '€42.1k', pct: 82 },
    { ch: 'Google', val: '€38.6k', pct: 74 },
    { ch: 'TikTok', val: '€19.4k', pct: 41 },
  ];

  const points = [8, 12, 10, 18, 14, 22, 19, 26, 24, 30, 28, 36, 33, 42];
  const w = 240, h = 80;
  const max = Math.max(...points), min = Math.min(...points);
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="dots"><i></i><i></i><i></i></div>
        <div className="url">quiver.olai.io / dashboard / acme-co</div>
      </div>
      <div className="dash-body">
        <div className="dash-card" style={{ gridRow: 'span 1' }}>
          <span className="lbl">Profit ROAS · last 7d</span>
          <span className="val">3.42×</span>
          <span className="delta">▲ +0.31 vs prev period</span>
          <div className="dash-chart">
            <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="qfill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.82 0.16 78 / 0.4)" />
                  <stop offset="100%" stopColor="oklch(0.82 0.16 78 / 0)" />
                </linearGradient>
              </defs>
              <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#qfill)" />
              <path d={path} stroke="oklch(0.82 0.16 78)" strokeWidth="1.5" fill="none" />
              {points.map((p, i) => {
                const x = (i / (points.length - 1)) * w;
                const y = h - ((p - min) / (max - min)) * h;
                return <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 3 : 0} fill="oklch(0.82 0.16 78)" />;
              })}
            </svg>
          </div>
        </div>
        <div className="dash-card">
          <span className="lbl">Channel breakdown</span>
          <div className="dash-rows" style={{ marginTop: 10, flex: 1 }}>
            {channels.map((c) => (
              <div className="dash-row" key={c.ch}>
                <span className="ch">{c.ch}</span>
                <div className="bar"><i style={{ width: c.pct + '%' }}></i></div>
                <span className="num">{c.val}</span>
              </div>
            ))}
          </div>
          <span className="lbl" style={{ marginTop: 12 }}>Alert · 2m ago</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>
            ↗ TikTok CPA spiked 41% — campaign &apos;SS26-prospect&apos;
          </span>
        </div>
      </div>
    </div>
  );
}

const quiverFeatures = [
  { t: 'Cross-channel analytics', d: 'Meta, Google, TikTok and Snap, normalized.' },
  { t: 'Automated reporting', d: 'Reports that write themselves, not your team.' },
  { t: 'Real-time monitoring', d: 'Performance shifts surfaced the moment they happen.' },
  { t: 'Custom alerting', d: 'Thresholds you define, in Slack or email.' },
  { t: 'Profit-based signals', d: 'Margin-aware bidding, not just revenue.' },
  { t: 'Warehouse-native', d: 'Plugs into BigQuery, Snowflake, Redshift.' },
];

export default function Quiver() {
  return (
    <section className="block quiver" id="quiver">
      <div className="wrap">
        <div className="section-label">
          <span className="num">03</span>
          <span className="line"></span>
          <span className="lbl">Product · Quiver</span>
        </div>
        <div className="quiver-grid">
          <div>
            <div className="quiver-tag">
              <span className="pill">Quiver</span>
              <span style={{ color: 'var(--fg-3)' }}>Our intelligence platform</span>
            </div>
            <h2>All your channels.<br />One source of truth.</h2>
            <p className="quiver-sub">
              Quiver unifies ad data across every platform you run, surfaces the patterns no dashboard catches, and turns reporting into decisions — not slides.
            </p>
            <div className="quiver-feats">
              {quiverFeatures.map((f) => (
                <div className="qf" key={f.t}>
                  <span className="qf-bullet"><CheckIcon /></span>
                  <div className="qf-text">
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="quiver-cta">
              <a href="#contact" className="btn">Get in touch <span className="arr"><ArrowIcon size={13} /></span></a>
              <a href="#contact" className="btn ghost">See a live demo</a>
            </div>
          </div>
          <div>
            <QuiverDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
