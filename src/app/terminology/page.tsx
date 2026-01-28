"use client";

import { useState } from "react";

const glossaryData = [
  {
    term: "Query",
    definition: "A declarative dependency on an asynchronous data source bound to a unique key. Queries automatically manage loading, error, and success states.",
    category: "core",
    example: "useQuery({ queryKey: ['todos'], queryFn: fetchTodos })",
  },
  {
    term: "Query Key",
    definition: "A unique identifier (array) for a query. Used for caching, invalidation, and data sharing. Keys are serialized and compared by value.",
    category: "core",
    example: "['posts', { category: 'tech', page: 1 }]",
  },
  {
    term: "Query Function",
    definition: "An async function that fetches and returns data for a query. Can be any promise-returning function (fetch, axios, etc.).",
    category: "core",
    example: "queryFn: () => fetch('/api/posts').then(r => r.json())",
  },
  {
    term: "Mutation",
    definition: "Any server-side modification operation (create, update, delete). Uses useMutation hook and provides callbacks for success/error handling.",
    category: "core",
    example: "useMutation({ mutationFn: createPost })",
  },
  {
    term: "Fresh",
    definition: "Data that is within its staleTime and won't automatically refetch. Fresh data is served from cache without network requests.",
    category: "state",
    example: "staleTime: 1000 * 60 * 5 // Fresh for 5 minutes",
  },
  {
    term: "Stale",
    definition: "Data that has exceeded its staleTime and will refetch on the next trigger (mount, focus, reconnect). Stale data is still shown while refetching.",
    category: "state",
    example: "Default staleTime is 0, meaning data is immediately stale",
  },
  {
    term: "Inactive",
    definition: "Cached data with no active observers (no mounted components using it). Inactive data remains in cache until gcTime expires.",
    category: "state",
    example: "When a component unmounts, its query becomes inactive",
  },
  {
    term: "Fetching",
    definition: "When a query is actively making a network request. Can occur during initial load or background refetch. Use isFetching to track.",
    category: "state",
    example: "if (isFetching) showRefreshingIndicator()",
  },
  {
    term: "staleTime",
    definition: "Duration (ms) that data is considered fresh. Default is 0. Set to Infinity for static data. Fresh data won't auto-refetch.",
    category: "config",
    example: "staleTime: Infinity // Never goes stale automatically",
  },
  {
    term: "gcTime",
    definition: "Garbage collection time (ms). How long inactive data stays in cache before being removed. Default is 5 minutes. Formerly called cacheTime.",
    category: "config",
    example: "gcTime: 1000 * 60 * 30 // 30 minutes",
  },
  {
    term: "Invalidation",
    definition: "Marking queries as stale, triggering a refetch on the next render or immediately if observed. Key feature for keeping data in sync after mutations.",
    category: "action",
    example: "queryClient.invalidateQueries({ queryKey: ['posts'] })",
  },
  {
    term: "Refetch",
    definition: "Manually or automatically re-executing a query's fetch function. Different from invalidation - refetch happens immediately.",
    category: "action",
    example: "refetch() // or queryClient.refetchQueries()",
  },
  {
    term: "Prefetching",
    definition: "Fetching data before it's needed (on hover, route change anticipation). Warms the cache for instant display when data is actually needed.",
    category: "action",
    example: "queryClient.prefetchQuery({ queryKey, queryFn })",
  },
  {
    term: "Optimistic Update",
    definition: "Updating the UI before server confirmation, with rollback on error. Provides instant feedback for better UX. Implemented in onMutate callback.",
    category: "pattern",
    example: "onMutate: () => { /* save state, update optimistically */ }",
  },
  {
    term: "Query Observer",
    definition: "A component subscription to a query. Multiple observers share the same cached data. Query stays active while it has at least one observer.",
    category: "internal",
    example: "Each useQuery call creates an observer",
  },
  {
    term: "Background Refetch",
    definition: "Refetching data in the background while showing stale data. Users see cached data immediately while fresh data loads. Key UX feature.",
    category: "pattern",
    example: "Shows stale data while isFetching=true in background",
  },
  {
    term: "Request Deduplication",
    definition: "Automatically combining multiple simultaneous requests for the same data into a single network request. Prevents redundant fetches.",
    category: "feature",
    example: "3 components with same queryKey = 1 network request",
  },
  {
    term: "Infinite Query",
    definition: "A query designed for paginated/infinite scroll data. Uses useInfiniteQuery with getNextPageParam. Data stored as pages array.",
    category: "hook",
    example: "useInfiniteQuery({ getNextPageParam: (lastPage) => lastPage.nextCursor })",
  },
  {
    term: "QueryClient",
    definition: "The core class that manages all queries and cache. Created once per application and provided via QueryClientProvider context.",
    category: "core",
    example: "const queryClient = new QueryClient()",
  },
  {
    term: "DevTools",
    definition: "Built-in debugging tool that shows all queries, their states, cache data, and allows manual triggering of actions like refetch and invalidate.",
    category: "tool",
    example: "<ReactQueryDevtools initialIsOpen={false} />",
  },
];

const categories = {
  core: { label: "Core Concepts", color: "blue" },
  state: { label: "Query States", color: "green" },
  config: { label: "Configuration", color: "purple" },
  action: { label: "Actions", color: "orange" },
  pattern: { label: "Patterns", color: "pink" },
  feature: { label: "Features", color: "cyan" },
  hook: { label: "Hooks", color: "indigo" },
  internal: { label: "Internals", color: "gray" },
  tool: { label: "Tools", color: "amber" },
};

export default function TerminologyPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredTerms = glossaryData
    .filter((item) => filter === "all" || item.category === filter)
    .filter(
      (item) =>
        search === "" ||
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          📖 TanStack Query Terminology Glossary
        </h1>
        <p className="text-lg text-gray-600">
          Quick reference for all TanStack Query concepts and terminology.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {Object.entries(categories).map(([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? `bg-${color}-500 text-white`
                  : `bg-${color}-100 text-${color}-800 hover:bg-${color}-200`
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="space-y-4">
        {filteredTerms.map((item) => {
          const category = categories[item.category as keyof typeof categories];
          return (
            <div
              key={item.term}
              className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{item.term}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}
                  >
                    {category.label}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{item.definition}</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <code className="text-sm font-mono text-gray-800">{item.example}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reference Card */}
      <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">⚡ Quick Reference</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-2">Main Hooks</h3>
            <ul className="text-sm space-y-1">
              <li><code>useQuery</code> - Fetch data</li>
              <li><code>useMutation</code> - Modify data</li>
              <li><code>useInfiniteQuery</code> - Pagination</li>
              <li><code>useQueryClient</code> - Access cache</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-2">Common Returns</h3>
            <ul className="text-sm space-y-1">
              <li><code>data</code> - The fetched data</li>
              <li><code>isLoading</code> - First load</li>
              <li><code>isFetching</code> - Any fetch</li>
              <li><code>isError</code> - Error occurred</li>
            </ul>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h3 className="font-bold mb-2">Key Config</h3>
            <ul className="text-sm space-y-1">
              <li><code>queryKey</code> - Unique ID</li>
              <li><code>queryFn</code> - Fetch function</li>
              <li><code>staleTime</code> - Fresh duration</li>
              <li><code>gcTime</code> - Cache duration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
