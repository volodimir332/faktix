"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-xl">If you can see this, the basic setup works!</p>
      
      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Right Sidebar Test</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white text-black p-4 rounded">
              <h3 className="text-lg font-semibold">Main Content</h3>
              <p>This is the main content area.</p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test Sidebar</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-start px-4 py-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <span className="text-sm font-medium">Test Button 1</span>
                </button>
                <button className="w-full flex items-center justify-start px-4 py-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors">
                  <span className="text-sm font-medium">Test Button 2</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 