export default function () {
	const isDropdownVisible = ref(false);

	const toggleDropdown = () => {
		isDropdownVisible.value = !isDropdownVisible.value;
	};

	const closeDropdown = () => {
		isDropdownVisible.value = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (!event.target) return;
		const dropdownContainer = document.querySelector(".dropdown-container");
		if (
			dropdownContainer &&
			!dropdownContainer.contains(event.target as Node)
		) {
			closeDropdown();
		}
	};

	onMounted(() => {
		document.addEventListener("click", handleClickOutside);
	});

	onBeforeUnmount(() => {
		document.removeEventListener("click", handleClickOutside);
	});

	return {
		toggleDropdown,
		isDropdownVisible,
	};
}
