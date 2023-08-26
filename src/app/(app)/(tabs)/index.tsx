import { FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAll } from "@/libs/supabase/api/posts";
import { Box, HStack, Icon, Refresh, Separator, Error } from "@/components/ui";
import { Post } from "@/features/post";
import PostSkeletons from "@/features/post/components/PostSkeletons";

interface Page {
	posts: Post[];
	nextCursor: number;
}

const HomeScreen = () => {
	const query = useInfiniteQuery<Page, Error>({
		queryKey: ["feed"],
		queryFn: ({ pageParam = 0 }) => getAll(pageParam),
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

	if (query.isLoading) return <PostSkeletons count={4} />;

	if (query.isError) return <Error retry={query.refetch} />;
	return (
		<Box flex={1} position="relative">
			<FlatList
				data={query.data.pages.flatMap((page) => page.posts)}
				keyExtractor={(post) => post.id}
				renderItem={({ item: post }) => <Post post={post} />}
				ItemSeparatorComponent={() => <Separator />}
				ListFooterComponent={
					<Box pb={64}>{query.hasNextPage && <PostSkeletons count={1} />}</Box>
				}
				refreshControl={<Refresh refetch={query.refetch} />}
				showsVerticalScrollIndicator={false}
				onEndReached={() => query.fetchNextPage()}
			/>

			<Link href="post/create" asChild>
				<TouchableOpacity
					style={{ position: "absolute", bottom: 12, right: 12 }}
				>
					<HStack
						space={0}
						justifyContent="center"
						alignItems="center"
						width={56}
						height={56}
						bg="primary-9"
						borderRadius="full"
						shadowColor="primary-9"
						shadowOffset={{ width: 0, height: 3 }}
						shadowOpacity={0.3}
						shadowRadius={3}
						elevation={5}
					>
						<Icon name="Plus" size={24} color="primary-3" />
					</HStack>
				</TouchableOpacity>
			</Link>
		</Box>
	);
};

export default HomeScreen;
