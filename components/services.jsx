import { PerfIcon, DataIcon, QuiverIcon, ConsultIcon } from './icons';

const services = [
  {
    n: '01', Icon: PerfIcon, title: 'Performance Marketing',
    desc: 'Strategy, execution and optimization across paid social and search. Channel-native craft, full-funnel logic.',
    tags: ['Google Ads', 'Meta', 'TikTok', 'Snapchat'],
  },
  {
    n: '02', Icon: DataIcon, title: 'Data & Analytics',
    desc: 'Tracking, measurement, attribution, dashboards and pipelines. Server-side by default, profit-aware by design.',
    tags: ['GA4', 'Server-side', 'BigQuery', 'Attribution'],
  },
  {
    n: '03', Icon: QuiverIcon, title: 'Quiver',
    desc: 'Our proprietary intelligence platform. Unifies ad data across channels, surfaces the insights that actually matter.',
    tags: ['Cross-channel', 'Realtime', 'Alerts'],
  },
  {
    n: '04', Icon: ConsultIcon, title: 'Consulting & Strategy',
    desc: 'Audits, roadmaps and team enablement. We embed, transfer the craft, and leave you sharper than we found you.',
    tags: ['Audits', 'Roadmaps', 'Enablement'],
  },
];

export default function Services() {
  return (
    <section className="block" id="services">
      <div className="wrap">
        <div className="section-label">
          <span className="num">02</span>
          <span className="line"></span>
          <span className="lbl">Services</span>
        </div>
        <div className="section-head">
          <h2>What we do, end to end.</h2>
          <p className="right">Four practices, designed to overlap. The same team that builds your tracking is in the room when we set the bid strategy.</p>
        </div>
        <div className="services">
          {services.map((s) => (
            <div className="svc" key={s.n}>
              <span className="svc-num">{s.n} / Service</span>
              <div className="svc-icon"><s.Icon /></div>
              <h3>{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-tags">
                {s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
