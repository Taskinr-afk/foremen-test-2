'use client';

import { MotionConfig } from 'framer-motion';
import { useCallback, useState, useSyncExternalStore } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Rail, SignInModal, StatusBar, TopBar } from '@/components/landing/chrome';
import { Hero } from '@/components/landing/hero';
import { Clocks, Closing, Field, Flow, Modules, Problem } from '@/components/landing/sections';
import { SignupFlow } from '@/components/onboarding/signup-flow';
import '@/components/landing/landing.css';

function subscribeHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export default function LandingPage() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => '');

  const enterApp = useCallback(() => {
    setSignInOpen(false);
    setShowSignup(false);
    window.location.hash = 'app';
  }, []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  const startSignup = useCallback(() => {
    setShowSignup(true);
  }, []);

  if (hash === '#app') return <AppShell />;
  if (showSignup) return <SignupFlow onComplete={enterApp} onBack={() => setShowSignup(false)} />;

  return (
    <MotionConfig reducedMotion="user">
      <div className="lp min-h-screen w-full">
        <a href="#main" className="lp-skip no-underline">Skip to content</a>
        <Rail />
        <TopBar onSignIn={() => setSignInOpen(true)} onDemo={startSignup} />
        <main id="main" tabIndex={-1} className="lg:pl-[72px] outline-none">
          <Hero onDemo={startSignup} />
          <Problem />
          <Modules />
          <Flow />
          <Clocks />
          <Field />
          <Closing onDemo={startSignup} />
        </main>
        <StatusBar onDemo={startSignup} />
        <SignInModal open={signInOpen} onClose={closeSignIn} onEnterApp={enterApp} />
      </div>
    </MotionConfig>
  );
}
