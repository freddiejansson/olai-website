function BentoViz1() {
  return (
    <svg className="bento-viz" viewBox="0 0 220 220" fill="none">
      <defs>
        <radialGradient id="rg1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.82 0.16 78 / 0.5)" />
          <stop offset="100%" stopColor="oklch(0.82 0.16 78 / 0)" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="80" fill="url(#rg1)" />
      <circle cx="160" cy="160" r="60" stroke="oklch(0.82 0.16 78 / 0.3)" />
      <circle cx="160" cy="160" r="90" stroke="oklch(0.82 0.16 78 / 0.18)" />
      <circle cx="160" cy="160" r="120" stroke="oklch(0.82 0.16 78 / 0.1)" />
      <circle cx="160" cy="160" r="6" fill="oklch(0.82 0.16 78)" />
    </svg>
  );
}

function BentoViz2() {
  return (
    <svg className="bento-viz" viewBox="0 0 220 220" fill="none" style={{ width: 160, height: 160 }}>
      {[0, 14, 28, 42, 56].map((y, i) => (
        <rect
          key={i}
          x={40 + i * 4}
          y={70 + y}
          width={140 - i * 8}
          height="10"
          rx="2"
          fill={i === 0 ? 'oklch(0.82 0.16 78 / 0.6)' : 'oklch(0.74 0.13 235 / ' + (0.4 - i * 0.06) + ')'}
        />
      ))}
    </svg>
  );
}

function BentoViz3() {
  return (
    <svg className="bento-viz" viewBox="0 0 220 220" fill="none" style={{ width: 170, height: 170 }}>
      <path d="M 30 110 Q 100 110 120 60" stroke="oklch(0.82 0.16 78 / 0.5)" strokeWidth="1.2" />
      <path d="M 30 110 Q 100 110 130 110" stroke="oklch(0.82 0.16 78 / 0.5)" strokeWidth="1.2" />
      <path d="M 30 110 Q 100 110 120 160" stroke="oklch(0.82 0.16 78 / 0.5)" strokeWidth="1.2" />
      <circle cx="30" cy="110" r="5" fill="oklch(0.82 0.16 78)" />
      <circle cx="120" cy="60" r="3" fill="oklch(0.74 0.13 235)" />
      <circle cx="130" cy="110" r="3" fill="oklch(0.74 0.13 235)" />
      <circle cx="120" cy="160" r="3" fill="oklch(0.74 0.13 235)" />
    </svg>
  );
}

function BentoViz4() {
  return (
    <svg className="bento-viz" viewBox="0 0 220 220" fill="none" style={{ width: 150, height: 150 }}>
      <circle cx="110" cy="110" r="60" stroke="oklch(0.82 0.16 78 / 0.3)" />
      <circle cx="110" cy="110" r="40" stroke="oklch(0.82 0.16 78 / 0.18)" />
      <path d="M 110 60 L 120 110 L 110 160 L 100 110 Z" fill="oklch(0.82 0.16 78 / 0.7)" />
      <circle cx="110" cy="110" r="3" fill="var(--bg)" />
    </svg>
  );
}

export default function WhyOlai() {
  return (
    <section className="block" id="why">
      <div className="wrap">
        <div className="section-label">
          <span className="num">04</span>
          <span className="line"></span>
          <span className="lbl">Why Olai</span>
        </div>
        <div className="section-head">
          <h2>The case for working with us.</h2>
          <p className="right">Four reasons we tend to come up in pitch meetings. They&apos;re not slogans — they&apos;re what the work looks like.</p>
        </div>
        <div className="bento">
          <div className="bento-card b1">
            <div className="kicker">01 — Tech-native</div>
            <h3>We build infrastructure, not just campaigns.</h3>
            <p>We look at every one-off analysis to see how it can scale. Then we build. Then we re-use.</p>
            <BentoViz1 />
          </div>
          <div className="bento-card b2">
            <div className="kicker">02 — Clarity</div>
            <h3>Full-funnel, profit-first.</h3>
            <p>Impression to margin, every dot connected.</p>
            <BentoViz2 />
          </div>
          <div className="bento-card b3">
            <div className="kicker">03 — Honest</div>
            <h3>Platform agnostic.</h3>
            <p>We go where the data is — not where the kickbacks are.</p>
            <BentoViz3 />
          </div>
          <div className="bento-card b4">
            <div className="kicker">04 — Roots</div>
            <h3>Swedish craft, nordic reach.</h3>
            <p>Swedish-built, deployed across the nordics</p>
            <BentoViz4 />
          </div>
          <div className="bento-card b5" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="kicker">How we work</div>
              <h3 style={{ marginTop: 6 }}>Senior team. No hand-offs.</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>Embed</div>
                <div className="mono" style={{ marginTop: 2 }}>not outsource</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>Ship</div>
                <div className="mono" style={{ marginTop: 2 }}>not deck</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-space)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>Transfer</div>
                <div className="mono" style={{ marginTop: 2 }}>not lock-in</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
