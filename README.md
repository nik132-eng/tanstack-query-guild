# TanStack Query Guild Session Presentation

An interactive tutorial and presentation application for learning TanStack Query v5 (React Query).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the presentation.

## 📚 Presentation Flow

The presentation is structured as a series of interactive pages:

| Section | Path | Topic |
|---------|------|-------|
| 0 | `/state-management` | Client vs Server State comparison |
| 1 | `/what-is-tanstack-query` | Introduction to TanStack Query |
| 2 | `/problems-with-use-effect` | Why useEffect is problematic for data fetching |
| 3 | `/basic-react-query` | Basic useQuery example with comparison |
| 4 | `/query-keys` | Query key patterns and factory pattern |
| 5 | `/search-query` | Debounced search implementation |
| 6 | `/infinite-query` | Infinite scroll with useInfiniteQuery |
| 7 | `/mutations` | Mutations and optimistic updates |
| 8 | `/caching` | Stale time and caching configuration |
| 9 | `/terminology` | Glossary of all TanStack Query terms |

## 🎯 Key Features Demonstrated

- **Side-by-side comparisons**: See useEffect bugs vs TanStack Query solutions
- **Interactive demos**: Try the features yourself in real-time
- **React Query DevTools**: Inspect queries, cache, and states
- **Live code examples**: Ready-to-copy code patterns

## 🛠️ Presentation Tips

### Before the Session
1. Have React Query DevTools open (floating button at bottom)
2. Open browser Network tab for demo purposes
3. Clear cache before major demos for clean demonstrations

### During the Session
1. Use DevTools to show query states (fresh/stale/inactive)
2. Point out network requests (or lack thereof) for caching demos
3. Demonstrate error scenarios where applicable
4. Let participants try the interactive demos

### Key Talking Points
- Server state has unique challenges vs client state
- TanStack Query eliminates boilerplate code
- Query keys are crucial - use the factory pattern
- DevTools are your best friend for debugging
- Optimistic updates improve UX significantly

## 📁 Project Structure

```
src/
├── app/
│   ├── (pages)/           # All presentation pages
│   ├── api/               # Mock API routes
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── ui/                # shadcn/ui components
│   └── navigation-card.tsx
├── hooks/
│   └── use-debounce.ts
├── lib/
│   ├── query-keys.ts      # Query key factory (important!)
│   └── fetch-utils.ts
└── providers/
    └── ReactQueryProvider.tsx
```

## 🔑 Important Files

- `src/lib/query-keys.ts` - Query key factory pattern example
- `src/providers/ReactQueryProvider.tsx` - TanStack Query setup
- `src/app/problems-with-use-effect/` - Side-by-side comparison
- `src/app/infinite-query/use-comments-hooks.ts` - Custom hooks example

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Query Library**: @tanstack/react-query v5
- **DevTools**: @tanstack/react-query-devtools

## 📖 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs)
- [TanStack Query GitHub](https://github.com/TanStack/query)
