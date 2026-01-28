# TanStack Query v5 Guild Session (50-Minute Talk)

**Total duration:** 50 minutes  
**Audience:** React developers who already use `useEffect` for data fetching  
**Goal:** Replace ad-hoc server-state handling with TanStack Query patterns  

---

## Legend (How to Read This Script)

- **Say:** What you should say (exact or close phrasing)
- **Show:** What to display on screen
- **Do:** Actions to perform (clicks, typing, toggles)
- **Ask:** Engagement prompts for the audience
- **Observe:** What to point out (DevTools, network, UI changes)

---

## Pre-Session (5 minutes before start)

### Technical Checklist

- Open React Query DevTools (floating button in app)
- Open browser Network tab (keep it visible)
- Hard refresh once (Cmd+Shift+R / Ctrl+Shift+R)
- Pre-load these routes:
  - `/`, `/state-management`, `/problems-with-use-effect`, `/basic-react-query`, `/query-keys`, `/search-query`, `/infinite-query`, `/mutations`, `/caching`, `/terminology`

### Files to Keep Open in Editor

- `src/app/problems-with-use-effect/FetchWithUseEffect.tsx`
- `src/app/problems-with-use-effect/FetchWithUseEffectFixed.tsx`
- `src/app/basic-react-query/FetchWithReactQuery.tsx`
- `src/lib/query-keys.ts`
- `src/app/infinite-query/use-comments-hooks-optimistic.ts`

---

# 0) Welcome & Overview (3 minutes)

### Say
"Welcome everyone. Today is a hands-on deep dive into TanStack Query v5. We are going to look at real problems with `useEffect`-based data fetching and how TanStack Query solves them with fewer lines of code, better caching, and better UX."

### Show
- `/` (Home page)

### Do
- Highlight the navigation cards and feature badges

### Ask
- "Quick show of hands: who has shipped a React app that fetches data with `useEffect`?"

### Observe
- Point out the core features: caching, background refetch, deduplication, optimistic updates

**Transition:** "Let's start with the root issue: client state vs server state."

---

# 1) Client State vs Server State (4 minutes)

### Say
"React apps deal with two kinds of state: client state and server state. We usually have great tools for client state, but server state is a different beast." 

### Show
- `/state-management`

### Do
- Walk through the two-column comparison

### Ask
- "When you fetch data from an API, who owns that data: your component, or the server?"

### Observe
- Highlight server-state challenges: caching, deduplication, stale data, background updates

**Key takeaway:** "Redux and Zustand are great for client state. For server state, you need a tool designed for it."

**Transition:** "Now let's see what goes wrong with the traditional approach."

---

# 2) Problems with useEffect (6 minutes)

### Say
"Most of us start with `useEffect` for fetching. It works at first, but it leads to a lot of invisible issues." 

### Show
- `/problems-with-use-effect`

### Do
- Point to the side-by-side comparison

### Problem 1: Race Conditions

**Say:** "Race conditions happen when responses return out of order."  
**Do:** Click categories quickly: Technology -> Design -> Productivity -> Technology  
**Observe:** Data may not match the active category  
**Ask:** "Has anyone seen this bug in production?" 

### Problem 2: Manual State Management

**Say:** "We manually track loading, error, and data states, which makes code noisy."  
**Show:** Buggy version has multiple `useState` calls  
**Observe:** 30+ lines just to fetch data

### Problem 3: Stale Data on Error

**Say:** "If a request fails, old data might still show, which is misleading."  
**Show:** Error handling in the buggy version  
**Observe:** You need to clear error/data manually

### Problem 4: No Caching

**Do:** Switch category -> switch back  
**Observe:** It refetches every time

**Transition:** "TanStack Query solves all of these, with fewer lines."

---

# 3) What is TanStack Query (4 minutes)

### Say
"TanStack Query is a server-state management library. It handles caching, background updates, and request deduplication for you." 

### Show
- `/what-is-tanstack-query`

### Do
- Scroll to Core Features grid

### Observe
- Highlight all 8 features, especially caching and deduplication

### Ask
- "Which of these features feels most valuable for your current project?"

**Transition:** "Let's see the simplest useQuery example."

---

# 4) Basic useQuery Example (6 minutes)

### Say
"Here is the same data fetching logic, but using `useQuery`. This is where the magic becomes obvious." 

### Show
- `/basic-react-query`

### Do
- Compare left vs right code blocks

### Observe
- Fewer lines, zero manual state
- The hook handles loading and error states

### Demo

**Do:** Open React Query DevTools  
**Do:** Switch categories  
**Observe:** New queries appear in DevTools  
**Observe:** Switching back to a category does not refetch (cached)

### Ask
- "Notice how the DevTools shows 'fresh' and 'stale'? That’s cache behavior in action."

**Transition:** "That brings us to query keys, which make caching possible."

---

# 5) Query Keys Best Practices (5 minutes)

### Say
"Query keys are the backbone of caching and invalidation. Treat them as a schema, not strings." 

### Show
- `/query-keys`

### Do
- Click "Basics" tab

### Explain the 4 rules

1. Keys must be arrays
2. Order matters
3. Include dependencies
4. Objects are compared by value

### Show
- Switch to "Factory Pattern" tab

### Say
"For large apps, use a query key factory so you have a single source of truth." 

### Show Code
- `src/lib/query-keys.ts`

### Ask
- "If you updated a post, which queries should refresh?"

### Answer (Detailed Explanation)

**Say:** "Great question! Let's think through this step by step. When you update a post, you need to consider what data might be affected."

**Show:** Point to the query key hierarchy on screen

**Explain the thinking process:**

1. **The Updated Post Detail Query**
   - **Say:** "First, obviously, the detail view of that specific post needs to refresh. If someone is viewing post ID 123, and we update it, they should see the new data."
   - **Show Code:**
     ```typescript
     queryClient.invalidateQueries({
       queryKey: queryKeys.posts.detail(postId)
     });
     ```
   - **Explain:** "This invalidates only `['posts', 'detail', '123']` - very specific."

