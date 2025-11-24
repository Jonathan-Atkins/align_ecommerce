import HeroSection from "./HeroSection";
import Timeline from "./Timeline";
import LandingLoader from '../components/LandingLoader';
export default function HomePage() {
  return (
    <>
      <LandingLoader />
      <HeroSection />
      <Timeline />
      {/* ...other homepage sections... */}
    </>
  );
}
