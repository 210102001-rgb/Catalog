import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to Solvia</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Get Started</h2>
            <p className="text-gray-600">
              Start building your application by editing the pages in the `app` directory.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Documentation</h2>
            <p className="text-gray-600 mb-4">
              Check out the <a href="https://nextjs.org/docs" className="text-blue-600 hover:underline">Next.js documentation</a> to learn more.
            </p>
            <div className="space-y-2">
              <a 
                href="/login" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
