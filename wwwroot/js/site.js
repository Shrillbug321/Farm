if (localStorage.getItem("profiles") === null)
	setStorage();

let profile_id = getProfileId();
let counter = 0;

const field_state = 
{
	empty:"empty",
	need_watering:"need_watering",
	need_fertilise:"need_fertilise",
	plant_grow:"plant_grow",
	plant_grown:"plant_grown",
	item_over:"item_over",
	item_over_disallowed:"item_over_disallowed"
}

function drag_equipment_cell(event)
{
	console.log(event);
	event.dataTransfer.setData("item", event.target.innerText);
}

function dragSeed(event)
{
	event.dataTransfer.setData("item_type", "seed");
	let src = event.target.src;
	let plant_name = (src.substring(src.lastIndexOf('/') + 1, src.length - 4));
	event.dataTransfer.setData("plant_name", plant_name);
	event.dataTransfer.setData("seed_id", event.target.id);
}

function dragStartWateringCan(event)
{
	event.dataTransfer.setData("item_type", "watering_can");
}

function dragStartFertilizer(event)
{
	event.dataTransfer.setData("item_type", "fertilizer");
	event.dataTransfer.setData("times", document.getElementById("fertilizer_text_overlay").textContent);
}

function dragItemOverField(event)
{
	event.preventDefault();
	let field = event.target;

	if (event.dataTransfer.getData("item_type") === "watering_can" ||
		event.dataTransfer.getData("item_type") === "fertilizer")
		return;

	/*if (hasState(field_state.need_watering, field) ||
		hasState(field_state.need_fertilise, field))
	{
		event.dataTransfer.dropEffect = "none";
		changeState(field_state.item_over_disallowed, field)
	}*/
}

function dragItemEnterField(event)
{
	event.preventDefault();
	let field = getFieldIfDroppedOnPlant(event);
	if (hasState(field_state.need_watering, field) ||
		hasState(field_state.need_fertilise, field))
	{
		event.dataTransfer.dropEffect = "none";
		changeState(field_state.item_over_disallowed, field)
	}
	else
		changeState(field_state.item_over, field);
	counter++;
}

function getFieldIfDroppedOnPlant(event)
{
	let target = event.target;
	if (target.getAttribute("id") == null || !target.getAttribute("id").includes("field"))
	{
		if (target.classList.contains("cell_image"))
			target = target.parentElement;

		if (target.getAttribute("id").includes("plant"))
			target = target.parentElement;
	}
	return target;
}

function dragItemLeaveField(event)
{
	event.preventDefault();
	counter--;
	let field = getFieldIfDroppedOnPlant(event);
	if (counter === 0)
	{
		removeState(field_state.item_over, field)
		removeState(field_state.item_over_disallowed, field)
	}
}

function getPlant(plant_id)
{
	let plant = document.getElementById(plant_id);
	let field = plant.parentNode;
	if (hasState(field_state.plant_grown, field))
	{
		field.setAttribute("times_to_fertilise", field.getAttribute("times_to_fertilise") - 1);
		if (field.getAttribute("times_to_fertilise") === "0")
			changeState(field_state.need_fertilise, field)
		
		let src = plant.getElementsByTagName("img")[0].src;
		let plant_name = (src.substring(src.lastIndexOf('/') + 1, src.length - 4));
		
		pushIntoLocalStorage("collected_plants", [{profile_id: profile_id, plant: plant_name}]);
		splitFromLocalStorage("planted", [{profile_id: profile_id, plant: plant_name}]);
		plant.remove();
		document.getElementById("get_plant_sfx").play();
		
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant_name + '&adding=true'
		});
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeAllCollectedCount?plantName=' + plant_name + '&adding=true'
		});
		
		changeState(field_state.empty, field);
	}
}

function hoseWatering()
{
	let fields = document.getElementsByClassName("field");
	document.getElementById("hose_watering_sfx").play();
	for (let field of fields)
	{
		removeState(field_state.need_watering, field);
		setFieldBorderStyle(field);
		fieldWateringTime(field, 4);
	}
}

function buyField()
{
	updateFieldsLocalStorage();
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=20'
	});
	countToRefresh();
}

function hoseBuyIsAvailable()
{
	let money = document.getElementById("money_text_overlay").textContent;
	let button = document.getElementById("buy_hose_button");
	if (money < 30)
		button.setAttribute("disabled", "");
	else
		if (button.getAttribute("has-hose") === "false")
			button.removeAttribute("disabled");
	}

function fertilizerBuyIsAvailable()
{
	let money = document.getElementById("money_text_overlay").textContent;
	let button = document.getElementById("buy_fertilizer_button");
	if (money < 20)
		button.setAttribute("disabled", "");
	else
		button.removeAttribute("disabled");
}

