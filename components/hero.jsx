import HeroCanvas from './hero-canvas';
import { ArrowIcon } from './icons';

const HERO = {
  eyebrow: 'PERFORMANCE × DATA ENGINEERING',
  pre: 'The signal',
  mid: 'beneath your',
  em: 'spend.',
  sub: 'Olai is a Swedish data and growth consultancy. We run performance media, build the measurement to prove it, and ship the platform that ties it all together.',
};

export default function Hero() {
  return (
    <section className="hero">
      <HeroCanvas
        mode="flow"
        intensity={1}
        speed={1}
        theme="light"
        flowVariant="curl"
        mouseMode="attract"
        particleSize={1.2}
        mousePull={1.4}
        tailLength={1}
        bgLayer="contours"
      />
      <div className="hero-grad"></div>
      <div className="wrap hero-inner">
        <div className="eyebrow">
          <span className="dot"></span>
          <span>{HERO.eyebrow}</span>
        </div>
        <h1 className="hero-title">
          {HERO.pre}<br />
          {HERO.mid} <em>{HERO.em}</em>
        </h1>
        <p className="hero-sub">{HERO.sub}</p>
        <div className="hero-cta">
          <a href="#contact" className="btn">
            Contact us <span className="arr"><ArrowIcon size={13} /></span>
          </a>
          <a href="#quiver" className="btn ghost">Meet Quiver</a>
        </div>
      </div>
      <div className="wrap hero-meta">
        <div className="col"></div>
        <div className="col" style={{ textAlign: 'right' }}>
          <span className="mono">Scroll <span style={{ color: 'var(--accent)' }}>↓</span></span>
        </div>
      </div>
    </section>
  );
}
