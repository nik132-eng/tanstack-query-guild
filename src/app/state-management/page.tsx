"use client";

export default function StateManagementPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          React State Management Context
        </h1>
        <p className="text-lg text-gray-600">
          Understanding the difference between Client State and Server State is
          crucial for choosing the right tools.
        </p>
      </div>

      {/* Comparison Diagram */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Client State */}
        <div className="border-2 border-blue-500 rounded-xl overflow-hidden">
          <div className="bg-blue-500 text-white p-4">
            <h2 className="text-2xl font-bold">🖥️ Client State</h2>
            <p className="text-blue-100">UI state that lives in the browser</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Characteristics:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Synchronous and predictable</li>
                <li>Only the app knows about it</li>
                <li>Fully controlled by the client</li>
                <li>No network involved</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Examples:</h3>
              <div className="flex flex-wrap gap-2">
                {["Modal open/close", "Form inputs", "Theme preference", "Active tab", "Sidebar collapsed"].map((item) => (
                  <span key={item} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Recommended Tools:</h3>
              <div className="flex flex-wrap gap-2">
                {["useState", "useReducer", "Zustand", "Jotai", "Context API"].map((tool) => (
                  <span key={tool} className="bg-gray-200 px-3 py-1 rounded text-sm font-mono">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Server State */}
        <div className="border-2 border-green-500 rounded-xl overflow-hidden">
          <div className="bg-green-500 text-white p-4">
            <h2 className="text-2xl font-bold">🌐 Server State</h2>
            <p className="text-green-100">Data from external sources (APIs)</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Characteristics:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Asynchronous by nature</li>
                <li>Shared between client and server</li>
                <li>Can become stale/outdated</li>
                <li>Needs caching, deduplication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Examples:</h3>
              <div className="flex flex-wrap gap-2">
                {["User profile", "Products list", "Comments", "Search results", "Dashboard data"].map((item) => (
                  <span key={item} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Recommended Tools:</h3>
              <div className="flex flex-wrap gap-2">
                {["TanStack Query", "SWR", "RTK Query", "Apollo Client"].map((tool) => (
                  <span key={tool} className="bg-gray-200 px-3 py-1 rounded text-sm font-mono">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Server State Challenges */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-800">
          ⚠️ Server State Challenges
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "📦",
              title: "Caching",
              description: "How long to keep data? When to refetch?"
            },
            {
              icon: "🔄",
              title: "Deduplication",
              description: "Multiple components requesting same data"
            },
            {
              icon: "🕐",
              title: "Stale Data",
              description: "Data becomes outdated over time"
            },
            {
              icon: "🔌",
              title: "Network Failures",
              description: "Handle errors, retries, offline mode"
            },
            {
              icon: "📄",
              title: "Pagination",
              description: "Loading data in chunks efficiently"
            },
            {
              icon: "🔃",
              title: "Background Updates",
              description: "Keep data fresh without blocking UI"
            },
            {
              icon: "⚡",
              title: "Optimistic Updates",
              description: "Update UI before server confirms"
            },
            {
              icon: "🗑️",
              title: "Garbage Collection",
              description: "Clean up unused cache data"
            }
          ].map((challenge) => (
            <div key={challenge.title} className="bg-white p-4 rounded-lg shadow-sm">
              <span className="text-2xl">{challenge.icon}</span>
              <h3 className="font-semibold mt-2">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🎯 Key Takeaway</h2>
        <div className="space-y-3 text-lg">
          <p>
            <strong>Don&apos;t use Redux/Zustand for server state!</strong>
          </p>
          <p>
            These are client-state tools. For server state, use tools specifically
            designed for it like <strong>TanStack Query</strong>.
          </p>
          <p className="text-purple-200 italic">
            &quot;Use the right tool for the job&quot; - The best architecture separates
            client state from server state management.
          </p>
        </div>
      </div>
    </div>
  );
}
