document.getElementById("tabla").style.overflow = "scroll";
fetch("https://amazing-events.herokuapp.com/api/events")
	.then((response) => response.json())
	.then((json) => {
		info = json;
		data = info.events;

		data.forEach((event) => {
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
		});
		execute();
	})
	.catch((error) => console.log(error));
let data;
let info;
let fn = (category) => category.category;
let highest = document.getElementById("highest");
let lowest = document.getElementById("lowest");
let larger = document.getElementById("larger");
let upcomingTable = document.getElementById("upcomingTable");
let pastTable = document.getElementById("pastTable");
let pastEvents;
let upcomingEvents;
let objCategoriesUpcoming = [];
let objCategoriesPast = [];
let eventsWithCategoryPast;
let pastCategoriesNoRepeat;
let eventsWithCategoryUpcoming;
let upcomingCategoriesNoRepeat;
function execute() {
	console.log(data);
	pastEvents = data.filter((event) => event.date < info.currentDate);

	upcomingEvents = data.filter((event) => event.date > info.currentDate);
	pastEvents.sort((a, b) => b.percentage - a.percentage);
	largerCapacity = data.sort((a, b) => b.capacity - a.capacity).slice(0, 1);
	lowestPercentage = pastEvents.slice(-1);
	highestPercentage = pastEvents.slice(0, 1);

	//Create highest %/ lowest %/ larger capacity  events
	highest.innerHTML = highestPercentage[0].name;
	lowest.innerHTML = lowestPercentage[0].name;
	larger.innerHTML = largerCapacity[0].name;

	eventsWithCategoryPast = pastEvents.filter(fn);
	pastCategoriesNoRepeat = Array.from(new Set(eventsWithCategoryPast.map(fn)));

	eventsWithCategoryUpcoming = upcomingEvents.filter(fn);
	upcomingCategoriesNoRepeat = Array.from(
		new Set(eventsWithCategoryUpcoming.map(fn))
	);

	function createObj(arrayNoRepeat, arrayUpcomingOrPast, objName) {
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
	}
	createObj(upcomingCategoriesNoRepeat, upcomingEvents, objCategoriesUpcoming);
	createObj(pastCategoriesNoRepeat, pastEvents, objCategoriesPast);

	function createTableRow(objUpcomingOrPast, container) {
		objUpcomingOrPast.forEach((event) => {
			container.innerHTML += `
		<tr>
			<td>${event.name}</td>
			<td>$${event.revenue}</td>
			<td>${event.percentage.toFixed(2)}%</td>
		</tr>
		
		`;
		});
	}
	createTableRow(objCategoriesUpcoming, upcomingTable);
	createTableRow(objCategoriesPast, pastTable);
}
