"use client";

import { useEffect, useMemo, useRef, useState, Fragment } from "react";

/* ---------- Utilities ---------- */
const seed = (a) => {
  let x = a;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
};
const rng = seed(42);
const DAYS = 30;
const genSeries = (base, vol = 0.12) =>
  Array.from({ length: DAYS }, (_, i) => {
    const trend = base * (1 + (i / DAYS) * 0.18);
    const noise = (rng() - 0.5) * 2 * vol * base;
    return Math.max(0, trend + noise);
  });
const spendSeries = genSeries(4200, 0.18);
const revenueSeries = spendSeries.map(
  (v, i) => v * (2.6 + Math.sin(i / 4) * 0.4 + rng() * 0.3),
);
const roasSeries = spendSeries.map((v, i) => revenueSeries[i] / v);

const fmtMoney = (v) => "€" + Math.round(v).toLocaleString("en-US");
const fmtNum = (v) => Math.round(v).toLocaleString("en-US");

function useCount(target, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

/* ---------- Icons ---------- */
function Icon({ name, size = 16 }) {
  const paths = {
    home: <path d="M3 9l7-6 7 6v8a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V9z" />,
    plug: <path d="M5 7V3M11 7V3M4 7h8v3a4 4 0 0 1-8 0V7zM8 14v3" />,
    file: <path d="M5 2h6l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 2v3h3" />,
    bid: <path d="M3 17V8M9 17V4M15 17v-7" />,
    spark: <path d="M10 2v4M10 14v4M2 10h4M14 10h4M5 5l2.5 2.5M12.5 12.5L15 15M5 15l2.5-2.5M12.5 7.5L15 5" />,
    bell: <path d="M5 8a5 5 0 0 1 10 0v4l1.5 2h-13L5 12V8zM8 17a2 2 0 0 0 4 0" />,
    flask: <path d="M7 2v5L3 16a1 1 0 0 0 .9 1.5h12.2A1 1 0 0 0 17 16l-4-9V2M5 2h10M6 11h8" />,
    chart: <path d="M3 17h14M5 13l3-3 3 2 4-5" />,
    cog: (
      <>
        <circle cx="10" cy="10" r="2.5" />
        <path d="M10 2v2M10 16v2M4 10H2M18 10h-2M5 5L4 4M16 16l-1-1M5 15l-1 1M16 4l-1 1" />
      </>
    ),
    book: <path d="M4 3h5a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4V3zM16 3h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6V3z" />,
    filter: <path d="M3 5h14M5 10h10M8 15h4" />,
    check: <path d="M4 10l4 4 8-8" />,
    download: <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="qd-icon"
    >
      {paths[name] || null}
    </svg>
  );
}

function ChannelIcon({ id }) {
  const map = {
    meta: { cls: "meta", label: "M" },
    google: { cls: "google", label: "G" },
    tiktok: { cls: "tiktok", label: "t" },
    snap: { cls: "snap", label: "S" },
  };
  const c = map[id] || { cls: "", label: "?" };
  return <span className={`qd-chan-icon qd-${c.cls}`}>{c.label}</span>;
}

/* ---------- Sidebar ---------- */
function Sidebar({ current, setCurrent }) {
  const sections = [
    {
      label: "Workspace",
      num: "01",
      items: [
        { id: "home", label: "Home", icon: "home" },
        { id: "forecasting", label: "Forecasting", icon: "spark" },
        { id: "campaigns", label: "Campaigns", icon: "chart" },
        { id: "experiments", label: "Experiments", icon: "flask" },
      ],
    },
    {
      label: "Intelligence",
      num: "02",
      items: [
        { id: "analyst", label: "Virtual Analyst", icon: "spark" },
        { id: "alerts", label: "Alerts", icon: "bell", badge: "4" },
        { id: "bidding", label: "Profit Bidding", icon: "bid" },
      ],
    },
    {
      label: "Data",
      num: "03",
      items: [
        { id: "connections", label: "Data Connections", icon: "plug" },
        { id: "reports", label: "Automated Reports", icon: "file" },
      ],
    },
    {
      label: "Workspace settings",
      num: "04",
      items: [
        { id: "docs", label: "Documentation", icon: "book" },
        { id: "settings", label: "Settings", icon: "cog" },
      ],
    },
  ];
  return (
    <aside className="qd-sidebar">
      <div className="qd-brand">
        <div className="qd-brand-mark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9 9 L19 19 M9 14 L14 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="19" cy="9" r="2" fill="var(--accent)" />
          </svg>
        </div>
        <div className="qd-brand-name">Quiver</div>
        <div className="qd-brand-sub">v 4.2</div>
      </div>

      {sections.map((sec) => (
        <div key={sec.num} className="qd-nav-section">
          <div className="qd-nav-label">
            <span className="qd-num">{sec.num}</span>
            <span>{sec.label}</span>
          </div>
          <div className="qd-nav">
            {sec.items.map((it) => (
              <button
                type="button"
                key={it.id}
                className={`qd-nav-btn ${current === it.id ? "active" : ""}`}
                onClick={() => setCurrent(it.id)}
              >
                <Icon name={it.icon} />
                <span>{it.label}</span>
                {it.badge && <span className="qd-badge">{it.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="qd-side-footer">
        <div className="qd-workspace">
          <div className="qd-ava">A</div>
          <div className="qd-ws-meta">
            <div className="qd-ws-name">Acme Co.</div>
            <div className="qd-ws-role">PROD · EU-NORTH</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Topbar ---------- */
function Topbar({ here, range, setRange }) {
  return (
    <div className="qd-topbar">
      <div className="qd-crumbs">
        <span>Acme Co.</span>
        <span className="qd-sep">/</span>
        <span className="qd-here">{here}</span>
      </div>
      <div className="qd-spacer" />
      <span className="qd-pill">
        <span className="qd-live-dot" /> Live · synced 38s ago
      </span>
      <div className="qd-range">
        {["24h", "7d", "30d", "90d", "YTD"].map((r) => (
          <button
            type="button"
            key={r}
            className={r === range ? "active" : ""}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>
      <button type="button" className="qd-btn">Compare</button>
      <button type="button" className="qd-btn primary">+ New view</button>
    </div>
  );
}

/* ---------- Page head ---------- */
function PageHead({ num, title, em, sub }) {
  return (
    <div className="qd-page-head qd-reveal">
      <div>
        <div className="qd-num">{num}</div>
        <h1>
          {title} {em && <em>{em}</em>}
        </h1>
        {sub && <div className="qd-page-sub">{sub}</div>}
      </div>
    </div>
  );
}

/* ---------- Sparkline ---------- */
function Sparkline({ data, color = "currentColor", fill = false }) {
  const w = 100,
    h = 26;
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = d + ` L${w} ${h} L0 ${h} Z`;
  return (
    <svg className="qd-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.1" />}
      <path d={d} stroke={color} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------- KPI ---------- */
function KPI({ label, value, format, delta, deltaPos, spark, sparkColor }) {
  const v = useCount(value);
  return (
    <div className="qd-kpi">
      <div className="qd-kpi-label">{label}</div>
      <div className="qd-kpi-value">{format(v)}</div>
      <div className={`qd-delta ${deltaPos ? "pos" : "neg"}`}>
        <span>{deltaPos ? "↑" : "↓"}</span>
        <span>{delta}</span>
        <span className="qd-vs">vs prev</span>
      </div>
      <Sparkline data={spark} color={sparkColor || "var(--qd-ink)"} fill />
    </div>
  );
}

/* ---------- Spend vs Revenue chart ---------- */
function SpendRevenueChart() {
  const w = 720,
    h = 260,
    pad = { l: 40, r: 16, t: 12, b: 28 };
  const innerW = w - pad.l - pad.r,
    innerH = h - pad.t - pad.b;
  const all = [...spendSeries, ...revenueSeries];
  const max = Math.max(...all) * 1.05;
  const xAt = (i) => pad.l + (i / (DAYS - 1)) * innerW;
  const yAt = (v) => pad.t + innerH - (v / max) * innerH;
  const lineD = (arr) => arr.map((v, i) => (i ? "L" : "M") + xAt(i) + " " + yAt(v)).join(" ");
  const areaD = (arr) =>
    lineD(arr) + ` L${xAt(DAYS - 1)} ${pad.t + innerH} L${xAt(0)} ${pad.t + innerH} Z`;
  const [hover, setHover] = useState(null);
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sx = (x / rect.width) * w;
    const i = Math.round(((sx - pad.l) / innerW) * (DAYS - 1));
    if (i >= 0 && i < DAYS) setHover(i);
  };

  return (
    <div className="qd-chart-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: 260 }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line
            key={i}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + innerH * t}
            y2={pad.t + innerH * t}
            stroke="var(--qd-rule)"
            strokeWidth="0.5"
            strokeDasharray={i === 4 ? "0" : "2 3"}
          />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const v = max * (1 - t);
          return (
            <text
              key={i}
              x={pad.l - 6}
              y={pad.t + innerH * t + 3}
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              fill="var(--qd-muted)"
              textAnchor="end"
            >
              {"€" + Math.round(v / 1000) + "k"}
            </text>
          );
        })}
        {[0, 6, 12, 18, 24, 29].map((i) => (
          <text
            key={i}
            x={xAt(i)}
            y={h - 8}
            fontSize="9"
            fontFamily="var(--font-mono), monospace"
            fill="var(--qd-muted)"
            textAnchor="middle"
          >
            D-{DAYS - 1 - i}
          </text>
        ))}

        <path d={areaD(revenueSeries)} fill="#2f5d50" opacity="0.08" />
        <path d={lineD(revenueSeries)} stroke="#2f5d50" strokeWidth="1.6" fill="none" />
        <path d={areaD(spendSeries)} fill="#c8553d" opacity="0.06" />
        <path d={lineD(spendSeries)} stroke="#c8553d" strokeWidth="1.6" fill="none" />

        {hover !== null && (
          <>
            <line
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="var(--qd-ink)"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
            <circle cx={xAt(hover)} cy={yAt(revenueSeries[hover])} r="3.5" fill="#2f5d50" />
            <circle cx={xAt(hover)} cy={yAt(spendSeries[hover])} r="3.5" fill="#c8553d" />
          </>
        )}
      </svg>
      {hover !== null && (
        <div className="qd-tooltip">
          <div className="qd-tt-day">Day −{DAYS - 1 - hover}</div>
          <div className="qd-tt-row">
            <span style={{ color: "#2f5d50" }}>● Revenue</span>
            <span>{fmtMoney(revenueSeries[hover])}</span>
          </div>
          <div className="qd-tt-row">
            <span style={{ color: "#c8553d" }}>● Spend</span>
            <span>{fmtMoney(spendSeries[hover])}</span>
          </div>
          <div className="qd-tt-row qd-tt-total">
            <span>ROAS</span>
            <span>{(revenueSeries[hover] / spendSeries[hover]).toFixed(2)}×</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- ROAS chart ---------- */
function RoasChart() {
  const w = 320,
    h = 140,
    pad = { l: 28, r: 8, t: 8, b: 20 };
  const innerW = w - pad.l - pad.r,
    innerH = h - pad.t - pad.b;
  const max = Math.max(...roasSeries) * 1.1;
  const min = Math.min(...roasSeries) * 0.9;
  const xAt = (i) => pad.l + (i / (DAYS - 1)) * innerW;
  const yAt = (v) => pad.t + innerH - ((v - min) / (max - min)) * innerH;
  const d = roasSeries.map((v, i) => (i ? "L" : "M") + xAt(i) + " " + yAt(v)).join(" ");
  const area = d + ` L${xAt(DAYS - 1)} ${pad.t + innerH} L${xAt(0)} ${pad.t + innerH} Z`;
  const target = 3.0;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 140 }}>
      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={yAt(target)}
        y2={yAt(target)}
        stroke="#c8553d"
        strokeWidth="0.8"
        strokeDasharray="3 3"
      />
      <text
        x={w - pad.r}
        y={yAt(target) - 4}
        fontSize="9"
        fontFamily="var(--font-mono), monospace"
        fill="#c8553d"
        textAnchor="end"
      >
        target 3.0×
      </text>
      <path d={area} fill="var(--qd-ink)" opacity="0.06" />
      <path d={d} stroke="var(--qd-ink)" strokeWidth="1.4" fill="none" />
      <text
        x={pad.l - 4}
        y={yAt(max * 0.95)}
        fontSize="9"
        fontFamily="var(--font-mono), monospace"
        fill="var(--qd-muted)"
        textAnchor="end"
      >
        {max.toFixed(1)}
      </text>
      <text
        x={pad.l - 4}
        y={yAt(min * 1.05)}
        fontSize="9"
        fontFamily="var(--font-mono), monospace"
        fill="var(--qd-muted)"
        textAnchor="end"
      >
        {min.toFixed(1)}
      </text>
    </svg>
  );
}

/* ---------- Donut ---------- */
const channels = [
  { id: "meta", name: "Meta", value: 42100, color: "#1a1916" },
  { id: "google", name: "Google", value: 38600, color: "#c8553d" },
  { id: "tiktok", name: "TikTok", value: 19400, color: "#2f5d50" },
  { id: "snap", name: "Snapchat", value: 8900, color: "#d4a24c" },
];
function Donut() {
  const total = channels.reduce((a, c) => a + c.value, 0);
  const r = 70,
    R = 84,
    cx = 90,
    cy = 90;
  let acc = 0;
  return (
    <div className="qd-donut-wrap">
      <svg className="qd-donut" viewBox="0 0 180 180">
        {channels.map((c) => {
          const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += c.value;
          const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const large = end - start > Math.PI ? 1 : 0;
          const x1 = cx + Math.cos(start) * R,
            y1 = cy + Math.sin(start) * R;
          const x2 = cx + Math.cos(end) * R,
            y2 = cy + Math.sin(end) * R;
          const x3 = cx + Math.cos(end) * r,
            y3 = cy + Math.sin(end) * r;
          const x4 = cx + Math.cos(start) * r,
            y4 = cy + Math.sin(start) * r;
          const d = `M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`;
          return <path key={c.id} d={d} fill={c.color} />;
        })}
        <text x="90" y="88" className="qd-donut-center">
          €{(total / 1000).toFixed(1)}k
        </text>
        <text x="90" y="104" className="qd-donut-sub">
          Total spend
        </text>
      </svg>
      <div className="qd-donut-legend">
        {channels.map((c) => (
          <div className="qd-dl-row" key={c.id}>
            <div className="qd-sw" style={{ background: c.color }} />
            <div>{c.name}</div>
            <div className="qd-v">€{(c.value / 1000).toFixed(1)}k</div>
            <div className="qd-pct">{((c.value / total) * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Funnel ---------- */
function Funnel() {
  const stages = [
    { label: "Impressions", n: 4_240_000, p: 1 },
    { label: "Clicks", n: 86_400, p: 0.34 },
    { label: "Sessions", n: 78_120, p: 0.31 },
    { label: "Add to cart", n: 14_280, p: 0.13 },
    { label: "Checkout", n: 4_810, p: 0.052 },
    { label: "Purchase", n: 3_412, p: 0.038 },
  ];
  return (
    <div className="qd-funnel">
      {stages.map((s, i) => (
        <div className="qd-stage" key={s.label}>
          <div className="qd-stage-label">{s.label}</div>
          <div className="qd-stage-bar">
            <div
              className="qd-stage-fill"
              style={{ width: s.p * 100 + "%", animationDelay: i * 0.08 + "s" }}
            />
          </div>
          <div className="qd-stage-num">{s.n.toLocaleString("en-US")}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Top campaigns ---------- */
const campaigns = [
  { name: "SS26 Prospect — Lookalike 1%", chan: "meta", spend: 12480, rev: 41200, roas: 3.3, cpa: 24.8, status: "ok" },
  { name: "Brand Search — Exact", chan: "google", spend: 4210, rev: 22800, roas: 5.41, cpa: 8.2, status: "ok" },
  { name: "Performance Max — Core", chan: "google", spend: 18800, rev: 52400, roas: 2.79, cpa: 18.1, status: "ok" },
  { name: "TikTok Spark — Creator pool", chan: "tiktok", spend: 11420, rev: 18900, roas: 1.65, cpa: 32.4, status: "warn" },
  { name: "Retargeting — 30d cart", chan: "meta", spend: 6800, rev: 28100, roas: 4.13, cpa: 12.6, status: "ok" },
  { name: "Snapchat Discovery — Gen Z", chan: "snap", spend: 3200, rev: 4100, roas: 1.28, cpa: 41.2, status: "err" },
];
function TopCampaigns() {
  return (
    <table className="qd-table">
      <thead>
        <tr>
          <th>Campaign</th>
          <th>Channel</th>
          <th style={{ textAlign: "right" }}>Spend</th>
          <th style={{ textAlign: "right" }}>Revenue</th>
          <th style={{ textAlign: "right" }}>ROAS</th>
          <th style={{ textAlign: "right" }}>CPA</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((c) => (
          <tr key={c.name}>
            <td>{c.name}</td>
            <td><ChannelIcon id={c.chan} /></td>
            <td className="qd-mono" style={{ textAlign: "right" }}>{fmtMoney(c.spend)}</td>
            <td className="qd-mono" style={{ textAlign: "right" }}>{fmtMoney(c.rev)}</td>
            <td
              className="qd-mono"
              style={{
                textAlign: "right",
                color:
                  c.roas >= 3 ? "var(--qd-pos)" : c.roas >= 2 ? "var(--qd-ink)" : "var(--qd-neg)",
              }}
            >
              {c.roas.toFixed(2)}×
            </td>
            <td className="qd-mono" style={{ textAlign: "right" }}>€{c.cpa.toFixed(2)}</td>
            <td>
              <span className={`qd-status ${c.status}`}>
                {c.status === "ok" ? "On pace" : c.status === "warn" ? "Watch" : "Action"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- Alert feed ---------- */
const alertItems = [
  { dot: "warn", tag: "TikTok", body: <><strong>CPA spiked 41%</strong> on campaign <em>SS26-prospect</em> — auto-paused at 14:32.</>, time: "2m" },
  { dot: "ok", tag: "Meta", body: <>Lookalike 1% scaled <strong>+€2,400/d</strong> after profit-bidder approval.</>, time: "38m" },
  { dot: "", tag: "Google", body: <>Brand search impression share <strong>down 4.2pp</strong> — new competitor detected.</>, time: "1h" },
  { dot: "warn", tag: "Snap", body: <>Creative fatigue on <em>Discovery — Gen Z</em>. CTR ↓ 28% over 7d.</>, time: "3h" },
];
function AlertFeed() {
  return (
    <div className="qd-alert-feed">
      {alertItems.map((a, i) => (
        <div className="qd-alert-row" key={i}>
          <div className={`qd-alert-dot ${a.dot}`} />
          <div className="qd-alert-body">
            <span className="qd-alert-tag">{a.tag}</span>
            {a.body}
          </div>
          <div className="qd-alert-time">{a.time} ago</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Cohort ---------- */
function Cohort() {
  const cohorts = ["W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1"];
  const headers = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"];
  const cohortRng = useMemo(() => seed(99), []);
  return (
    <div className="qd-cohort">
      <div></div>
      {headers.map((h) => (
        <div className="qd-cohort-head" key={h}>{h}</div>
      ))}
      {cohorts.map((c, ri) => (
        <Fragment key={c}>
          <div className="qd-cohort-lab">{c}</div>
          {headers.map((_, ci) => {
            if (ci > 7 - ri)
              return <div key={ci} className="qd-cohort-cell empty" />;
            const v = Math.max(0, 100 - ci * 18 - cohortRng() * 10);
            const op = v / 100;
            return (
              <div
                key={ci}
                className="qd-cohort-cell"
                style={{
                  background: `rgba(47, 93, 80, ${op * 0.55 + 0.05})`,
                  color: op > 0.5 ? "#fff" : "var(--qd-ink)",
                }}
              >
                {Math.round(v)}%
              </div>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}

/* ---------- Home Dashboard page ---------- */
function HomeDashboard({ range }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Still up,";
    if (h < 12) return "Good morning,";
    if (h < 17) return "Good afternoon,";
    if (h < 22) return "Good evening,";
    return "Working late,";
  }, []);
  const kpis = [
    { label: "Total spend", value: 109000, format: fmtMoney, delta: "+8.2%", deltaPos: false, spark: [40, 42, 44, 43, 46, 48, 50, 52, 54, 55, 58, 60], color: "#c8553d" },
    { label: "Revenue", value: 372400, format: fmtMoney, delta: "+14.1%", deltaPos: true, spark: [60, 62, 65, 68, 72, 76, 80, 84, 88, 92, 98, 104], color: "#2f5d50" },
    { label: "Profit margin", value: 31.4, format: (v) => v.toFixed(1) + "%", delta: "+2.1pp", deltaPos: true, spark: [22, 24, 26, 25, 27, 28, 29, 30, 31, 30, 32, 31] },
    { label: "CAC", value: 24.8, format: (v) => "€" + v.toFixed(2), delta: "−4.6%", deltaPos: true, spark: [32, 30, 29, 28, 27, 28, 26, 25, 26, 25, 24, 25] },
    { label: "Conversions", value: 3412, format: fmtNum, delta: "+11.8%", deltaPos: true, spark: [200, 210, 230, 240, 250, 260, 280, 290, 310, 320, 340, 341] },
    { label: "COS%", value: (109000 / 372400) * 100, format: (v) => v.toFixed(1) + "%", delta: "−1.6pp", deltaPos: true, spark: [66.7, 67.7, 67.7, 63.2, 63.9, 63.2, 62.5, 61.9, 61.4, 59.8, 59.2, 57.7] },
  ];
  return (
    <>
      <PageHead
        num="01 — Overview"
        title={greeting}
        em="Maria."
        sub={`Here's what moved at Acme Co. over the last ${range}. Three things need your eye — Virtual Analyst flagged them below.`}
      />

      <div className="qd-kpi-grid qd-reveal" style={{ animationDelay: "0.05s" }}>
        {kpis.map((k) => (
          <KPI key={k.label} {...k} sparkColor={k.color} />
        ))}
      </div>

      <div className="qd-row-2 qd-reveal" style={{ animationDelay: "0.1s" }}>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">02 — Performance</div>
              <h3>Spend vs revenue</h3>
              <div className="qd-card-sub">Daily, blended across all channels · attribution: data-driven</div>
            </div>
            <div className="qd-legend">
              <span className="qd-li"><span className="qd-sw" style={{ background: "#c8553d" }} />Spend</span>
              <span className="qd-li"><span className="qd-sw" style={{ background: "#2f5d50" }} />Revenue</span>
            </div>
          </div>
          <SpendRevenueChart />
        </div>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">03 — Profit ROAS</div>
              <h3>Margin-aware return</h3>
              <div className="qd-card-sub">Trending against your <em>3.0× target</em></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="qd-big-num">3.42×</div>
              <div className="qd-big-delta pos">↑ +0.31</div>
            </div>
          </div>
          <RoasChart />
          <div className="qd-best-worst">
            <div>
              <div className="qd-mini-label">Best day</div>
              4.18× · Tue Apr 21
            </div>
            <div>
              <div className="qd-mini-label">Worst day</div>
              2.41× · Sun Apr 5
            </div>
          </div>
        </div>
      </div>

      <div className="qd-row-2 qd-reveal" style={{ animationDelay: "0.15s" }}>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">04 — Acquisition funnel</div>
              <h3>From impression to purchase</h3>
              <div className="qd-card-sub">Last 30 days · all channels</div>
            </div>
            <span className="qd-status ok">Conv. 3.95%</span>
          </div>
          <Funnel />
        </div>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">05 — Channel mix</div>
              <h3>Where the spend goes</h3>
              <div className="qd-card-sub">Normalized across platforms</div>
            </div>
          </div>
          <Donut />
        </div>
      </div>

      <div className="qd-row-2-1 qd-reveal" style={{ animationDelay: "0.2s" }}>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">06 — Campaigns</div>
              <h3>Top performers, last 7d</h3>
            </div>
            <button type="button" className="qd-btn">View all 47 →</button>
          </div>
          <TopCampaigns />
        </div>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">07 — Signal</div>
              <h3>Live alerts</h3>
            </div>
            <button type="button" className="qd-btn">All</button>
          </div>
          <AlertFeed />
        </div>
      </div>

      <div className="qd-card qd-reveal" style={{ animationDelay: "0.25s" }}>
        <div className="qd-card-head">
          <div>
            <div className="qd-num">08 — Cohort retention</div>
            <h3>Customer return by week</h3>
            <div className="qd-card-sub">Weekly cohorts · % returning customers</div>
          </div>
          <div className="qd-legend">
            <span className="qd-li"><span className="qd-sw" style={{ background: "rgba(47, 93, 80, 0.15)" }} />Lower</span>
            <span className="qd-li"><span className="qd-sw" style={{ background: "rgba(47, 93, 80, 0.55)" }} />Higher</span>
          </div>
        </div>
        <Cohort />
      </div>
    </>
  );
}

/* ---------- Data connections ---------- */
function DataConnectionsPage() {
  const conns = [
    { id: "meta", name: "Meta Ads", desc: "Campaign spend, conversions, audiences across 2 ad accounts.", status: "ok", synced: "38s", accounts: 2, rows: "2.4M" },
    { id: "google", name: "Google Ads", desc: "Search, Performance Max & Display. Server-side enhanced conversions.", status: "ok", synced: "1m", accounts: 1, rows: "4.1M" },
    { id: "tiktok", name: "TikTok Ads", desc: "Spark Ads & creator pool campaigns.", status: "warn", synced: "14m", accounts: 1, rows: "0.8M" },
    { id: "snap", name: "Snapchat Ads", desc: "Discovery & Story ads, Gen Z prospecting.", status: "ok", synced: "2m", accounts: 1, rows: "0.3M" },
    { id: "ga4", name: "GA4 + Server-side", desc: "Sessions, events, attribution path. Quiver tag installed.", status: "ok", synced: "11s", accounts: 1, rows: "12.8M" },
    { id: "shopify", name: "Shopify", desc: "Orders, returns, COGS for profit-aware bidding.", status: "ok", synced: "4m", accounts: 1, rows: "0.6M" },
    { id: "bq", name: "BigQuery", desc: "Warehouse export. Custom margin & LTV models.", status: "ok", synced: "1h", accounts: 1, rows: "—" },
    { id: "klaviyo", name: "Klaviyo", desc: "Email & SMS attribution overlay.", status: "idle", synced: "—", accounts: 0, rows: "—" },
  ];
  const chanIds = ["meta", "google", "tiktok", "snap"];
  return (
    <>
      <PageHead num="03 — Data" title="Data" em="connections." sub="Every channel, normalized into one schema. Server-side by default. The plumbing nobody else wants to touch — done right." />

      <div className="qd-subbar">
        <input className="qd-search" placeholder="Search 12 connectors…" />
        <span className="qd-pill">
          <Icon name="filter" size={12} /> 8 connected · 1 needs attention
        </span>
        <div className="qd-spacer" />
        <button type="button" className="qd-btn">Browse marketplace</button>
        <button type="button" className="qd-btn primary">+ Add connection</button>
      </div>

      <div className="qd-tile-grid">
        {conns.map((c, i) => (
          <div key={c.id} className="qd-tile qd-reveal" style={{ animationDelay: i * 0.04 + "s" }}>
            <div className="qd-tile-top">
              <div className="qd-tile-head">
                {chanIds.includes(c.id) ? (
                  <ChannelIcon id={c.id} />
                ) : (
                  <span className="qd-chan-icon qd-generic">{c.name[0]}</span>
                )}
                <div>
                  <h4>{c.name}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
              <span className={`qd-status ${c.status === "ok" ? "ok" : c.status === "warn" ? "warn" : ""}`}>
                {c.status === "ok" ? "● Live" : c.status === "warn" ? "● Stale" : "○ Idle"}
              </span>
            </div>
            <div className="qd-tile-stats">
              <div><span className="qd-k">Synced</span><span className="qd-vv">{c.synced} ago</span></div>
              <div><span className="qd-k">Accounts</span><span className="qd-vv">{c.accounts}</span></div>
              <div><span className="qd-k">Rows / 24h</span><span className="qd-vv">{c.rows}</span></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Reports ---------- */
function ReportsPage() {
  const reports = [
    { name: "Weekly performance digest", cadence: "Mon 08:00", recipients: 7, channels: "Slack #marketing, email", last: "3 days ago", kind: "Digest", status: "ok" },
    { name: "Daily anomaly brief", cadence: "Daily 07:30", recipients: 3, channels: "Slack #alerts", last: "14h ago", kind: "Alert", status: "ok" },
    { name: "Q2 board pack", cadence: "Quarterly", recipients: 12, channels: "PDF · email", last: "21 days ago", kind: "Board", status: "ok" },
    { name: "Profit ROAS — channel pivot", cadence: "Tue, Fri", recipients: 4, channels: "BigQuery + Looker", last: "2 days ago", kind: "Pivot", status: "ok" },
    { name: "Creative fatigue scan", cadence: "Daily", recipients: 5, channels: "email", last: "8h ago", kind: "Scan", status: "warn" },
    { name: "Attribution path explorer", cadence: "On demand", recipients: 2, channels: "in-app", last: "never", kind: "Explorer", status: "idle" },
  ];
  const templates = [
    { num: "01", title: "Margin uplift", body: "Channel-level profit attribution every Tuesday morning.", tag: "Profit" },
    { num: "02", title: "Creative pulse", body: "Top 10 creatives by hook rate, fatigue flagged early.", tag: "Creative" },
    { num: "03", title: "Spend pacing", body: "Daily pacing vs monthly target with auto-throttle.", tag: "Pacing" },
  ];
  return (
    <>
      <PageHead num="03 — Reporting" title="Reports that" em="write themselves." sub="Six automated reports. Three Slack channels. Zero Monday-morning copy-paste. Define the question once — Quiver delivers the answer on a cadence." />

      <div className="qd-subbar">
        <input className="qd-search" placeholder="Search reports…" />
        <span className="qd-pill"><Icon name="check" size={12} /> 6 active · last delivery 14h ago</span>
        <div className="qd-spacer" />
        <button type="button" className="qd-btn">Templates</button>
        <button type="button" className="qd-btn primary">+ New report</button>
      </div>

      <div className="qd-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="qd-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>Report</th>
              <th>Type</th>
              <th>Cadence</th>
              <th>Delivery</th>
              <th>Recipients</th>
              <th>Last sent</th>
              <th>Status</th>
              <th style={{ paddingRight: 20 }}></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={r.name} className="qd-reveal" style={{ animationDelay: i * 0.04 + "s" }}>
                <td style={{ paddingLeft: 20 }}>
                  <div className="qd-report-name">{r.name}</div>
                </td>
                <td><span className="qd-kind">{r.kind}</span></td>
                <td className="qd-mono">{r.cadence}</td>
                <td className="qd-channels">{r.channels}</td>
                <td className="qd-mono">{r.recipients}</td>
                <td className="qd-mono qd-muted-text">{r.last}</td>
                <td>
                  <span className={`qd-status ${r.status === "ok" ? "ok" : r.status === "warn" ? "warn" : ""}`}>
                    {r.status === "ok" ? "Active" : r.status === "warn" ? "Review" : "Draft"}
                  </span>
                </td>
                <td style={{ paddingRight: 20, textAlign: "right" }}>
                  <button type="button" className="qd-btn qd-icon-btn"><Icon name="download" size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="qd-row-3" style={{ marginTop: 24 }}>
        {templates.map((t) => (
          <div key={t.num} className="qd-tile">
            <div className="qd-tile-head" style={{ display: "block" }}>
              <div className="qd-num">{t.num} — Template</div>
              <h4 style={{ marginTop: 6 }}>{t.title}</h4>
              <p style={{ marginTop: 6 }}>{t.body}</p>
            </div>
            <div className="qd-tile-tmpl-foot">
              <span className="qd-tile-tag">{t.tag}</span>
              <button type="button" className="qd-btn qd-btn-sm">Use template →</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Alerts ---------- */
function AlertsPage() {
  const items = [
    { sev: "err", tag: "TikTok", title: "CPA spiked 41% — auto-paused", body: "Campaign SS26-prospect breached ceiling at €38.20. Threshold: €28.00. Auto-pause executed at 14:32 local.", time: "2 min ago", rule: "Profit · CPA ceiling" },
    { sev: "warn", tag: "Meta", title: "Lookalike 1% creative fatigue", body: "Hook rate ↓ 32% over 7 days. Recommended: rotate creative pool or rest audience for 5 days.", time: "38 min ago", rule: "Creative · Hook rate" },
    { sev: "ok", tag: "Profit Bidder", title: "+€2,400/d budget approved", body: "Profit-bidder scaled Lookalike 1% based on 3-day margin uplift signal. ROAS confidence: 94%.", time: "1h ago", rule: "Auto · Scale-up" },
    { sev: "warn", tag: "Google", title: "Brand IS down 4.2pp", body: "Brand search impression share dropped to 87.4%. New competitor \"northwind.se\" detected on top-3 brand terms.", time: "1h ago", rule: "Brand · IS floor" },
    { sev: "ok", tag: "Snap", title: "Discovery — Gen Z paused", body: "ROAS 1.28× below profit floor for 5 consecutive days. Auto-paused per rule.", time: "3h ago", rule: "Profit · ROAS floor" },
    { sev: "warn", tag: "Attribution", title: "GA4 conversion lag detected", body: "Server-side events arriving ~12min late. Investigating upstream — no data loss expected.", time: "4h ago", rule: "Pipeline health" },
  ];
  const sevColor = { err: "var(--qd-accent)", warn: "var(--qd-accent-3)", ok: "var(--qd-pos)" };
  return (
    <>
      <PageHead num="02 — Signal" title="Performance" em="alerts." sub="Anomalies, threshold breaches, and auto-actions across every channel — surfaced the moment they happen." />

      <div className="qd-subbar">
        <div className="qd-range">
          <button type="button" className="active">All</button>
          <button type="button">Critical</button>
          <button type="button">Watch</button>
          <button type="button">Auto-actions</button>
        </div>
        <div className="qd-spacer" />
        <span className="qd-pill"><span className="qd-live-dot" /> 4 unresolved · 2 auto-actions today</span>
        <button type="button" className="qd-btn">Configure rules</button>
      </div>

      <div className="qd-row-2-1">
        <div>
          <div className="qd-card" style={{ padding: 0 }}>
            {items.map((a, i) => (
              <div
                key={i}
                className="qd-alert-item qd-reveal"
                style={{
                  borderBottom: i === items.length - 1 ? "none" : "1px solid var(--qd-rule)",
                  animationDelay: i * 0.05 + "s",
                }}
              >
                <div className="qd-sev-rail" style={{ background: sevColor[a.sev] }} />
                <div>
                  <div className="qd-alert-meta">
                    <span className="qd-alert-tag">{a.tag}</span>
                    <span className={`qd-status ${a.sev}`}>
                      {a.sev === "err" ? "Action" : a.sev === "warn" ? "Watch" : "Resolved"}
                    </span>
                    <span className="qd-rule-text">Rule: {a.rule}</span>
                  </div>
                  <div className="qd-alert-title">{a.title}</div>
                  <div className="qd-alert-desc">{a.body}</div>
                </div>
                <div className="qd-alert-actions">
                  <div className="qd-alert-time qd-mono">{a.time}</div>
                  <button type="button" className="qd-btn qd-btn-sm">Investigate →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="qd-side-stack">
          <div className="qd-card">
            <div className="qd-card-head">
              <div>
                <div className="qd-num">A — Last 24h</div>
                <h3>Alert volume</h3>
              </div>
            </div>
            <div className="qd-vol-grid">
              <div>
                <div className="qd-vol-num" style={{ color: "var(--qd-accent)" }}>2</div>
                <div className="qd-vol-lbl">Critical</div>
              </div>
              <div>
                <div className="qd-vol-num" style={{ color: "var(--qd-accent-3)" }}>5</div>
                <div className="qd-vol-lbl">Watch</div>
              </div>
              <div>
                <div className="qd-vol-num" style={{ color: "var(--qd-pos)" }}>11</div>
                <div className="qd-vol-lbl">Auto-fixed</div>
              </div>
            </div>
            <Sparkline data={[3, 5, 4, 7, 6, 9, 12, 10, 8, 7, 11, 18]} color="var(--qd-ink)" fill />
          </div>
          <div className="qd-card">
            <div className="qd-card-head">
              <div>
                <div className="qd-num">B — Rules</div>
                <h3>Active monitors</h3>
              </div>
            </div>
            {[
              ["Profit ROAS floor", "2.0×", "ok"],
              ["CPA ceiling", "€28", "warn"],
              ["Brand IS floor", "90%", "warn"],
              ["Pacing variance", "±15%", "ok"],
              ["Hook rate min", "8%", "ok"],
            ].map(([n, v, s]) => (
              <div key={n} className="qd-rule-row">
                <span>{n}</span>
                <span className="qd-mono qd-muted-text">{v}</span>
                <span className={`qd-status ${s}`}>{s === "ok" ? "● ok" : "● near"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Forecasting ---------- */
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const SHORT_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// deterministic per-day pseudo-random in [0, 1)
const dayRand = (d, salt = 0) => {
  const k = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + salt * 7919;
  let x = (k ^ 0x9e3779b9) >>> 0;
  x = (x * 1664525 + 1013904223) >>> 0;
  x = (x ^ (x >>> 15)) >>> 0;
  return (x % 1_000_000) / 1_000_000;
};

function genDay(date) {
  const dow = date.getDay(); // 0=Sun
  // weekly seasonality: weekdays higher than weekends
  const weekly = [0.82, 1.06, 1.10, 1.08, 1.12, 1.04, 0.86][dow];
  // small monthly trend
  const monthProgress = (date.getDate() - 1) / 30;
  const trend = 1 + monthProgress * 0.06;
  const noiseR = (dayRand(date, 1) - 0.5) * 0.10;
  const noiseC = (dayRand(date, 2) - 0.5) * 0.07;
  const baseRevenue = 14200 * weekly * trend * (1 + noiseR);
  const baseCost = 9100 * (0.92 + (weekly - 0.92) * 0.55) * trend * (1 + noiseC);
  const revenue = Math.max(0, baseRevenue);
  const cost = Math.max(0, baseCost);
  const profit = revenue - cost;
  return { date, revenue, cost, profit };
}

function buildForecastData(period, today) {
  let start, end, splitIndex; // splitIndex = first forecast index (-1 if none)
  if (period === "7d") {
    end = new Date(today);
    start = new Date(today);
    start.setDate(start.getDate() - 6);
    splitIndex = -1;
  } else if (period === "30d") {
    end = new Date(today);
    start = new Date(today);
    start.setDate(start.getDate() - 29);
    splitIndex = -1;
  } else {
    // month: full current calendar month, with forecast for days after today
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const todayKey = dayKey(today);
    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    splitIndex = days.findIndex((d) => dayKey(d) > todayKey);
  }

  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const series = days.map((d, i) => {
    const base = genDay(d);
    const isForecast = splitIndex >= 0 && i >= splitIndex;
    if (!isForecast) return { ...base, isForecast: false };
    // forecast: add small confidence band that widens with distance
    const distance = i - splitIndex + 1;
    const widen = 0.03 + distance * 0.008;
    return {
      ...base,
      isForecast: true,
      revenueLo: base.revenue * (1 - widen),
      revenueHi: base.revenue * (1 + widen),
      profitLo: base.profit * (1 - widen * 1.4),
      profitHi: base.profit * (1 + widen * 1.4),
      costLo: base.cost * (1 - widen * 0.9),
      costHi: base.cost * (1 + widen * 0.9),
    };
  });

  // previous-period series (same length, immediately preceding `start`)
  const prevSeries = [];
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - (days.length - 1));
  for (let d = new Date(prevStart); d <= prevEnd; d.setDate(d.getDate() + 1)) {
    prevSeries.push(genDay(new Date(d)));
  }

  return { series, splitIndex, prevSeries, start, end, today };
}

function sumKey(arr, key) {
  return arr.reduce((s, r) => s + (r[key] || 0), 0);
}

function ForecastChart({ data, metric, color }) {
  const { series, splitIndex } = data;
  const w = 760, h = 300, pad = { l: 56, r: 16, t: 14, b: 32 };
  const innerW = w - pad.l - pad.r, innerH = h - pad.t - pad.b;
  const N = series.length;

  const loKey = metric + "Lo", hiKey = metric + "Hi";
  const all = [];
  series.forEach((p) => {
    all.push(p[metric]);
    if (p.isForecast) {
      all.push(p[loKey], p[hiKey]);
    }
  });
  let max = Math.max(...all);
  let min = Math.min(...all, 0);
  const span = max - min || 1;
  max += span * 0.08;
  min -= span * 0.04;

  const xAt = (i) => pad.l + (N === 1 ? innerW / 2 : (i / (N - 1)) * innerW);
  const yAt = (v) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

  const actualPts = [];
  const forecastPts = [];
  series.forEach((p, i) => {
    const point = [xAt(i), yAt(p[metric])];
    if (!p.isForecast) {
      actualPts.push(point);
      if (splitIndex >= 0 && i === splitIndex - 1) forecastPts.push(point); // bridge
    } else {
      forecastPts.push(point);
    }
  });
  const toPath = (pts) =>
    pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");

  // confidence band (forecast only)
  let bandPath = "";
  if (splitIndex >= 0) {
    const upper = [];
    const lower = [];
    for (let i = splitIndex; i < N; i++) {
      const p = series[i];
      upper.push([xAt(i), yAt(p[hiKey])]);
      lower.push([xAt(i), yAt(p[loKey])]);
    }
    if (upper.length) {
      const up = upper.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      const dn = lower
        .slice()
        .reverse()
        .map((p) => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1))
        .join(" ");
      bandPath = up + " " + dn + " Z";
    }
  }

  const [hover, setHover] = useState(null);
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const sx = (x / rect.width) * w;
    const i = Math.round(((sx - pad.l) / innerW) * (N - 1));
    if (i >= 0 && i < N) setHover(i);
  };

  // x-axis ticks: ~6 evenly spaced
  const tickIdx = [];
  const tickCount = Math.min(6, N);
  for (let t = 0; t < tickCount; t++) {
    tickIdx.push(Math.round((t / (tickCount - 1)) * (N - 1)));
  }

  // y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const fmtAxis = (v) => {
    const a = Math.abs(v);
    if (a >= 1000) return "€" + Math.round(v / 1000) + "k";
    return "€" + Math.round(v);
  };

  return (
    <div className="qd-chart-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ width: "100%", height: 300 }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {yTicks.map((t, i) => (
          <line
            key={i}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + innerH * t}
            y2={pad.t + innerH * t}
            stroke="var(--qd-rule)"
            strokeWidth="0.5"
            strokeDasharray={i === yTicks.length - 1 ? "0" : "2 3"}
          />
        ))}
        {yTicks.map((t, i) => {
          const v = max - (max - min) * t;
          return (
            <text
              key={i}
              x={pad.l - 8}
              y={pad.t + innerH * t + 3}
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              fill="var(--qd-muted)"
              textAnchor="end"
            >
              {fmtAxis(v)}
            </text>
          );
        })}
        {tickIdx.map((i) => {
          const d = series[i].date;
          return (
            <text
              key={i}
              x={xAt(i)}
              y={h - 10}
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              fill="var(--qd-muted)"
              textAnchor="middle"
            >
              {SHORT_MONTH[d.getMonth()]} {d.getDate()}
            </text>
          );
        })}

        {/* zero line if min < 0 */}
        {min < 0 && (
          <line
            x1={pad.l}
            x2={w - pad.r}
            y1={yAt(0)}
            y2={yAt(0)}
            stroke="var(--qd-rule-2)"
            strokeWidth="0.8"
          />
        )}

        {/* forecast separator */}
        {splitIndex > 0 && (
          <>
            <line
              x1={xAt(splitIndex - 0.5)}
              x2={xAt(splitIndex - 0.5)}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="var(--qd-ink)"
              strokeWidth="0.6"
              strokeDasharray="4 3"
              opacity="0.45"
            />
            <text
              x={xAt(splitIndex - 0.5) + 4}
              y={pad.t + 10}
              fontSize="9"
              fontFamily="var(--font-mono), monospace"
              fill="var(--qd-muted)"
            >
              forecast →
            </text>
          </>
        )}

        {bandPath && <path d={bandPath} fill={color} opacity="0.10" />}

        {/* actual line */}
        {actualPts.length > 1 && (
          <path d={toPath(actualPts)} stroke={color} strokeWidth="1.8" fill="none" />
        )}
        {/* forecast line dashed */}
        {forecastPts.length > 1 && (
          <path
            d={toPath(forecastPts)}
            stroke={color}
            strokeWidth="1.6"
            fill="none"
            strokeDasharray="4 3"
            opacity="0.85"
          />
        )}

        {hover !== null && (
          <>
            <line
              x1={xAt(hover)}
              x2={xAt(hover)}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="var(--qd-ink)"
              strokeWidth="0.6"
              strokeDasharray="2 3"
            />
            <circle cx={xAt(hover)} cy={yAt(series[hover][metric])} r="3.6" fill={color} />
          </>
        )}
      </svg>
      {hover !== null && (
        <div className="qd-tooltip">
          <div className="qd-tt-day">
            {SHORT_MONTH[series[hover].date.getMonth()]} {series[hover].date.getDate()}
            {series[hover].isForecast ? " · forecast" : ""}
          </div>
          <div className="qd-tt-row">
            <span style={{ color: "#2f5d50" }}>● Revenue</span>
            <span>{fmtMoney(series[hover].revenue)}</span>
          </div>
          <div className="qd-tt-row">
            <span style={{ color: "#c8553d" }}>● Cost</span>
            <span>{fmtMoney(series[hover].cost)}</span>
          </div>
          <div className="qd-tt-row qd-tt-total">
            <span>Profit</span>
            <span>{fmtMoney(series[hover].profit)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ForecastKPI({ label, headline, lo, hi, prev, color, format, hasForecast }) {
  const v = useCount(headline);
  const delta = prev > 0 ? ((headline - prev) / prev) * 100 : 0;
  const isCost = label === "Projected cost" || label === "Cost";
  const pos = isCost ? delta < 0 : delta > 0;
  return (
    <div className="qd-kpi">
      <div className="qd-kpi-label">{label}</div>
      <div className="qd-kpi-value" style={{ color }}>{format(v)}</div>
      <div className={`qd-delta ${pos ? "pos" : "neg"}`}>
        <span>{delta >= 0 ? "↑" : "↓"}</span>
        <span>{Math.abs(delta).toFixed(1)}%</span>
        <span className="qd-vs">vs prev</span>
      </div>
      {hasForecast && lo != null && hi != null && (
        <div
          className="qd-mono"
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "var(--qd-muted)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <span style={{ letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }}>
            Range
          </span>
          <span style={{ color: "var(--qd-ink)", whiteSpace: "nowrap" }}>
            {format(lo)} – {format(hi)}
          </span>
        </div>
      )}
    </div>
  );
}

function ForecastingPage() {
  const [period, setPeriod] = useState("month");
  const [metric, setMetric] = useState("revenue");

  // Today is computed at mount so it stays stable per session but is real "today"
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const data = useMemo(() => buildForecastData(period, today), [period, today]);
  const { series, splitIndex, prevSeries, start, end } = data;

  const actualSeries = splitIndex >= 0 ? series.slice(0, splitIndex) : series;
  const forecastSeries = splitIndex >= 0 ? series.slice(splitIndex) : [];

  const actual = {
    revenue: sumKey(actualSeries, "revenue"),
    cost: sumKey(actualSeries, "cost"),
    profit: sumKey(actualSeries, "profit"),
  };
  const forecastTotals = {
    revenue: sumKey(forecastSeries, "revenue"),
    cost: sumKey(forecastSeries, "cost"),
    profit: sumKey(forecastSeries, "profit"),
  };
  const projected = {
    revenue: actual.revenue + forecastTotals.revenue,
    cost: actual.cost + forecastTotals.cost,
    profit: actual.profit + forecastTotals.profit,
  };
  const projectedLo = {
    revenue: actual.revenue + sumKey(forecastSeries, "revenueLo"),
    cost: actual.cost + sumKey(forecastSeries, "costLo"),
    profit: actual.profit + sumKey(forecastSeries, "profitLo"),
  };
  const projectedHi = {
    revenue: actual.revenue + sumKey(forecastSeries, "revenueHi"),
    cost: actual.cost + sumKey(forecastSeries, "costHi"),
    profit: actual.profit + sumKey(forecastSeries, "profitHi"),
  };
  const hasForecast = forecastSeries.length > 0;
  const prev = {
    revenue: sumKey(prevSeries, "revenue"),
    cost: sumKey(prevSeries, "cost"),
    profit: sumKey(prevSeries, "profit"),
  };

  // Run-rates based on actual portion
  const elapsedDays = Math.max(1, actualSeries.length);
  const dailyRunRate = {
    revenue: actual.revenue / elapsedDays,
    cost: actual.cost / elapsedDays,
    profit: actual.profit / elapsedDays,
  };
  const annualRunRate = {
    revenue: dailyRunRate.revenue * 365,
    cost: dailyRunRate.cost * 365,
    profit: dailyRunRate.profit * 365,
  };

  const monthName = MONTH_NAMES[today.getMonth()];
  const todayLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const periodSubLabel =
    period === "7d"
      ? `Last 7 days · ${SHORT_MONTH[start.getMonth()]} ${start.getDate()} → ${SHORT_MONTH[end.getMonth()]} ${end.getDate()}`
      : period === "30d"
      ? `Last 30 days · ${SHORT_MONTH[start.getMonth()]} ${start.getDate()} → ${SHORT_MONTH[end.getMonth()]} ${end.getDate()}`
      : `${monthName} ${today.getFullYear()} · day ${today.getDate()} of ${end.getDate()}`;

  const metricColor = {
    revenue: "#2f5d50",
    cost: "#c8553d",
    profit: "#1a1916",
  };

  // Best / worst day in actual
  const bestDay = actualSeries.length
    ? actualSeries.reduce((a, b) => (b[metric] > a[metric] ? b : a))
    : null;
  const worstDay = actualSeries.length
    ? actualSeries.reduce((a, b) => (b[metric] < a[metric] ? b : a))
    : null;

  // Margin
  const margin = projected.revenue > 0 ? (projected.profit / projected.revenue) * 100 : 0;
  const marginActual = actual.revenue > 0 ? (actual.profit / actual.revenue) * 100 : 0;

  // Build mini breakdown rows: by week if month/30d, else daily
  const groupRows = useMemo(() => {
    if (period === "7d") {
      return series.map((p) => ({
        label: p.date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        ...p,
        forecast: p.isForecast,
      }));
    }
    // group by ISO week
    const map = new Map();
    series.forEach((p) => {
      const d = new Date(p.date);
      // week starting Monday
      const day = (d.getDay() + 6) % 7;
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - day);
      const key = dayKey(weekStart);
      if (!map.has(key)) {
        map.set(key, {
          label: `Week of ${SHORT_MONTH[weekStart.getMonth()]} ${weekStart.getDate()}`,
          revenue: 0,
          cost: 0,
          profit: 0,
          forecast: true,
          start: weekStart,
        });
      }
      const row = map.get(key);
      row.revenue += p.revenue;
      row.cost += p.cost;
      row.profit += p.profit;
      row.forecast = row.forecast && p.isForecast;
    });
    return Array.from(map.values());
  }, [series, period]);

  return (
    <>
      <PageHead
        num="01 — Forecasting"
        title="Demand"
        em="forecasting."
        sub={`Revenue, profit, and cost — actuals through ${todayLabel}, projected to month-end with confidence bands.`}
      />

      <div className="qd-subbar">
        <div className="qd-range">
          {[
            { id: "7d", label: "7d" },
            { id: "30d", label: "30d" },
            { id: "month", label: `This month — ${monthName}` },
          ].map((r) => (
            <button
              type="button"
              key={r.id}
              className={period === r.id ? "active" : ""}
              onClick={() => setPeriod(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <span className="qd-pill">
          <span className="qd-live-dot" /> {periodSubLabel}
        </span>
        <div className="qd-spacer" />
        <span className="qd-pill">Today · {SHORT_MONTH[today.getMonth()]} {today.getDate()}, {today.getFullYear()}</span>
        <button type="button" className="qd-btn">Export</button>
        <button type="button" className="qd-btn primary">Adjust assumptions</button>
      </div>

      <div className="qd-kpi-grid qd-reveal">
        <ForecastKPI
          label={hasForecast ? "Projected revenue" : "Revenue"}
          headline={projected.revenue}
          lo={projectedLo.revenue}
          hi={projectedHi.revenue}
          prev={prev.revenue}
          color="#2f5d50"
          format={fmtMoney}
          hasForecast={hasForecast}
        />
        <ForecastKPI
          label={hasForecast ? "Projected profit" : "Profit"}
          headline={projected.profit}
          lo={projectedLo.profit}
          hi={projectedHi.profit}
          prev={prev.profit}
          color="#1a1916"
          format={fmtMoney}
          hasForecast={hasForecast}
        />
        <ForecastKPI
          label={hasForecast ? "Projected cost" : "Cost"}
          headline={projected.cost}
          lo={projectedLo.cost}
          hi={projectedHi.cost}
          prev={prev.cost}
          color="#c8553d"
          format={fmtMoney}
          hasForecast={hasForecast}
        />
        <ForecastKPI
          label={hasForecast ? "Projected margin" : "Margin"}
          headline={margin}
          lo={projectedHi.revenue > 0 ? (projectedLo.profit / projectedHi.revenue) * 100 : 0}
          hi={projectedLo.revenue > 0 ? (projectedHi.profit / projectedLo.revenue) * 100 : 0}
          prev={prev.revenue > 0 ? (prev.profit / prev.revenue) * 100 : 0}
          color="var(--qd-ink)"
          format={(v) => v.toFixed(1) + "%"}
          hasForecast={hasForecast}
        />
      </div>

      <div className="qd-row-2-1 qd-reveal" style={{ animationDelay: "0.05s" }}>
        <div className="qd-card">
          <div className="qd-card-head">
            <div>
              <div className="qd-num">02 — Trajectory</div>
              <h3>
                {metric === "revenue" ? "Revenue" : metric === "profit" ? "Profit" : "Cost"} ·{" "}
                {period === "month" ? `${monthName} ${today.getFullYear()}` : period === "7d" ? "last 7 days" : "last 30 days"}
              </h3>
              <div className="qd-card-sub">
                {splitIndex >= 0
                  ? <>Solid line = actuals · dashed = forecast with <em>±1σ band</em></>
                  : "Daily, blended across all channels"}
              </div>
            </div>
            <div className="qd-range">
              {[
                { id: "revenue", label: "Revenue" },
                { id: "profit", label: "Profit" },
                { id: "cost", label: "Cost" },
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className={metric === m.id ? "active" : ""}
                  onClick={() => setMetric(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <ForecastChart data={data} metric={metric} color={metricColor[metric]} />
          <div className="qd-best-worst">
            <div>
              <div className="qd-mini-label">Best day so far</div>
              {bestDay
                ? `${fmtMoney(bestDay[metric])} · ${bestDay.date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}`
                : "—"}
            </div>
            <div>
              <div className="qd-mini-label">Worst day so far</div>
              {worstDay
                ? `${fmtMoney(worstDay[metric])} · ${worstDay.date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}`
                : "—"}
            </div>
          </div>
        </div>

        <div className="qd-side-stack">
          <div className="qd-card">
            <div className="qd-card-head">
              <div>
                <div className="qd-num">03 — Run-rate</div>
                <h3>Pace, projected forward</h3>
                <div className="qd-card-sub">Based on {elapsedDays} actual day{elapsedDays === 1 ? "" : "s"}</div>
              </div>
            </div>
            {[
              { k: "Daily revenue", v: dailyRunRate.revenue, c: "#2f5d50" },
              { k: "Daily profit", v: dailyRunRate.profit, c: "#1a1916" },
              { k: "Daily cost", v: dailyRunRate.cost, c: "#c8553d" },
            ].map((r) => (
              <div key={r.k} className="qd-rule-row">
                <span>{r.k}</span>
                <span className="qd-mono qd-muted-text">/ day</span>
                <span className="qd-mono" style={{ color: r.c, fontWeight: 600 }}>{fmtMoney(r.v)}</span>
              </div>
            ))}
            <div style={{ height: 10 }} />
            {[
              { k: "Annualized revenue", v: annualRunRate.revenue, c: "#2f5d50" },
              { k: "Annualized profit", v: annualRunRate.profit, c: "#1a1916" },
              { k: "Annualized cost", v: annualRunRate.cost, c: "#c8553d" },
            ].map((r) => (
              <div key={r.k} className="qd-rule-row">
                <span>{r.k}</span>
                <span className="qd-mono qd-muted-text">/ year</span>
                <span className="qd-mono" style={{ color: r.c, fontWeight: 600 }}>{fmtMoney(r.v)}</span>
              </div>
            ))}
          </div>

          {period === "month" && splitIndex >= 0 && (
            <div className="qd-card">
              <div className="qd-card-head">
                <div>
                  <div className="qd-num">04 — Month-end</div>
                  <h3>Projected close, {monthName}</h3>
                  <div className="qd-card-sub">
                    {actualSeries.length} actual + {forecastSeries.length} forecast day{forecastSeries.length === 1 ? "" : "s"}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div className="qd-mini-label">Revenue</div>
                  <div className="qd-big-num" style={{ color: "#2f5d50" }}>{fmtMoney(projected.revenue)}</div>
                  <div className="qd-mono" style={{ fontSize: 11, color: "var(--qd-muted)" }}>
                    {fmtMoney(actual.revenue)} actual + {fmtMoney(forecastTotals.revenue)} forecast
                  </div>
                </div>
                <div>
                  <div className="qd-mini-label">Profit</div>
                  <div className="qd-big-num">{fmtMoney(projected.profit)}</div>
                  <div className="qd-mono" style={{ fontSize: 11, color: "var(--qd-muted)" }}>
                    margin {margin.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="qd-mini-label">Cost</div>
                  <div className="qd-big-num" style={{ color: "#c8553d" }}>{fmtMoney(projected.cost)}</div>
                  <div className="qd-mono" style={{ fontSize: 11, color: "var(--qd-muted)" }}>
                    {((projected.cost / projected.revenue) * 100).toFixed(1)}% of revenue
                  </div>
                </div>
                <div>
                  <div className="qd-mini-label">vs prev month</div>
                  <div className="qd-big-num">
                    {prev.revenue > 0
                      ? ((projected.revenue / prev.revenue - 1) * 100).toFixed(1) + "%"
                      : "—"}
                  </div>
                  <div className="qd-mono" style={{ fontSize: 11, color: "var(--qd-muted)" }}>
                    revenue trajectory
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="qd-card qd-reveal" style={{ animationDelay: "0.1s" }}>
        <div className="qd-card-head">
          <div>
            <div className="qd-num">05 — Breakdown</div>
            <h3>{period === "7d" ? "Daily" : "Weekly"} detail</h3>
            <div className="qd-card-sub">Forecast rows show the model's central estimate</div>
          </div>
          <div className="qd-legend">
            <span className="qd-li"><span className="qd-sw" style={{ background: "#2f5d50" }} />Revenue</span>
            <span className="qd-li"><span className="qd-sw" style={{ background: "#c8553d" }} />Cost</span>
            <span className="qd-li"><span className="qd-sw" style={{ background: "#1a1916" }} />Profit</span>
          </div>
        </div>
        <table className="qd-table">
          <thead>
            <tr>
              <th>{period === "7d" ? "Day" : "Week"}</th>
              <th style={{ textAlign: "right" }}>Revenue</th>
              <th style={{ textAlign: "right" }}>Cost</th>
              <th style={{ textAlign: "right" }}>Profit</th>
              <th style={{ textAlign: "right" }}>Margin</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {groupRows.map((r, i) => {
              const m = r.revenue > 0 ? (r.profit / r.revenue) * 100 : 0;
              return (
                <tr key={i}>
                  <td>{r.label}</td>
                  <td className="qd-mono" style={{ textAlign: "right", color: "#2f5d50" }}>{fmtMoney(r.revenue)}</td>
                  <td className="qd-mono" style={{ textAlign: "right", color: "#c8553d" }}>{fmtMoney(r.cost)}</td>
                  <td className="qd-mono" style={{ textAlign: "right", fontWeight: 600 }}>{fmtMoney(r.profit)}</td>
                  <td className="qd-mono" style={{ textAlign: "right" }}>{m.toFixed(1)}%</td>
                  <td>
                    <span className={`qd-status ${r.forecast ? "warn" : "ok"}`}>
                      {r.forecast ? "Forecast" : "Actual"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- Placeholder ---------- */
function PlaceholderPage({ num, title, em, sub }) {
  return (
    <>
      <PageHead num={num} title={title} em={em} sub={sub} />
      <div className="qd-card qd-reveal qd-placeholder">
        <div className="qd-mini-label">Module — coming online</div>
        <div className="qd-placeholder-title">
          This screen is part of the <em>full Quiver</em> shell.
        </div>
        <div className="qd-placeholder-sub">
          Click Home, Data Connections, Reports, or Alerts in the sidebar to see the wired-up screens.
        </div>
      </div>
    </>
  );
}

/* ---------- Virtual Analyst ---------- */
function VirtualAnalyst() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { who: "bot", body: <>Morning Maria. I scanned your account overnight — three things worth your attention.</> },
    {
      who: "bot",
      body: (
        <>
          <div className="qd-insight">
            <strong>1. TikTok Spark — Creator pool</strong> is bleeding margin. CPA up 41% in 24h, ROAS 1.65× vs 3.0× target. I auto-paused at 14:32.
          </div>
          <div className="qd-insight">
            <strong>2. Meta Lookalike 1%</strong> can absorb +€2.4k/d at current efficiency. Margin model says go. Approve?
          </div>
          <div className="qd-insight">
            <strong>3.</strong> Brand search IS dropped 4.2pp — new competitor on your top-3 brand terms. Want a competitive scan?
          </div>
        </>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { who: "user", body: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      let reply;
      if (lower.includes("approve") || lower.includes("scale") || lower.includes("meta")) {
        reply = (
          <>
            Approved. Scaling Lookalike 1% by +€2,400/d effective tomorrow 00:00 UTC.
            <div className="qd-insight" style={{ marginTop: 8 }}>
              <strong>Forecast (7d):</strong> +€18.2k revenue at 3.34× blended ROAS. Confidence 94%. I'll alert if margin drifts beyond ±0.3×.
            </div>
          </>
        );
      } else if (lower.includes("competitor") || lower.includes("brand") || lower.includes("scan")) {
        reply = (
          <>
            Running competitive scan… new bidder <strong>northwind.se</strong> appearing on 3 brand terms. Average position 1.4. Suggest +18% bid on exact-match brand keywords for the next 14d.
            <div className="qd-insight" style={{ marginTop: 8 }}>
              <strong>Estimated cost:</strong> +€840 / week. <strong>Estimated brand IS recovery:</strong> 91% within 5 days.
            </div>
          </>
        );
      } else if (lower.includes("why") || lower.includes("explain")) {
        reply = (
          <>
            The TikTok spike traces to a creator-pool refresh that landed Tuesday — three new hooks underperformed median CTR by 38%. The blended-bidder kept buying because volume was up. Profit signal flipped negative at 14:00; I paused 32 minutes later.
          </>
        );
      } else {
        reply = <>I can pull that. Want it as a one-off or a recurring report? I can route it to Slack #marketing or email it to the team.</>;
      }
      setMessages((m) => [...m, { who: "bot", body: reply }]);
    }, 900);
  };

  if (!open) {
    return (
      <button type="button" className="qd-va-fab" onClick={() => setOpen(true)}>
        <span className="qd-va-mark">Q</span>
        <span>Virtual Analyst</span>
        <span className="qd-va-status">3 INSIGHTS</span>
      </button>
    );
  }
  return (
    <div className="qd-va-panel">
      <header>
        <div className="qd-va-mark gradient">Q</div>
        <div>
          <div className="qd-va-title">Virtual Analyst</div>
          <div className="qd-va-sub">QUIVER · GPT — TUNED ON YOUR DATA</div>
        </div>
        <button type="button" className="qd-va-close" onClick={() => setOpen(false)}>×</button>
      </header>
      <div className="qd-va-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`qd-va-msg ${m.who}`}>
            {m.who === "bot" && <div className="qd-va-meta">QUIVER</div>}
            <div>{m.body}</div>
          </div>
        ))}
        {typing && (
          <div className="qd-va-msg bot">
            <div className="qd-va-meta">QUIVER · thinking</div>
            <div className="qd-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
      <div className="qd-va-suggest">
        {["Approve Meta scale", "Why TikTok dropped?", "Competitor scan", "Forecast next week"].map((s) => (
          <button type="button" key={s} onClick={() => send(s)}>{s}</button>
        ))}
      </div>
      <div className="qd-va-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask anything about your performance…"
        />
        <button type="button" onClick={() => send(input)}>Send</button>
      </div>
    </div>
  );
}

/* ---------- Root ---------- */
export default function QuiverInteractiveDashboard() {
  const [current, setCurrent] = useState("home");
  const [range, setRange] = useState("30d");

  const titles = {
    home: "Home",
    connections: "Data connections",
    reports: "Automated reports",
    alerts: "Alerts",
    bidding: "Profit bidding",
    analyst: "Virtual Analyst",
    campaigns: "Campaigns",
    experiments: "Experiments",
    forecasting: "Forecasting",
    settings: "Settings",
    docs: "Documentation",
  };
  const placeholders = {
    bidding: { num: "02 — Automation", title: "Profit", em: "bidding.", sub: "Margin-aware bid optimization across every channel." },
    analyst: { num: "02 — AI", title: "Virtual", em: "Analyst.", sub: "Quiver tuned on your data." },
    campaigns: { num: "01 — Workspace", title: "All", em: "campaigns.", sub: "47 active across 4 channels." },
    experiments: { num: "01 — Workspace", title: "A/B", em: "experiments.", sub: "Hold-out tests, geo-lift, creative." },
    settings: { num: "04 — Settings", title: "Workspace", em: "settings.", sub: "Team, billing, integrations." },
    docs: { num: "04 — Settings", title: "Documentation", em: "", sub: "Guides, API reference, playbooks." },
  };

  const renderPage = () => {
    if (current === "home") return <HomeDashboard range={range} />;
    if (current === "connections") return <DataConnectionsPage />;
    if (current === "reports") return <ReportsPage />;
    if (current === "alerts") return <AlertsPage />;
    if (current === "forecasting") return <ForecastingPage />;
    return <PlaceholderPage {...placeholders[current]} />;
  };

  return (
    <div className="qd-app">
      <div className="qd-bg-motif" />
      <Sidebar current={current} setCurrent={setCurrent} />
      <main className="qd-main">
        <Topbar here={titles[current]} range={range} setRange={setRange} />
        {renderPage()}
      </main>
      <VirtualAnalyst />
    </div>
  );
}
