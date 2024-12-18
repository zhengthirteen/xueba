<template>
	<div class="top-bar" :class="{ hidden: isHidden }" ref="topBar">
		<div class="search-container">
			<select
				v-model="selectedFilter"
				@change="handleSearch"
				class="filter-dropdown"
			>
				<option
					v-for="(label, index) in filterLabels"
					:key="index"
					:value="index"
				>
					{{ label }}
				</option>
			</select>
			<input
				type="text"
				placeholder="搜索..."
				class="search-bar"
				v-model="searchQuery"
				@keyup.enter="handleSearch"
			/>
			<button class="search-button" @click="handleSearch">搜索</button>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
	name: "SearchBar",
	props: {
		onSearch: {
			type: Function,
			required: true,
		},
	},
	setup(props) {
		const searchQuery = ref("");
		const isHidden = ref(false);
		const topBar = ref(null);
		const selectedFilter = ref(0);
		const filterLabels = [
			"全部",
			"校园学习",
			"打听求助",
			"日常趣事",
			"恋爱交友",
			"资料分享",
		];

		const handleSearch = () => {
			props.onSearch(searchQuery.value, selectedFilter.value);
		};

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			if (scrollTop > 100) {
				isHidden.value = true;
			} else {
				isHidden.value = false;
			}
		};

		onMounted(() => {
			window.addEventListener("scroll", handleScroll);
		});

		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});

		return {
			searchQuery,
			isHidden,
			topBar,
			handleSearch,
			selectedFilter,
			filterLabels,
		};
	},
};
</script>

<style scoped>
.top-bar {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 20px;
	position: sticky;
	top: 40px;
	background: white;
	padding: 10px;
	transition: opacity 0.5s, top 0.5s;
	z-index: 10;
	width: 80%;
	margin: 0 auto;
	height: auto;
}

.top-bar.hidden {
	opacity: 0;
	top: 0;
}

.search-container {
	display: flex;
	width: 100%;
	align-items: center;
}

.filter-dropdown {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px 0 0 5px;
	height: 50px;
	margin-right: 10px;
	flex-grow: 0;
}

.search-bar {
	flex-grow: 1;
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px 0 0 5px;
	height: 50px;
}

.search-button {
	padding: 10px 20px;
	border: none;
	background-color: #007bff;
	color: white;
	border-radius: 0 5px 5px 0;
	cursor: pointer;
	height: 50px;
	width: 20%;
}

.search-button:hover {
	background-color: #0056b3;
}
</style>
