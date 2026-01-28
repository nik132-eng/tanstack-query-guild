"use client";

import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/fetch-utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Post } from "../api/posts/data";

function CacheDemo({ staleTime }: { staleTime: number }) {
  const { data, isLoading, isFetching, isStale, dataUpdatedAt } = useQuery({
    queryKey: ["cache-demo", staleTime],
    queryFn: () => fetchData<Post[]>("/api/posts?category=technology"),
    staleTime: staleTime,
  });

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">
          staleTime: {staleTime === Infinity ? "Infinity" : `${staleTime / 1000}s`}
        </h3>
        <div className="flex gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isStale ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
            }`}
          >
            {isStale ? "Stale" : "Fresh"}
          </span>
          {isFetching && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Fetching...
            </span>
          )}
        </div>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="text-sm text-gray-600">
          <p>Posts loaded: {data?.length}</p>
          <p className="text-xs mt-1">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

function ToggleCacheDemo() {
  const [showQuery, setShowQuery] = useState(true);

  const { data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["toggle-demo"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 500));
      return { timestamp: Date.now() };
    },
    enabled: showQuery,
    staleTime: 1000 * 60, // 1 minute
  });

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Toggle Mount/Unmount Demo</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQuery(!showQuery)}
        >
          {showQuery ? "Unmount Query" : "Mount Query"}
        </Button>
      </div>
      {showQuery && (
        <div className="p-3 bg-gray-50 rounded">
          {isFetching ? (
            <p className="text-blue-500">Fetching...</p>
          ) : (
            <div className="text-sm">
              <p>Data: {JSON.stringify(data)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {dataUpdatedAt
                  ? `Fetched at: ${new Date(dataUpdatedAt).toLocaleTimeString()}`
                  : "Not fetched yet"}
              </p>
            </div>
          )}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-3">
        💡 When staleTime is set, unmounting and remounting won&apos;t refetch if data is fresh
      </p>
    </div>
  );
}

export default function CachingPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"concepts" | "demo" | "config">("concepts");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Caching & Stale Time</h1>
        <p className="text-lg text-gray-600">
          Understanding how TanStack Query manages data freshness and caching behavior.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: "concepts", label: "📚 Concepts" },
          { id: "demo", label: "🎮 Live Demo" },
          { id: "config", label: "⚙️ Configuration" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Concepts Tab */}
      {activeTab === "concepts" && (
        <div className="space-y-8">
          {/* staleTime vs gcTime */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-green-500 rounded-xl overflow-hidden">
              <div className="bg-green-500 text-white p-4">
                <h2 className="text-xl font-bold">staleTime</h2>
                <p className="text-green-100 text-sm">How long data is considered fresh</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium">Default: 0 (immediately stale)</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Fresh data won&apos;t refetch on mount, focus, or reconnect
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Set to <code className="bg-gray-100 px-1 rounded">Infinity</code> for static data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Affects when background refetches are triggered
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-2 border-purple-500 rounded-xl overflow-hidden">
              <div className="bg-purple-500 text-white p-4">
                <h2 className="text-xl font-bold">gcTime (garbage collection)</h2>
                <p className="text-purple-100 text-sm">How long inactive data stays in cache</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium">Default: 5 minutes</p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    Starts counting when query has no observers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    After gcTime, data is garbage collected
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    Cached data can still be shown while refetching
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Query Lifecycle Timeline */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">📊 Query Data Lifecycle</h2>
            <div className="relative">
              {/* Timeline */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 h-2 bg-green-500 rounded-l-full"></div>
                <div className="flex-1 h-2 bg-amber-500"></div>
                <div className="flex-1 h-2 bg-gray-500"></div>
                <div className="flex-1 h-2 bg-red-500 rounded-r-full"></div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-400">Fresh</div>
                  <div className="text-gray-400 text-xs">Just fetched</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-400">Stale</div>
                  <div className="text-gray-400 text-xs">After staleTime</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-400">Inactive</div>
                  <div className="text-gray-400 text-xs">No observers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-400">Deleted</div>
                  <div className="text-gray-400 text-xs">After gcTime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Refetch Triggers */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              🔄 Automatic Refetch Triggers (when data is stale)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { trigger: "refetchOnMount", default: "true", description: "When component mounts" },
                { trigger: "refetchOnWindowFocus", default: "true", description: "When window regains focus" },
                { trigger: "refetchOnReconnect", default: "true", description: "When network reconnects" },
                { trigger: "refetchInterval", default: "false", description: "Poll at specified interval" }
              ].map((item) => (
                <div key={item.trigger} className="bg-white p-4 rounded-lg">
                  <code className="text-sm font-mono text-blue-600">{item.trigger}</code>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">{item.description}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.default === "true" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {item.default}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demo Tab */}
      {activeTab === "demo" && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800">
              👀 <strong>Tip:</strong> Open React Query DevTools (floating button) to see query states in real-time!
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Compare Different staleTime Values</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <CacheDemo staleTime={0} />
              <CacheDemo staleTime={1000 * 30} />
              <CacheDemo staleTime={Infinity} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => queryClient.invalidateQueries({ queryKey: ["cache-demo"] })}
                variant="outline"
              >
                Invalidate All Cache Demos
              </Button>
              <Button
                onClick={() => queryClient.refetchQueries({ queryKey: ["cache-demo"] })}
              >
                Refetch All
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Toggle Mount/Unmount Test</h2>
            <ToggleCacheDemo />
            <p className="text-sm text-gray-600 mt-3">
              When you toggle off and back on quickly, notice how cached data is shown instantly
              without a new network request if it&apos;s still fresh.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === "config" && (
        <div className="space-y-8">
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">💻 Configuration Examples</h2>
            <pre className="text-sm overflow-x-auto">
{`// Per-query configuration
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 1000 * 60 * 5,  // 5 minutes
  gcTime: 1000 * 60 * 30,    // 30 minutes
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
});

// Global defaults (in QueryClient)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,      // All queries fresh for 1 minute
      gcTime: 1000 * 60 * 10,    // Cache for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on focus globally
      retry: 3,                   // Retry failed requests 3 times
    },
  },
});`}
            </pre>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-bold mb-4">📋 Recommendations by Use Case</h2>
            <div className="space-y-4">
              {[
                {
                  useCase: "Static data (countries, categories)",
                  staleTime: "Infinity",
                  gcTime: "Infinity",
                  color: "green"
                },
                {
                  useCase: "User profile data",
                  staleTime: "1000 * 60 * 5 (5 min)",
                  gcTime: "1000 * 60 * 30 (30 min)",
                  color: "blue"
                },
                {
                  useCase: "Frequently updating data (dashboard)",
                  staleTime: "0",
                  gcTime: "1000 * 60 (1 min)",
                  color: "amber"
                },
                {
                  useCase: "Real-time data",
                  staleTime: "0 + refetchInterval",
                  gcTime: "1000 * 60 (1 min)",
                  color: "red"
                }
              ].map((rec) => (
                <div key={rec.useCase} className={`border-l-4 border-${rec.color}-500 pl-4 py-2`}>
                  <p className="font-medium">{rec.useCase}</p>
                  <p className="text-sm text-gray-600">
                    staleTime: <code className="bg-gray-100 px-1 rounded">{rec.staleTime}</code>
                  </p>
                  <p className="text-sm text-gray-600">
                    gcTime: <code className="bg-gray-100 px-1 rounded">{rec.gcTime}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
