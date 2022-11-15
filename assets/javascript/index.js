const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			events: [],
			filteredEvents: [],
			categories: [],
			inputSearch: "",
			checked: [],
			dataEvents: [],
		};
	},

	created() {
		fetch("https://amazing-events.herokuapp.com/api/events")
			.then((response) => response.json())
			.then((json) => {
				this.info = json;
				this.dataEvents = this.info.events;

				this.filteredEvents = this.dataEvents;
				this.getCategories();
			})
			.catch((error) => console.log(error));
	},
	methods: {
		getCategories() {
			let fn = (events) => events.category;
			this.categories = [...new Set(this.dataEvents.filter(fn).map(fn))];
		},
		find() {
			this.filteredEvents = this.dataEvents.filter((events) =>
				events.name
					.toLowerCase()
					.trim()
					.includes(this.inputSearch.toLowerCase().trim())
			);
		},
	},

	computed: {
		filter() {
			const eventsFilteredByCategory = this.dataEvents.filter(
				(events) =>
					this.checked.includes(events.category) || this.checked.length === 0
			);
			this.filteredEvents = eventsFilteredByCategory.filter((events) =>
				events.name
					.toLowerCase()
					.trim()
					.includes(this.inputSearch.toLowerCase().trim())
			);
		},
	},
});

app.mount("#app");
