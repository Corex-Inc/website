import { lazy, Suspense } from 'react';
import { CorexLoader } from '@/components/shared/loading/corex';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';
import { Hero } from '../components/home/Hero';

const Features = lazy(() => import( '../components/home/Features'));
const Platforms = lazy(() => import('../components/home/Platforms'));
const SyntaxSection = lazy(() => import('../components/home/SyntaxSection'));
const CTA = lazy(() => import('../components/home/CTA'));

export function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <Suspense fallback={<CorexLoader />}>
        <Features />
      </Suspense>
      
      <Suspense fallback={<CorexLoader />}>
        <SyntaxSection />
      </Suspense>

      <Suspense fallback={<CorexLoader />}>
        <Platforms />
      </Suspense>

      <Suspense fallback={<CorexLoader />}>
        <CTA />
      </Suspense>
      <Footer />
    </>
  );
}
