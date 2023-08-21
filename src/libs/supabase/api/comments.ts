import { sortItems } from "@/utils/arrays";
import { supabase } from "..";
import { Database } from "../types/database.types";

type NewComment = Database["public"]["Tables"]["comments"]["Insert"];

export async function getAll(postId: string) {
	const { data: comments, error } = await supabase
		.from("comments")
		.select("*, author: profiles(*)")
		.eq("post_id", postId);

	if (error) throw error;

	return sortItems(comments);
}

export async function create(newComment: NewComment) {
	const { data, error } = await supabase.from("comments").insert(newComment);

	if (error) throw error;

	return data;
}