function itemsBuyIsAvailable()
{
	hoseBuyIsAvailable();
	fertilizerBuyIsAvailable();
}

function buyPlants()
{
	let market_slots = document.getElementsByClassName("market_slot");
	let selected_plants = document.querySelectorAll("input[type='number']");
	let money = document.getElementById("money_text_overlay").textContent;
	let cost = 0.0;
	for (let item of selected_plants)
		cost += (item.value * 1) * (item.getAttribute("buy_price") * 1);
	
	if (money < cost)
	{
		let div = document.createElement("div");
		div.innerHTML = "Potrzeba " + cost + " monet!";
		document.getElementById("errors").append(div);
	} 
	else
	{
		let seeds = JSON.parse(localStorage.getItem("seeds"));
		for (let item of market_slots)
		{
			let plant = item.querySelectorAll("input")[0];
			for (let i = 0; i < plant.value; i++)
				seeds.push({profile_id: profile_id, plant: plant.name});
			
			if (plant.value > 0)
			{
				item.querySelector("p[name='seeds_count']").textContent = item.querySelector("p[name='seeds_count']").textContent * 1 + plant.value * 1;
				$.get({
					url: 'https://localhost:7135/Equipments/ChangeSeedsCount?plantName=' + plant.name + '&howMany=' + plant.value + '&adding=true'
				});
			}
		}
		localStorage.setItem("seeds", JSON.stringify(seeds));
		$.get({
			url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=' + cost
		});
		document.getElementById("money_text_overlay").textContent -= cost;
		itemsBuyIsAvailable();
	}
}

function buyPlant(slot_id)
{
	let money = document.getElementById("money_text_overlay").textContent;
	let market_slot = document.getElementById(slot_id);
	let input = market_slot.querySelector('input');
	let item = market_slot.querySelector("p[name = 'seeds_count']");

	let cost = input.getAttribute("buy_price") * 1;
	if (money < cost)
	{
		let div = document.createElement("div");
		div.innerHTML = "Potrzeba " + cost + " monet!";
		document.getElementById("errors").append(div);
	} 
	else
	{
		let seeds = localStorage.getItem("seeds");
		seeds = JSON.parse(seeds);
		console.log(seeds);
		seeds.push({profile_id: profile_id, plant: input.name});
		localStorage.setItem("seeds", JSON.stringify(seeds));

		$.get({
			url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=' + cost
		});
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeSeedsCount?plantName=' + input.name + '&adding=true'
		});
		document.getElementById("money_text_overlay").textContent -= cost;
		market_slot.querySelector("p[name = 'seeds_count']").textContent = market_slot.querySelector("p[name = 'seeds_count']").textContent * 1 + 1;
		itemsBuyIsAvailable();
	}
}

function sellPlants()
{
	let market_slots = document.getElementsByClassName("market_slot");
	let profit = 0.0;
	{
		let collected_plants = localStorage.getItem("collected_plants");
		collected_plants = JSON.parse(collected_plants);
		for (let item of market_slots)
		{
			let plant = item.querySelectorAll("input")[0];
			let sells = 0;
			for (let i = 0; i < plant.value; i++)
			{
				let remove_index = collected_plants.findIndex(el => el.profile_id === profile_id && el.plant === plant.name);
				if (remove_index > -1)
				{
					collected_plants.splice(remove_index, 1);
					profit += (plant.getAttribute("sell_price") * 1);
					sells++;
				}
			}
			$.get({
				url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant.name + '&howMany=' + sells + '&adding=false'
			});
			item.querySelector("p[name='collected_count']").textContent -= sells;
		}
		localStorage.setItem("collected_plants", JSON.stringify(collected_plants));
		$.get({
			url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
		});
		document.getElementById("sell_sfx").play();
		document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
		itemsBuyIsAvailable();
	}
}

function sellPlant(slot_id)
{
	let market_slot = document.getElementById(slot_id);
	let plant = market_slot.querySelector('input');
	let profit = 0.0;
	{
		let collected_plants = JSON.parse(localStorage.getItem("collected_plants"));
		let remove_index = collected_plants.findIndex(el => el.profile_id === profile_id && el.plant === plant.name);
		if (remove_index > -1)
		{
			collected_plants.splice(remove_index, 1);
			profit += (plant.getAttribute("sell_price") * 1);
			localStorage.setItem("collected_plants", JSON.stringify(collected_plants));
			$.get({
				url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
			});
			$.get({
				url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant.name + '&adding=false'
			});
			document.getElementById("sell_sfx").play();
			document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
			market_slot.querySelector("p[name='collected_count']").textContent--;
			itemsBuyIsAvailable();
		}
	}
}

