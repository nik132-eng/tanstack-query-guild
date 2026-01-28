import { NavigationCard } from "@/components/navigation-card";

const sections = [
  {
    title: "0. React State Management",
    description: "Understanding the difference between Client State and Server State - why it matters for choosing the right tools.",
    href: "/state-management",
    icon: "🎯"
  },
  {
    title: "1. What is TanStack Query?",
    description: "Introduction to TanStack Query, its core features, and why it's the go-to solution for server state management.",
    href: "/what-is-tanstack-query",
    icon: "⚡"
  },
  {
    title: "2. Problems with useEffect",
    description: "See why traditional data fetching with useEffect is problematic and how to fix common issues like race conditions.",
    href: "/problems-with-use-effect",
    icon: "🐛"
  },
  {
    title: "3. Basic React Query",
    description: "Learn how React Query simplifies data fetching with automatic state management, caching, and more.",
    href: "/basic-react-query",
    icon: "📚"
  },
  {
    title: "4. Query Keys Best Practices",
    description: "Master query key patterns for large applications. Learn the factory pattern for consistent, type-safe keys.",
    href: "/query-keys",
    icon: "🔑"
  },
  {
    title: "5. Debounced Search",
    description: "Learn how to implement efficient debounced search with React Query to optimize data fetching.",
    href: "/search-query",
    icon: "🔍"
  },
  {
    title: "6. Infinite Queries",
    description: "Explore how to implement infinite scrolling and pagination with useInfiniteQuery hook.",
    href: "/infinite-query",
    icon: "♾️"
  },
  {
    title: "7. Mutations & Optimistic Updates",
    description: "Learn how to create, update, and delete data using useMutation with proper cache management.",
    href: "/mutations",
    icon: "✏️"
  },
  {
    title: "8. Caching & Stale Time",
    description: "Understanding and configuring TanStack Query's powerful caching behavior and data freshness.",
    href: "/caching",
    icon: "💾"
  },
  {
    title: "9. Terminology Glossary",
    description: "Quick reference for all TanStack Query terminology and concepts in one place.",
    href: "/terminology",
    icon: "📖"
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto min-h-screen p-8 pb-20 sm:p-20">
      <header className="flex flex-col items-center mb-12">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
          Guild Session Presentation
        </div>
        <h1 className="text-5xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TanStack Query v5
        </h1>
        <p className="text-xl text-center max-w-3xl text-gray-600">
          Master Server State Management in React
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Interactive tutorial covering everything from basics to advanced patterns
        </p>
      </header>

      {/* Feature Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Caching", icon: "📦" },
          { label: "Background Refetch", icon: "🔄" },
          { label: "Deduplication", icon: "⚡" },
          { label: "Optimistic Updates", icon: "🎯" },
        ].map((item) => (
          <div key={item.label} className="bg-gray-100 rounded-lg p-4 text-center">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-sm font-medium mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <NavigationCard
            key={section.href}
            title={section.title}
            description={section.description}
            href={section.href}
            icon={section.icon}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16 flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Open DevTools to explore queries in real-time</p>
          <p className="text-xs text-gray-400">Look for the floating TanStack Query icon at the bottom of the screen</p>
        </div>
        <div className="flex gap-4 items-center">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-5"
            href="https://tanstack.com/query/latest/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 Official Docs
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-5"
            href="https://github.com/TanStack/query"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⭐ GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
