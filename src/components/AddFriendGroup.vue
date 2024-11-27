<template>
  <div class="add-friend-group">
    <h2>添加好友/群组</h2>
    <input v-model="inputValue" placeholder="输入好友/群组ID" />
    <button @click="addFriendGroup">添加</button>
  </div>
</template>

<script>
export default {
  name: "AddFriendGroup",
  data() {
    return {
      inputValue: "",
    };
  },
  methods: {
    addFriendGroup() {
      if (this.inputValue.trim()) {
        alert(`已添加：${this.inputValue}`);
        this.inputValue = "";
      } else {
        alert("请输入有效的好友/群组ID");
      }
    },
  },
};
</script>

<style scoped>
.add-friend-group {
  padding: 20px;
}
.add-friend-group input {
  margin-right: 10px;
}
</style>
