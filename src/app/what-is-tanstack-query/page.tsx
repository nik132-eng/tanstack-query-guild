"use client";

export default function WhatIsTanStackQueryPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">
          What is TanStack Query?
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A powerful asynchronous state management library for TypeScript/JavaScript
          that makes fetching, caching, and updating server state a breeze.
        </p>
      </div>

      {/* Logo and Version */}
      <div className="flex justify-center mb-8">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
          TanStack Query v5 (formerly React Query)
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">✨ Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "🔄",
              title: "Automatic Caching",
              description: "Data is cached and shared across components automatically"
            },
            {
              icon: "🔁",
              title: "Background Refetching",
              description: "Data stays fresh with smart refetching strategies"
            },
            {
              icon: "⚡",
              title: "Request Deduplication",
              description: "Multiple identical requests become a single request"
            },
            {
              icon: "📄",
              title: "Pagination & Infinite Scroll",
              description: "Built-in support for complex data loading patterns"
            },
            {
              icon: "🔄",
              title: "Smart Retry Logic",
              description: "Automatic retry with exponential backoff on failure"
            },
            {
              icon: "✏️",
              title: "Mutations",
              description: "Create, update, delete with automatic cache updates"
            },
            {
              icon: "🎯",
              title: "Optimistic Updates",
              description: "Update UI before server confirms for snappy UX"
            },
            {
              icon: "🛠️",
              title: "DevTools",
              description: "Powerful debugging tools included out of the box"
            }
          ].map((feature) => (
            <div 
              key={feature.title} 
              className="bg-white border rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="font-bold mt-3 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Use TanStack Query */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">🤔 Why Use TanStack Query?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Without TanStack Query */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-red-800 mb-3">❌ Without TanStack Query</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Manual loading/error/success states (3+ useState calls)",
                "Race conditions with useEffect",
                "No automatic caching",
                "Manual request deduplication",
                "No background refetching",
                "Manual retry logic implementation",
                "Complex pagination handling",
                "No request cancellation"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With TanStack Query */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-green-800 mb-3">✅ With TanStack Query</h3>
            <ul className="space-y-2 text-sm">
              {[
                "All states managed automatically",
                "No race conditions - handled internally",
                "Intelligent caching out of the box",
                "Automatic request deduplication",
                "Smart background refetching",
                "Built-in retry with exponential backoff",
                "useInfiniteQuery for pagination",
                "Automatic request cancellation"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Platform Support */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          🌍 Not Just React! Multi-Framework Support
        </h2>
        <p className="text-center text-blue-100 mb-6">
          TanStack Query supports multiple frontend frameworks with the same powerful features
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "React", package: "@tanstack/react-query", emoji: "⚛️" },
            { name: "Vue", package: "@tanstack/vue-query", emoji: "💚" },
            { name: "Solid", package: "@tanstack/solid-query", emoji: "💙" },
            { name: "Svelte", package: "@tanstack/svelte-query", emoji: "🧡" },
            { name: "Angular", package: "@tanstack/angular-query", emoji: "🅰️" }
          ].map((framework) => (
            <div key={framework.name} className="bg-white/10 rounded-lg p-4 text-center">
              <span className="text-2xl">{framework.emoji}</span>
              <p className="font-bold mt-2">{framework.name}</p>
              <p className="text-xs text-blue-200 font-mono">{framework.package}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Setup */}
      <div className="bg-gray-900 text-white rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">🚀 Quick Setup</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 mb-2">1. Install the package:</p>
            <code className="bg-gray-800 px-4 py-2 rounded block">
              npm install @tanstack/react-query
            </code>
          </div>
          <div>
            <p className="text-gray-400 mb-2">2. Wrap your app with QueryClientProvider:</p>
            <pre className="bg-gray-800 px-4 py-3 rounded text-sm overflow-x-auto">
{`import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}`}
            </pre>
          </div>
          <div>
            <p className="text-gray-400 mb-2">3. Use in your components:</p>
            <pre className="bg-gray-800 px-4 py-3 rounded text-sm overflow-x-auto">
{`const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});`}
            </pre>
          </div>
        </div>
      </div>

      {/* DevTools Teaser */}
      <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">🔧 DevTools</h2>
        <p className="text-gray-700 mb-4">
          TanStack Query comes with powerful DevTools to inspect your queries, their state,
          cache, and more. Look for the floating icon in the bottom corner of this app!
        </p>
        <div className="flex gap-4 flex-wrap">
          <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
            View all queries
          </span>
          <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
            Inspect cache data
          </span>
          <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
            Trigger refetches
          </span>
          <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
            See query states
          </span>
        </div>
      </div>
    </div>
  );
}
