import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	RefreshControl,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllByUser } from "@/libs/supabase/api/posts";
import { Box, Separator } from "@/components/ui";
import { Post } from "@/features/post";

interface Page {
	posts: Post[];
	nextCursor: number;
}

const Posts = ({ userId }: { userId: string }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const { width } = Dimensions.get("screen");

	const query = useInfiniteQuery<Page, Error>({
		queryKey: ["posts", userId],
		queryFn: ({ pageParam }) => getAllByUser({ userId, pageParam }),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	const handleRefresh = useCallback(() => {
		setRefreshing(true);
		query.refetch().then(() => setRefreshing(false));
	}, []);

	useEffect(() => {
		if (query.data?.pages) {
			const newPage = query.data.pages[query.data.pages.length - 1];
			const newPosts = newPage.posts;
			setPosts((prevPosts) => [...prevPosts, ...newPosts]);
		}
	}, [query.data]);

	if (query.isLoading) return null;

	if (query.isError) return null;

	return (
		<Box width={width}>
			<FlatList
				data={posts}
				keyExtractor={(post) => post.id}
				renderItem={({ item: post }) => <Post post={post} />}
				ItemSeparatorComponent={() => <Separator height={0.5} />}
				ListFooterComponent={
					<Box pb={64}>
						{query.hasNextPage && <ActivityIndicator size="small" />}
					</Box>
				}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
				}
				onEndReached={() => query.fetchNextPage()}
			/>
		</Box>
	);
};

export default Posts;
