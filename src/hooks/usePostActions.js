import { ref, inject } from "vue";
import likeBlack from "@/assets/like_black.png";
import likeRed from "@/assets/like_red.png";
import starBlack from "@/assets/star_black.png";
import starYellow from "@/assets/star_yellow.png";
import transmitBlue from "@/assets/transmit2.png";
import transmitBlack from "@/assets/transmit.png";
import axios from "../utils/axios";

export function usePostActions(post) {
	// 管理点赞状态
	const isLiked = ref(false);
	const likeImage = ref(likeBlack);

	// 管理收藏状态
	const isFavorited = ref(false);
	const favoriteImage = ref(starBlack);
	const transmitImage = ref(transmitBlack);

	// 管理转发消息
	const shareMessage = ref("");

	// 管理评论内容
	const commentContent = ref("");

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
	// const sharePost = () => {
	// 	transmitImage.value = transmitBlue;
	// 	const postUrl = `http://47.108.29.209/post/${post.value.postDTO.postID}`;
	// 	console.log(post);
	// 	const message = `我在学吧平台上看到了这篇帖子，快来一起看看吧！\n【${post.value.postDTO.postTitle}】\n${postUrl}`;

	// 	if (navigator.clipboard) {
	// 		navigator.clipboard
	// 			.writeText(message)
	// 			.then(() => {
	// 				showAlert("帖子地址已复制到剪贴板", true);
	// 			})
	// 			.catch((err) => {
	// 				showAlert("复制失败，请手动复制帖子地址", false);
	// 			});
	// 	} else {
	// 		shareMessage.value = message;
	// 		showAlert("当前环境不支持剪贴板操作，请手动复制帖子地址", false);
	// 	}
	// };
	const sharePost = () => {
		transmitImage.value = transmitBlue;
		const postUrl = `http://47.108.29.209/postDetail/${post.value.postDTO.postID}`;
		console.log(post);
		const message = `我在学吧平台上看到了这篇帖子，快来一起看看吧！\n【${post.value.postDTO.postTitle}】\n${postUrl}`;
		try {
			const textarea = document.createElement("textarea");
			textarea.value = message;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			document.body.removeChild(textarea);
			showAlert("帖子地址已复制到剪贴板", true);
		} catch (err) {
			showAlert("复制失败，请手动复制帖子地址", false);
		}
	};

	// 回复帖子
	const replyPost = async () => {
		try {
			const response = await axios.post("/api/post/replypost", {
				cdto: {
					relaID: post.value.postDTO.postID,
					userID: localStorage.getItem("user_id"),
					content: commentContent.value,
				},
				picdto: {
					url: "",
				},
			});

			if (response.data.code === 1) {
				showAlert("评论成功", true);

				commentContent.value = "";
			} else {
				showAlert(`评论失败: ${response.data.msg}`, false);
			}
		} catch (error) {
			showAlert("评论失败，请稍后重试！", false);
		}
	};

	return {
		isLiked,
		likeImage,
		isFavorited,
		favoriteImage,
		shareMessage,
		commentContent,
		toggleLike,
		toggleFavorite,
		sharePost,
		replyPost,
		transmitImage,
	};
}
