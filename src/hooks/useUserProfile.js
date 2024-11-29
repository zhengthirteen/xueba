import { ref, onMounted } from "vue";
import axios from "axios"; // 引入 axios 用于发送 HTTP 请求
export function useUserProfile() {
// 定义用户资料的状态
const user = ref({
    name: "张三",
    bio: "这是张三的个人简介。",
    avatar: "https://via.placeholder.com/100", // 模拟头像
    status: "在线", // 模拟状态
    gender: "男", // 模拟性别
  });

  // 用于存储用户邮箱、手机号、地址和学校
  const email = ref("user@example.com"); // 模拟邮箱
  const phone = ref("+1 234 567 890"); // 模拟手机号
  const address = ref("1234 Elm Street, Springfield, IL"); // 模拟地址
  const school = ref("Springfield University"); // 模拟学校


//   // 定义用户资料的状态
//   const user = ref({
//     name: "",
//     bio: "",
//     avatar: "",
//     status: "",
//     gender: "",
//   });

//   // 用于存储用户邮箱、手机号、地址和学校
//   const email = ref("");
//   const phone = ref("");
//   const address = ref("");
//   const school = ref("");

//   // 模拟从后端 API 获取数据的函数
//   const getUserDetails = async (userId) => {
//     try {
//       // 假设我们从后端获取数据
//       const response = await axios.get(`https://api.example.com/users/${userId}`);

//       // 假设后端返回的数据结构如下
//       const data = response.data;

//       // 更新用户资料
//       user.value = {
//         name: data.name,
//         bio: data.bio,
//         avatar: data.avatar,
//         status: data.status,
//         gender: data.gender,
//       };

//       // 更新其他信息（邮箱、手机号、地址、学校）
//       email.value = data.email;
//       phone.value = data.phone;
//       address.value = data.address;
//       school.value = data.school;

//     } catch (error) {
//       console.error("获取用户资料失败:", error);
//     }
//   };

//   // 在组件挂载时调用获取用户详细信息
//   onMounted(() => {
//     const userId = 1; // 假设的用户 ID
//     getUserDetails(userId);  // 调用 API 获取用户详细信息
//   });

  // 编辑资料的逻辑（这里只是一个跳转到编辑页面）
  function editProfile() {
    window.location.href = "/user-edit"; // 使用 window.location 跳转到编辑页面
  }

  return { user, email, phone, address, school, editProfile };
}
