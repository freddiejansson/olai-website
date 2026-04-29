import { LinkedinIcon } from './icons';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <a href="#" className="logo"><span className="logo-mark"></span>Olai</a>
            <p className="footer-blurb">A Swedish data and growth consultancy. Performance media, measurement, and the platform that ties it all together.</p>
          </div>
          <div>
            <h5>Practice</h5>
            <ul>
              <li><a href="#services">Performance</a></li>
              <li><a href="#services">Data &amp; Analytics</a></li>
              <li><a href="#quiver">Quiver</a></li>
              <li><a href="#services">Consulting</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Journal</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Connect</h5>
            <ul>
              <li><a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><LinkedinIcon /> LinkedIn</a></li>
              <li><a href="mailto:hello@olaibusiness.se">hello@olaibusiness.se</a></li>
              <li><a href="#">Sundsvall · Sverige</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bot">
          <span>© 2026 Olai Business Consulting AB · olaibusiness.se</span>
          <span>Designed in Sundsvall · Engineered everywhere</span>
        </div>
      </div>
    </footer>
  );
}
