<template>
  <div class="auth-container">
    <h2>注册</h2>
    <form @submit.prevent="handleRegister">
      <label for="name">用户名:</label>
      <input v-model="name" id="name" type="text" placeholder="输入用户名" required />

      <label for="gender">性别:</label>
      <input v-model="gender" id="gender" type="text" placeholder="输入性别" required />

      <label for="email">邮箱:</label>
      <input v-model="email" id="email" type="email" placeholder="输入邮箱" required />

      <label for="phone">电话号码:</label>
      <input v-model="phone" id="phone" type="text" placeholder="输入电话号码" required />

      <label for="address">地址:</label>
      <input v-model="address" id="address" type="text" placeholder="输入地址" required />

      <label for="school">学校:</label>
      <input v-model="school" id="school" type="text" placeholder="输入学校" required />

      <label for="password">密码:</label>
      <input v-model="password" id="password" type="password" placeholder="输入密码" required />

      <button type="submit">注册</button>
    </form>
    <p>已有账号？<router-link to="/login">去登录</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Register",
  data() {
    return {
      name: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      school: "",
      password: "",
    };
  },
  methods: {
    async handleRegister() {
      try {
        // 发送POST请求到服务器进行注册
        const response = await axios.post("/api/login/register", {
          name: this.name,
          gender: this.gender,
          email: this.email,
          phone: this.phone,
          address: this.address,
          school: this.school,
          password: this.password,
        });
        if (response.status === 200) {
          alert("注册成功！");
          this.$router.push("/login");
        } else {
          alert("注册失败，请检查输入信息！");
        }
      } catch (error) {
        alert("注册失败，请稍后再试！");
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  width: 400px; /* 调整宽度 */
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.auth-container h2 {
  text-align: center;
  margin-bottom: 20px;
}
.auth-container form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.auth-container label {
  margin-top: 10px;
}
.auth-container input {
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 90%;
}
.auth-container button {
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}
.auth-container p {
  text-align: center;
  margin-top: 10px;
}
</style>