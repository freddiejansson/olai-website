export default function Positioning() {
  return (
    <section className="block" id="positioning">
      <div className="wrap">
        <div className="position-row">
          <div>
            <div className="section-label">
              <span className="num">01</span>
              <span className="line"></span>
              <span className="lbl">Position</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: '14ch' }}>
              Two disciplines. One operating system.
            </h2>
          </div>
          <div>
            <p className="position-text">
              We sit at the intersection of data engineering and performance marketing. <em>We don&apos;t just run your ads — we build the infrastructure to understand them.</em>
            </p>
            <div className="position-cols" style={{ marginTop: 48 }}>
              <div className="item">
                <h4>Media management</h4>
                <p>Deep hands on experience across Google, Meta, TikTok and Snap. We&apos;ve spent the budget, broken the platforms, and rebuilt the playbooks.</p>
              </div>
              <div className="item">
                <h4>Data engineers</h4>
                <p>Server-side tracking, attribution modeling, warehouse pipelines. The plumbing nobody else wants to touch — done right.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
