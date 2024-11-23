'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { jwtDecode } from 'jwt-decode';

// Dynamically import the LandingPage component with no SSR
const LandingPage = dynamic(() => import('../components/landingpage'), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      // No token, render the LandingPage
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        // Token expired, render the LandingPage
        localStorage.removeItem('token'); // Clear the expired token
        return;
      }

      // Check user role
      const userRole = decodedToken.role; 
      if (userRole === 'builder') {
        router.push('/builder-dashboard'); 
      } else if (userRole === 'investor') {
        router.push('/investor-dashboard'); 
      } else {
        console.error('Unknown user role:', userRole);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('userToken'); 
    }
  }, [router]);

  return (
    <main>
      <LandingPage />
    </main>
  );
}
