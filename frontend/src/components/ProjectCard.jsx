import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CircleDollarSign, HelpCircle, Info, Shield, ArrowRight, Check, AlertTriangle, X, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProjectCard = ({ project }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [showBackingModal, setShowBackingModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [selectedTier, setSelectedTier] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

  
    const handleInvestmentSubmit = () => {
      if (!investmentAmount && !selectedTier) return;
      setShowConfirmation(true);
    };

    const handleConfirmInvestment = async () => {
      try {
        // Simulate an API call
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Randomly succeed or fail for demo purposes
            Math.random() > 0.5 ? resolve() : reject(new Error('Insufficient funds'));
          }, 1000);
        });

        setShowConfirmation(false);
        setShowBackingModal(false);
        setShowSuccessModal(true);
        
        // Reset form
        setInvestmentAmount('');
        setSelectedTier(null);
      } catch (error) {
        setErrorMessage(error.message);
        setShowConfirmation(false);
        setShowBackingModal(false);
        setShowErrorModal(true);
      }
    };

    const handleTierSelect = (amount) => {
      setSelectedTier(amount);
      setInvestmentAmount(amount.toString());
    };

    const resetAll = () => {
      setShowSuccessModal(false);
      setShowErrorModal(false);
      setShowBackingModal(false);
      setShowConfirmation(false);
      setInvestmentAmount('');
      setSelectedTier(null);
      setErrorMessage('');
    };
  
    return (
      <>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.backers} backers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.daysLeft} days left</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                    {project.category}
                  </span>
                </div>
              </div>
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Fund Project'}
              </button>
            </div>
  
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Raised: {project.raised} ckBTC</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="text-sm text-gray-600">
                Goal: {project.goal} ckBTC
              </div>
            </div>
  
            {showDetails && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button 
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    onClick={() => setShowBackingModal(true)}
                  >
                    Back Project
                  </button>
                  <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm hover:bg-purple-50 transition-colors">
                    Share
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
  
        {(showBackingModal || showConfirmation) && (
          <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4 ">
            <div className="w-full max-w-xl my-8">
              <Card className="mx-auto">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {showConfirmation ? 'Confirm Investment' : 'Back this Project'}
                    </CardTitle>
                    <button 
                      onClick={() => {
                        setShowBackingModal(false);
                        setShowConfirmation(false);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {!showConfirmation ? (
                    <div className="space-y-6">
                      {/* Project Summary */}
                      <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <CircleDollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{project.title}</h3>
                          <p className="text-sm text-gray-600">
                            Current funding: {project.raised} of {project.goal} ckBTC ({project.progress}%)
                          </p>
                        </div>
                      </div>
  
                      {/* Investment Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Investment Amount (ckBTC)
                        </label>
                        <div className="relative">
                          <input 
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={investmentAmount}
                            onChange={(e) => {
                              setInvestmentAmount(e.target.value);
                              setSelectedTier(null);
                            }}
                            placeholder="Enter amount"
                            className="w-full border rounded-lg px-4 py-2 pr-12 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <span className="absolute right-4 top-2 text-sm text-gray-500">ckBTC</span>
                        </div>
                      </div>
  
                      {/* Investment Tiers */}
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                          <span>Suggested Tiers</span>
                          <HelpCircle className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[1, 5, 10].map((amount) => (
                            <button
                              key={amount}
                              onClick={() => handleTierSelect(amount)}
                              className={`p-3 border rounded-lg text-center transition-colors ${
                                selectedTier === amount 
                                  ? 'bg-purple-50 border-purple-300' 
                                  : 'hover:bg-purple-50 hover:border-purple-300'
                              }`}
                            >
                              <div className="font-medium">{amount} ckBTC</div>
                              <div className="text-xs text-gray-500">
                                {amount === 1 ? 'Basic' : amount === 5 ? 'Popular' : 'Premium'} Tier
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
  
                      {/* Additional Information */}
                      <Alert className="bg-blue-50 border-blue-200">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-xs text-blue-600">
                          Your investment will be locked until the project reaches its funding goal. 
                          You can withdraw your investment at any time before the goal is reached.
                        </AlertDescription>
                      </Alert>
  
                      {/* Security Notice */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4" />
                        <span>Your investment is secured by smart contracts</span>
                      </div>
  
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={() => setShowBackingModal(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleInvestmentSubmit}
                          disabled={!investmentAmount}
                          className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 ${
                            !investmentAmount 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Confirmation Summary */}
                      <div className="p-4 bg-purple-50 rounded-lg space-y-4">
                        <div className="flex items-center space-x-2 text-purple-600">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Investment Summary</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{investmentAmount} ckBTC</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Project:</span>
                            <span className="font-medium">{project.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment Tier:</span>
                            <span className="font-medium">
                              {selectedTier === 1 ? 'Basic' : selectedTier === 5 ? 'Popular' : selectedTier === 10 ? 'Premium' : 'Custom'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Warning Notice */}
                      <Alert className="bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-600">
                          Please review your investment details carefully. This action cannot be undone 
                          once the project reaches its funding goal.
                        </AlertDescription>
                      </Alert>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={() => setShowConfirmation(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button 
                          onClick={handleConfirmInvestment}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Confirm Investment</span>
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

         {/* Success Modal */}
         {showSuccessModal && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Investment Successful!</h3>
                  <p className="text-gray-600 mb-6">
                    You have successfully invested {investmentAmount} ckBTC in {project.title}.
                  </p>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-sm">#{Math.random().toString(36).substr(2, 9)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="text-green-600 font-medium">Confirmed</span>
                      </div>
                    </div>
                    <button
                      onClick={resetAll}
                      className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Error Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Investment Failed</h3>
                  <p className="text-gray-600 mb-6">
                    {errorMessage || 'There was an error processing your investment. Please try again.'}
                  </p>
                  <div className="space-y-4">
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-xs text-red-600">
                        No funds have been deducted from your account.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowErrorModal(false);
                          setShowBackingModal(true);
                        }}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RefreshCcw className="w-4 h-4" />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </>
    );
};
  
export default ProjectCard;