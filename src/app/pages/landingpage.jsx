"use client"
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
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const LandingPage = () => {
  const [btcPrice, setBtcPrice] = useState("46,235.00");
  const [projectCount, setProjectCount] = useState(0);

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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Floating Nav */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-slate-900">
                ChangiaHub
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-slate-600 hover:text-orange-500 transition-colors">
                Dashboard
              </Link>
              <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors">Projects</a>
              <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors">Launch</a>
              <a href="#" className="text-slate-600 hover:text-orange-500 transition-colors">Learn</a>
              <div className="px-4 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">
                ckBTC: ${btcPrice}
              </div>
            </div>

            <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
              Connect Wallet
              <Wallet className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 mb-6">
                <Bitcoin className="h-4 w-4" />
                <span className="font-medium">Powered by ckBTC on Internet Computer</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900">
                Decentralized 
                <span className="text-orange-500"> Crowdfunding </span>
                Reimagined
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Launch your projects with the power of ckBTC. Instant settlements, 
                zero traditional banking fees, and a global community of crypto-native backers.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/roleselection">
                  <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-6">
                    Start Your Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-6">
                  Explore Projects
                </Button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">Current Projects</div>
                      <div className="text-2xl font-bold text-slate-900">{projectCount}</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">Total Value Locked</div>
                      <div className="text-2xl font-bold text-slate-900">₿ 143.27</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">Success Rate</div>
                      <div className="text-2xl font-bold text-emerald-500">94.3%</div>
                    </div>
                    
                    <div className="h-px bg-slate-100" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-slate-600">Avg. Time</div>
                        <div className="font-bold text-slate-900">14 days</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Min. Pledge</div>
                        <div className="font-bold text-slate-900">0.001 ₿</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Backers</div>
                        <div className="font-bold text-slate-900">12K+</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-slate-900">
            The Future of Crowdfunding is 
            <span className="text-orange-500"> Here</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wallet className="h-6 w-6 text-orange-500" />,
                title: "Connect Wallet",
                description: "Link your Internet Computer wallet to start backing projects with ckBTC"
              },
              {
                icon: <Globe className="h-6 w-6 text-orange-500" />,
                title: "Global Reach",
                description: "Access a worldwide network of crypto-native backers and entrepreneurs"
              },
              {
                icon: <Lock className="h-6 w-6 text-orange-500" />,
                title: "Secure & Instant",
                description: "Smart contracts ensure secure, transparent, and immediate fund transfers"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="bg-orange-50 p-4 rounded-full w-fit mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                  <div className="mt-6 flex items-center text-sm text-orange-500">
                    <span>Learn More</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-8 text-slate-900">
                Why Choose 
                <span className="text-orange-500"> ChangiaHub</span>
              </h2>
              
              <p className="text-lg text-slate-600 mb-8">
                Experience the next generation of crowdfunding with ckBTC on the Internet Computer blockchain.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Zero Traditional Fees",
                    description: "No bank processing fees or currency conversion charges"
                  },
                  {
                    title: "Smart Contract Security",
                    description: "Automated escrow and milestone-based fund releases"
                  },
                  {
                    title: "Global Instant Settlements",
                    description: "No waiting for international transfers or clearance"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-orange-50 p-2 rounded-full">
                      <Check className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-slate-900">{item.title}</h3>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <ChartBar className="h-8 w-8 text-orange-500" />,
                  value: "$24M+",
                  label: "Total Funded"
                },
                {
                  icon: <Clock className="h-8 w-8 text-orange-500" />,
                  value: "4.2 hrs",
                  label: "Avg. Fund Time"
                },
                {
                  icon: <Users className="h-8 w-8 text-orange-500" />,
                  value: "15K+",
                  label: "Active Users"
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
                  value: "94.3%",
                  label: "Success Rate"
                }
              ].map((stat, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    {stat.icon}
                    <div className="text-2xl font-bold mb-2 text-slate-900">{stat.value}</div>
                    <div className="text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Launch Your Project?
              </h2>
              
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join the future of decentralized crowdfunding. Start your campaign with ckBTC today.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6">
                  Start Your Campaign
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Schedule a Demo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <Shield className="h-5 w-5" />, text: "Smart Contract Audited" },
                  { icon: <Lock className="h-5 w-5" />, text: "Bank-Grade Security" },
                  { icon: <Clock className="h-5 w-5" />, text: "24/7 Support" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2">
                    {item.icon}
                    <span className="opacity-90">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold text-white">
                  ChangiaHub
                </span>
              </div>
              <p className="text-slate-400">
                The next generation of decentralized crowdfunding powered by ckBTC on the Internet Computer.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Integration", "Security", "Roadmap"]
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Blog", "Community"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Contact"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © 2024 ChangiaHub. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Cookie Settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;