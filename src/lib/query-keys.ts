/**
 * Query Key Factory Pattern
 *
 * This pattern centralizes all query keys in your application for:
 * - Type safety and autocomplete
 * - Consistent key structure
 * - Easy invalidation patterns
 * - Single source of truth
 *
 * Usage:
 * - queryKeys.posts.all → Invalidate all post-related queries
 * - queryKeys.posts.lists() → Match all list queries
 * - queryKeys.posts.list({ category: 'tech' }) → Specific list query
 * - queryKeys.posts.detail('123') → Single post detail
 */

export const queryKeys = {
  // Posts domain
  posts: {
    // Base key for all post queries
    all: ["posts"] as const,

    // List queries
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: { category?: string; page?: number; limit?: number }) =>
      [...queryKeys.posts.lists(), filters] as const,

    // Detail queries
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.posts.details(), id] as const,

    // Search queries
    search: (term: string) =>
      [...queryKeys.posts.all, "search", term] as const,
  },

  // Comments domain
  comments: {
    all: ["comments"] as const,

    // Infinite query for comments
    infinite: () => [...queryKeys.comments.all, "infinite"] as const,

    // Comments by post
    byPost: (postId: string | number) =>
      [...queryKeys.comments.all, "post", postId] as const,
  },

  // Tags domain
  tags: {
    all: ["tags"] as const,
    list: () => [...queryKeys.tags.all, "list"] as const,
  },

  // Users domain (example for future use)
  users: {
    all: ["users"] as const,
    detail: (id: string | number) => [...queryKeys.users.all, id] as const,
    profile: () => [...queryKeys.users.all, "profile"] as const,
    preferences: (userId: string | number) =>
      [...queryKeys.users.all, userId, "preferences"] as const,
  },
} as const;

/**
 * Type helper for extracting query key types
 */
export type QueryKeys = typeof queryKeys;
