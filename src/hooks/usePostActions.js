import { ref, inject } from "vue";
import likeBlack from "@/assets/like_black.png";
import likeRed from "@/assets/like_red.png";
import starBlack from "@/assets/star_black.png";
import starYellow from "@/assets/star_yellow.png";
import axios from "../utils/axios";
export function usePostActions(post) {
	// 管理点赞状态
	const isLiked = ref(false);
	const likeImage = ref(likeBlack);

	// 管理收藏状态
	const isFavorited = ref(false);
	const favoriteImage = ref(starBlack);

	// 管理转发消息
	const shareMessage = ref("");

	const showAlert = inject("showAlert");

	// 切换点赞状态
	const toggleLike = async () => {
		try {
			const url = isLiked.value
				? "/api/post/canclecommend"
				: "/api/post/commend";
			const response = await axios.post(url, {
				postID: post.value.postDTO.postID,
				userID: localStorage.getItem("user_id"),
			});
			if (response.data.code === 1) {
				isLiked.value = !isLiked.value;
				likeImage.value = isLiked.value ? likeRed : likeBlack;
				post.value.postDTO.score += isLiked.value ? 1 : -1;
			} else {
				showAlert(`操作失败: ${response.data.msg}`, false);
			}
		} catch (error) {
			showAlert("操作失败，请稍后重试！", false);
		}
	};

	// 切换收藏状态
	const toggleFavorite = async () => {
		try {
			const url = isFavorited.value
				? "/api/post/canclefavorite"
				: "/api/post/favorite";
			const response = await axios.post(url, {
				postID: post.value.postDTO.postID,
				userID: localStorage.getItem("user_id"),
			});
			if (response.data.code === 1) {
				isFavorited.value = !isFavorited.value;
				favoriteImage.value = isFavorited.value ? starYellow : starBlack;
				 post.value.postDTO.collectNum += isFavorited.value ? 1 : -1;
			} else {
				showAlert(`操作失败: ${response.data.msg}`, false);
			}
		} catch (error) {
			showAlert("操作失败，请稍后重试！", false);
		}
	};

	// 转发帖子
	const sharePost = () => {
		const postUrl = `http://47.108.29.209/post/${post.value.postDTO.postID}`;
		console.log(post);

		navigator.clipboard
			.writeText(postUrl)
			.then(() => {
				shareMessage.value = "帖子地址已复制到剪贴板";
			})
			.catch((err) => {
				showAlert("复制失败，请手动复制帖子地址", false);
			});
	};

	return {
		isLiked,
		likeImage,
		isFavorited,
		favoriteImage,
		shareMessage,
		toggleLike,
		toggleFavorite,
		sharePost,
	};
}
