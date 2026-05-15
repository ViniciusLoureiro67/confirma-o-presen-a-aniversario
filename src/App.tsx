import { GlobalBackdrop } from './components/GlobalBackdrop';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Location } from './components/Location';
import { RSVPForm } from './components/RSVPForm';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <>
      <GlobalBackdrop />
      <main className="relative" style={{ zIndex: 2 }}>
        <Hero />
        <About />
        <Location />
        <RSVPForm />
        <Footer />
      </main>
    </>
  );
}
