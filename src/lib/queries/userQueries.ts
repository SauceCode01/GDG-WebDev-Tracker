 
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"; 
import { User } from "@/types/User"; 
import { getUser, getUsers } from "../api/users";

export function useUserQuery(uid: string) {
  const { data: user, ...rest } = useQuery<User>({
    queryKey: ["coupons", uid],
    queryFn: async () => {
      if (!uid) throw new Error("Project ID and Item ID are required");
      const response = await getUser(uid);
      return response;
    },
    enabled: !!uid,
  });

  return { user, ...rest };
}


export function useInfiniteCouponQuery() {
  const { data, ...rest } = useInfiniteQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async ({ pageParam }) => {
      return getUsers(10, pageParam as string | undefined);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage): string | undefined => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].uid;
    },
  });

  const users: User[] = data?.pages.flatMap((page) => page) ?? [];

  return { users, ...rest };
}
