"use client";

import { useState } from "react";

export default function QueryKeysPage() {
  const [activeTab, setActiveTab] = useState<"basics" | "factory" | "invalidation">("basics");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Query Keys Best Practices
        </h1>
        <p className="text-lg text-gray-600">
          Query keys are the backbone of TanStack Query. They determine caching,
          invalidation, and data sharing across your application.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: "basics", label: "📚 Basics" },
          { id: "factory", label: "🏭 Factory Pattern" },
          { id: "invalidation", label: "🔄 Smart Invalidation" }
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

      {/* Basics Tab */}
      {activeTab === "basics" && (
        <div className="space-y-8">
          {/* Rules */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">📋 Query Key Rules</h2>
            <div className="space-y-4">
              {[
                {
                  rule: "Keys must be arrays",
                  good: "['posts']",
                  bad: "'posts'",
                  explanation: "Always use arrays, even for single values"
                },
                {
                  rule: "Order matters for specificity",
                  good: "['posts', 'list'] → ['posts', 'detail', id]",
                  bad: "['list', 'posts']",
                  explanation: "Broad to specific, enables partial invalidation"
                },
                {
                  rule: "Include all dependencies",
                  good: "['posts', { category, page, limit }]",
                  bad: "['posts'] // missing filters",
                  explanation: "Query will auto-update when dependencies change"
                },
                {
                  rule: "Objects are compared by value",
                  good: "['posts', { a: 1 }] === ['posts', { a: 1 }]",
                  bad: "Thinking objects need same reference",
                  explanation: "TanStack Query uses deep comparison"
                }
              ].map((item) => (
                <div key={item.rule} className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{item.rule}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded">
                      <span className="text-green-600 text-sm font-medium">✅ Good:</span>
                      <code className="block mt-1 text-sm font-mono">{item.good}</code>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <span className="text-red-600 text-sm font-medium">❌ Avoid:</span>
                      <code className="block mt-1 text-sm font-mono">{item.bad}</code>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">💡 {item.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Structure Examples */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">📝 Query Key Structure Examples</h2>
            <pre className="text-sm overflow-x-auto">
{`// Simple key
['todos']

// With identifier
['todos', todoId]

// With filters object
['todos', { status: 'active', sortBy: 'date' }]

// Nested structure (recommended)
['users', userId, 'posts']
['users', userId, 'posts', postId]
['users', userId, 'posts', postId, 'comments']

// For search
['posts', 'search', searchTerm]

// For pagination
['posts', 'list', { page: 1, limit: 10 }]

// For infinite query
['comments', 'infinite']`}
            </pre>
          </div>
        </div>
      )}

      {/* Factory Pattern Tab */}
      {activeTab === "factory" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">🏭 Query Key Factory Pattern</h2>
            <p className="text-purple-100">
              The recommended approach for managing query keys in large applications.
              Centralize all query keys in one place for consistency and type safety.
            </p>
          </div>

          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-green-400">
              📁 lib/query-keys.ts
            </h3>
            <pre className="text-sm overflow-x-auto">
{`// Query Key Factory Pattern
export const queryKeys = {
  // Posts domain
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: { category?: string; page?: number }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    search: (term: string) => [...queryKeys.posts.all, 'search', term] as const,
  },

  // Comments domain
  comments: {
    all: ['comments'] as const,
    infinite: () => [...queryKeys.comments.all, 'infinite'] as const,
    byPost: (postId: string) => [...queryKeys.comments.all, 'post', postId] as const,
  },

  // Users domain
  users: {
    all: ['users'] as const,
    detail: (id: string) => [...queryKeys.users.all, id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },
} as const;`}
            </pre>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-green-600">✅ Usage in Components</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import { queryKeys } from '@/lib/query-keys';

// In useQuery
const { data } = useQuery({
  queryKey: queryKeys.posts.list({ category: 'tech' }),
  queryFn: () => fetchPosts('tech'),
});

// In useInfiniteQuery
const { data } = useInfiniteQuery({
  queryKey: queryKeys.comments.infinite(),
  queryFn: fetchComments,
});`}
              </pre>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-bold text-lg mb-3 text-blue-600">🎯 Benefits</h3>
              <ul className="space-y-2">
                {[
                  "Single source of truth for all query keys",
                  "TypeScript autocomplete and type safety",
                  "Easy to refactor and update",
                  "Consistent key structure across the app",
                  "Clearer invalidation patterns",
                  "Easier testing and debugging"
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="text-blue-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Invalidation Tab */}
      {activeTab === "invalidation" && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2 text-amber-800">
              🔄 Understanding Query Invalidation
            </h2>
            <p className="text-gray-700">
              Invalidation marks queries as stale, triggering a refetch. The power lies
              in partial matching - invalidate broad or specific queries as needed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Visual Hierarchy */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">🌳 Query Key Hierarchy</h3>
              <div className="font-mono text-sm space-y-1">
                <div className="text-gray-600">{`['posts']`}</div>
                <div className="pl-4 border-l-2 border-blue-300">
                  <div className="text-gray-600">{`['posts', 'list']`}</div>
                  <div className="pl-4 border-l-2 border-green-300">
                    <div className="text-green-600">{`['posts', 'list', { category: 'tech' }]`}</div>
                    <div className="text-green-600">{`['posts', 'list', { category: 'design' }]`}</div>
                  </div>
                </div>
                <div className="pl-4 border-l-2 border-blue-300">
                  <div className="text-gray-600">{`['posts', 'detail']`}</div>
                  <div className="pl-4 border-l-2 border-purple-300">
                    <div className="text-purple-600">{`['posts', 'detail', '123']`}</div>
                    <div className="text-purple-600">{`['posts', 'detail', '456']`}</div>
                  </div>
                </div>
                <div className="pl-4 border-l-2 border-blue-300">
                  <div className="text-orange-600">{`['posts', 'search', 'react']`}</div>
                </div>
              </div>
            </div>

            {/* Invalidation Scenarios */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-bold text-lg mb-4">📋 Invalidation Scenarios</h3>
              <div className="space-y-4">
                {[
                  {
                    action: "New post created",
                    code: "invalidateQueries({ queryKey: queryKeys.posts.lists() })",
                    effect: "All list queries refetch"
                  },
                  {
                    action: "Post updated",
                    code: "invalidateQueries({ queryKey: queryKeys.posts.detail(id) })",
                    effect: "Only that post refetches"
                  },
                  {
                    action: "Post deleted",
                    code: "invalidateQueries({ queryKey: queryKeys.posts.all })",
                    effect: "All post queries refetch"
                  }
                ].map((scenario) => (
                  <div key={scenario.action} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{scenario.action}</p>
                    <code className="text-xs block mt-1 text-blue-600 bg-blue-50 p-2 rounded">
                      {scenario.code}
                    </code>
                    <p className="text-sm text-gray-600 mt-1">→ {scenario.effect}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">💻 Invalidation in Mutations</h3>
            <pre className="text-sm overflow-x-auto">
{`import { queryKeys } from '@/lib/query-keys';

const createPostMutation = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    // Invalidate all list queries - they'll refetch
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.lists()
    });
  },
});

const updatePostMutation = useMutation({
  mutationFn: updatePost,
  onSuccess: (data, variables) => {
    // Invalidate specific post detail
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.detail(variables.id)
    });
    // Also invalidate lists since content changed
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.lists()
    });
  },
});

const deletePostMutation = useMutation({
  mutationFn: deletePost,
  onSuccess: () => {
    // Nuclear option - invalidate everything posts-related
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.all
    });
  },
});`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
