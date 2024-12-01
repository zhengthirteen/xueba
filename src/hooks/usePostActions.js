import { ref } from 'vue';

export function usePostActions() {
  // 管理点赞状态
  const isLiked = ref(false);

  // 管理收藏状态
  const isFavorited = ref(false);

  // 管理转发消息
  const shareMessage = ref('');

  // 切换点赞状态
  const toggleLike = () => {
    isLiked.value = !isLiked.value;
    alert(isLiked.value ? '点赞成功！' : '取消点赞');
  };

  // 切换收藏状态
  const toggleFavorite = () => {
    isFavorited.value = !isFavorited.value;
    alert(isFavorited.value ? '收藏成功！' : '取消收藏');
  };

  // 转发帖子
  const sharePost = () => {
    shareMessage.value = "帖子已经转发！";
    setTimeout(() => {
      shareMessage.value = ''; // 清空转发信息
    }, 2000);
  };

  return {
    isLiked,
    isFavorited,
    shareMessage,
    toggleLike,
    toggleFavorite,
    sharePost,
  };
}