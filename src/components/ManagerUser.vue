<template>
	<div class="home" style="transform: scale(1.0);">
		<div class="main-content">
			<h1 class="title">用户后台管理</h1>
			<div class="content">
				<div class="table-container">
					<table v-if="filteredUserList.length > 0" class="report-table">
						<thead>
							<tr>
								<th>序号</th>
								<th>用户名</th>
								<th>头像</th>
								<th>在线状态</th>
								<th>性别</th>
								<th>邮箱</th>
								<th>电话</th>
								<th>地址</th>
								<th>学校</th>
								<th>状态</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(user, index) in filteredUserList" :key="user.userID" @click="toggleHighlight($event)" @dblclick="showDetail(user)">
								<td>{{ index + 1 }}</td>
								<td>{{ user.userName }}</td>
								<td><img :src="user.picURL" alt="头像" width="50" height="50"></td>
								<td>{{ getOnlineStatus(user.onlineStatus) }}</td>
								<td>{{ getGender(user.gender) }}</td>
								<td>{{ user.email }}</td>
								<td>{{ user.phone }}</td>
								<td>{{ user.address.length > 10 ? user.address.substring(0, 10) + '...' : user.address }}</td>
								<td>{{ user.school }}</td>
								<td :class="getStatusClass(user.status)">{{ getStatus(user.status) }}</td>
								<td>
									<div v-if="user.status === 0" class="btn-group-vertical">
										<button @click="handleUser(user, 1)" class="btn btn-danger">封禁</button>
									</div>
									<button v-if="user.status === 1" @click="handleUser(user, 0)" class="btn btn-success">解封</button>
								</td>
							</tr>
						</tbody>
					</table>
					<div v-else class="no-results">
						<p class="no-results-text">抱歉，没有找到匹配的结果。</p>
					</div>
				</div>
			</div>
			<!-- 退出按钮 -->
			<div class="logout-btn">
				<img src="@/assets/exit.png" @click="confirmLogout" alt="退出" class="exit-icon" @mouseover="showExitText" @mouseout="hideExitText" />
				<span v-if="isExitTextVisible" class="exit-text">退出登录</span>
			</div>
			<!-- 切换至用户管理按钮 -->
			<div class="switch-btn">
				<button @click="switchToUserManagement" class="btn btn-primary">切换至帖子管理</button>
			</div>
		</div>
	</div>
	<!-- 详细信息弹窗 -->
	<div v-if="isDetailVisible" class="detail-modal">
		<div class="detail-content">
			<h2>详细信息</h2>
			<p><strong>用户名:</strong> {{ selectedUser.userName }}</p>
			<p><strong>头像:</strong> <img :src="selectedUser.picURL" alt="头像" width="50" height="50"></p>
			<p><strong>在线状态:</strong> {{ getOnlineStatus(selectedUser.onlineStatus) }}</p>
			<p><strong>性别:</strong> {{ getGender(selectedUser.gender) }}</p>
			<p><strong>邮箱:</strong> {{ selectedUser.email }}</p>
			<p><strong>电话:</strong> {{ selectedUser.phone }}</p>
			<p><strong>地址:</strong> {{ selectedUser.address }}</p>
			<p><strong>学校:</strong> {{ selectedUser.school }}</p>
			<p><strong>状态:</strong> {{ getStatus(selectedUser.status) }}</p>
			<button @click="closeDetail" class="btn btn-secondary">关闭</button>
		</div>
	</div>
</template>

<script>
import { ref, inject, provide, onMounted, onUnmounted, computed } from "vue";
import axios from "../utils/axios";

export default {
  name: "ManagerHome",
  setup() {
    const router = inject("router");
    const showAlert = inject("showAlert");
    const showConfirm = inject("showConfirm");
    const userList = ref([]);
    const isSearching = ref(false);
    const searchQuery = ref("");
    const selectedRow = ref(null);
    const isExitTextVisible = ref(false);
    const isDetailVisible = ref(false);
    const selectedUser = ref({});
    let intervalId = null;

    const fetchUserList = async () => {
      try {
        const res = await axios.get("/api/backstage/getuserlist");
        if (res.data.code === 1) {
          const users = res.data.data;
          for (const user of users) {
            const picRes = await axios.post("/api/source/picture", {
              picID: user.imgID,
              status: 0
            });
            if (picRes.data.code === 1) {
              user.picURL = picRes.data.data.picURL;
            } else {
              user.picURL = "";
            }
          }
          userList.value = users;
        } else {
          showAlert("获取用户列表失败: " + res.data.msg, false);
        }
      } catch (error) {
        showAlert("请求用户列表失败: " + error, false);
      }
    };

    const filteredUserList = computed(() => {
      return userList.value;
    });

    const getOnlineStatus = (status) => {
      switch (status) {
        case 0:
          return "在线";
        case 1:
          return "隐身";
        case 2:
          return "忙碌";
        case 3:
          return "离线";
        default:
          return "未知";
      }
    };

    const getGender = (gender) => {
      switch (gender) {
        case 0:
          return "保密";
        case 1:
          return "男";
        case 2:
          return "女";
        default:
          return "未知";
      }
    };

    const getStatus = (status) => {
      switch (status) {
        case 0:
          return "正常";
        case 1:
          return "封禁";
        case 3:
          return "已注销";
        default:
          return "未知";
      }
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 0:
          return "status-normal";
        case 1:
          return "status-banned";
        case 3:
          return "status-processed";
        default:
          return "";
      }
    };

    const toggleHighlight = (event) => {
      const row = event.currentTarget;
      if (selectedRow.value) {
        selectedRow.value.classList.remove('highlighted');
      }
      if (selectedRow.value === row) {
        selectedRow.value = null;
      } else {
        row.classList.add('highlighted');
        selectedRow.value = row;
      }
    };

    const showDetail = (user) => {
      selectedUser.value = user;
      isDetailVisible.value = true;
    };

    const closeDetail = () => {
      isDetailVisible.value = false;
    };

    const handleUser = async (user, status) => {
      try {
        const adminID = localStorage.getItem("admin_id");
        const res = await axios.post("/api/backstage/usermanage", {
          status: status,
					adminID: adminID,
					userID: user.userID,	
        });
        if (res.data.code === 1) {
          showAlert("操作成功", true);
          fetchUserList();
        } else {
          showAlert("操作失败" , false);
        }
      } catch (error) {
        showAlert("请求操作失败: " + error, false);
      }
    };

    const confirmLogout = () => {
      showConfirm(
        "您确定要退出吗？",
        "退出成功",
        true,
        (confirmed) => {
          if (confirmed) {
            router.push("/login");
          }
        }
      );
    };

    const showExitText = () => {
      isExitTextVisible.value = true;
    };

    const hideExitText = () => {
      isExitTextVisible.value = false;
    };

    const switchToUserManagement = () => {
      router.push({ name: "ManagerHome" });
    };

    provide("clearSearch", () => {
      searchQuery.value = "";
    });

    onMounted(() => {
      fetchUserList();
      intervalId = setInterval(fetchUserList, 1000); 
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return { userList, filteredUserList, getOnlineStatus, getGender, getStatus, getStatusClass, toggleHighlight, showDetail, closeDetail, handleUser, confirmLogout, isExitTextVisible, showExitText, hideExitText, isDetailVisible, selectedUser, switchToUserManagement };
  },
};
</script>

<style scoped>

.home {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
    margin: -10vw;
}

.main-content {
	position: relative;
	padding: 18px;
	border-radius: 8px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.title {
	font-size: 2.7em;
	color: #333;
	margin-bottom: 27px;
	text-align: center;
	font-weight: bold;
    margin-top: 20px;
}

.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top:30px;
}

.table-container {
	width: 100%;
	height: 400px; 
	overflow-y: auto;
}

.report-table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 27px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
	border-radius: 7px;
	overflow: hidden;
}

.report-table th, .report-table td {
	border: 1px solid #ddd;
	padding: 14px;
	text-align: left;
	white-space: nowrap;
	font-size: 1.1em;
	width: 10%;
}

.report-table th {
	background-color: #f8f8f8;
	color: #333;
	font-weight: bold;
	position: sticky;
	top: 0;
	z-index: 1;
}

.report-table tr:nth-child(even) {
	background-color: #f9f9f9;
}

.report-table tr:hover {
	background-color: #f1f1f1;
	cursor: pointer;
}

.report-table tr.highlighted {
	background-color: #b3e5fc;
	transition: background-color 0.3s ease;
}

.status-normal {
	background-color: #d4edda;
}

.status-banned {
	background-color: #f8d7da;
}

.status-processed {
	background-color: #a9a9a9;
}

.no-results {
	text-align: center;
	margin-top: 27px;
}

.no-results-text {
	font-size: 1.4em;
	color: #555;
}

.btn {
	padding: 9px 18px;
	border: none;
	border-radius: 4px;
	color: white;
	cursor: pointer;
	margin: 5px;
	font-size: 0.9em;
}

.btn-danger {
	background-color: #dc3545;
}

.btn-secondary {
	background-color: #6c757d;
}

.btn-success {
	background-color: #28a745;
}

.btn-primary {
	background-color: #007bff;
}

.btn:hover {
	opacity: 0.8;
}

.exit-icon {
	width: 30px;
	height: 30px;
	cursor: pointer;
	position: absolute;
	top: 20px;
	left: 20px;
}

.exit-text {
	position: absolute;
	top: 20px;
	left: 60px;
	font-size: 1.2em;
	color: #333;
}

.switch-btn {
	position: absolute;
	top: 20px;
	right: 20px;
}

.detail-modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
	z-index: 1;
}

.detail-content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.detail-content h2 {
	margin-bottom: 20px;
}

.detail-content p {
	margin: 5px 0;
}

.detail-content .btn {
	align-self: flex-end;
	margin-top: 20px;
}

.btn-group-vertical {
	display: flex;
	flex-direction: column;
}
</style>
