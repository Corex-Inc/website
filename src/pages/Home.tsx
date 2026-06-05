import { lazy, Suspense } from 'react';
import { Hero } from '../components/home/Hero';
import { Header } from '../components/shared/Header';
import { Footer } from '../components/shared/Footer';
import { CorexLoader } from '@/components/shared/loading/corex';

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
