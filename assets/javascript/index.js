let cards = document.getElementById("cards");
let containerCheck = document.getElementById("containerCheck");
let form = document.getElementById("formListen");
let info;
let data;
//Crear checkbox
let fn = (category) => category.category;
let eventsWithCategory;
let categories;
let categoriesNoRepeat;
let arrayCategoriesNoRepeat;
fetch("https://amazing-events.herokuapp.com/api/events")
	.then((response) => response.json())
	.then((json) => {
		info = json;
		data = info.events;

		execute();
	})
	.catch((error) => console.log(error));

function execute() {
	eventsWithCategory = data.filter(fn);
	categories = eventsWithCategory.map(fn);
	categoriesNoRepeat = new Set(categories);
	arrayCategoriesNoRepeat = Array.from(categoriesNoRepeat);
	createCheckbox(arrayCategoriesNoRepeat, containerCheck);
	renderCards(eventsWithCategory, cards);
	containerCheck.addEventListener("change", filterSearch);
	form.addEventListener("submit", (e) => {
		e.preventDefault();
	});
	searchBar.addEventListener("keyup", filterSearch);
}

function createCheckbox(array, container) {
	let aux = "";
	array.forEach(
		(value) =>
			(aux += ` <label class="btn btn-dark active "><input type="checkbox"
									value="${value}"								
								/>${value}
	 </label>`)
	);

	container.innerHTML = aux;
}

//Crear cards

function createCard(evento) {
	let div = document.createElement("div");
	div.classList.add(`card`);
	div.innerHTML += `<img src="${evento.image}"
						class="card-img-top"
						alt="Image of ${evento.name}"/>
					<div class="card-body d-flex flex-column align-items-center">
						<h3 class="card-title">${evento.name}</h3>
						<p class="card-text">
							${evento.description}
						</p>
						<h3 class="mt-auto">
							$ ${evento.price}
						</h3>
						<a
							href="./details.html?id=${evento._id}"
							class="btn btn-primary align-self-stretch "
							>More info...</a
						>
					</div>`;
	return div;
}

function renderCards(events, container) {
	container.innerHTML = "";
	if (events.length == 0) {
		cards.innerHTML = `<h2 class="mt-5 text-light bg-dark p-3">There are no events to show</h2>`;
	} else {
		let fragment = document.createDocumentFragment();
		events.forEach((evento) => fragment.appendChild(createCard(evento)));

		container.appendChild(fragment);
	}
}

//filtro checkbox

function filterCheck() {
	const checked = Array.from(
		document.querySelectorAll('input[type="checkbox"]:checked')
	).map((input) => input.value);

	const filteredEvents = eventFilterByCategory(eventsWithCategory, checked);

	filteredEvents.length !== 0
		? renderCards(filteredEvents, cards)
		: (cards.innerHTML = "<h2>There are no events to show</h2>");

	return filteredEvents;
}

function eventFilterByCategory(events, categoriesSelected) {
	let fn = (evento) =>
		categoriesSelected.includes(evento.category) ||
		categoriesSelected.length === 0;
	let filtered = events.filter(fn);
	return filtered;
}

// filtro Searchbar

let searchBar = document.querySelector("input[type=search]");

function filterSearch() {
	let filterInput = searchBar.value.toLowerCase().trim();
	let aux = [];

	filterCheck().forEach((element) => {
		if (element.name.toLocaleLowerCase().includes(filterInput)) {
			aux.push(element);
		} else {
		}
	});

	renderCards(aux, cards);
}
