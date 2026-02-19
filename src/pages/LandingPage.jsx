import Hero from '@/components/landing/Hero';
import AboutSection from '@/components/landing/AboutSection';
import RulesSection from '@/components/landing/RulesSection';
import CriteriaSection from '@/components/landing/CriteriaSection';
// import JudgesSection from '@/components/landing/JudgesSection';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <RulesSection />
      <CriteriaSection />
      {/* <JudgesSection /> */}
    </>
  );
}