2. **All List Queries**
   - **Say:** "But wait - if you're on a list page showing posts, and one of those posts was updated, the list might show stale data. For example, if the post title changed, the list should reflect that."
   - **Show Code:**
     ```typescript
     queryClient.invalidateQueries({
       queryKey: queryKeys.posts.lists()
     });
     ```
   - **Explain:** "This matches ALL list queries: `['posts', 'list', { category: 'tech' }]`, `['posts', 'list', { category: 'design' }]`, etc. The partial matching is powerful here."

3. **Search Queries (Maybe)**
   - **Say:** "If the post title or content changed, search results might be affected. But this depends on your use case - you might want to invalidate search queries too."
   - **Show Code (optional):**
     ```typescript
     queryClient.invalidateQueries({
       queryKey: queryKeys.posts.search(searchTerm)
     });
     ```
   - **Explain:** "This is optional - only if search results include the updated post."

**Show the Complete Solution:**

**Say:** "Here's what a real update mutation looks like:"

**Show Code:**
```typescript
const updatePostMutation = useMutation({
  mutationFn: updatePost,
  onSuccess: (data, variables) => {
    // 1. Invalidate the specific post detail
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.detail(variables.id)
    });
    
    // 2. Invalidate all list queries (title/content might have changed)
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.lists()
    });
    
    // Optional: If search includes this post
    // queryClient.invalidateQueries({
    //   queryKey: queryKeys.posts.search(...)
    // });
  },
});
```

**Key Points to Emphasize:**

1. **Hierarchical Matching**
   - **Say:** "Notice how `queryKeys.posts.lists()` matches all list queries because of the hierarchy. We don't need to invalidate each category separately."
   - **Show:** The tree structure: `['posts']` → `['posts', 'list']` → `['posts', 'list', { category }]`

2. **Specific vs Broad**
   - **Say:** "We invalidate the detail query specifically, but lists broadly. This is efficient - we only refetch what's needed."

3. **When to Invalidate Everything**
   - **Say:** "If you deleted a post, you might want to invalidate everything: `queryKeys.posts.all`. But for updates, being selective is better for performance."

**Ask Follow-up:**
- "What if you only updated the post's view count? Would you still invalidate lists?"
- **Answer:** "Probably not! If only metadata changed, you might only invalidate the detail query. Think about what actually affects each query."

### Do
- Switch to "Smart Invalidation" tab
- Point to the "Post updated" scenario
- Show the code example in the page
- Walk through the invalidation scenarios one by one

**Transition:** "Let's see how query keys help with search."

---

# 6) Debounced Search (4 minutes)

### Say
"Search inputs are expensive if you fire on every keystroke. Debounce plus `enabled` gives you control." 

### Show
- `/search-query`

### Do
- Open Network tab

### Demo

**Do:** Type slowly "react"  
**Observe:** Request only after delay  
**Do:** Type fast "typescript"  
**Observe:** Only one request  
**Do:** Search "react" again  
**Observe:** Instant results from cache

### Ask
- "Did you notice the second search didn’t hit the network? That’s caching by query key."

**Transition:** "Next, pagination with useInfiniteQuery."

---

# 7) Infinite Queries & Pagination (6 minutes)

### Say
"Pagination is where TanStack Query shines. `useInfiniteQuery` is built for this." 

### Show
- `/infinite-query`

### Do
- Point to Load More button

### Explain

- `initialPageParam` is required in v5
- `getNextPageParam` defines cursor logic

### Demo

**Do:** Click "Load More" twice  
**Observe:** New pages added  
**Observe:** DevTools shows pages array growing  
**Do:** Keep clicking until no more pages  
**Observe:** `hasNextPage` becomes false

### Ask
- "If the user scrolls back, should we refetch pages? No — they’re cached."

**Transition:** "Let’s move from reads to writes."

---

# 8) Mutations & Optimistic Updates (7 minutes)

### Say
"Mutations are for creating, updating, or deleting. The key is how you update the cache afterward." 

### Show
- `/mutations`

### Do
- Open the "Concepts" tab

### Explain 3 strategies

**Say:** "After a mutation, you need to update the cache. There are three strategies, each with trade-offs:"

1. **Invalidation (Simple)**
   - **Say:** "Just mark queries as stale, and they'll refetch automatically. Simple, but requires an extra network request."
   - **Show Code:**
     ```typescript
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['comments'] });
     }
     ```
   - **Explain:** "This is the safest approach - always fresh data, but slower."

2. **Direct Cache Update**
   - **Say:** "Manually update the cache with the server response. No extra request, but you must match the exact data structure."
   - **Show Code:**
     ```typescript
     onSuccess: (newComment) => {
       queryClient.setQueryData(['comments'], (old) => {
         return { ...old, comments: [newComment, ...old.comments] };
       });
     }
     ```
   - **Explain:** "Faster, but more complex. You need to know the cache structure."

3. **Optimistic Updates**
   - **Say:** "Update the UI immediately, then confirm with the server. Best UX, but most complex - you need rollback logic."
   - **Explain:** "We'll see this in action in a moment."

---

### Demo: Basic Mutation (Detailed Script)

**Say:** "Let's see a real mutation in action. I'll post a comment and show you what happens."

**Do:** Switch to "Live Demo" tab

**Say:** "Notice the warning here - the server has a 10% chance of returning an error. This is intentional so we can see error handling."

**Before Posting - Set Context:**

**Say:** "Before I post, let me show you what's in the cache right now."

**Do:** Open React Query DevTools
**Observe:** Show the comments query in DevTools
**Say:** "See the current comments? We have X comments cached."

**Now Post a Comment:**

**Say:** "I'm going to type a comment and post it. Watch what happens step by step."

**Do:** Type in the input: "This is a test comment from the presentation"
**Do:** Click "Post" button

