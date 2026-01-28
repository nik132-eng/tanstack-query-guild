"use client";

import { useState } from "react";
import InfiniteComments from "../infinite-query/InfiniteComments";

export default function MutationsPage() {
  const [activeTab, setActiveTab] = useState<"concepts" | "demo" | "optimistic">("concepts");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Mutations & Optimistic Updates
        </h1>
        <p className="text-lg text-gray-600">
          Learn how to create, update, and delete data using useMutation with proper
          cache management and optimistic updates.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { id: "concepts", label: "📚 Concepts" },
          { id: "demo", label: "🎮 Live Demo" },
          { id: "optimistic", label: "⚡ Optimistic Updates" }
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
          {/* useMutation Basics */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              ✏️ useMutation Hook
            </h2>
            <p className="text-gray-700 mb-4">
              Use <code className="bg-blue-100 px-1 rounded">useMutation</code> for any
              server-side modifications: POST, PUT, PATCH, DELETE requests.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Options */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold mb-3">Key Options</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { name: "mutationFn", desc: "Async function that performs the mutation" },
                    { name: "onMutate", desc: "Before mutation - for optimistic updates" },
                    { name: "onSuccess", desc: "On success - update cache, show toast" },
                    { name: "onError", desc: "On error - rollback, show error" },
                    { name: "onSettled", desc: "After success OR error - cleanup" }
                  ].map((opt) => (
                    <li key={opt.name}>
                      <code className="text-blue-600">{opt.name}</code>: {opt.desc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Returns */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-bold mb-3">Returns</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { name: "mutate", desc: "Trigger the mutation (fire & forget)" },
                    { name: "mutateAsync", desc: "Trigger with Promise (await result)" },
                    { name: "isPending", desc: "Loading state" },
                    { name: "isError", desc: "Error state" },
                    { name: "error", desc: "Error object if failed" },
                    { name: "reset", desc: "Reset mutation state" }
                  ].map((ret) => (
                    <li key={ret.name}>
                      <code className="text-green-600">{ret.name}</code>: {ret.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Mutation Lifecycle */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📊 Mutation Lifecycle</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {[
                { name: "onMutate", desc: "Prepare / Optimistic", color: "amber" },
                { name: "mutationFn", desc: "Server Request", color: "blue" },
                { name: "onSuccess", desc: "Success Handler", color: "green" },
                { name: "onError", desc: "Error Handler", color: "red" },
                { name: "onSettled", desc: "Cleanup", color: "purple" }
              ].map((step, index) => (
                <div key={step.name} className="flex items-center">
                  <div className={`bg-${step.color}-500 p-4 rounded-lg text-center min-w-[120px]`}>
                    <p className="font-bold text-sm">{step.name}</p>
                    <p className="text-xs opacity-80">{step.desc}</p>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block text-gray-500 mx-2">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cache Update Strategies */}
          <div>
            <h2 className="text-2xl font-bold mb-4">🔄 Cache Update Strategies</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Invalidation */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-blue-500 text-white p-3">
                  <h3 className="font-bold">1. Invalidation</h3>
                  <p className="text-xs opacity-80">Simple but extra request</p>
                </div>
                <div className="p-4 text-sm">
                  <p className="text-gray-600 mb-3">
                    Mark queries as stale → auto-refetch
                  </p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`onSuccess: () => {
  queryClient.invalidateQueries({
    queryKey: ['posts']
  });
}`}
                  </pre>
                  <div className="mt-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ✅ Simple
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded ml-1">
                      ⚠️ Extra Request
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Update */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-purple-500 text-white p-3">
                  <h3 className="font-bold">2. Direct Cache Update</h3>
                  <p className="text-xs opacity-80">No extra request</p>
                </div>
                <div className="p-4 text-sm">
                  <p className="text-gray-600 mb-3">
                    Manually update cache with server response
                  </p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`onSuccess: (newPost) => {
  queryClient.setQueryData(
    ['posts'],
    (old) => [...old, newPost]
  );
}`}
                  </pre>
                  <div className="mt-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ✅ No Request
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded ml-1">
                      ⚠️ More Code
                    </span>
                  </div>
                </div>
              </div>

              {/* Optimistic */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3">
                  <h3 className="font-bold">3. Optimistic Update</h3>
                  <p className="text-xs opacity-80">Best UX, with rollback</p>
                </div>
                <div className="p-4 text-sm">
                  <p className="text-gray-600 mb-3">
                    Update UI before server confirms
                  </p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`onMutate: (newPost) => {
  // Save current state
  // Update optimistically
  return { previousData };
},
onError: (err, vars, ctx) => {
  // Rollback on error
}`}
                  </pre>
                  <div className="mt-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      ✅ Best UX
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded ml-1">
                      🔧 Complex
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">💻 Basic Mutation Example</h2>
            <pre className="text-sm overflow-x-auto">
{`import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePost() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (newPost: CreatePostInput) =>
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      }).then(res => res.json()),

    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // Or update cache directly
      queryClient.setQueryData(['posts'], (old) => [...old, data]);
    },

    onError: (error) => {
      toast.error(\`Failed to create post: \${error.message}\`);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutate({ title: 'New Post', body: 'Content' });
    }}>
      <button disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
      {isError && <p>Error: {error.message}</p>}
    </form>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Demo Tab */}
      {activeTab === "demo" && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800">
              👀 <strong>Try it:</strong> Post a new comment below. The server has a 10% chance
              of returning an error to demonstrate error handling and rollback.
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <InfiniteComments />
          </div>
        </div>
      )}

      {/* Optimistic Updates Tab */}
      {activeTab === "optimistic" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">⚡ Optimistic Updates</h2>
            <p className="opacity-90">
              Update the UI immediately before the server confirms, providing instant feedback
              to users. If the server request fails, rollback to the previous state.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">📊 Optimistic Update Flow</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "onMutate: Save & Update", desc: "Save current state, update cache optimistically", color: "amber" },
                { step: 2, title: "mutationFn: Server Request", desc: "Send request to server", color: "blue" },
                { step: 3, title: "onSuccess OR onError", desc: "Confirm update OR rollback to saved state", color: "green" },
                { step: 4, title: "onSettled: Optional Refetch", desc: "Optionally invalidate to sync with server", color: "purple" }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className={`bg-${item.color}-500 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">💻 Optimistic Update Implementation</h2>
            <pre className="text-sm overflow-x-auto">
{`export function useCreateCommentOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: { text: string }) =>
      postData<{ comment: Comment }>('/api/comments', newComment),

    onMutate: async (newComment) => {
      // 1. Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments'] });

      // 2. Snapshot the previous value
      const previousData = queryClient.getQueryData(['comments']);

      // 3. Optimistically update to the new value
      queryClient.setQueryData(['comments'], (oldData: any) => {
        const optimisticComment = {
          id: 'temp-' + Date.now(),
          text: newComment.text,
          user: { name: 'You', avatar: '👤' },
          createdAt: new Date().toISOString(),
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              comments: [optimisticComment, ...oldData.pages[0].comments],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });

      // 4. Return context with previous data for rollback
      return { previousData };
    },

    onError: (err, newComment, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(['comments'], context.previousData);
      }
      toast.error('Failed to post comment');
    },

    onSettled: () => {
      // Always refetch after error or success to sync
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}`}
            </pre>
          </div>

          {/* When to Use */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-5 bg-green-50 border-green-200">
              <h3 className="font-bold text-green-800 mb-3">✅ Use Optimistic Updates When:</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Action is expected to succeed most of the time",
                  "Immediate feedback improves UX significantly",
                  "Rollback is straightforward",
                  "Adding items to a list",
                  "Toggling states (like/unlike, follow/unfollow)"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border rounded-xl p-5 bg-red-50 border-red-200">
              <h3 className="font-bold text-red-800 mb-3">❌ Avoid Optimistic Updates When:</h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Action has high failure rate",
                  "Rollback would be confusing",
                  "Complex server-side validation needed",
                  "Financial transactions",
                  "Data has complex dependencies"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
