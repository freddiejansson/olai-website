'use client';

import { useEffect, useState } from 'react';
import { ArrowIcon } from './icons';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap nav-inner">
        <a href="#" className="logo"><span className="logo-mark"></span>Olai</a>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#quiver">Quiver</a>
          <a href="#why">Why Olai</a>
          <a href="#contact">Contact</a>
        </div>
        <a href="#contact" className="btn">
          Contact us <span className="arr"><ArrowIcon size={13} /></span>
        </a>
      </div>
    </nav>
  );
}