**Observe and Explain (Step by Step):**

1. **Loading State (Immediate)**
   - **Say:** "First, notice the button changes to 'Posting...' - that's the `isPending` state from useMutation."
   - **Point to:** The disabled button and loading text
   - **Say:** "The input is also disabled - we can't submit twice."

2. **Network Request (Behind the Scenes)**
   - **Say:** "While this is happening, a POST request is being sent to the server."
   - **Do:** Open Network tab (if not already open)
   - **Observe:** Show the POST request to `/api/comments`
   - **Say:** "This is the `mutationFn` executing - the actual server call."

3. **Success Response**
   - **Say:** "The server responds with the new comment data."
   - **Observe:** Success toast appears
   - **Say:** "That toast is from the `onSuccess` callback."

4. **Cache Update**
   - **Say:** "Now watch the DevTools - the cache is being updated."
   - **Observe:** DevTools shows the query updating
   - **Say:** "The new comment appears in the list immediately because we invalidated the comments query, which triggered a refetch."
   - **Point to:** The new comment appearing in the list

**Explain What Happened:**

**Say:** "Here's the flow: User clicks post → mutation starts → server request → success → cache invalidated → query refetches → UI updates. This is the invalidation strategy we discussed."

**If Error Occurs (10% chance):**

**Say:** "Oh, we got an error! This is perfect to show error handling."

**Observe:** Error toast appears
**Say:** "Notice the error toast - that's from the `onError` callback."
**Observe:** Comment doesn't appear in the list
**Say:** "The cache wasn't updated because the mutation failed. The UI stays in the previous state - this is correct behavior."

**Key Points to Emphasize:**

1. **Loading States:** "useMutation gives you `isPending` automatically - no manual state management."
2. **Error Handling:** "Errors are handled gracefully - the UI doesn't break."
3. **Cache Sync:** "After success, the cache is updated so the UI reflects the new data."

---

### Demo: Optimistic Updates (Detailed Script)

**Say:** "Now let's see the most advanced pattern - optimistic updates. This is where the UI updates BEFORE the server confirms."

**Do:** Switch to "Optimistic Updates" tab

**Explain the Concept First:**

**Say:** "Optimistic updates give users instant feedback. We update the UI immediately, assuming the server will succeed. If it fails, we rollback."

**Show the Flow Diagram:**

**Say:** "Look at this flow diagram. Let me walk through each step:"

1. **onMutate (Before Request)**
   - **Say:** "First, we cancel any outgoing queries to prevent conflicts."
   - **Say:** "Then we save a snapshot of the current cache - this is our rollback point."
   - **Say:** "Finally, we update the cache optimistically with the new comment."

2. **mutationFn (Server Request)**
   - **Say:** "The actual server request happens here."

3. **onSuccess OR onError**
   - **Say:** "If success, we confirm the update. If error, we rollback to the saved snapshot."

**Show the Code:**

**Say:** "Let me show you the actual code. This is in `use-comments-hooks-optimistic.ts`."

**Show Code (from the file):**
```typescript
onMutate: async (newCommentData) => {
  // 1. Cancel outgoing queries
  await queryClient.cancelQueries({ queryKey });
  
  // 2. Snapshot previous data for rollback
  const previousData = queryClient.getQueryData(queryKey);
  
  // 3. Create optimistic comment
  const optimisticComment = {
    id: Date.now(), // Temporary ID
    text: newCommentData.text,
    user: { name: "Current User", avatar: "CU" },
    createdAt: new Date().toISOString(),
  };
  
  // 4. Update cache optimistically
  queryClient.setQueryData(queryKey, (oldData) => {
    return {
      ...oldData,
      pages: [{
        ...oldData.pages[0],
        comments: [optimisticComment, ...oldData.pages[0].comments],
      }, ...oldData.pages.slice(1)],
    };
  });
  
  // 5. Return snapshot for potential rollback
  return { previousData };
},
```

**Explain Each Part:**

1. **cancelQueries:**
   - **Say:** "We cancel any refetches that might overwrite our optimistic update."

2. **Snapshot:**
   - **Say:** "We save the current state. If the server fails, we'll restore this."

3. **Optimistic Comment:**
   - **Say:** "We create a temporary comment with a temporary ID. Notice it uses `Date.now()` - this is just for the UI."

4. **setQueryData:**
   - **Say:** "We immediately update the cache. The comment appears instantly in the UI."

5. **Return previousData:**
   - **Say:** "We return the snapshot so `onError` can use it for rollback."

**Now Show the Error Handler:**

**Show Code:**
```typescript
onError: (error, variables, context) => {
  // Rollback to the saved snapshot
  queryClient.setQueryData(queryKey, context?.previousData);
}
```

**Say:** "If the mutation fails, we simply restore the previous data. The optimistic comment disappears, and the UI goes back to the original state."

**Live Demo - Optimistic Update:**

**Say:** "Let's see this in action. I'll post a comment and you'll see it appear instantly."

**Do:** Go back to "Live Demo" tab (the same component uses optimistic updates)

**Before Posting:**

**Say:** "Watch the DevTools carefully. I'll post a comment now."

**Do:** Type: "Optimistic update test"
**Do:** Click "Post"

**Observe and Narrate (Real-time):**

1. **Instant UI Update (0ms)**
   - **Say:** "Did you see that? The comment appeared INSTANTLY - before the server even responded!"
   - **Point to:** The comment appearing immediately
   - **Say:** "That's the optimistic update. The UI assumes success."

2. **Network Request (Behind the Scenes)**
   - **Say:** "Meanwhile, the server request is still happening."
   - **Observe:** Network tab shows the POST request
   - **Say:** "The user sees instant feedback, but the server call is still in progress."

3. **Success Confirmation**
   - **Say:** "When the server responds successfully, the optimistic comment is replaced with the real one from the server."
   - **Observe:** Success toast
   - **Say:** "Notice the ID might change - the server gives it a real ID."

