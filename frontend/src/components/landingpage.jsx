'use client'
import { useState, useEffect } from 'react';
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
  Check,
  PlayCircle,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const LandingPage = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (projectCount < 2481) {
        setProjectCount(prev => Math.min(prev + 47, 2481));
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [projectCount]);

  return (
    <div className="bg-gradient-to-b from-[#0F0F0F] to-black text-white min-h-screen font-inter tracking-tight">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-lg py-3' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Bitcoin className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 transition-transform group-hover:scale-110" />
              <div className="absolute -inset-2 bg-green-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
              Bitchanga
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Dashboard', 'Projects', 'Launch'].map((item) => (
              <Link
                key={item}
                href="/roleselection"
                className="relative group text-gray-300 hover:text-white transition-colors"
              >
                {item}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              {['Dashboard', 'Projects', 'Launch'].map((item) => (
                <Link
                  key={item}
                  href="/roleselection"
                  className="block py-3 text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <header className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10 animate-gradient" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center bg-white/5 backdrop-blur-xl px-3 sm:px-4 py-2 rounded-full border border-white/10 hover:border-green-500/50 transition-colors">
                <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                <span className="text-sm sm:text-base text-green-400">New Generation Funding</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                  Decentralized
                </span>
                <span className="block text-white">
                  Crowdfunding
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-green-400">
                  Reimagined
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                Launch projects with instant settlements and a global community of crypto-native backers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/roleselection">
                  <Button className="w-full sm:w-auto group bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black rounded-full px-6 sm:px-8 py-4 sm:py-6 font-semibold transition-all hover:scale-105">
                    Start Campaign
                    <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="https://www.youtube.com/watch?v=4WrnIxb5-iQ">
                <Button variant="outline" className="w-full sm:w-auto group bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black rounded-full px-6 sm:px-8 py-4 sm:py-6 font-semibold transition-all hover:scale-105">
                  <PlayCircle className="mr-2" />
                  Watch Demo
                </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-3xl -z-10" />
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-colors">
                <CardContent className="p-4 sm:p-8 space-y-4 sm:space-y-6">
                  {[
                    { 
                      label: "Active Projects",
                      value: projectCount,
                      icon: <Users className="h-5 w-5 text-green-400" />
                    },
                    { 
                      label: "Success Rate",
                      value: "94.3%",
                      icon: <ChartBar className="h-5 w-5 text-blue-400" />
                    },
                    { 
                      label: "Avg. Completion Time",
                      value: "47 days",
                      icon: <Clock className="h-5 w-5 text-purple-400" />
                    }
                  ].map((stat, index) => (
                    <div key={index} 
                      className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {stat.icon}
                        <span className="text-sm sm:text-base text-gray-300">{stat.label}</span>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-white">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <section className="py-16 sm:py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
              The Future of Crowdfunding
            </span>
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Wallet className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Connect Wallet",
                description: "Seamlessly link your Internet Computer wallet",
                gradient: "from-green-400 to-green-600"
              },
              {
                icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Global Reach",
                description: "Access a worldwide network of crypto entrepreneurs",
                gradient: "from-blue-400 to-blue-600"
              },
              {
                icon: <Lock className="h-6 w-6 sm:h-8 sm:w-8" />,
                title: "Secure & Instant",
                description: "Smart contracts ensure transparent fund transfers",
                gradient: "from-purple-400 to-purple-600"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                  style={{
                    background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
                    '--tw-gradient-from': `var(--tw-${feature.gradient.split(' ')[0]})`,
                    '--tw-gradient-to': `var(--tw-${feature.gradient.split(' ')[2]})`
                  }}
                />
                <div className="relative z-10">
                  <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-full bg-gradient-to-r ${feature.gradient} w-fit`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.15]" />
            
            <div className="relative p-6 sm:p-12 text-center">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                  Launch Your Next Big Project
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10">
                Join the decentralized crowdfunding revolution. Turn your vision into reality.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                <Button className="group bg-white hover:bg-gray-100 text-black rounded-full px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all hover:scale-105">
                  Start Campaign
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" className="group bg-white hover:bg-gray-100 text-black rounded-full px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold transition-all hover:scale-105">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-12">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3">
                <Bitcoin className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                  Bitchanga
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Decentralized crowdfunding powered by blockchain on the Internet Computer.
              </p>
            </div>
            
            {[
              { title: "Product", links: ["Features", "Roadmap", "Security"] },
              { title: "Resources", links: ["Docs", "Blog", "Community"] },
              { title: "Company", links: ["About", "Careers", "Contact"] }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-6 sm:pt-8 text-center">
            <p className="text-sm sm:text-base text-gray-500">
              © 2024 Bitchanga. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;