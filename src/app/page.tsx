import HeroSection from "./HeroSection";
import Timeline from "./Timeline";
import LandingLoader from '../components/LandingLoader';
import LovableClientInit from '../components/LovableClientInit';
export default function HomePage() {
  return (
    <>
      {/* Server-rendered initial loader so the loading overlay is visible
          immediately on first paint. The client `LandingLoader` will
          coordinate removal/fade and respect the session flag so the
          overlay only shows once per tab session. */}
      <div id="initial-loader">
        <div className="page-loader-overlay loading-screen" role="status" aria-live="polite">
          <div className="loader-logo-wrapper" aria-hidden="true">
            <img src="/align_vegas_logo.png" alt="Align Vegas logo" width={260} height={260} className="loader-logo" style={{ display: 'block' }} />
          </div>
        </div>
      </div>

      <LandingLoader />
      <LovableClientInit />
      <HeroSection />
      <Timeline />
      {/* ...other homepage sections... */}
    </>
  );
}
