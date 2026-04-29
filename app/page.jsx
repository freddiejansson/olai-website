import Nav from '@/components/nav';
import Hero from '@/components/hero';
import Positioning from '@/components/positioning';
import Services from '@/components/services';
import Quiver from '@/components/quiver';
import WhyOlai from '@/components/why-olai';
import Contact from '@/components/contact';
import Footer from '@/components/footer';

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Positioning />
      <Services />
      <Quiver />
      <WhyOlai />
      <Contact />
      <Footer />
    </>
  );
}
