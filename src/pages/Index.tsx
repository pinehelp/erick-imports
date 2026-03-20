import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Benefits } from '@/components/landing/Benefits';
import { Footer } from '@/components/landing/Footer';
import { Disclaimer } from '@/components/simulator/Disclaimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />
      <Benefits />
      <section className="px-4 py-12">
        <div className="mx-auto max-w-lg">
          <Disclaimer />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
