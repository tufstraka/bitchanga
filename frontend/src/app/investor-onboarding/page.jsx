"use client";

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  Target, 
  BadgeCheck, 
  Globe,
  Wallet,
  Building,
  ChevronRight
} from 'lucide-react';

const InvestorOnboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    investorType: '',
    accreditationStatus: '',
    investmentRange: '',
    preferredStages: [],
    sectors: [],
    geographicFocus: [],
    commitmentLevel: '',
    investmentFrequency: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.investorType && formData.accreditationStatus;
      case 2:
        return formData.investmentRange && formData.preferredStages.length > 0;
      case 3:
        return formData.sectors.length > 0 && formData.commitmentLevel;
      default:
        return true;
    }
  };

  const renderProgressBar = () => (
    <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">I am investing as a</label>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { id: 'individual', label: 'Individual Investor', icon: Wallet },
            { id: 'institution', label: 'Institution', icon: Building }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, investorType: id }))}
              className={`p-6 border rounded-xl text-left transition-all flex items-center space-x-4 ${
                formData.investorType === id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Accreditation Status</label>
        <div className="space-y-3">
          {[
            { id: 'accredited', label: 'Accredited Investor', description: 'I meet the SEC requirements for accredited investor status' },
            { id: 'non-accredited', label: 'Non-Accredited Investor', description: 'I do not meet accredited investor requirements' },
            { id: 'international', label: 'International Investor', description: 'I am investing from outside the United States' }
          ].map(({ id, label, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, accreditationStatus: id }))}
              className={`w-full p-4 border rounded-xl text-left transition-all ${
                formData.accreditationStatus === id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  formData.accreditationStatus === id ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Investment Range (per project)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            '< $10k',
            '$10k - $50k',
            '$50k - $250k',
            '$250k+'
          ].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, investmentRange: range }))}
              className={`p-4 border rounded-lg text-center transition-all ${
                formData.investmentRange === range 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Preferred Investment Stages</label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            'Pre-seed',
            'Seed',
            'Series A',
            'Series B',
            'Growth',
            'Late Stage'
          ].map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => handleMultiSelect('preferredStages', stage)}
              className={`p-4 border rounded-lg text-center transition-all ${
                formData.preferredStages.includes(stage)
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Investment Frequency</label>
        <select
          name="investmentFrequency"
          value={formData.investmentFrequency}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select frequency</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annually">Annually</option>
          <option value="opportunistic">Opportunistic</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Sectors of Interest</label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            'Technology',
            'Healthcare',
            'Finance',
            'Education',
            'Sustainability',
            'Consumer',
            'Enterprise',
            'Hardware',
            'AI/ML'
          ].map((sector) => (
            <button
              key={sector}
              type="button"
              onClick={() => handleMultiSelect('sectors', sector)}
              className={`p-4 border rounded-lg text-center transition-all ${
                formData.sectors.includes(sector)
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Geographic Focus</label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            'North America',
            'Europe',
            'Asia',
            'Latin America',
            'Africa',
            'Global'
          ].map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => handleMultiSelect('geographicFocus', region)}
              className={`p-4 border rounded-lg text-center transition-all ${
                formData.geographicFocus.includes(region)
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Commitment Level</label>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'passive', label: 'Passive', description: 'Financial investment only' },
            { id: 'active', label: 'Active', description: 'Occasional mentoring & networking' },
            { id: 'hands-on', label: 'Hands-on', description: 'Regular involvement & mentoring' }
          ].map(({ id, label, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, commitmentLevel: id }))}
              className={`p-4 border rounded-xl text-center transition-all ${
                formData.commitmentLevel === id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <p className="font-medium">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      icon: Briefcase,
      title: "Investor Profile",
      subtitle: "Tell us about your investor status",
      content: renderStep1()
    },
    {
      icon: Target,
      title: "Investment Preferences",
      subtitle: "Define your investment strategy",
      content: renderStep2()
    },
    {
      icon: Globe,
      title: "Focus Areas",
      subtitle: "Specify your interests and involvement",
      content: renderStep3()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Investor Profile</h1>
          <p className="mt-2 text-gray-600">Help us match you with the right opportunities</p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              {React.createElement(steps[step - 1].icon, { className: "w-6 h-6 text-blue-600" })}
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-200 text-blue-400 cursor-not-allowed'
              }`}
            >
              <span>{step === 3 ? 'Complete Profile' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Need help? Check out our <span className="text-blue-600 cursor-pointer">investor guidelines</span>
        </p>
      </div>
    </div>
  );
};

export default InvestorOnboarding;