**If Error Occurs (Demonstrate Rollback):**

**Say:** "Let me try again. There's a 10% chance of error, so we might see a rollback."

**Do:** Post another comment

**If Error Happens:**

**Say:** "Perfect! We got an error. Watch what happens..."

**Observe:**
1. Comment appears instantly (optimistic)
2. Error toast appears
3. Comment disappears (rollback)

**Say:** "See that? The comment appeared optimistically, but when the server returned an error, it disappeared. That's the rollback in action. The UI returned to exactly how it was before."

**Key Points to Emphasize:**

1. **Instant Feedback:**
   - **Say:** "Users see their action reflected immediately - no waiting for network latency."

2. **Rollback Safety:**
   - **Say:** "If something goes wrong, we rollback. Data integrity is maintained."

3. **When to Use:**
   - **Say:** "Use optimistic updates when actions are likely to succeed and rollback is straightforward. Don't use them for financial transactions or critical operations."

4. **Complexity Trade-off:**
   - **Say:** "Optimistic updates require more code, but the UX improvement is significant."

**Show DevTools During Demo:**

**Say:** "Watch the DevTools while I post another comment."

**Do:** Post a comment
**Observe:** DevTools shows the query data updating
**Say:** "See how the cache updates immediately? That's the optimistic update. Then when the server responds, it updates again with the real data."

---

### Ask
- "Where in your app would optimistic updates improve UX?"

**Possible Answers to Guide Discussion:**

- **Social media:** Likes, comments, follows
- **E-commerce:** Add to cart, wishlist
- **Todo apps:** Check/uncheck items
- **Forms:** Save drafts optimistically
- **Chat apps:** Send messages

**Say:** "The key is: actions that users expect to work, where instant feedback matters, and where rollback is simple." 

**Transition:** "Now let’s talk about cache timing and freshness."

---

# 9) Caching & Stale Time (5 minutes)

### Opening Hook

**Say:** "Have you ever noticed how some apps feel instant when you navigate back to a page, while others always show a loading spinner? That's the difference between smart caching and no caching. Today, I'll show you how TanStack Query makes your app feel instant while keeping data fresh."

### Show
- `/caching`

### Do
- Open "Concepts" tab

### Set the Context

**Say:** "Before we dive in, let me ask you: In your current apps, when you navigate away from a page and come back, does it refetch the data every single time?"

**Pause for audience response or acknowledgment**

**Say:** "Most apps do, and that's wasteful. TanStack Query gives you control over when data is considered 'fresh' and when it needs to be refetched. This is the secret to making apps feel fast."

---

## Part 1: Understanding staleTime vs gcTime (2 minutes)

### The Analogy First

**Say:** "Think of staleTime like the expiration date on milk. Fresh milk (within the date) - you can use it. Stale milk (past the date) - you should get new milk. gcTime is like how long you keep expired milk in the fridge before throwing it away - even if it's expired, you might still use it as a placeholder while you go to the store."

**Say:** "Let's see how this works in code."

---

### Explain staleTime (The "Freshness" Concept)

**Say:** "`staleTime` is TanStack Query's way of saying 'how long is this data still good?'"

**Show:** Point to the green box explaining staleTime

**Say:** "By default, staleTime is 0 - meaning data is immediately stale. Every time you mount a component, it refetches. But you can change this."

**Use Real-World Analogy:**

**Say:** "Imagine you're building a news app:"
- **staleTime: 0** - "Every time someone opens the app, fetch fresh news. Good for breaking news, but expensive."
- **staleTime: 5 minutes** - "News is fresh for 5 minutes. If someone opens the app within 5 minutes, show cached news. After 5 minutes, fetch new news. Perfect balance."
- **staleTime: Infinity** - "News never expires. Use this for static content like 'About Us' page. Never refetch automatically."

**Explain the Behavior:**

**Say:** "Here's what happens:"
- **Fresh data (within staleTime):** 
  - Won't refetch on component mount
  - Won't refetch on window focus
  - Won't refetch on network reconnect
  - **Say:** "It's like saying 'this data is still good, don't waste a network request.'"

- **Stale data (after staleTime):**
  - Will refetch on mount (if refetchOnMount is true)
  - Will refetch on window focus (if refetchOnWindowFocus is true)
  - Will refetch on reconnect (if refetchOnReconnect is true)
  - **Say:** "Now it's like saying 'this data might be old, let's get fresh data.'"

**Key Insight:**

**Say:** "The magic is: TanStack Query shows cached data immediately, then refetches in the background if stale. Users see instant feedback, and data stays fresh. This is called 'stale-while-revalidate' - we'll see it in action."

---

### Explain gcTime (The "Memory Management" Concept)

**Say:** "Now `gcTime` is different. It's not about freshness - it's about memory management."

**Show:** Point to the purple box explaining gcTime

**Say:** "gcTime determines how long unused data stays in cache before being garbage collected."

**Use the Component Lifecycle Analogy:**

**Say:** "Here's the lifecycle:"

1. **Component mounts** → Query fetches → Data cached
   - **Say:** "Data is active - components are using it."

2. **Component unmounts** → Query becomes inactive → gcTime countdown starts
   - **Say:** "No components are using it anymore, but it's still in cache."

3. **After gcTime (default 5 minutes)** → Data garbage collected
   - **Say:** "If no component uses it for 5 minutes, it's removed from cache to free memory."

**The Important Detail:**

**Say:** "But here's the clever part: even if data is inactive and being garbage collected, TanStack Query can still show it as a placeholder while refetching. This means:"

**Demonstrate with gesture:**
- **Say:** "User navigates away (component unmounts) → Data becomes inactive"
- **Say:** "User comes back 2 minutes later (component remounts)"
- **Say:** "If data is still in cache (within gcTime), it shows immediately while refetching in background"
- **Say:** "No loading spinner! Users see instant data, then it updates when fresh data arrives."

