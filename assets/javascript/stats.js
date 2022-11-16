const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			dataEvents: [],
			objCategoriesUpcoming: [],
			objCategoriesPast: [],
			upcomingCategoriesNoRepeat: [],
			largerCapacity: [],
			lowestPercentage: [],
			highestPercentage: [],
			eventsWithCategoryPast: [],
			info: {},
			pastEvents: [],
			upcomingEvents: [],
		};
	},

	created() {
		fetch("https://amazing-events.herokuapp.com/api/events")
			.then((response) => response.json())
			.then((json) => {
				this.info = json;
				this.dataEvents = this.info.events;

				this.dataEvents.forEach((event) => this.addProperty(event));
				this.upcomingPastFilter();
				this.pastEvents.sort((a, b) => b.percentage - a.percentage);
				this.largerCapacity = this.dataEvents
					.sort((a, b) => b.capacity - a.capacity)
					.slice(0, 1)[0].name;

				this.lowestPercentage = this.pastEvents.slice(-1)[0].name;
				this.highestPercentage = this.pastEvents.slice(0, 1)[0].name;

				let fn = (category) => category.category;
				this.eventsWithCategoryPast = this.pastEvents.filter(fn);
				this.pastCategoriesNoRepeat = Array.from(
					new Set(this.eventsWithCategoryPast.map(fn))
				);

				this.eventsWithCategoryUpcoming = this.upcomingEvents.filter(fn);
				this.upcomingCategoriesNoRepeat = Array.from(
					new Set(this.eventsWithCategoryUpcoming.map(fn))
				);

				this.createObj(
					this.upcomingCategoriesNoRepeat,
					this.upcomingEvents,
					this.objCategoriesUpcoming
				);

				this.createObj(
					this.pastCategoriesNoRepeat,
					this.pastEvents,
					this.objCategoriesPast
				);
			})
			.catch((error) => console.log(error));
	},
	methods: {
		createObj(arrayNoRepeat, arrayUpcomingOrPast, objName) {
			arrayNoRepeat.sort().forEach((category) => {
				let obj = {
					name: "",
					revenue: 0,
					percentage: 0,
				};

				obj.name = category;
				obj.revenue = arrayUpcomingOrPast
					.filter((events) => events.category == category)
					.map((events) => events.revenue)
					.reduce((a, b) => a + b, 0);

				obj.percentage =
					arrayUpcomingOrPast
						.filter((events) => events.category == category)
						.map((events) => events.percentage)
						.reduce((a, b) => a + b, 0) /
					arrayUpcomingOrPast.filter((events) => events.category == category).length;
				objName.push(obj);
			});
		},
		addProperty(event) {
			event.percentage = parseInt(
				event.assistance
					? ((event.assistance * 100) / event.capacity).toFixed(2)
					: ((event.estimate * 100) / event.capacity).toFixed(2)
			);

			event.revenue = parseInt(
				event.assistance
					? event.assistance * event.price
					: event.estimate * event.price
			);
		},
		upcomingPastFilter() {
			this.pastEvents = this.dataEvents.filter(
				(event) => event.date < this.info.currentDate
			);

			this.upcomingEvents = this.dataEvents.filter(
				(event) => event.date > this.info.currentDate
			);
		},
	},

	computed: {},
});

app.mount("#app");
