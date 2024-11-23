'use client'
import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, Star, Filter, TrendingUp, Share2, Award, Facebook, Twitter, Link, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [filterOptions, setFilterOptions] = useState({
    minFunding: 0,
    maxFunding: 100,
    hasBackers: false,
  });
  const [favorites, setFavorites] = useState(new Set());
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Sample projects data with additional fields
  const projects = [
    {
      id: 1,
      title: "DeFi Lending Protocol",
      description: "Decentralized lending platform built on Internet Computer",
      category: "DeFi",
      raised: 15.5,
      goal: 20,
      backers: 234,
      daysLeft: 12,
      image: "/api/placeholder/400/200",
      tags: ["Featured", "Trending"],
      trending_score: 95,
      verified: true
    },
    {
      id: 2,
      title: "NFT Marketplace",
      description: "First-ever NFT marketplace for Internet Computer digital collectibles",
      category: "NFT",
      raised: 8.2,
      goal: 15,
      backers: 156,
      daysLeft: 18,
      image: "/api/placeholder/400/200",
      tags: ["New"],
      trending_score: 80,
      verified: true
    },
    {
      id: 3,
      title: "GameFi Project",
      description: "Play-to-earn gaming ecosystem powered by ckBTC",
      category: "Gaming",
      raised: 25.8,
      goal: 30,
      backers: 412,
      daysLeft: 5,
      image: "/api/placeholder/400/200",
      tags: ["Popular"],
      trending_score: 88,
      verified: true
    }
  ];

  const categories = ['all', 'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Social'];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFunding = (project.raised / project.goal * 100) >= filterOptions.minFunding &&
                            (project.raised / project.goal * 100) <= filterOptions.maxFunding;
      const matchesBackers = !filterOptions.hasBackers || project.backers > 0;
      
      return matchesCategory && matchesSearch && matchesFunding && matchesBackers;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return b.trending_score - a.trending_score;
        case 'mostFunded':
          return (b.raised / b.goal) - (a.raised / a.goal);
        case 'endingSoon':
          return a.daysLeft - b.daysLeft;
        default:
          return 0;
      }
    });

  // Featured projects section
  const featuredProjects = projects.filter(project => project.tags.includes('Featured'));

  // Handle favorite toggle
  const toggleFavorite = (projectId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(projectId)) {
        newFavorites.delete(projectId);
      } else {
        newFavorites.add(projectId);
      }
      return newFavorites;
    });
  };

  // Handle share
  const handleShare = (project) => {
    setSelectedProject(project);
    setShowShareDialog(true);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://yourplatform.com/projects/${selectedProject.id}`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {showAlert && (
        <Alert className="fixed top-4 right-4 z-50 bg-green-100">
          <AlertDescription>Link copied to clipboard!</AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
          Start a Project
        </button>
      </div>

      {/* Featured Projects Slider */}
      {featuredProjects.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-yellow-500" />
            <h2 className="text-xl font-semibold">Featured Projects</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {featuredProjects.map((project) => (
              <div key={project.id} className="min-w-[300px] bg-white rounded-lg shadow-md p-4">
                <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-md" />
                <h3 className="mt-2 font-semibold">{project.title}</h3>
                <div className="mt-2 text-sm text-gray-600">{project.raised} ckBTC raised</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filter</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterOptions(prev => ({ ...prev, hasBackers: !prev.hasBackers }))}>
                Has Backers {filterOptions.hasBackers ? '✓' : ''}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterOptions(prev => ({ ...prev, minFunding: 50 }))}>
                50%+ Funded
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterOptions({ minFunding: 0, maxFunding: 100, hasBackers: false })}>
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <TrendingUp size={20} />
              <span>Sort</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('trending')}>Trending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('mostFunded')}>Most Funded</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('endingSoon')}>Ending Soon</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all transform hover:scale-105 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {project.title}
                    {project.verified && (
                      <span className="text-blue-500 text-sm bg-blue-50 px-2 py-1 rounded-full">Verified</span>
                    )}
                  </CardTitle>
                  <div className="flex gap-2 mt-1">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => toggleFavorite(project.id)}
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  <Star size={20} fill={favorites.has(project.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <CardDescription className="text-gray-600">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{(project.raised / project.goal * 100).toFixed(1)}% funded</span>
                    <span>{project.raised} ckBTC raised</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(project.raised / project.goal * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{project.backers} backers</span>
                  <span>{project.daysLeft} days left</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <button className="flex-1 flex justify-center items-center gap-2 py-2 text-blue-600 hover:text-blue-700 font-medium">
                View Project <ArrowUpRight size={16} />
              </button>
              <button 
                onClick={() => handleShare(project)}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <Share2 size={16} />
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-center gap-4">
              <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                <Facebook size={20} />
              </button>
              <button className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500">
                <Twitter size={20} />
              </button>
              <button 
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={copyToClipboard}
              >
                <Link size={20} />
              </button>
            </div>
            <input
              type="text"
              value={selectedProject ? `https://yourplatform.com/projects/${selectedProject.id}` : ''}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;