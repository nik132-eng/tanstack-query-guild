import { postData } from "@/lib/fetch-utils";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Comment } from "../api/comments/data";
import { CommentsResponse } from "../api/comments/route";

const queryKey: QueryKey = ["comments"];

export function useCreateCommentMutationOptimistic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: { text: string }) =>
      postData<{ comment: Comment }>("/api/comments", newComment),

    // Handle optimistic updates
    onMutate: async (newCommentData) => {
      // Cancel any outgoing refetches to avoid them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value for rollback in case of error
      const previousData =
        queryClient.getQueryData<
          InfiniteData<CommentsResponse, number | undefined>
        >(queryKey);

      const optimisticComment: Comment = {
        id: Date.now(),
        text: newCommentData.text,
        // In a real app, user data would come from your auth provider
        user: {
          name: "Current User",
          avatar: "CU",
        },
        createdAt: new Date().toISOString(),
      };

      // Update the cache with our optimistic comment
      queryClient.setQueryData<
        InfiniteData<CommentsResponse, number | undefined>
      >(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            ...oldData,
            pages: [
              {
                ...firstPage,
                totalComments: firstPage.totalComments + 1,
                comments: [optimisticComment, ...firstPage.comments],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      // Return the previous data for the onError handler
      return { previousData };
    },

    // If the mutation fails, roll back to the previous state
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousData);
    },
  });
}