**Say:** "This is why gcTime is separate from staleTime. staleTime controls freshness, gcTime controls memory."

---

### Show Query Lifecycle Timeline (Visual Learning)

**Say:** "Let me show you the complete journey of query data with this visual timeline."

**Show:** Point to the Query Data Lifecycle timeline

**Walk through with gestures:**

1. **Fresh (Green) - "Just Fetched"**
   - **Say:** "Data is brand new, just fetched from the server."
   - **Point to:** Green section
   - **Say:** "It's fresh, so no automatic refetches will happen. Users can navigate away and come back - instant data."

2. **Stale (Amber) - "Time's Up"**
   - **Say:** "After staleTime expires, data becomes stale."
   - **Point to:** Amber section
   - **Say:** "It's still shown to users, but TanStack Query knows it might be outdated. On the next trigger (mount, focus, etc.), it will refetch in the background."

3. **Inactive (Gray) - "No One's Watching"**
   - **Say:** "When no components are using the query, it becomes inactive."
   - **Point to:** Gray section
   - **Say:** "The gcTime countdown starts. Data is still in cache, but no one is watching it."

4. **Deleted (Red) - "Gone Forever"**
   - **Say:** "After gcTime expires, data is garbage collected."
   - **Point to:** Red section
   - **Say:** "It's removed from cache to free memory. If a component needs it again, it will fetch fresh."

**Connect to Real-World:**

**Say:** "This lifecycle is why TanStack Query apps feel fast. Users see cached data instantly, fresh data updates in the background, and memory is managed automatically. You don't have to think about it."

---

## Part 2: Live Demo - The Power of staleTime (2.5 minutes)

### Explain staleTime

**Say:** "Let's start with `staleTime`. This determines how long data is considered 'fresh' after it's fetched."

**Show:** Point to the green box explaining staleTime

**Say:** "By default, staleTime is 0 - meaning data is immediately stale. But you can change this."

**Explain the concept:**

**Say:** "Think of it like this:"
- **Fresh data (within staleTime):** Won't automatically refetch on mount, focus, or reconnect
- **Stale data (after staleTime):** Will refetch on the next trigger (mount, focus, etc.)

**Show Examples:**
- **Say:** "If staleTime is 0, every time you navigate away and come back, it refetches."
- **Say:** "If staleTime is 30 seconds, data stays fresh for 30 seconds. During that time, no automatic refetches."
- **Say:** "If staleTime is Infinity, data never goes stale - perfect for static data like countries or categories."

### Explain gcTime

**Say:** "Now `gcTime` - this is different. It's about garbage collection - how long inactive data stays in cache."

**Show:** Point to the purple box explaining gcTime

**Say:** "Key difference:"
- **staleTime:** When data is considered fresh (affects refetching)
- **gcTime:** How long unused data stays in cache (affects memory)

**Explain:**

**Say:** "gcTime starts counting when a query has no observers - meaning no components are using it."

**Say:** "For example:"
- Component mounts → Query fetches → Data is cached
- Component unmounts → Query becomes inactive → gcTime countdown starts
- After gcTime (default 5 minutes) → Data is garbage collected

**Say:** "But here's the important part: even if data is inactive, it can still be shown as a placeholder while refetching. This prevents loading spinners for data you just had."

### Show Query Lifecycle Timeline

**Say:** "Let me show you the complete lifecycle of query data."

**Show:** Point to the Query Data Lifecycle timeline

**Walk through each stage:**

1. **Fresh (Green)**
   - **Say:** "Data is just fetched. It's fresh and won't auto-refetch."
   - **Point to:** Green section

2. **Stale (Amber)**
   - **Say:** "After staleTime expires, data becomes stale. It will refetch on next trigger."
   - **Point to:** Amber section

3. **Inactive (Gray)**
   - **Say:** "When no components are using the query, it becomes inactive. gcTime countdown starts."
   - **Point to:** Gray section

4. **Deleted (Red)**
   - **Say:** "After gcTime expires, data is garbage collected and removed from cache."
   - **Point to:** Red section

**Say:** "This lifecycle ensures efficient memory usage while keeping frequently accessed data available."

---

## Part 2: Live Demo - The Power of staleTime (2.5 minutes)

### Set Up the Demo

**Say:** "I'm going to show you three identical queries side by side, but with different staleTime values. Watch how they behave differently."

### Do
- Switch to "Live Demo" tab
- Open React Query DevTools (make it visible to audience)
- Have Network tab visible and ready

### Initial Setup - Build Anticipation

**Say:** "You see three boxes here. They're all fetching the exact same data - posts from the technology category. But watch what happens..."

**Point to each box as you explain:**
- **Left box:** "This one has staleTime: 0 - it's immediately stale after fetching"
- **Middle box:** "This one has staleTime: 30 seconds - it stays fresh for 30 seconds"
- **Right box:** "This one has staleTime: Infinity - it never goes stale"

**Observe:** All three show "Loading..." initially

**Say:** "They're all loading now. They'll all fetch the same data, but their caching behavior will be completely different."

### Wait for Initial Load - Create Suspense

**Observe:** All three queries fetch and show data

**Say:** "Perfect! All three have loaded. Notice something important:"

**Point to status badges:**
- **Say:** "All three show 'Fresh' badges - they're all green. Why? Because they just fetched, so they're all fresh right now."

**Observe:** Check timestamps
- **Say:** "Look at the 'Last updated' timestamps - they're all identical. They all fetched at the same time."

**Say:** "But here's where it gets interesting. Watch what happens when I invalidate them..."

---

### Demo 1: staleTime = 0 (The "Always Refetch" Pattern)

**Say:** "I'm going to click 'Invalidate All Cache Demos'. This marks all queries as stale. Watch what happens to each box..."

**Do:** Click "Invalidate All Cache Demos" button

**Observe in Real-Time:**

**Say:** "Watch the left box - staleTime: 0..."

**Point to:** Left box shows "Fetching..." immediately

