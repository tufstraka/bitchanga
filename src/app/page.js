'use client';

import dynamic from 'next/dynamic';

// Dynamically import the LandingPage component with no SSR
const LandingPage = dynamic(() => import("./pages/landingpage"), {
  ssr: false
});

export default function Home() {
  return (
    <main>     
        <LandingPage />
    </main>
  );
}