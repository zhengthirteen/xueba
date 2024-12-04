import { ref, inject } from "vue";

export function usePostActions() {
	// 管理点赞状态
	const isLiked = ref(false);
	const likeImage = ref("src/fig/like_black.png");

	// 管理收藏状态
	const isFavorited = ref(false);
	const favoriteImage = ref("src/fig/star_black.png");

	// 管理转发消息
	const shareMessage = ref("");

	const showAlert = inject("showAlert");

	// 切换点赞状态
	const toggleLike = () => {
		isLiked.value = !isLiked.value;
		likeImage.value = isLiked.value
			? "src/fig/like_red.png"
			: "src/fig/like_black.png";
		showAlert(isLiked.value ? "点赞成功！" : "取消点赞", isLiked.value);
	};

	// 切换收藏状态
	const toggleFavorite = () => {
		isFavorited.value = !isFavorited.value;
		favoriteImage.value = isFavorited.value
			? "src/fig/star_yellow.png"
			: "src/fig/star_black.png";
		showAlert(isFavorited.value ? "收藏成功！" : "取消收藏", isFavorited.value);
	};

	// 转发帖子
	const sharePost = () => {
		showAlert("转发成功！", true);
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
