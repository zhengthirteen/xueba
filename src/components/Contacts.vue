<template>
	<div class="contacts">
		<Sidebar />
		<SearchBar :onSearch="handleSearch" />
		<div class="contact-list">
			<div
				v-for="contact in filteredContacts"
				:key="contact.id"
				class="contact-item"
			>
				<router-link :to="'/chat/' + contact.id">{{
					contact.name
				}}</router-link>
				<div
					class="dropdown-container"
					@mouseover="showDropdown(contact.id)"
					@mouseleave="hideDropdown(contact.id)"
				>
					<button class="dropdown-button">...</button>
					<div v-if="dropdownVisible === contact.id" class="dropdown">
						<button @click="deleteContact(contact.id)">删除好友</button>
						<button @click="viewContactDetails(contact.id)">好友详情</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, inject } from "vue";
import SearchBar from "./SearchBar.vue";
import Sidebar from "./Sidebar.vue";

export default {
	name: "Contacts",
	components: {
		SearchBar,
		Sidebar,
	},
	setup() {
		const contacts = ref([
			{ id: 1, name: "好友A" },
			{ id: 2, name: "好友B" },
			{ id: 3, name: "好友C" },
			{ id: 4, name: "好友C" },
			{ id: 5, name: "好友C" },
			{ id: 6, name: "好友C" },
			{ id: 7, name: "好友C" },
			{ id: 8, name: "好友C" },
			{ id: 9, name: "好友C" },
			{ id: 10, name: "好友C" },
		]);
		const searchQuery = ref("");
		const dropdownVisible = ref(null);
		const showAlert = inject("showAlert");

		const handleSearch = (query) => {
			searchQuery.value = query;
		};

		const filteredContacts = computed(() => {
			return contacts.value.filter((contact) =>
				contact.name.includes(searchQuery.value)
			);
		});

		const showDropdown = (id) => {
			dropdownVisible.value = id;
		};

		const hideDropdown = (id) => {
			if (dropdownVisible.value === id) {
				dropdownVisible.value = null;
			}
		};

		const deleteContact = (id) => {
			contacts.value = contacts.value.filter((contact) => contact.id !== id);
			showAlert("好友已删除", true);
		};

		const viewContactDetails = (id) => {
			alert(`查看好友 ${id} 的详情`);
		};

		return {
			contacts,
			searchQuery,
			dropdownVisible,
			handleSearch,
			filteredContacts,
			showDropdown,
			hideDropdown,
			deleteContact,
			viewContactDetails,
		};
	},
};
</script>

<style scoped>
.contacts {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	width: 75vw;
	margin-left: 10vw;
}

.contact-list {
	width: 100%;
	padding: 20px;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #ddd;
	padding: 10px;
	margin-bottom: 10px;
	position: relative;
}

.dropdown-container {
	position: relative;
	width: 50px;
}

.dropdown-button {
	background: none;
	border: none;
	cursor: pointer;
	font-size: 20px;
}

.dropdown {
	position: absolute;
	top: 100%;
	right: 0;
	background: white;
	border: 1px solid #ddd;
	padding: 10px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	z-index: 10;
	width: 95px;
}
</style>