**Say:** "Boom! It immediately started refetching. Why? Because staleTime is 0, so it's immediately stale, so it immediately refetches."

**Observe:** Middle and right boxes
- **Say:** "But look at the middle box - nothing. And the right box - nothing. Why?"

**Explain:**
- **Say:** "The middle box has staleTime: 30 seconds. It was just fetched, so it's still within its 30-second freshness window. It doesn't need to refetch."
- **Say:** "The right box has staleTime: Infinity. It never goes stale, so even when invalidated, it won't auto-refetch."

**Key Teaching Moment:**

**Say:** "This is the difference! With staleTime: 0, every invalidation triggers a refetch. With staleTime: 30s, it only refetches if the data is actually stale. With Infinity, it never auto-refetches."

**Check Network Tab:**

**Do:** Point to Network tab

**Observe:**
- **Say:** "See in the Network tab? Only one request was made - from the staleTime: 0 box. The other two didn't make requests because they're still fresh."

---

### Demo 2: staleTime = 30s (The "Smart Caching" Pattern)

**Say:** "Now let's see what happens with the 30-second box. This is the sweet spot for most data."

**Do:** Wait a moment, then explain

**Say:** "If we wait 30 seconds, the middle box would become stale. But we don't have to wait - let me show you another way."

**Do:** Click "Refetch All" button

**Observe:**
- **Say:** "This button forces a refetch regardless of staleTime. Watch all three boxes now..."

**Point to:** All three boxes show "Fetching..."

**Say:** "All three are refetching because we're forcing it. But in normal operation, only stale queries would refetch automatically."

**Explain the Difference:**

**Say:** "Here's the key insight:"
- **Say:** "With staleTime: 0, every mount, every focus, every reconnect triggers a refetch. That's a lot of network requests."
- **Say:** "With staleTime: 30s, data is fresh for 30 seconds. During that time, no automatic refetches happen. Users see instant data, and you save network requests."
- **Say:** "After 30 seconds, if someone comes back, it refetches. Perfect balance between freshness and performance."

---

### Demo 3: staleTime = Infinity (The "Static Data" Pattern)

**Say:** "The Infinity box is special. Let me show you why."

**Do:** Click "Invalidate All Cache Demos" again

**Observe:**
- **Say:** "I invalidated again. Watch the Infinity box..."

**Point to:** Infinity box status

**Say:** "It might not refetch automatically, or if it does, it's because we're forcing it. The key is: it never goes stale on its own."

**Real-World Application:**

**Say:** "This is perfect for data that never changes:"
- **Say:** "List of countries - never changes, use Infinity"
- **Say:** "Product categories - rarely changes, use Infinity"
- **Say:** "Terms of service - doesn't change, use Infinity"

**Say:** "You can still manually refetch or invalidate Infinity queries, but they won't auto-refetch. This saves unnecessary network requests."

---

### Show DevTools - The Technical View

**Say:** "Let's look under the hood with DevTools. This shows you exactly what TanStack Query is doing."

