'use client';

// Animated hero background with multiple visual modes.
// Modes: 'network' (constellation), 'flow' (drifting particles), 'topo' (topographic
// contours), 'grid' (data grid pulses), 'orbit' (concentric rings), 'off'.

import { useEffect, useRef } from 'react';

export default function HeroCanvas({
  mode = 'flow',
  intensity = 1,
  speed = 1,
  theme = 'light',
  flowVariant = 'curl',
  mouseMode = 'attract',
  particleSize = 1.2,
  mousePull = 1.4,
  tailLength = 1,
  bgLayer = 'contours',
}) {
  const ref = useRef(null);
  const cfg = useRef({
    mode, intensity, speed, theme, flowVariant, mouseMode,
    particleSize, mousePull, tailLength, bgLayer,
  });
  cfg.current = {
    mode, intensity, speed, theme, flowVariant, mouseMode,
    particleSize, mousePull, tailLength, bgLayer,
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let particles = [];
    const mouse = { x: -9999, y: -9999 };
    // Offscreen canvas holding the static "map" backdrop, rebuilt on resize/layer change.
    const layerCanvas = document.createElement('canvas');
    let lastLayerKey = '';

    function rebuildNodes() {
      const target = Math.floor((w * h) / 16000) * cfg.current.intensity;
      nodes = new Array(Math.max(40, Math.min(180, Math.round(target)))).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.4,
        hue: Math.random() < 0.78 ? 'amber' : 'blue',
        pulse: Math.random() * Math.PI * 2,
      }));
    }
    function rebuildParticles() {
      const target = Math.floor((w * h) / 8000) * cfg.current.intensity;
      particles = new Array(Math.max(60, Math.min(280, Math.round(target)))).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        seed: Math.random() * 1000,
        speed: 0.4 + Math.random() * 1.2,
        len: 8 + Math.random() * 18,
        hue: Math.random() < 0.85 ? 'amber' : 'blue',
      }));
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildNodes();
      rebuildParticles();
      lastLayerKey = '';
    }

    const isLight = () => cfg.current.theme === 'light';
    const colorAmber = (a) => `oklch(0.82 0.16 78 / ${a})`;
    const colorBlue = (a) => `oklch(0.74 0.13 235 / ${a})`;
    const bgFade = () => {
      const tl = cfg.current.tailLength || 1;
      const a = Math.max(0.04, Math.min(0.32, 0.12 / tl));
      return isLight() ? `oklch(0.98 0.004 90 / ${a})` : `oklch(0.17 0.018 252 / ${a})`;
    };
    const bgClear = () => isLight() ? 'oklch(0.98 0.004 90 / 1)' : 'oklch(0.17 0.018 252 / 1)';
    const lineMuted = (a) => isLight()
      ? `oklch(0.32 0.02 252 / ${Math.min(1, a * 1.6)})`
      : `oklch(0.7 0.02 252 / ${a})`;
    const colorAmberAdj = (a) => isLight() ? `oklch(0.62 0.18 60 / ${a})` : colorAmber(a);
    const colorBlueAdj  = (a) => isLight() ? `oklch(0.55 0.18 250 / ${a})` : colorBlue(a);

    /* ---------- bg map layer (under particles) ---------- */
    function buildLayer() {
      const layer = cfg.current.bgLayer || 'none';
      const key = `${layer}|${w}x${h}|${cfg.current.theme}`;
      if (key === lastLayerKey) return;
      lastLayerKey = key;
      layerCanvas.width = Math.max(1, Math.floor(w * dpr));
      layerCanvas.height = Math.max(1, Math.floor(h * dpr));
      const lx = layerCanvas.getContext('2d');
      lx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lx.clearRect(0, 0, w, h);
      if (layer === 'none') return;
      const ink = (a) => isLight()
        ? `oklch(0.32 0.03 252 / ${a})`
        : `oklch(0.78 0.03 252 / ${a})`;

      if (layer === 'contours') {
        const cols = Math.ceil(w / 6) + 1;
        const rows = Math.ceil(h / 6) + 1;
        const step = 6;
        const heights = new Float32Array(cols * rows);
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const x = i * step, y = j * step;
            const v = Math.sin(x * 0.004) * Math.cos(y * 0.005)
              + Math.sin((x + y) * 0.0028) * 0.6
              + Math.cos(x * 0.001 - y * 0.0015) * 0.7;
            heights[j * cols + i] = v;
          }
        }
        const levels = [-1.4, -0.9, -0.4, 0, 0.4, 0.9, 1.4];
        levels.forEach((lvl, idx) => {
          const center = idx === 3;
          lx.strokeStyle = center ? colorAmberAdj(isLight() ? 0.35 : 0.45) : ink(0.10);
          lx.lineWidth = center ? 0.7 : 0.5;
          lx.beginPath();
          for (let j = 0; j < rows - 1; j++) {
            for (let i = 0; i < cols - 1; i++) {
              const a = heights[j * cols + i];
              const b = heights[j * cols + i + 1];
              const c = heights[(j + 1) * cols + i + 1];
              const d = heights[(j + 1) * cols + i];
              const x = i * step, y = j * step;
              const seg = (ax, ay, bx, by, va, vb) => {
                if ((va <= lvl) === (vb <= lvl)) return null;
                const tt = (lvl - va) / (vb - va);
                return [ax + (bx - ax) * tt, ay + (by - ay) * tt];
              };
              const e1 = seg(x, y, x + step, y, a, b);
              const e2 = seg(x + step, y, x + step, y + step, b, c);
              const e3 = seg(x + step, y + step, x, y + step, c, d);
              const e4 = seg(x, y + step, x, y, d, a);
              const pts = [e1, e2, e3, e4].filter(Boolean);
              if (pts.length === 2) {
                lx.moveTo(pts[0][0], pts[0][1]);
                lx.lineTo(pts[1][0], pts[1][1]);
              } else if (pts.length === 4) {
                lx.moveTo(pts[0][0], pts[0][1]); lx.lineTo(pts[1][0], pts[1][1]);
                lx.moveTo(pts[2][0], pts[2][1]); lx.lineTo(pts[3][0], pts[3][1]);
              }
            }
          }
          lx.stroke();
        });
      } else if (layer === 'grid') {
        lx.strokeStyle = ink(0.07);
        lx.lineWidth = 0.5;
        const minor = 24;
        for (let x = 0; x < w; x += minor) {
          lx.beginPath(); lx.moveTo(x, 0); lx.lineTo(x, h); lx.stroke();
        }
        for (let y = 0; y < h; y += minor) {
          lx.beginPath(); lx.moveTo(0, y); lx.lineTo(w, y); lx.stroke();
        }
        lx.strokeStyle = ink(0.16);
        lx.lineWidth = 0.7;
        const major = 120;
        for (let x = 0; x < w; x += major) {
          lx.beginPath(); lx.moveTo(x, 0); lx.lineTo(x, h); lx.stroke();
        }
        for (let y = 0; y < h; y += major) {
          lx.beginPath(); lx.moveTo(0, y); lx.lineTo(w, y); lx.stroke();
        }
        lx.fillStyle = ink(0.5);
        for (let x = major; x < w; x += major) {
          for (let y = major; y < h; y += major) {
            lx.fillRect(x - 1.5, y - 0.4, 3, 0.8);
            lx.fillRect(x - 0.4, y - 1.5, 0.8, 3);
          }
        }
      } else if (layer === 'isobars') {
        const centers = [
          { x: w * 0.22, y: h * 0.32, r0: 60, n: 9, sign: 1 },
          { x: w * 0.74, y: h * 0.6, r0: 80, n: 11, sign: -1 },
          { x: w * 0.48, y: h * 0.18, r0: 40, n: 6, sign: 1 },
        ];
        centers.forEach((c) => {
          for (let i = 0; i < c.n; i++) {
            const r = c.r0 + i * 38;
            lx.strokeStyle = ink(0.06 + (c.n - i) * 0.012);
            lx.lineWidth = 0.55;
            lx.beginPath();
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
              const wob = Math.sin(a * 3 + i * 0.4 + c.sign) * 6 + Math.cos(a * 2 - i * 0.2) * 4;
              const rr = r + wob;
              const px = c.x + Math.cos(a) * rr;
              const py = c.y + Math.sin(a) * rr * 0.9;
              if (a === 0) lx.moveTo(px, py); else lx.lineTo(px, py);
            }
            lx.stroke();
          }
          lx.fillStyle = ink(0.45);
          lx.font = '600 11px ui-monospace, Menlo, monospace';
          lx.textAlign = 'center';
          lx.textBaseline = 'middle';
          lx.fillText(c.sign > 0 ? 'H' : 'L', c.x, c.y);
        });
      } else if (layer === 'streets') {
        lx.strokeStyle = ink(0.1);
        lx.lineWidth = 0.6;
        let seed = 12345;
        const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed & 0xffff) / 0xffff; };
        const xs = []; let xx = 0;
        while (xx < w) { xs.push(xx); xx += 28 + rnd() * 70; }
        const ys = []; let yy = 0;
        while (yy < h) { ys.push(yy); yy += 28 + rnd() * 70; }
        ys.forEach((y) => {
          lx.beginPath(); lx.moveTo(0, y); lx.lineTo(w, y); lx.stroke();
        });
        xs.forEach((x) => {
          lx.beginPath(); lx.moveTo(x, 0); lx.lineTo(x, h); lx.stroke();
        });
        lx.fillStyle = ink(0.18);
        for (let i = 0; i < xs.length - 1; i++) {
          for (let j = 0; j < ys.length - 1; j++) {
            if (rnd() > 0.55) {
              const cx = (xs[i] + xs[i + 1]) / 2;
              const cy = (ys[j] + ys[j + 1]) / 2;
              const sz = 2 + rnd() * 4;
              lx.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
            }
          }
        }
      } else if (layer === 'coastline') {
        lx.strokeStyle = ink(0.25);
        lx.lineWidth = 0.9;
        const baseY = h * 0.55;
        const pts = [];
        for (let x = -10; x <= w + 10; x += 6) {
          const y = baseY
            + Math.sin(x * 0.004) * 70
            + Math.sin(x * 0.013) * 22
            + Math.cos(x * 0.027) * 9;
          pts.push([x, y]);
        }
        lx.beginPath();
        pts.forEach((p, i) => i === 0 ? lx.moveTo(p[0], p[1]) : lx.lineTo(p[0], p[1]));
        lx.stroke();
        lx.strokeStyle = ink(0.07);
        lx.lineWidth = 0.4;
        for (let offset = 8; offset < 80; offset += 6) {
          lx.beginPath();
          pts.forEach((p, i) => {
            const y = p[1] - offset - Math.sin(p[0] * 0.01 + offset * 0.2) * 3;
            i === 0 ? lx.moveTo(p[0], y) : lx.lineTo(p[0], y);
          });
          lx.stroke();
        }
        lx.strokeStyle = ink(0.3);
        lx.lineWidth = 0.7;
        lx.beginPath();
        const ix = w * 0.7, iy = h * 0.28, ir = 18;
        for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.1) {
          const wob = Math.sin(a * 4) * 3;
          const px = ix + Math.cos(a) * (ir + wob);
          const py = iy + Math.sin(a) * (ir + wob);
          if (a === 0) lx.moveTo(px, py); else lx.lineTo(px, py);
        }
        lx.stroke();
      }
    }
    function paintLayer() {
      const layer = cfg.current.bgLayer || 'none';
      if (layer === 'none') return;
      buildLayer();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layerCanvas, 0, 0);
      ctx.restore();
    }

    /* ---------- modes ---------- */

    function drawNetwork() {
      const sp = cfg.current.speed;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * sp; n.y += n.vy * sp;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 14000) {
          const f = (1 - md2 / 14000) * 0.4;
          n.x += (mdx / Math.sqrt(md2 + 1)) * f;
          n.y += (mdy / Math.sqrt(md2 + 1)) * f;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 18000) {
            ctx.strokeStyle = lineMuted((1 - d2 / 18000) * 0.18);
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulse += 0.012 * sp;
        const p = (Math.sin(n.pulse) + 1) / 2;
        const r = n.r + p * 0.4;
        ctx.fillStyle = n.hue === 'amber' ? colorAmberAdj(0.55 + p * 0.4) : colorBlueAdj(0.5 + p * 0.35);
        ctx.shadowColor = n.hue === 'amber' ? colorAmberAdj(0.6) : colorBlueAdj(0.5);
        ctx.shadowBlur = isLight() ? 0 : 8;
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function flowField(x, y, t, variant) {
      if (variant === 'wave') {
        const a = Math.sin(y * 0.012 + t * 0.0003);
        const b = 0.4 + Math.cos(x * 0.004 + t * 0.0002) * 0.2;
        return Math.atan2(a * 0.6, b);
      }
      if (variant === 'spiral') {
        const cx = w * 0.5, cy = h * 0.5;
        const dx = x - cx, dy = y - cy;
        const r = Math.hypot(dx, dy) + 1;
        const tang = Math.atan2(dy, dx) + Math.PI / 2;
        const wob = Math.sin(r * 0.012 - t * 0.0006) * 0.4;
        return tang + wob;
      }
      if (variant === 'radial') {
        const cx = w * 0.5, cy = h * 0.5;
        const dx = x - cx, dy = y - cy;
        const breath = Math.sin(t * 0.0004) * 0.5;
        return Math.atan2(dy, dx) + breath + Math.PI;
      }
      if (variant === 'lattice') {
        const a = Math.sin(x * 0.008 + t * 0.0003) * Math.cos(y * 0.008 - t * 0.00025);
        const b = Math.cos(x * 0.006 - t * 0.0002) * Math.sin(y * 0.005 + t * 0.0003);
        return Math.atan2(b, a);
      }
      const a = Math.sin(x * 0.0035 + t * 0.0002) + Math.cos(y * 0.0028 - t * 0.00018);
      const b = Math.cos(x * 0.0024 - t * 0.00021) + Math.sin(y * 0.003 + t * 0.00015);
      return Math.atan2(b, a);
    }
    function drawFlow(now) {
      const sp = cfg.current.speed;
      const variant = cfg.current.flowVariant || 'curl';
      const mMode = cfg.current.mouseMode || 'attract';
      const pull = cfg.current.mousePull ?? 1;
      const psize = cfg.current.particleSize ?? 0.7;
      ctx.fillStyle = bgFade();
      ctx.fillRect(0, 0, w, h);
      paintLayer();
      const mAlive = mouse.x > -9000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let ang = flowField(p.x, p.y, now, variant);
        if (mAlive) {
          const mdx = mouse.x - p.x, mdy = mouse.y - p.y;
          const md = Math.hypot(mdx, mdy);
          const radius = 200 + 200 * pull;
          if (md < radius && md > 1) {
            const target = Math.atan2(mdy, mdx) + (mMode === 'repel' ? Math.PI : 0);
            const w0 = (1 - md / radius);
            const angTo = mMode === 'orbit' ? target + Math.PI / 2 : target;
            let diff = angTo - ang;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            ang += diff * w0 * Math.min(1, 0.85 * pull);
          }
        }
        const boost = mAlive ? 1 + Math.max(0, 1 - Math.hypot(mouse.x - p.x, mouse.y - p.y) / (200 + 200 * pull)) * 0.8 * pull : 1;
        const dx = Math.cos(ang) * p.speed * sp * boost;
        const dy = Math.sin(ang) * p.speed * sp * boost;
        const nx = p.x + dx, ny = p.y + dy;
        ctx.strokeStyle = p.hue === 'amber' ? colorAmberAdj(0.55) : colorBlueAdj(0.45);
        ctx.lineWidth = psize;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny;
        if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          p.x = Math.random() * w; p.y = Math.random() * h;
        }
      }
    }

    function drawTopo(now) {
      ctx.fillStyle = bgClear();
      ctx.fillRect(0, 0, w, h);
      const sp = cfg.current.speed;
      const t = now * 0.00012 * sp;
      const lines = 22;
      const step = h / lines;
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const baseY = i * step + step * 0.5;
        for (let x = 0; x <= w; x += 8) {
          const y = baseY
            + Math.sin(x * 0.006 + t + i * 0.6) * 22
            + Math.sin(x * 0.011 + t * 1.7 + i * 0.2) * 10
            + Math.cos(x * 0.003 - t * 0.6) * 14;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const mid = lines / 2;
        const dist = Math.abs(i - mid) / mid;
        const alpha = 0.06 + (1 - dist) * 0.18;
        const useAmber = i % 5 === 2;
        ctx.strokeStyle = useAmber ? colorAmberAdj(alpha * (isLight() ? 1.5 : 1)) : lineMuted(alpha);
        ctx.lineWidth = useAmber ? 0.9 : 0.5;
        ctx.stroke();
      }
    }

    function drawGrid(now) {
      ctx.fillStyle = bgClear();
      ctx.fillRect(0, 0, w, h);
      const sp = cfg.current.speed;
      const t = now * 0.001 * sp;
      const gx = 36, gy = 36;
      for (let x = gx / 2; x < w; x += gx) {
        for (let y = gy / 2; y < h; y += gy) {
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          const mouseLift = d < 220 ? (1 - d / 220) : 0;
          const wave = (Math.sin((x + y) * 0.012 + t) + 1) / 2;
          const a = 0.05 + wave * 0.18 + mouseLift * 0.6;
          const r = 1.1 + wave * 0.6 + mouseLift * 1.6;
          const isHot = (Math.sin((x * 0.04 + y * 0.03) + t * 0.7) > 0.985);
          ctx.fillStyle = isHot ? colorAmberAdj(0.9) : lineMuted(a);
          if (isHot) { ctx.shadowColor = colorAmberAdj(0.6); ctx.shadowBlur = isLight() ? 0 : 10; }
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    function drawOrbit(now) {
      ctx.fillStyle = bgClear();
      ctx.fillRect(0, 0, w, h);
      const sp = cfg.current.speed;
      const t = now * 0.00018 * sp;
      const cx = w * 0.7, cy = h * 0.5;
      const rings = 6;
      const baseR = Math.min(w, h) * 0.12;
      for (let i = 1; i <= rings; i++) {
        const r = baseR * i;
        ctx.strokeStyle = lineMuted(0.06 + (rings - i) * 0.018);
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        const ang = t * (1 + i * 0.4) + i;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        const isAmber = i % 2 === 1;
        ctx.fillStyle = isAmber ? colorAmberAdj(0.85) : colorBlueAdj(0.7);
        ctx.shadowColor = isAmber ? colorAmberAdj(0.7) : colorBlueAdj(0.6);
        ctx.shadowBlur = isLight() ? 0 : 14;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        const x2 = cx + Math.cos(ang + Math.PI * 0.7) * r;
        const y2 = cy + Math.sin(ang + Math.PI * 0.7) * r;
        ctx.fillStyle = lineMuted(0.4);
        ctx.beginPath(); ctx.arc(x2, y2, 2, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = colorAmberAdj(0.9);
      ctx.shadowColor = colorAmberAdj(0.7);
      ctx.shadowBlur = isLight() ? 0 : 18;
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    function step(now) {
      const m = cfg.current.mode;
      if (m === 'off') {
        ctx.clearRect(0, 0, w, h);
      } else if (m === 'flow') {
        drawFlow(now);
      } else if (m === 'topo') {
        drawTopo(now);
      } else if (m === 'grid') {
        drawGrid(now);
      } else if (m === 'orbit') {
        drawOrbit(now);
      } else {
        ctx.clearRect(0, 0, w, h);
        drawNetwork();
      }
      raf = requestAnimationFrame(step);
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onLeave() { mouse.x = -9999; mouse.y = -9999; }

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} />;
}
