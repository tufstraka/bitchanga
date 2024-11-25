import { Lightbulb, LineChart } from 'lucide-react';

function RoleSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Bitchanga</h1>
          <p className="text-xl text-gray-600">Tell us who you are, and let&apos;s get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="group cursor-pointer">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-400">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Lightbulb className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">I&apos;m a Builder</h2>
                <p className="text-center text-gray-600">
                  Have a groundbreaking idea? Ready to bring your vision to life? Join as a builder and connect with potential investors.
                </p>
                <a href="/builder-onboarding" className="inline-block">
                  <span className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    Start Building →
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-400">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <LineChart className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">I&apos;m an Investor</h2>
                <p className="text-center text-gray-600">
                  Looking for the next big opportunity? Join as an investor to discover innovative projects and support promising founders.
                </p>
                <a href="/investor-onboarding" className="inline-block pointer-events-none opacity-50">
                  <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Start Investing → (Coming Soon)
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;