function sellAllPlants()
{
	let market_slots = document.getElementsByClassName("market_slot");
	let profit = 0.0;
	{
		let collected_plants = JSON.parse(localStorage.getItem("collected_plants"));
		for (let item of market_slots)
		{
			let plant = item.querySelectorAll("input")[0];
			let sells = 0;
			for (let collected_plant of collected_plants)
			{
				let remove_index = collected_plants.findIndex(el => el.profile_id === profile_id && el.plant === plant.name);
				if (remove_index > -1)
				{
					collected_plants.splice(remove_index, 1);
					profit += (plant.getAttribute("sell_price") * 1);
					sells++;
				}
			}
			$.get({
				url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant.name + '&howMany=' + sells + '&adding=false'
			});
			item.querySelector("p[name='collected_count']").textContent -= sells;
		}
		localStorage.setItem("collected_plants", JSON.stringify(collected_plants));
		$.get({
			url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
		});
		document.getElementById("sell_all_sfx").play();
		document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
		itemsBuyIsAvailable();
	}
}

function buyHose()
{
	let money = document.getElementById("money_text_overlay").textContent;
	if (money < 30)
	{
		let div = document.createElement("div");
		div.innerHTML = "Nie masz tylu monet";
		document.getElementById("errors").append(div);
		return;
	}
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=30'
	});
	$.get({
		url: 'https://localhost:7135/Equipments/AddHose'
	});
	document.getElementById("money_text_overlay").textContent -= 30;
	itemsBuyIsAvailable();
}

function buyFertilizer()
{
	let money = document.getElementById("money_text_overlay").textContent;
	if (money < 20)
	{
		let div = document.createElement("div");
		div.innerHTML = "Nie masz tylu monet";
		document.getElementById("errors").append(div);
		return;
	}
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=20'
	});
	$.get({
		url: 'https://localhost:7135/Equipments/ChangeFertilizers?howMany=10&adding=true'
	});
	document.getElementById("money_text_overlay").textContent -= 20;
	itemsBuyIsAvailable();
}

function calculateCost()
{
	let sum = document.getElementById("sum");
	sum.addEventListener('input')
	let selected_plants = document.querySelectorAll("input[type='number']");
	let cost = 0.0;
	for (let item of selected_plants)
		cost += (item.value * 1) * (item.getAttribute("price") * 1);
	sum.textContent = cost;
}

function setFieldBorderStyle(field)
{
	if (hasState(field_state.item_over_disallowed, field))
		field.style.border = "5px solid red";
	else if (hasState(field_state.item_over, field))
		field.style.border = "5px solid yellow";
	else if (hasState(field_state.plant_grown, field))
		field.style.border = "5px solid lawngreen";
	else if (hasState(field_state.need_watering, field))
		field.style.border = "5px solid aqua";
	else if (hasState(field_state.need_fertilise, field))
		field.style.border = "5px solid pink";
	else
		field.style.border = "5px solid black";
}

function countPlantInEquipment(plant_name)
{
	let seeds = JSON.parse(localStorage.getItem("seeds"));
	seeds = seeds.filter(p => p.profile_id === profile_id);
	return seeds.filter(s => s.plant === plant_name).length;
}

function createProfile()
{
	let profile_number = getValueFromCookie("new_profile");
	let email = decodeURI(getValueFromCookie("email"));
	pushProfileIntoLocalStorage([{profile_id: profile_number, email: email}]);
	pushFieldsIntoLocalStorage([{profile_id: profile_number, fields: 4}]);
}

function getValueFromCookie(param)
{
	let cookie = document.cookie;
	let start_index = cookie.indexOf(param + "=");
	start_index = cookie.indexOf("=", start_index) + 1;
	let end_index = cookie.indexOf(";", start_index + 1);
	if (end_index === -1)
		return cookie.slice(start_index);
	else
		return cookie.slice(start_index, end_index);
}

function getProfileId()
{
	let profiles = JSON.parse(localStorage.getItem("profiles"));
	let email = document.querySelector("a[title='Manage']").textContent;
	let profile_id = 0;
	for (let item of profiles)
	{
		if (item.email === email)
		{
			profile_id = item.profile_id;
			break;
		}
	}
	localStorage.setItem("profile_id", profile_id);
	return profile_id;
}

function countToRefresh()
{
	let seconds = 0.2;
	let interval = setInterval(() =>
	{
		if (seconds === 0)
		{
			clearInterval(interval);
			window.location.reload();
		}
		else
			seconds -= 0.1;
	}, 100);
}

