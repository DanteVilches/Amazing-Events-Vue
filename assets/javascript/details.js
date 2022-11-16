const { createApp } = Vue;

const app = createApp({
	data() {
		return {
			dataEvents: [],
			evento: [],
		};
	},

	created() {
		fetch("https://amazing-events.herokuapp.com/api/events")
			.then((response) => response.json())
			.then((json) => {
				this.info = json;
				this.dataEvents = this.info.events;
				queryString = location.search;
				params = new URLSearchParams(queryString);
				this.id = params.get("id");
				this.evento = this.dataEvents.find((eventos) => eventos._id == this.id);
			})
			.catch((error) => console.log(error));
	},
	methods: {},

	computed: {},
});

app.mount("#app");
