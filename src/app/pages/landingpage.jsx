"use client"
import React, { useState, useEffect } from 'react';
import { 
  Bitcoin, 
  Shield, 
  TrendingUp, 
  ChevronRight, 
  Globe, 
  Lock, 
  Wallet,
  ArrowRight,
  Clock,
  Users,
  ChartBar,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import  Link  from 'next/link';

const LandingPage = () => {
  const [btcPrice, setBtcPrice] = useState("46,235.00");
  const [projectCount, setProjectCount] = useState(0);

  // Animate project count on load
  useEffect(() => {
    const timer = setInterval(() => {
      if (projectCount < 2481) {
        setProjectCount(prev => prev + 47);
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Floating Nav */}
      <nav className="fixed w-full bg-black/30 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                ChangiaHub
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-gray-300 hover:text-yellow-500 transition-colors">
            Dashboard
            </Link>           
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">Projects</a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">Launch</a>
              <a href="#" className="text-gray-300 hover:text-yellow-500 transition-colors">Learn</a>
              <div className="px-4 py-1 rounded-full bg-gray-800 text-yellow-500">
                ckBTC: ${btcPrice}
              </div>
            </div>
            <div className="space-x-4">
              <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                Connect Wallet
                <Wallet className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,199,0,0.1),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
                <Bitcoin className="h-4 w-4" />
                <span>Powered by ckBTC on Internet Computer</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Decentralized 
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"> Crowdfunding </span>
                Reimagined
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Launch your projects with the power of ckBTC. Instant settlements, 
                zero traditional banking fees, and a global community of crypto-native backers.
              </p>
              <div className="space-x-4">
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400 text-lg px-8 py-6">
                  Start Your Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-lg text-black px-8 py-6">
                  Explore Projects
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="border-2 border-yellow-500/20 bg-black/40 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Current Projects</div>
                      <div className="text-2xl font-bold">{projectCount}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Total Value Locked</div>
                      <div className="text-2xl font-bold">₿ 143.27</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Success Rate</div>
                      <div className="text-2xl font-bold text-green-500">94.3%</div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-400">Avg. Time</div>
                        <div className="font-bold">14 days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Min. Pledge</div>
                        <div className="font-bold">0.001 ₿</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Backers</div>
                        <div className="font-bold">12K+</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            The Future of Crowdfunding is 
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"> Here</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:border-yellow-500/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-yellow-500/10 p-4 rounded-full w-fit mb-6">
                  <Wallet className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Connect Wallet</h3>
                <p className="text-gray-400">Link your Internet Computer wallet to start backing projects with ckBTC</p>
                <div className="mt-6 flex items-center text-sm text-yellow-500">
                  <span>Get Started</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:border-yellow-500/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-yellow-500/10 p-4 rounded-full w-fit mb-6">
                  <Globe className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Global Reach</h3>
                <p className="text-gray-400">Access a worldwide network of crypto-native backers and entrepreneurs</p>
                <div className="mt-6 flex items-center text-sm text-yellow-500">
                  <span>Explore Network</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border border-white/10 backdrop-blur-lg hover:border-yellow-500/50 transition-all duration-300">
              <CardContent className="p-8">
                <div className="bg-yellow-500/10 p-4 rounded-full w-fit mb-6">
                  <Lock className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Secure & Instant</h3>
                <p className="text-gray-400">Smart contracts ensure secure, transparent, and immediate fund transfers</p>
                <div className="mt-6 flex items-center text-sm text-yellow-500">
                  <span>Learn More</span>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Choose 
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent"> ChangiaHub</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the next generation of crowdfunding with ckBTC on the Internet Computer blockchain.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Zero Traditional Fees</h3>
                    <p className="text-gray-400">No bank processing fees or currency conversion charges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Smart Contract Security</h3>
                    <p className="text-gray-400">Automated escrow and milestone-based fund releases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500/10 p-2 rounded-full">
                    <Check className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Global Instant Settlements</h3>
                    <p className="text-gray-400">No waiting for international transfers or clearance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-black/40 border border-white/10">
                <CardContent className="p-6">
                  <ChartBar className="h-8 w-8 text-yellow-500 mb-4" />
                  <div className="text-2xl font-bold mb-2">$24M+</div>
                  <div className="text-gray-400">Total Funded</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border border-white/10">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-yellow-500 mb-4" />
                  <div className="text-2xl font-bold mb-2">4.2 hrs</div>
                  <div className="text-gray-400">Avg. Fund Time</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border border-white/10">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-yellow-500 mb-4" />
                  <div className="text-2xl font-bold mb-2">15K+</div>
                  <div className="text-gray-400">Active Users</div>
                </CardContent>
              </Card>
              <Card className="bg-black/40 border border-white/10">
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-yellow-500 mb-4" />
                  <div className="text-2xl font-bold mb-2">94.3%</div>
                  <div className="text-gray-400">Success Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
            {/* CTA Section */}
            <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="border-2 border-yellow-500/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Launch Your Project?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the future of decentralized crowdfunding. Start your campaign with ckBTC today.
              </p>
              <div className="space-x-4">
                <Button className="bg-yellow-500 text-black hover:bg-yellow-400 text-lg px-8 py-6">
                  Start Your Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white/20 hover:bg-white/10 text-lg px-8 py-6">
                  Schedule a Demo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">Smart Contract Audited</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Lock className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">Bank-Grade Security</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">24/7 Support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Bitcoin className="h-8 w-8 text-yellow-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                  ChangiaHub
                </span>
              </div>
              <p className="text-gray-400">
                The next generation of decentralized crowdfunding powered by ckBTC on the Internet Computer.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Features</a></li>
                <li><a href="#" className="hover:text-yellow-500">Integration</a></li>
                <li><a href="#" className="hover:text-yellow-500">Security</a></li>
                <li><a href="#" className="hover:text-yellow-500">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">Documentation</a></li>
                <li><a href="#" className="hover:text-yellow-500">API Reference</a></li>
                <li><a href="#" className="hover:text-yellow-500">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-500">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-500">About</a></li>
                <li><a href="#" className="hover:text-yellow-500">Careers</a></li>
                <li><a href="#" className="hover:text-yellow-500">Press Kit</a></li>
                <li><a href="#" className="hover:text-yellow-500">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400">
                © 2024 ChangiaHub. All rights reserved.
              </div>
              <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-yellow-500">Privacy Policy</a>
                <a href="#" className="hover:text-yellow-500">Terms of Service</a>
                <a href="#" className="hover:text-yellow-500">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;