function changeState(state, field)
{
	switch (state)
	{
		case field_state.plant_grow:
			removeState(field_state.empty, field);
			break;
		case field_state.plant_grown:
			console.log('jjj')
			removeState(field_state.plant_grow, field);
			break;
		case field_state.empty:
			removeState(field_state.plant_grown, field);
			break;
	}
	let states = field.getAttribute("states");
	field.setAttribute("states", `${states}${state};`);
}

function addState(state, field)
{
	field.setAttribute("states", `${field.getAttribute("states")}${state};`);
}
function removeState(state, field)
{
	let states = field.getAttribute("states");
	states = states.slice(0, states.indexOf(state)) + states.slice(states.indexOf(";", states.indexOf(state))+1)
	field.setAttribute("states", states);
}

function hasState(state, field)
{
	let states = field.getAttribute("states");
	return states.includes(state);
}

//localStorage
function pushIntoLocalStorage(type, pushed_items)
{
	let items = localStorage.getItem(type);
	items = JSON.parse(items);
	for (let item of pushed_items)
		items.push({profile_id: profile_id, plant: item.plant});
	localStorage.setItem(type, JSON.stringify(items));
}

function pushProfileIntoLocalStorage(pushed_items)
{
	let items = JSON.parse(localStorage.getItem("profiles"));
	for (let item of pushed_items)
		items.push({profile_id: item.profile_id, email: item.email});
	localStorage.setItem("profiles", JSON.stringify(items));
}

function pushFieldsIntoLocalStorage(pushed_items)
{
	let items = JSON.parse(localStorage.getItem("fields"));
	for (let item of pushed_items)
		items.push({profile_id: item.profile_id, fields: item.fields});
	localStorage.setItem("fields", JSON.stringify(items));
}

function getFromLocalStorage(type)
{
	let items = JSON.parse(localStorage.getItem(type));
	return items.filter(i => i.profile_id === profile_id);
}

function splitFromLocalStorage(type, splited_items)
{
	let items = JSON.parse(localStorage.getItem(type));
	for (let item of splited_items)
	{
		let remove_index = items.findIndex(el => Number(el.profile_id) === profile_id && el.plant === item.plant);
		if (remove_index > -1)
			items.splice(remove_index, 1);
	}
	localStorage.setItem(type, JSON.stringify(items));
}

function updateFieldsLocalStorage()
{
	let items = JSON.parse(localStorage.getItem("fields"));
	for (let item of items)
	{
		if (item.profile_id === profile_id)
		{
			item.fields += 1;
			break;
		}
	}
	localStorage.setItem("fields", JSON.stringify(items));
}

function updatePlantStorage(field_id, time_to_grow)
{
	let items = JSON.parse(localStorage.getItem("planted"));
	items.find(i=>i.field_id === field_id).time_to_grow = time_to_grow;
	localStorage.setItem("planted", JSON.stringify(items));
}

function setStorage()
{
	localStorage.clear();
	let profiles =
		[
			{
				profile_id: 1,
				email: "admin@a.pl"
			},
			{
				profile_id: 2,
				email: "Janek@onet.pl"
			}
		]
	let seeds =
		[
			{
				profile_id: 1,
				plant: "Strawberry"
			},
			{
				profile_id: 1,
				plant: "Beetroot"
			},
			{
				profile_id: 1,
				plant: "Cucumber"
			},
			{
				profile_id: 2,
				plant: "Cucumber"
			}
		]
	let collected_plants =
		[
			{
				profile_id: 1,
				plant: "Cucumber"
			},
			{
				profile_id: 1,
				plant: "Beetroot"
			},
			{
				profile_id: 1,
				plant: "Beetroot"
			},
			{
				profile_id: 1,
				plant: "Strawberry"
			},
			{
				profile_id: 2,
				plant: "Strawberry"
			}
		]
	let planted =
		[
			{
				profile_id: 1,
				field_id: 1,
				plant: "Cucumber"
			},
			{
				profile_id: 1,
				field_id: 1,
				plant: "Beetroot"
			},
			{
				profile_id: 1,
				field_id: 2,
				plant: "Blueberry"
			},
			{
				profile_id: 1,
				field_id: 3,
				plant: "Strawberry"
			},
			{
				profile_id: 2,
				field_id: 1,
				plant: "Strawberry"
			}
		]
	let fields =
		[
			{
				profile_id: 1,
				fields: 6
			},
			{
				profile_id: 2,
				fields: 4
			}
		]
	localStorage.setItem("profiles", JSON.stringify(profiles));
	localStorage.setItem("seeds", JSON.stringify(seeds));
	localStorage.setItem("collected_plants", JSON.stringify(collected_plants));
	localStorage.setItem("planted", JSON.stringify(planted));
	localStorage.setItem("fields", JSON.stringify(fields));
}