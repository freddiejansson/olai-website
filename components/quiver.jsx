"use client";

import { useState } from 'react';
import { ArrowIcon, CheckIcon } from './icons';
import QuiverInteractiveDashboard from './QuiverInteractiveDashboard';

function MiniSpark({ points, color, fill = true }) {
  const w = 100, h = 28;
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg className="dp-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.1" />}
      <path d={path} stroke={color} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MiniChart() {
  const w = 360, h = 120, pad = { l: 24, r: 8, t: 8, b: 18 };
  const innerW = w - pad.l - pad.r, innerH = h - pad.t - pad.b;
  const spend = [40, 44, 42, 48, 46, 52, 50, 55, 58, 56, 62, 65, 68, 72];
  const revenue = [110, 118, 122, 132, 128, 142, 148, 158, 162, 170, 178, 188, 196, 208];
  const all = [...spend, ...revenue];
  const max = Math.max(...all) * 1.05;
  const xAt = (i, n) => pad.l + (i / (n - 1)) * innerW;
  const yAt = (v) => pad.t + innerH - (v / max) * innerH;
  const line = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + xAt(i, arr.length) + ' ' + yAt(v)).join(' ');
  const area = (arr) => line(arr) + ` L${xAt(arr.length - 1, arr.length)} ${pad.t + innerH} L${xAt(0, arr.length)} ${pad.t + innerH} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="dp-chart-svg" preserveAspectRatio="none">
      {[0, 0.33, 0.66, 1].map((t, i) => (
        <line
          key={i}
          x1={pad.l}
          x2={w - pad.r}
          y1={pad.t + innerH * t}
          y2={pad.t + innerH * t}
          stroke="oklch(0.78 0.008 90 / 0.55)"
          strokeWidth="0.5"
          strokeDasharray={i === 3 ? '0' : '2 3'}
        />
      ))}
      <path d={area(revenue)} fill="#2f5d50" opacity="0.1" />
      <path d={line(revenue)} stroke="#2f5d50" strokeWidth="1.4" fill="none" />
      <path d={area(spend)} fill="#c8553d" opacity="0.08" />
      <path d={line(spend)} stroke="#c8553d" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function MiniDonut() {
  const data = [
    { v: 42100, c: '#1a1916' },
    { v: 38600, c: '#c8553d' },
    { v: 19400, c: '#2f5d50' },
    { v: 8900, c: '#d4a24c' },
  ];
  const total = data.reduce((a, d) => a + d.v, 0);
  const R = 38, r = 28, cx = 44, cy = 44;
  let acc = 0;
  return (
    <svg viewBox="0 0 88 88" className="dp-donut">
      {data.map((d, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += d.v;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = end - start > Math.PI ? 1 : 0;
        const x1 = cx + Math.cos(start) * R, y1 = cy + Math.sin(start) * R;
        const x2 = cx + Math.cos(end) * R, y2 = cy + Math.sin(end) * R;
        const x3 = cx + Math.cos(end) * r, y3 = cy + Math.sin(end) * r;
        const x4 = cx + Math.cos(start) * r, y4 = cy + Math.sin(start) * r;
        const dPath = `M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
        return <path key={i} d={dPath} fill={d.c} />;
      })}
    </svg>
  );
}

