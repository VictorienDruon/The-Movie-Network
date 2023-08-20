import { TextInput, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentSchema } from "@/utils/schema";
import { supabase } from "@/libs/supabase";
import { addComment } from "@/libs/supabase/api";
import { Box, HStack, Body } from "@/components/ui";
import { Theme } from "@/styles/theme";
import { useTheme } from "@shopify/restyle";

const CommentBar = ({ postId }: { postId: string }) => {
	const { colors } = useTheme<Theme>();
	const queryClient = useQueryClient();
	const mutation = useMutation(addComment, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", postId] });
		},
	});
	const { control, handleSubmit, reset } = useForm<CommentSchema>({
		resolver: zodResolver(CommentSchema),
	});

	const handleCommentSubmit = handleSubmit(
		async ({ content }: CommentSchema) => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			mutation.mutate({ content, post_id: postId, user_id: user.id });
			reset();
		}
	);

	return (
		<Controller
			control={control}
			render={({ field: { onChange, onBlur, value } }) => (
				<HStack
					space={0}
					flex={1}
					alignItems="flex-end"
					maxHeight={100}
					borderRadius="lg"
					backgroundColor="neutral-3"
				>
					<TextInput
						placeholder="Add a comment..."
						placeholderTextColor={colors["neutral-9"]}
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						multiline
						style={{
							flex: 1,
							paddingTop: 10,
							paddingBottom: 10,
							paddingHorizontal: 16,
							color: colors["neutral-12"],
						}}
					/>
					{value?.trim() && value.trim().length <= 280 && (
						<TouchableOpacity
							disabled={mutation.isLoading}
							onPress={handleCommentSubmit}
						>
							<Box pr={12} py={8}>
								<Body fontWeight="600" color="blue-11">
									Publish
								</Body>
							</Box>
						</TouchableOpacity>
					)}
				</HStack>
			)}
			name="content"
		/>
	);
};

export default CommentBar;
