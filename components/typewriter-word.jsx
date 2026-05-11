'use client';

import { useEffect, useRef, useState } from 'react';

export default function TypewriterWord({
  words,
  hold = 2400,
  step = 60,
  caretColor,
}) {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState(words[0] ?? '');
  const [reduced, setReduced] = useState(false);
  const raf = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) {
      setDisplay(words[idx] ?? '');
      return;
    }
    if (!words?.length) return;

    const target = words[idx] ?? '';
    let cur = display;
    let mode = cur && cur !== target ? 'erase' : 'type';
    let last = performance.now();

    const tick = (now) => {
      if (now - last < step) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      last = now;

      if (mode === 'erase') {
        cur = cur.slice(0, -1);
        setDisplay(cur);
        if (cur.length === 0) mode = 'type';
      } else {
        cur = target.slice(0, cur.length + 1);
        setDisplay(cur);
        if (cur === target) {
          timer.current = setTimeout(() => {
            setIdx((i) => (i + 1) % words.length);
          }, hold);
          return;
        }
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, words.join('|'), hold, step, reduced]);

  if (reduced) {
    return <span>{words[idx] ?? ''}</span>;
  }

  return (
    <span style={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {display || ' '}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '0.06em',
          height: '0.9em',
          marginLeft: 2,
          verticalAlign: '-0.08em',
          background: caretColor ?? 'currentColor',
          animation: 'tw-caret 1s steps(2) infinite',
        }}
      />
      <style>{`@keyframes tw-caret { 50% { opacity: 0; } }`}</style>
    </span>
  );
}
