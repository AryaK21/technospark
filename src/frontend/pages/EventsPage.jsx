import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Events from '../../components/Events';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';
import '../../styles/events.css';

export default function EventsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-root public-website-root">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main-content" style={{ paddingTop: 0 }}>
        <div className="non-hero-comic-wrapper" style={{ minHeight: '80vh' }}>
          <ComicSkylineBg />
          <div className="non-hero-content-layer">
            <Events />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