function QuiverDashboard({ onOpenDemo }) {
  const navItems = [
    { label: 'Home', active: true },
    { label: 'Forecasting' },
    { label: 'Campaigns' },
    { label: 'Experiments' },
  ];
  const intelItems = [
    { label: 'Virtual Analyst' },
    { label: 'Alerts', badge: '4' },
    { label: 'Profit Bidding' },
  ];

  const kpis = [
    { label: 'Total spend', value: '€109.0k', delta: '+8.2%', pos: false, spark: [40, 42, 44, 43, 46, 48, 50, 52, 54, 55, 58, 60], color: '#c8553d' },
    { label: 'Revenue', value: '€372.4k', delta: '+14.1%', pos: true, spark: [60, 62, 65, 68, 72, 76, 80, 84, 88, 92, 98, 104], color: '#2f5d50' },
    { label: 'Profit margin', value: '31.4%', delta: '+2.1pp', pos: true, spark: [22, 24, 26, 25, 27, 28, 29, 30, 31, 30, 32, 31], color: '#1a1916' },
    { label: 'ROAS', value: '3.42×', delta: '+0.31', pos: true, spark: [26, 28, 27, 30, 29, 32, 31, 33, 34, 33, 35, 34], color: '#1a1916' },
  ];

  const channels = [
    { ch: 'Meta', val: '€42.1k', pct: 46, color: '#1a1916' },
    { ch: 'Google', val: '€38.6k', pct: 35, color: '#c8553d' },
    { ch: 'TikTok', val: '€19.4k', pct: 18, color: '#2f5d50' },
    { ch: 'Snapchat', val: '€8.9k', pct: 8, color: '#d4a24c' },
  ];

  return (
    <div className="dash">
      <div className="dash-top">
        <div className="dots"><i></i><i></i><i></i></div>
        <div className="url">quiver.olaibusiness.se / dashboard / acme-co</div>
      </div>
      <div className="dp-shell">
        <aside className="dp-sidebar">
          <div className="dp-brand">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.4" />
              <path d="M9 9 L19 19 M9 14 L14 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="19" cy="9" r="2" fill="var(--accent)" />
            </svg>
            <span>Quiver</span>
          </div>
          <div className="dp-nav-label"><span className="dp-num">01</span>Workspace</div>
          {navItems.map((it) => (
            <div key={it.label} className={`dp-nav-btn${it.active ? ' active' : ''}`}>
              <span className="dp-bullet" />
              {it.label}
            </div>
          ))}
          <div className="dp-nav-label"><span className="dp-num">02</span>Intelligence</div>
          {intelItems.map((it) => (
            <div key={it.label} className="dp-nav-btn">
              <span className="dp-bullet" />
              {it.label}
              {it.badge && <span className="dp-badge">{it.badge}</span>}
            </div>
          ))}
        </aside>

        <div className="dp-main">
          <div className="dp-topbar">
            <div className="dp-crumbs">
              Acme Co. <span className="dp-sep">/</span> <span className="dp-here">Home</span>
            </div>
            <div className="dp-spacer" />
            <span className="dp-pill"><span className="dp-live-dot" /> Live</span>
            <div className="dp-range">
              {['24h', '7d', '30d', '90d'].map((r) => (
                <span key={r} className={r === '7d' ? 'active' : ''}>{r}</span>
              ))}
            </div>
          </div>

          <div className="dp-kpi-grid">
            {kpis.map((k) => (
              <div className="dp-kpi" key={k.label}>
                <div className="dp-kpi-label">{k.label}</div>
                <div className="dp-kpi-value">{k.value}</div>
                <div className={`dp-delta ${k.pos ? 'pos' : 'neg'}`}>
                  <span>{k.pos ? '↑' : '↓'}</span> {k.delta}
                </div>
                <MiniSpark points={k.spark} color={k.color} />
              </div>
            ))}
          </div>

          <div className="dp-row-2">
            <div className="dp-card">
              <div className="dp-card-head">
                <div>
                  <div className="dp-num">02 — Performance</div>
                  <h4>Spend vs revenue</h4>
                </div>
                <div className="dp-legend">
                  <span><i style={{ background: '#c8553d' }} />Spend</span>
                  <span><i style={{ background: '#2f5d50' }} />Revenue</span>
                </div>
              </div>
              <MiniChart />
            </div>
            <div className="dp-card">
              <div className="dp-card-head">
                <div>
                  <div className="dp-num">03 — Channel mix</div>
                  <h4>Where spend goes</h4>
                </div>
              </div>
              <div className="dp-mix">
                <MiniDonut />
                <div className="dp-mix-rows">
                  {channels.map((c) => (
                    <div className="dp-mix-row" key={c.ch}>
                      <span className="dp-sw" style={{ background: c.color }} />
                      <span className="dp-mix-name">{c.ch}</span>
                      <span className="dp-mix-val">{c.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-overlay">
        <button
          type="button"
          className="dash-cta"
          onClick={onOpenDemo}
          aria-label="See a live demo of Quiver"
        >
          <span className="dash-cta-label">See a live demo</span>
          <span className="dash-cta-sub">Open the interactive dashboard</span>
          <span className="dash-cta-arr"><ArrowIcon size={16} /></span>
        </button>
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
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
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
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setIsDemoOpen(true)}
                >
                  See a live demo
                </button>
              </div>
            </div>
            <div>
              <QuiverDashboard onOpenDemo={() => setIsDemoOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      {isDemoOpen && (
        <div
          className="quiver-demo-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Quiver live demo"
          onClick={() => setIsDemoOpen(false)}
        >
          <div className="quiver-demo-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="quiver-demo-close"
              aria-label="Close live demo"
              onClick={() => setIsDemoOpen(false)}
            >
              Close
            </button>
            <div className="quiver-demo-shell">
              <QuiverInteractiveDashboard />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
