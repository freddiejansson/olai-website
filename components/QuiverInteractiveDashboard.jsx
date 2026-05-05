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
        { id: "campaigns", label: "Campaigns", icon: "chart" },
        { id: "experiments", label: "Experiments", icon: "flask" },
        { id: "forecasting", label: "Forecasting", icon: "spark" },
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
  const kpis = [
    { label: "Total spend", value: 109000, format: fmtMoney, delta: "+8.2%", deltaPos: false, spark: [40, 42, 44, 43, 46, 48, 50, 52, 54, 55, 58, 60], color: "#c8553d" },
    { label: "Revenue", value: 372400, format: fmtMoney, delta: "+14.1%", deltaPos: true, spark: [60, 62, 65, 68, 72, 76, 80, 84, 88, 92, 98, 104], color: "#2f5d50" },
    { label: "Profit margin", value: 31.4, format: (v) => v.toFixed(1) + "%", delta: "+2.1pp", deltaPos: true, spark: [22, 24, 26, 25, 27, 28, 29, 30, 31, 30, 32, 31] },
    { label: "CAC", value: 24.8, format: (v) => "€" + v.toFixed(2), delta: "−4.6%", deltaPos: true, spark: [32, 30, 29, 28, 27, 28, 26, 25, 26, 25, 24, 25] },
    { label: "Conversions", value: 3412, format: fmtNum, delta: "+11.8%", deltaPos: true, spark: [200, 210, 230, 240, 250, 260, 280, 290, 310, 320, 340, 341] },
    { label: "Active campaigns", value: 47, format: fmtNum, delta: "+3", deltaPos: true, spark: [40, 41, 41, 42, 43, 44, 44, 45, 45, 46, 46, 47] },
  ];
  return (
    <>
      <PageHead
        num="01 — Overview"
        title="Good morning,"
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
    forecasting: { num: "01 — Workspace", title: "Demand", em: "forecasting.", sub: "Seasonality-adjusted spend planning." },
    settings: { num: "04 — Settings", title: "Workspace", em: "settings.", sub: "Team, billing, integrations." },
    docs: { num: "04 — Settings", title: "Documentation", em: "", sub: "Guides, API reference, playbooks." },
  };

  const renderPage = () => {
    if (current === "home") return <HomeDashboard range={range} />;
    if (current === "connections") return <DataConnectionsPage />;
    if (current === "reports") return <ReportsPage />;
    if (current === "alerts") return <AlertsPage />;
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