**Do:** Open React Query DevTools (make sure it's visible)

**Observe and Explain:**

**Say:** "See these three queries in DevTools?"

**Point to:** Query keys: `['cache-demo', 0]`, `['cache-demo', 30000]`, `['cache-demo', Infinity]`

**Say:** "Notice the query keys include the staleTime value. This is important - each staleTime gets its own cache entry."

**Explain Why:**

**Say:** "This means:"
- **Say:** "You can have the same data with different freshness requirements"
- **Say:** "One component might need fresh data (staleTime: 0)"
- **Say:** "Another component might be fine with slightly stale data (staleTime: 30s)"
- **Say:** "TanStack Query manages them separately"

**Observe Query States:**

**Point to each query in DevTools:**
- **First query (0):** "This one is probably 'stale' now - it refetches frequently"
- **Second query (30000):** "This one is 'fresh' - still within its 30-second window"
- **Third query (Infinity):** "This one is always 'fresh' - never goes stale"

**Say:** "This is how TanStack Query gives you fine-grained control over caching. Each query can have its own freshness requirements."

---

## Part 3: Toggle Mount/Unmount Demo - The "Instant Feel" (1.5 minutes)

### Set Up the "Magic Moment"

**Say:** "This next demo is my favorite. It shows you exactly why TanStack Query apps feel instant. Watch closely..."

### Do
- Scroll down to "Toggle Mount/Unmount Test" section

### Explain What We're About to See

**Say:** "This component has a query with staleTime: 1 minute. I'm going to unmount it and remount it. Watch what happens - or more importantly, watch what DOESN'T happen."

**Before Toggling - Set the Baseline:**

**Observe:** Component is mounted, showing data
- **Say:** "The component is mounted. It's showing data with a timestamp - this is when it was fetched."
- **Point to:** The timestamp
- **Say:** "Remember this timestamp - we'll come back to it."

**Do:** Open Network tab (make it visible)

**Say:** "I have the Network tab open. Watch it carefully - we're about to see something interesting."

---

### The Magic Moment - Unmount and Remount

**Say:** "Here we go. I'm unmounting the component..."

**Do:** Click "Unmount Query" button

**Observe:**
- **Say:** "The component disappeared. The query is now inactive - no components are using it."
- **Say:** "But here's the key: the data is still in cache. The gcTime countdown has started - it has 5 minutes before garbage collection."

**Say:** "Now watch this carefully. I'm going to mount it again in just 2 seconds..."

**Do:** Wait 2-3 seconds (count: "One... two... three..."), then click "Mount Query" button

**Observe in Real-Time:**

**Say:** "Did you see that?!"

**Point to:** Data appears instantly - no loading spinner

**Say:** "The data appeared INSTANTLY. No loading spinner, no 'Fetching...' message, no delay. It just appeared."

**Check Network Tab:**

**Do:** Point to Network tab

**Observe:**
- **Say:** "Look at the Network tab. No new request was made. Zero network requests."
- **Say:** "The data came entirely from cache. This is why it was instant."

**Explain the Magic:**

**Say:** "Here's what happened:"
1. **Say:** "Component unmounted → Query became inactive → Data stayed in cache"
2. **Say:** "Component remounted → Query became active → Data was still fresh (within 1-minute staleTime)"
3. **Say:** "TanStack Query served cached data immediately → User sees instant feedback"

**Say:** "This is the 'instant feel' that users love. No loading spinners for data they just saw."

---

### Demonstrate Stale-While-Revalidate (The Background Update)

**Say:** "But what if the data was stale? Let me show you the 'stale-while-revalidate' pattern."

**Do:** Click "Unmount Query" again

**Say:** "I'm going to simulate stale data. In a real app, this would happen if you waited longer than the staleTime, or if the data was invalidated."

**Do:** Wait a moment, then click "Mount Query"

**Explain What Would Happen:**

**Say:** "If the data was stale, here's what you'd see:"

1. **Instant Display:**
   - **Say:** "Cached data appears immediately - no loading spinner"
   - **Say:** "Users see instant feedback, even if data is stale"

2. **Background Refetch:**
   - **Say:** "TanStack Query refetches in the background"
   - **Say:** "You might see a subtle 'Fetching...' indicator, but the UI doesn't block"

3. **Silent Update:**
   - **Say:** "When fresh data arrives, the UI updates silently"
   - **Say:** "Users see instant data, then it updates when fresh data arrives"

**The Key Insight:**

**Say:** "This is the 'stale-while-revalidate' pattern:"
- **Say:** "Show stale data immediately (instant UX)"
- **Say:** "Refetch in background (fresh data)"
- **Say:** "Update when ready (seamless experience)"

**Say:** "Users never see a blank loading state for data they just had. The app feels instant, and data stays fresh. This is the TanStack Query advantage."

---

## Part 4: Refetch Triggers - When Data Refreshes Automatically (1 minute)

### Set the Context

**Say:** "You might be wondering: 'When does TanStack Query actually refetch data?' Let me show you the automatic triggers."

### Do
- Go back to "Concepts" tab
- Scroll to "Automatic Refetch Triggers" section

### Explain with Real-World Scenarios

**Say:** "TanStack Query has four automatic refetch triggers. But remember: they only fire if data is stale. Fresh data won't refetch automatically."

**Go through each with examples:**

1. **refetchOnMount (default: true)**
   - **Say:** "When a component using the query mounts, it checks if data is stale."
   - **Real-world:** "User navigates to a page → Component mounts → If data is stale, it refetches"
   - **Say:** "This is why staleTime matters - with staleTime: 0, every navigation triggers a refetch. With staleTime: 5 minutes, it only refetches if data is older than 5 minutes."

2. **refetchOnWindowFocus (default: true)**
   - **Say:** "When the browser window regains focus, stale queries refetch."
   - **Real-world:** "User switches to another tab, comes back 10 minutes later → Window gains focus → Stale queries refetch"
   - **Say:** "This is perfect for keeping data fresh when users return to your app. They see cached data instantly, then it updates in the background."

3. **refetchOnReconnect (default: true)**
   - **Say:** "When the network reconnects, stale queries refetch."
   - **Real-world:** "User loses WiFi, reconnects → Network reconnects → Stale queries refetch"
   - **Say:** "Perfect for mobile users who might lose connection. When they reconnect, data automatically refreshes."

4. **refetchInterval (default: false)**
   - **Say:** "Poll at a specified interval, regardless of staleTime."
   - **Real-world:** "Dashboard that needs real-time updates → Set refetchInterval: 5000 → Polls every 5 seconds"
   - **Say:** "Use this for dashboards, live scores, or any data that needs constant updates."

**Key Insight:**

**Say:** "The beauty is: these triggers are smart. They only refetch stale data. If your data is fresh (within staleTime), these triggers do nothing. You get automatic freshness without unnecessary network requests."

---

## Part 5: Real-World Recommendations - Making the Right Choice (1.5 minutes)

### Say
"Now let's talk about practical decisions. How do you choose the right staleTime for your data?"

### Do
- Switch to "Configuration" tab
- Scroll to "Recommendations by Use Case"

### The Decision Framework

**Say:** "Here's my framework for choosing staleTime:"

**Say:** "Ask yourself: How often does this data change?"
- **Say:** "Never? → staleTime: Infinity"
- **Say:** "Rarely (hours/days)? → staleTime: 5-30 minutes"
- **Say:** "Occasionally (minutes)? → staleTime: 1-5 minutes"
- **Say:** "Frequently (seconds)? → staleTime: 0 + refetchInterval"

### Go Through Each Use Case with Reasoning

**Say:** "Let me show you real examples:"

1. **Static data (countries, categories, currencies)**
   - **Say:** "staleTime: Infinity, gcTime: Infinity"
   - **Reasoning:** "This data literally never changes. Countries don't change. Product categories rarely change. Cache it forever."
   - **Say:** "You can still manually invalidate if needed, but it won't auto-refetch."

2. **User profile data**
   - **Say:** "staleTime: 5 minutes, gcTime: 30 minutes"
   - **Reasoning:** "User profiles change occasionally - maybe they update their avatar or bio. But not every second."
   - **Say:** "5 minutes is a good balance - fresh enough for most use cases, but not so frequent that you're constantly refetching."
   - **Say:** "gcTime: 30 minutes means if the user navigates away and comes back within 30 minutes, they see cached data instantly."

3. **Frequently updating data (dashboard, activity feed)**
   - **Say:** "staleTime: 0, gcTime: 1 minute"
   - **Reasoning:** "Dashboards need fresh data. Activity feeds update constantly."
   - **Say:** "staleTime: 0 means it refetches on every mount/focus. But gcTime: 1 minute means old data is quickly cleaned up."
   - **Say:** "This gives you fresh data while managing memory efficiently."

4. **Real-time data (live scores, chat, notifications)**
   - **Say:** "staleTime: 0 + refetchInterval: 5000"
   - **Reasoning:** "This data changes constantly and needs to be as fresh as possible."
   - **Say:** "staleTime: 0 ensures it's always considered stale, and refetchInterval: 5000 polls every 5 seconds."
   - **Say:** "This gives you near real-time updates without WebSockets."

### The Golden Rule

**Say:** "Here's my golden rule: Start with defaults (staleTime: 0), then optimize based on your needs."

**Say:** "If you notice:"
- **Say:** "Too many network requests? → Increase staleTime"
- **Say:** "Data feels stale? → Decrease staleTime"
- **Say:** "Memory issues? → Decrease gcTime"

**Say:** "TanStack Query makes it easy to experiment. Change staleTime, see how it feels, adjust. It's that simple."

---

### Interactive Question - Make It Personal

**Ask:**
- "Which data in your product could safely use staleTime = Infinity?"

**Pause for audience responses or thinking time**

**Possible Answers to Guide Discussion:**

**Say:** "Common candidates include:"
- **Static reference data:** Countries, states, categories, currencies, timezones
- **Configuration data:** App settings, feature flags (that don't change often), theme configurations
- **Content that rarely changes:** Terms of service, privacy policy, help documentation, FAQ content
- **Lookup tables:** Product types, status codes, enum values

**Say:** "The key question is: Does this data EVER change? If the answer is 'rarely' or 'never', use Infinity."

**Say:** "And remember: Infinity doesn't mean you can't update it. You can always manually invalidate or refetch. It just means TanStack Query won't automatically refetch it."

**Say:** "This saves network requests and makes your app feel faster. Users see instant data, and you reduce server load."

---

### Final Thought

**Say:** "Caching is about balance. Too aggressive, and users see stale data. Too conservative, and you waste network requests. TanStack Query gives you the tools to find that balance, and the defaults are usually pretty good." 

**Transition:** "Let’s end with a quick glossary."

---

# 10) Terminology Glossary (2 minutes)

### Say
"This page is your reference when you’re implementing TanStack Query in real projects." 

### Show
- `/terminology`

### Do
- Use the search box briefly

### Observe
- Terms like query key, stale, invalidation, optimistic update

### Ask
- "Is there any term you want me to clarify right now?"

**Transition:** "Let’s close and take questions."

---

# Closing & Q&A (3 minutes)

### Say
"Let’s recap: TanStack Query removes boilerplate, solves caching and stale data problems, and gives you great dev tools. The most important takeaway: treat server state as a first-class concern." 

### Next Steps

- Docs: https://tanstack.com/query/latest
- Repo: https://github.com/TanStack/query
- Your project code is ready in this repo

### Common Q&A Seeds

- When to use TanStack Query vs Redux?
- What about GraphQL?
- How do we test queries and mutations?

---

# Engagement Map (Quick Reference)

- **Start:** Ask who uses `useEffect` for fetching
- **useEffect bugs:** Ask who has seen race conditions
- **Query Keys:** Ask which queries should be invalidated
- **Search Demo:** Ask why cached searches are instant
- **Infinite Query:** Ask whether scrolling should refetch
- **Mutations:** Ask where optimistic updates fit
- **Caching:** Ask which data can be static
- **Glossary:** Ask if any term needs clarification

---

# Quick Reference: Common Invalidation Scenarios

### Scenario 1: Post Updated
**Which queries to invalidate?**
- ✅ `queryKeys.posts.detail(id)` - The specific post
- ✅ `queryKeys.posts.lists()` - All list queries (title/content might have changed)
- ⚠️ `queryKeys.posts.search(term)` - Only if search results include this post

**Reasoning:** Detail view definitely needs update. Lists might show the post, so they need refresh. Search is optional.

---

### Scenario 2: Post Created
**Which queries to invalidate?**
- ✅ `queryKeys.posts.lists()` - All list queries (new post should appear)
- ❌ `queryKeys.posts.detail(id)` - Not needed (post doesn't exist yet)

**Reasoning:** New posts appear in lists, so invalidate all lists. No detail query exists yet.

---

### Scenario 3: Post Deleted
**Which queries to invalidate?**
- ✅ `queryKeys.posts.all` - Everything (nuclear option)
- OR be selective:
  - ✅ `queryKeys.posts.detail(id)` - Remove from cache
  - ✅ `queryKeys.posts.lists()` - Remove from all lists
  - ✅ `queryKeys.posts.search(term)` - Remove from search results

**Reasoning:** Deleted post shouldn't appear anywhere. Invalidating all is safest, but selective is more performant.

---

### Scenario 4: Only View Count Updated
**Which queries to invalidate?**
- ✅ `queryKeys.posts.detail(id)` - Only the detail view
- ❌ `queryKeys.posts.lists()` - Probably not needed (view count not shown in list)

**Reasoning:** If lists don't show view count, no need to invalidate them. Only detail view needs update.

---

### Scenario 5: Comment Added to Post
**Which queries to invalidate?**
- ✅ `queryKeys.comments.byPost(postId)` - Comments for that post
- ✅ `queryKeys.comments.infinite()` - If using infinite query
- ❌ `queryKeys.posts.*` - Not needed (post itself didn't change)

**Reasoning:** Only comment-related queries need refresh. Post data is unchanged.

---

### Key Principles for Invalidation Decisions

1. **Think about what data is affected** - Not just what was mutated
2. **Consider where the data appears** - Lists, details, search, etc.
3. **Be selective when possible** - Don't invalidate everything unless necessary
4. **Use hierarchical keys** - `lists()` matches all list queries automatically
5. **Consider user experience** - What will users see that's now stale?

---

# Delivery Tips

- Keep DevTools open during demos
- Keep Network tab visible for search demo
- Use real-time errors as teaching moments
- If running short on time, shorten glossary + Q&A
- If running long, reduce detail in caching section

