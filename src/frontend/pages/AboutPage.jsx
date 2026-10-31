import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import About from '../../components/About';
import Footer from '../../components/Footer';
import CustomCursor from '../../components/CustomCursor';
import ScrollProgress from '../../components/ScrollProgress';
import ComicSkylineBg from '../../components/ComicSkylineBg';
import '../../styles/about.css';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-root public-website-root">
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main-content" style={{ paddingTop: '2rem' }}>
        <div className="non-hero-comic-wrapper" style={{ minHeight: '80vh' }}>
          <ComicSkylineBg />
          <div className="non-hero-content-layer">
            <About />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

