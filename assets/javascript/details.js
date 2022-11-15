const queryString = location.search;

let data;
const params = new URLSearchParams(queryString);
const id = params.get("id");
let evento;

fetch("https://amazing-events.herokuapp.com/api/events")
	.then((response) => response.json())
	.then((json) => {
		info = json;
		data = info.events;
		evento = data.find((eventos) => eventos._id == id);
		createCard();
	})
	.catch((error) => console.log(error));
let sectionDetail = document.getElementById("sectionDetail");

function createCard() {
	sectionDetail.innerHTML = `<div class="w-50 h-75 p-3 border border-dark d-flex justify-content-center align-items-center detailImg gap-2">
		<img src="${evento.image}" alt="${evento.name}" />
	</div>
	<div class="d-flex flex-column justify-content-center align-items-center w-50 h-75 p-3 border border-dark detailP">
		
    <h3>${evento.name}</h3>

		<div>
			<p>Category: ${evento.category}</p>
			
			<p> Date: ${evento.date}</p>
            <p>Capacity: ${evento.capacity}</p>
			<p>${
				evento.estimate
					? "Estimate: " + evento.estimate
					: "Asisstance: " + evento.assistance
			}</p>
			<p>${evento.description}</p>
			
			<h3>Price: $${evento.price}</h3>
		</div>
	</div> `;
}
