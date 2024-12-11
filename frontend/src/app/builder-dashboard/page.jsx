'use client'
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Target, Calendar, Settings, HelpCircle,
  Bell, Search, TrendingUp, DollarSign, AlertCircle,
  ChevronDown, Wallet, Copy, ExternalLink, Download,
  Filter, RefreshCw, CircleDollarSign, Rocket, Clock,
  ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import  ProjectCard  from '@/components/ProjectCard';
import { useAgent, useAuth, useIdentity } from '@nfid/identitykit/react';
import { idlFactory } from '@/declarations/icrc_1_ledger/icrc_1.did';
import { Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';


const projectsData = [
  { 
    id: 1, 
    title: "DeFi Infrastructure", 
    raised: 45.8, 
    goal: 100, 
    backers: 234, 
    daysLeft: 12, 
    progress: 45.8,
    category: "DeFi",
    status: "active",
    tags: ["infrastructure", "defi", "blockchain"],
    description: "Building the next generation of DeFi infrastructure on Internet Computer."
  },
  { 
    id: 2, 
    title: "NFT Marketplace", 
    raised: 28.4, 
    goal: 50, 
    backers: 156, 
    daysLeft: 8, 
    progress: 56.8,
    category: "NFT",
    status: "active",
    tags: ["nft", "marketplace", "art"],
    description: "A comprehensive NFT marketplace for digital artists and collectors."
  },
  { 
    id: 3, 
    title: "Web3 Gaming Platform", 
    raised: 89.2, 
    goal: 150, 
    backers: 445, 
    daysLeft: 15, 
    progress: 59.5,
    category: "Gaming",
    status: "active",
    tags: ["gaming", "web3", "metaverse"],
    description: "Revolutionary gaming platform built on blockchain technology."
  },
];

const fundingHistory = [
  { name: 'Jan', amount: 125 },
  { name: 'Feb', amount: 245 },
  { name: 'Mar', amount: 189 },
  { name: 'Apr', amount: 322 },
  { name: 'May', amount: 267 },
  { name: 'Jun', amount: 452 },
];


const BuilderDashboard = () => {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projects, setProjects] = useState(projectsData);
  const [filterParams, setFilterParams] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'progress'
  });
  const [showFilters, setShowFilters] = useState(false);
  const { connect, disconnect, isConnecting, user } = useAuth();
  const identity = useIdentity()


  const agent = useAgent();

  const canisterId = process.env.NEXT_PUBLIC_CKBTC_LEDGER_CANISTER_ID;

  //To Do: Check Registration Status before allowing access to the dashboard
  /*const REGISTRATION_FEE = 100; // in ckBTC
  const WHITELIST_CANISTER_ID = process.env.NEXT_PUBLIC_WHITELIST_CANISTER_ID;
  const REGISTRATION_CANISTER_ID = process.env.NEXT_PUBLIC_REGISTRATION_CANISTER_ID;

  useEffect(() => {
    if (user && identity) {
      checkAccess();
    } else {
      setIsLoading(false);
    }
  }, [user, identity]);

  const checkAccess = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check whitelist status
      const whitelistStatus = await checkWhitelistStatus();
      setIsWhitelisted(whitelistStatus);

      // Check registration status
      const registrationStatus = await checkRegistrationStatus();
      setHasRegistered(registrationStatus);

    } catch (err) {
      console.error('Error checking access:', err);
      setError('Failed to verify access status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkWhitelistStatus = async () => {
    try {
      if (!agent || !WHITELIST_CANISTER_ID) return false;

      const whitelistActor = Actor.createActor(whitelistIdlFactory, {
        agent,
        canisterId: Principal.fromText(WHITELIST_CANISTER_ID),
      });

      const status = await whitelistActor.isWhitelisted(user.principal);
      return status;
    } catch (err) {
      console.error('Error checking whitelist:', err);
      throw new Error('Failed to check whitelist status');
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      if (!agent || !REGISTRATION_CANISTER_ID) return false;

      const registrationActor = Actor.createActor(registrationIdlFactory, {
        agent,
        canisterId: Principal.fromText(REGISTRATION_CANISTER_ID),
      });

      const status = await registrationActor.hasRegistered(user.principal);
      return status;
    } catch (err) {
      console.error('Error checking registration:', err);
      throw new Error('Failed to check registration status');
    }
  };

  const handleRegistration = async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (!agent || !REGISTRATION_CANISTER_ID) {
        throw new Error('Registration service not available');
      }

      const registrationActor = Actor.createActor(registrationIdlFactory, {
        agent,
        canisterId: Principal.fromText(REGISTRATION_CANISTER_ID),
      });

      // Process registration fee payment
      await registrationActor.register({
        amount: REGISTRATION_FEE,
        from: user.principal,
      });

      // Verify registration
      const status = await checkRegistrationStatus();
      setHasRegistered(status);

    } catch (err) {
      console.error('Registration failed:', err);
      setError('Failed to process registration. Please ensure you have sufficient ckBTC balance.');
    } finally {
      setIsLoading(false);
    }
  };*/

  const connectWallet = async () => {
    try {
      setError(null);
      setIsLoading(true);

      await connect();

    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (isConnecting) return;
      
      if (!user) {
        try {
          await connect(); 

        } catch (error) {
          console.error('Error initializing:', error);
        }
    }
    };

    init();
  }, []); 

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const fetchCkBTCBalance = async () => {
    try {
      if (!agent) {
        throw new Error('Not authenticated. Please connect to proceed.');
      }
      if (!canisterId || typeof canisterId !== 'string') {
        throw new Error('Invalid Canister ID. It must be a string.');
      }
      if (!identity) {
        throw new Error('Identity is not available.');
      }

      let canisterPrincipal, userPrincipal;
      try {
        canisterPrincipal = Principal.fromText(canisterId);
      } catch (error) {
        console.error('Invalid Canister ID format:', error);
        throw new Error('Canister ID is invalid.');
      }

      userPrincipal = user?.principal;
  
      const actorInstance = Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterPrincipal,
      });
  
      const account = {
        owner: userPrincipal,
        subaccount: [], 
      };
  
      const ckbtbalance = await actorInstance.icrc1_balance_of(account);

      console.log('ckbt balance:', ckbtbalance);
      setBalance(ckbtbalance?.toString() || '0');
    } catch (err) {
      console.error('Error in fetchCkBTCBalance:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      setError(err.message || 'An error occurred while fetching the balance.');
    }
  };


  const handleDisconnect = async () => {
    try {
      setError(null);
      await disconnect();
      setBalance(null);
    } catch (err) {
      console.error('Failed to disconnect:', err);
      setError('Failed to disconnect wallet');
    }
  };

  const WalletDetails = () => (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Wallet Details</h3>
        <button onClick={() => setShowWalletDetails(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Connection Status</div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${identity ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">{identity ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">Principal ID</div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm">
              {identity ? 
                `${identity.getPrincipal().toString().slice(0, 6)}...${identity.getPrincipal().toString().slice(-4)}` :
                'Not connected'
              }
            </div>
            {identity && (
              <button 
                onClick={() => copyToClipboard(identity.getPrincipal().toString())}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">ckBTC Balance</div>
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {isLoading ? 'Loading...' : 
               error ? 'Error loading balance' :
               balance !== null ? `${balance} ckBTC` : 'N/A'}
            </div>
            <button 
              onClick={fetchCkBTCBalance}
              disabled={isLoading || !identity}
              className={`p-1 hover:bg-gray-200 rounded ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          {identity ? (
            <button 
              onClick={handleDisconnect}
              className="flex-1 bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-700"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isLoading || isConnecting}
              className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading || isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 h-4 text-red-600" />
            <AlertDescription className="text-xs text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );

  const Sidebar = () => (
    <div 
      className={`bg-white border-r h-screen fixed left-0 top-0 pt-16 transition-all duration-300 
        ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
    >
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-24 bg-white border rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
      >
        {sidebarCollapsed ? 
          <ChevronRight className="w-4 h-4 text-gray-600" /> : 
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        }
      </button>

      <div className="p-4">
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'} mb-8`}>
          <CircleDollarSign className="w-6 h-6 text-purple-600" />
          {!sidebarCollapsed && <span className="text-lg font-bold">CkBTC Fund</span>}
        </div>
        
        <div className="space-y-2">
          {[
            { icon: BarChart3, label: 'Overview', id: 'overview' },
            { icon: Rocket, label: 'My Projects', id: 'projects' },
            { icon: Users, label: 'Backers', id: 'backers' },
            { icon: Target, label: 'Goals', id: 'goals' },
            { icon: Settings, label: 'Settings', id: 'settings' },
            { icon: HelpCircle, label: 'Help', id: 'help' },
          ].map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} w-full p-2 rounded-lg text-sm
                ${activeTab === id ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
              title={sidebarCollapsed ? label : ''}
            >
              <Icon className="w-4 h-4" />
              {!sidebarCollapsed && <span>{label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectFilters = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filterParams.category}
            onChange={(e) => setFilterParams({...filterParams, category: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="DeFi">DeFi</option>
            <option value="NFT">NFT</option>
            <option value="Gaming">Gaming</option>
          </select>

          <select
            value={filterParams.status}
            onChange={(e) => setFilterParams({...filterParams, status: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filterParams.sortBy}
            onChange={(e) => setFilterParams({...filterParams, sortBy: e.target.value})}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="progress">Progress</option>
            <option value="raised">Amount Raised</option>
            <option value="backers">Backers Count</option>
            <option value="newest">Newest First</option>
          </select>

          <button 
            onClick={() => setFilterParams({category: 'all', status: 'all', sortBy: 'progress'})}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/*<h1 className="text-xl font-bold text-purple-600">Hey there,</h1>*/}
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 mr-4">
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Wallet Balance Display */}
            <div className="hidden md:flex items-center space-x-2 bg-purple-50 rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">
                {isLoading ? 'Loading...' : 
                 error ? 'Error' :
                 balance !== null ? `${balance} ckBTC` : 'Not connected'}
              </span>
              <button 
                onClick={fetchCkBTCBalance}
                disabled={isConnecting}
                className={`p-1 hover:bg-purple-100 rounded ${isLoading ? 'animate-spin' : ''}`}
              >
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </button>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              {user ? (
                <button 
                  onClick={() => setShowWalletDetails(!showWalletDetails)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-2 py-1"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {identity.getPrincipal().toString().slice(0, 6)}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-700"
                >
                  Connect Wallet
                </button>
              )}
              {showWalletDetails && <WalletDetails />}
            </div>
          </div>
        </div>
      </nav>

 <Sidebar />

      <div 
        className={`transition-all duration-300 pt-16
          ${sidebarCollapsed ? 'pl-16' : 'pl-64'} 
          ${showFilters ? 'pr-64' : 'pr-6'}`}
      >
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <DollarSign className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">452.6 ckBTC</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Rocket className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500">8 pending approval</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Backers</CardTitle>
                <Users className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,841</div>
                <p className="text-xs text-gray-500">+12.5% new backers</p>
              </CardContent>
            </Card>
          </div>

          <ProjectFilters />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Funding Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={fundingHistory}>
                        <XAxis dataKey="name" stroke="#888888" />
                        <YAxis stroke="#888888" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#9333ea" 
                          strokeWidth={2}
                          dot={{ fill: '#9333ea' }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Trending Projects</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                </button>
              </div>
              {projects
                .filter(project => 
                  (filterParams.category === 'all' || project.category === filterParams.category) &&
                  (filterParams.status === 'all' || project.status === filterParams.status)
                )
                .sort((a, b) => {
                  switch(filterParams.sortBy) {
                    case 'progress':
                      return b.progress - a.progress;
                    case 'raised':
                      return b.raised - a.raised;
                    case 'backers':
                      return b.backers - a.backers;
                    case 'newest':
                      return b.id - a.id;
                    default:
                      return 0;
                  }
                })
                .map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))
              }
            </div>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Recent Activity</CardTitle>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      Export CSV
                    </button>
                    <button className="text-sm text-purple-600 hover:text-purple-700">
                      View All
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: "Alice.icp", action: "backed", project: "DeFi Infrastructure", amount: "5.2 ckBTC", time: "2 hours ago" },
                    { user: "Bob.icp", action: "created", project: "NFT Marketplace", amount: "- ckBTC", time: "5 hours ago" },
                    { user: "Carol.icp", action: "backed", project: "Web3 Gaming Platform", amount: "2.8 ckBTC", time: "8 hours ago" },
                  ].map((activity, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors px-2 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">
                            {activity.user.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium">{activity.project}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {activity.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Sidebar */}
          <div 
            className={`fixed right-0 top-16 h-screen w-64 bg-white border-l p-6 transform transition-transform duration-300 ${
              showFilters ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">Advanced Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Funding Range
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <span>to</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Project Tags
                </label>
                <div className="space-y-2">
                  {['infrastructure', 'defi', 'nft', 'gaming', 'metaverse'].map(tag => (
                    <label key={tag} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-purple-600" />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Time Frame
                </label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>

              <button className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-700">
                Apply Filters
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuilderDashboard;