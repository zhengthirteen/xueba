<template>
	<div class="home">
		<div class="main-content">
			<h1 class="title">后台管理</h1>
			<div class="search-bar">
				<input type="text" v-model="searchQuery" @input="handleSearch" placeholder="搜索..." />
				<button @click="handleSearch(searchQuery)">搜索</button>
			</div>
			<div class="content">
				<div class="table-container">
					<table v-if="!isSearching && filteredReportList.length > 0" class="report-table">
						<thead>
							<tr>
								<th>序号</th>
								<th>被举报内容</th>
								<th>信息类型</th>
								<th>举报原因</th>
								<th>举报者</th>
								<th>内容状态</th>
								<th>处理状态</th>
								<th>举报时间</th>
								<th>更新时间</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(report, index) in filteredReportList" :key="report.reportID" @click="toggleHighlight($event)" @dblclick="showDetail(report)">
								<td>{{ index + 1 }}</td>
								<td>{{ truncateText(report.msgContent, 10) }}</td>
								<td>{{ getMsgType(report.msgType) }}</td>
								<td>{{ truncateText(report.reportContent, 10) }}</td>
								<td>{{ report.reporterName }}</td>
								<td :class="getMsgStatusClass(report.msgStatus)">{{ getMsgStatus(report.msgStatus) }}</td>
								<td :class="{'status-processed': report.reportStatus === 1}">{{ getReportStatus(report.reportStatus) }}</td>
								<td>{{ report.createTime }}</td>
								<td>{{ report.updateTime }}</td>
								<td>
									<button v-if="report.msgStatus === 0 && report.reportStatus === 0" @click="handleReport(report, 2)" class="btn btn-danger">封禁</button>
									<button v-if="report.msgStatus === 0 && report.reportStatus === 0" @click="handleReport(report, 0)" class="btn btn-secondary">忽略</button>
									<button v-if="report.msgStatus === 0 && report.reportStatus === 1" @click="handleReport(report, 2)" class="btn btn-danger">封禁</button>
									<button v-if="report.msgStatus === 2 && report.reportStatus === 1" @click="handleReport(report, 0)" class="btn btn-success">解封</button>
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
		</div>
	</div>
	<!-- 详细信息弹窗 -->
	<div v-if="isDetailVisible" class="detail-modal">
		<div class="detail-content">
			<h2>详细信息</h2>
			<p><strong>被举报内容:</strong> {{ selectedReport.msgContent }}</p>
			<p><strong>信息类型:</strong> {{ getMsgType(selectedReport.msgType) }}</p>
			<p><strong>举报原因:</strong> {{ selectedReport.reportContent }}</p>
			<p><strong>举报者:</strong> {{ selectedReport.reporterName }}</p>
			<p><strong>内容状态:</strong> {{ getMsgStatus(selectedReport.msgStatus) }}</p>
			<p><strong>处理状态:</strong> {{ getReportStatus(selectedReport.reportStatus) }}</p>
			<p><strong>举报时间:</strong> {{ selectedReport.createTime }}</p>
			<p><strong>更新时间:</strong> {{ selectedReport.updateTime }}</p>
			<button @click="closeDetail" class="btn btn-secondary">关闭</button>
		</div>
	</div>
</template>

<script>
import { ref, inject, provide, onMounted, onUnmounted, computed } from "vue";
import axios from "../utils/axios";

export default {
  name: "Home",
  setup() {
    const router = inject("router");
    const showAlert = inject("showAlert");
    const showConfirm = inject("showConfirm");
    const reportList = ref([]);
    const isSearching = ref(false);
    const searchQuery = ref("");
    const selectedRow = ref(null);
    const isExitTextVisible = ref(false);
    const isDetailVisible = ref(false);
    const selectedReport = ref({});
    let intervalId = null;

    const fetchReportList = async () => {
      try {
        const res = await axios.post("/api/backstage/getreportlist");
        if (res.data.code === 1) {
          reportList.value = res.data.data;
        } else {
          showAlert("获取举报列表失败: " + res.data.msg, false);
        }
      } catch (error) {
        showAlert("请求举报列表失败: " + error, false);
      }
    };

    const handleSearch = (query) => {
      if (!query) {
        isSearching.value = false;
        return;
      }
      isSearching.value = true;
      // Implement search logic here if needed
    };

    const filteredReportList = computed(() => {
      return reportList.value;
    });

    const getMsgStatus = (status) => {
      switch (status) {
        case 0:
          return "正常";
        case 1:
          return "删除";
        case 2:
          return "封禁";
        default:
          return "未知";
      }
    };

    const getMsgType = (type) => {
      switch (type) {
        case 0:
          return "帖子";
        case 3:
          return "评论";
        default:
          return "未知";
      }
    };

    const getReportStatus = (status) => {
      switch (status) {
        case 0:
          return "待处理";
        case 1:
          return "已处理";
        default:
          return "未知";
      }
    };

    const getMsgStatusClass = (status) => {
      switch (status) {
        case 0:
          return "status-normal";
        case 2:
          return "status-banned";
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

    const showDetail = (report) => {
      selectedReport.value = report;
      isDetailVisible.value = true;
    };

    const closeDetail = () => {
      isDetailVisible.value = false;
    };

    const truncateText = (text, maxLength) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleReport = async (report, msgStatus) => {
      try {
        const adminID = localStorage.getItem("admin_id");
        const res = await axios.post("/api/backstage/reporthandle", {
          reportID: report.reportID,
          msgStatus: msgStatus,
          adminID: adminID
        });
        if (res.data.code === 1) {
          showAlert("操作成功: " + res.data.msg, true);
          fetchReportList();
        } else {
          showAlert("操作失败: " + res.data.msg, false);
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

    provide("clearSearch", () => {
      searchQuery.value = "";
      handleSearch("");
    });

    onMounted(() => {
      fetchReportList();
      intervalId = setInterval(fetchReportList, 1000); 
    });

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return { handleSearch, reportList, isSearching, searchQuery, filteredReportList, getMsgStatus, getMsgType, getReportStatus, getMsgStatusClass, toggleHighlight, showDetail, closeDetail, truncateText, handleReport, confirmLogout, isExitTextVisible, showExitText, hideExitText, isDetailVisible, selectedReport };
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

.search-bar {
	display: flex;
	justify-content: center;
	margin-bottom: 20px;
}

.search-bar input {
	padding: 10px;
	font-size: 1em;
	border: 1px solid #ddd;
	border-radius: 4px;
	width: 50vw;
	margin-right: 10px;
}

.search-bar button {
	padding: 10px 20px;
	font-size: 1em;
	border: none;
	border-radius: 4px;
	background-color: #007bff;
	color: white;
	cursor: pointer;
}

.search-bar button:hover {
	background-color: #0056b3;
}

.filter-select {
	margin-left: 10px;
	padding: 5px;
	font-size: 0.9em;
	border: 1px solid #ddd;
	border-radius: 4px;
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
</style>
