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
			upcomingEvents: [],
		};
	},

	created() {
		fetch("https://amazing-events.herokuapp.com/api/events")
			.then((response) => response.json())
			.then((json) => {
				this.info = json;
				this.dataEvents = this.info.events;

				this.upcomingEvents = this.dataEvents.filter(
					(event) => event.date > this.info.currentDate
				);

				this.filteredEvents = this.upcomingEvents;
				this.getCategories();
			})
			.catch((error) => console.log(error));
	},
	methods: {
		getCategories() {
			let fn = (events) => events.category;
			this.categories = [...new Set(this.upcomingEvents.filter(fn).map(fn))];
		},
		find() {
			this.filteredEvents = this.upcomingEvents.filter((events) =>
				events.name
					.toLowerCase()
					.trim()
					.includes(this.inputSearch.toLowerCase().trim())
			);
		},
	},

	computed: {
		filter() {
			const eventsFilteredByCategory = this.upcomingEvents.filter(
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
