"use client";
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Rocket, Target, Coins, Upload } from 'lucide-react';

const BuilderOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    targetAmount: '',
    pitch: '',
    timeline: '3',
    teamSize: '1',
    stage: 'concept'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.projectName && formData.category;
      case 2:
        return formData.targetAmount && formData.timeline;
      case 3:
        return formData.pitch.length >= 100;
      default:
        return true;
    }
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
      <div 
        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your project name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          <option value="tech">Technology</option>
          <option value="sustainability">Sustainability</option>
          <option value="health">Healthcare</option>
          <option value="education">Education</option>
          <option value="finance">Finance</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project Stage</label>
        <div className="grid grid-cols-3 gap-4">
          {['concept', 'prototype', 'launched'].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, stage }))}
              className={`p-4 border rounded-lg text-center transition-all ${
                formData.stage === stage 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <span className="capitalize">{stage}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Funding Target</label>
        <div className="relative">
          <span className="absolute left-4 top-2 text-gray-500">$</span>
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleInputChange}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter target amount"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Timeline (months)</label>
        <input
          type="range"
          name="timeline"
          min="1"
          max="24"
          value={formData.timeline}
          onChange={handleInputChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formData.timeline} months</span>
          <span>24 months</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Team Size</label>
        <div className="flex space-x-4">
          {[1, '2-5', '6-10', '10+'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, teamSize: size }))}
              className={`px-4 py-2 border rounded-lg transition-all ${
                formData.teamSize === size 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project Pitch</label>
        <textarea
          name="pitch"
          value={formData.pitch}
          onChange={handleInputChange}
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Describe your project, its unique value proposition, and why investors should be excited about it..."
        />
        <p className="text-sm text-gray-500">
          {formData.pitch.length}/500 characters (minimum 100)
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Upload Pitch Deck (Optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your pitch deck here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            PDF, PPT, or PPTX up to 10MB
          </p>
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      icon: Building2,
      title: "Project Basics",
      subtitle: "Let's start with the fundamentals",
      content: renderStep1()
    },
    {
      icon: Target,
      title: "Funding Details",
      subtitle: "Set your funding goals and timeline",
      content: renderStep2()
    },
    {
      icon: Rocket,
      title: "Project Pitch",
      subtitle: "Tell investors about your vision",
      content: renderStep3()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Project</h1>
          <p className="mt-2 text-gray-600">Complete your project profile to connect with investors</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              {React.createElement(steps[step - 1].icon, { className: "w-6 h-6 text-purple-600" })}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{steps[step - 1].title}</h2>
              <p className="text-gray-600">{steps[step - 1].subtitle}</p>
            </div>
          </div>

          {/* Step Content */}
          {steps[step - 1].content}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                step === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => step === 3 ? console.log('Submit:', formData) : setStep(s => s + 1)}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg ${
                isStepValid()
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-200 text-purple-400 cursor-not-allowed'
              }`}
            >
              <span>{step === 3 ? 'Submit' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Need help? Check out our <span className="text-purple-600 cursor-pointer">guide for builders</span>
        </p>
      </div>
    </div>
  );
};

export default BuilderOnboarding;