if (localStorage.getItem("profiles") === null)
	set_storage();
get_profile_id();
function drag_equipment_cell(event) {
	console.log(event);
	event.dataTransfer.setData("item", event.target.innerText);
}

function drag_seed(event) {
	event.dataTransfer.setData("item_type", "seed");
	let src = event.target.src;
	let plant_name = (src.substring(src.lastIndexOf('/') + 1, src.length - 4));
	console.log(plant_name);
	event.dataTransfer.setData("plant_name", plant_name);
	event.dataTransfer.setData("seed_id", event.target.id);
}

function drag_start_watering_can(event) {
	event.dataTransfer.setData("item_type", "watering_can");
}

function drag_start_fertilizer(event) {
	event.dataTransfer.setData("item_type", "fertilizer");
	event.dataTransfer.setData("times", document.getElementById("fertilizer_text_overlay").textContent);
}

function drag_over_item(event) {
	event.preventDefault();
	let field = event.target;
	if (event.dataTransfer.getData("item_type") == "watering_can" ||
		event.dataTransfer.getData("item_type") == "fertilizer")
		return;
	if (field.getAttribute("need_watering") == "true") {
		event.dataTransfer.dropEffect = "none";
		field.style.border = "5px solid red";
		return;
	}
	if (field.getAttribute("times_to_fertilise") == 0) {
		event.dataTransfer.dropEffect = "none";
		field.style.border = "5px solid red";
		return;
	}
}
let previous_style = "5px solid yellow";
function drag_enter_field(event) {
	event.preventDefault();
	let field = event.target;
	previous_style = field.style.border;
	field.style.border = "5px solid yellow";
}

function drag_leave_field(event) {
	event.preventDefault();
	set_field_border_style(event.target);
}

function get_plant(plant_id) {
	let plant = document.getElementById(plant_id);
	let field = plant.parentNode;
	console.log(plant);
	if (field.getAttribute("draggable") == "true") {
		field.setAttribute("times_to_fertilise", field.getAttribute("times_to_fertilise")-1 );
		
		let src = plant.getElementsByTagName("img")[0].src;
		let plant_name = (src.substring(src.lastIndexOf('/') + 1, src.length - 4));
		let profile_id = get_profile_id();
		push_into_local_storage("collected_plants", [{ profile_id: profile_id, plant: plant_name }]);
		split_from_local_stroage("planted", [{ profile_id: profile_id, plant: plant_name }]);
		plant.remove();
		document.getElementById("get_plant_sfx").play();
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant_name + '&adding=true'
		});
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeAllCollectedCount?plantName=' + plant_name + '&adding=true'
		});
		field.setAttribute("draggable", "false");
		set_field_border_style(field);
	}
}

function hose_watering() {
	let fields = document.getElementsByClassName("field");
	document.getElementById("hose_watering_sfx").play();
	for (field of fields) {
		field.setAttribute("need_watering", "false");
		set_field_border_style(field);
		field_watering_time(field, 2);
    }
}

function buy_field() {
	update_fields_local_storage();
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=20'
	});
	count_to_refresh();
}

function hose_buy_is_available() {
	let money = document.getElementById("money_text_overlay").textContent;
	let button = document.getElementById("buy_hose_button");
	if (money < 30)
		button.setAttribute("disabled", "");
	else {
		if (button.getAttribute("has-hose") == "false")
			button.removeAttribute("disabled");
	}
}

function fertilizer_buy_is_available() {
	let money = document.getElementById("money_text_overlay").textContent;
	let button = document.getElementById("buy_fertilizer_button");
	if (money < 20)
		button.setAttribute("disabled", "");
	else
		button.removeAttribute("disabled");
}

function items_buy_is_available() {
	hose_buy_is_available();
	fertilizer_buy_is_available();
}

function buy_plants() {
	let market_slots = document.getElementsByClassName("market_slot");
	let selected_plants = document.querySelectorAll("input[type='number']");
	let money = document.getElementById("money_text_overlay").textContent;
	let cost = 0.0;
	for (let item of selected_plants) {
		cost += (item.value*1) * (item.getAttribute("buy_price")*1);
	}
	if (money < cost) {
		let div = document.createElement("div");
		div.innerHTML = "Potrzeba "+cost+" monet!";
		document.getElementById("errors").append(div);
	}
	else {
		let profile_id = localStorage.getItem("profile_id");
		let seeds = localStorage.getItem("seeds");
		seeds = JSON.parse(seeds);
		console.log(seeds);
		for (let item of market_slots)
		{
			let plant = item.querySelectorAll("input")[0];
			for (i = 0; i < plant.value; i++) {
				seeds.push({ profile_id: profile_id, plant: plant.name });
			}
			if (plant.value > 0) {
				item.querySelector("p[name='seeds_count']").textContent = item.querySelector("p[name='seeds_count']").textContent*1 + plant.value*1;
				$.get({
					url: 'https://localhost:7135/Equipments/ChangeSeedsCount?plantName=' + plant.name + '&howMany=' + plant.value+'&adding=true'
				});
            }
			
		}
		localStorage.setItem("seeds", JSON.stringify(seeds));
		$.get({
			url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=' + cost
		});
		document.getElementById("money_text_overlay").textContent -= cost;
		items_buy_is_available();
	}
}
function buy_plant(slot_id) {
	let money = document.getElementById("money_text_overlay").textContent;
	let market_slot = document.getElementById(slot_id);
	let input = market_slot.querySelector('input');
	let item = market_slot.querySelector("p[name = 'seeds_count']");

	let cost = input.getAttribute("buy_price") * 1;
	console.log(item);
	if (money < cost) {
		let div = document.createElement("div");
		div.innerHTML = "Potrzeba " + cost + " monet!";
		document.getElementById("errors").append(div);
	}
	else {
		let profile_id = localStorage.getItem("profile_id");
		let seeds = localStorage.getItem("seeds");
		seeds = JSON.parse(seeds);
		console.log(seeds);
		seeds.push({ profile_id: profile_id, plant: input.name });
		localStorage.setItem("seeds", JSON.stringify(seeds));

		$.get({
			url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=' + cost
		});
		$.get({
			url: 'https://localhost:7135/Equipments/ChangeSeedsCount?plantName=' + input.name + '&adding=true'
		});
		document.getElementById("money_text_overlay").textContent -= cost;
		market_slot.querySelector("p[name = 'seeds_count']").textContent = market_slot.querySelector("p[name = 'seeds_count']").textContent * 1 + 1;
		items_buy_is_available();
	}
}
function sell_plants() {
	let market_slots = document.getElementsByClassName("market_slot");
	let profit = 0.0;
	{
		let profile_id = localStorage.getItem("profile_id");
		let collected_plants = localStorage.getItem("collected_plants");
		collected_plants = JSON.parse(collected_plants);
		for (let item of market_slots) {
			let plant = item.querySelectorAll("input")[0];
			let sells = 0;
			for (i = 0; i < plant.value; i++)
			{
				let remove_index = collected_plants.findIndex(el => el.profile_id == profile_id && el.plant == plant.name);
				if (remove_index > -1) {
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
		collected_plants = localStorage.getItem("collected_plants");
		seeds = JSON.parse(collected_plants);
		console.log(collected_plants);
		$.get({
			url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
		});
		document.getElementById("sell_sfx").play();
		document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
		items_buy_is_available();
	}
}
function sell_plant(slot_id) {
	let market_slot = document.getElementById(slot_id);
	let plant = market_slot.querySelector('input');
	let profit = 0.0;
	{
		let profile_id = localStorage.getItem("profile_id");
		let collected_plants = localStorage.getItem("collected_plants");
		collected_plants = JSON.parse(collected_plants);
		let remove_index = collected_plants.findIndex(el => el.profile_id == profile_id && el.plant == plant.name);
		if (remove_index > -1) {
			collected_plants.splice(remove_index, 1);
			profit += (plant.getAttribute("sell_price") * 1);
			localStorage.setItem("collected_plants", JSON.stringify(collected_plants));
			collected_plants = localStorage.getItem("collected_plants");
			seeds = JSON.parse(collected_plants);
			console.log(collected_plants);
			$.get({
				url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
			});
			$.get({
				url: 'https://localhost:7135/Equipments/ChangeCollectedCount?plantName=' + plant.name + '&adding=false'
			});
			document.getElementById("sell_sfx").play();
			document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
			market_slot.querySelector("p[name='collected_count']").textContent--;
			items_buy_is_available();
		}
	}
}
function sell_all_plants() {
	let market_slots = document.getElementsByClassName("market_slot");
	let profit = 0.0;
	{
		let profile_id = localStorage.getItem("profile_id");
		let collected_plants = localStorage.getItem("collected_plants");
		collected_plants = JSON.parse(collected_plants);
		for (let item of market_slots)
		{
			let plant = item.querySelectorAll("input")[0];
			let sells = 0;
			for (pi of collected_plants)
			{
				let remove_index = collected_plants.findIndex(el => el.profile_id == profile_id && el.plant == plant.name);
				if (remove_index > -1) {
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
		collected_plants = localStorage.getItem("collected_plants");
		seeds = JSON.parse(collected_plants);
		console.log(collected_plants);
		$.get({
			url: 'https://localhost:7135/Equipments/IncreaseMoney?howMany=' + profit
		});
		document.getElementById("sell_all_sfx").play();
		document.getElementById("money_text_overlay").textContent = document.getElementById("money_text_overlay").textContent * 1 + profit;
		items_buy_is_available();
	}
}
function buy_hose() {
	let money = document.getElementById("money_text_overlay").textContent;
	if (money < 30)
	{
		let div = document.createElement("div");
		div.innerHTML = "Nie masz tylu monet";
		document.getElementById("errors").append(div);
		return;
	};
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=30'
	});
	$.get({
		url: 'https://localhost:7135/Equipments/AddHose'
	});
	document.getElementById("money_text_overlay").textContent -= 30;
	items_buy_is_available();
}

function buy_fertilizer() {
	let money = document.getElementById("money_text_overlay").textContent;
	if (money < 20)
	{
		let div = document.createElement("div");
		div.innerHTML = "Nie masz tylu monet";
		document.getElementById("errors").append(div);
		return;
	};
	$.get({
		url: 'https://localhost:7135/Equipments/DecreaseMoney?howMany=20'
	});
	$.get({
		url: 'https://localhost:7135/Equipments/ChangeFertilizers?howMany=10&adding=true'
	});
	document.getElementById("money_text_overlay").textContent -= 20;
	items_buy_is_available();
}

function calculate_cost() {
	let sum = document.getElementById("sum");
	sum.addEventListener('input', )
	let selected_plants = document.querySelectorAll("input[type='number']");
	let cost = 0.0;
	for (let item of selected_plants) {
		cost += (item.value * 1) * (item.getAttribute("price") * 1);
	}
	sum.textContent = cost
}

function set_field_border_style(field) {
	if (field.getAttribute("draggable") == "true")
		field.style.border = "5px solid lawngreen";
	else if (field.getAttribute("need_watering") == "true")
		field.style.border = "5px solid aqua";
	else if (field.getAttribute("times_to_fertilise") == 0)
		field.style.border = "5px solid pink";
	else
		field.style.border = "5px solid black";
}

function count_plant_in_equipment(plant_name) {
	let profile_id = localStorage.getItem("profile_id");
	let seeds = localStorage.getItem("seeds");
	seeds = JSON.parse(seeds);
	seeds = seeds.filter(p => p.profile_id == profile_id);
	return seeds.filter(s => s.plant == plant_name).length;
}

function add_new_profile() {
	let profile_number = get_value_from_cookie("new_profile");
	let email = unescape(get_value_from_cookie("email"));
	console.log(profile_number);
	console.log(email);
	push_profile_into_local_storage([{ profile_id: profile_number, email: email }]);
	push_fields_into_local_storage([{ profile_id: profile_number, fields: 4 }]);
}

function get_value_from_cookie(param) {
	let cookie = document.cookie;
	let start_index = cookie.indexOf(param+"=");
	start_index = cookie.indexOf("=", start_index)+1;
	let end_index = cookie.indexOf(";", start_index + 1);
	if (end_index == -1)
		return cookie.slice(start_index);
	else
		return cookie.slice(start_index, end_index);
}

function get_profile_id() {
	let profiles = localStorage.getItem("profiles");
	profiles = JSON.parse(profiles);
	let email = document.querySelector("a[title='Manage']").textContent;
	let profile_id = 0;
	for (let item of profiles) {
		if (item.email == email) {
			profile_id = item.profile_id;
			break;
		}
	}
	localStorage.setItem("profile_id", profile_id);
	return profile_id;
}
function set_storage() {
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
			plant: "Cucumber"
		},
		{
			profile_id: 1,
			plant: "Beetroot"
		},
		{
			profile_id: 1,
			plant: "Blueberry"
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

function push_into_local_storage(type, pushed_items) {
	let profile_id = localStorage.getItem("profile_id");
	let items = localStorage.getItem(type);
	items = JSON.parse(items);
	console.log(items);
	for (let item of pushed_items) {
		items.push({ profile_id: profile_id, plant: item.plant });
	}
	localStorage.setItem(type, JSON.stringify(items));
}
function push_profile_into_local_storage(pushed_items) {
	let items = localStorage.getItem("profiles");
	items = JSON.parse(items);
	for (let item of pushed_items) {
		items.push({ profile_id: item.profile_id, email: item.email });
	}
	localStorage.setItem("profiles", JSON.stringify(items));
}

function push_fields_into_local_storage(pushed_items) {
	let items = localStorage.getItem("fields");
	items = JSON.parse(items);
	for (let item of pushed_items) {
		items.push({ profile_id: item.profile_id, fields: item.fields });
	}
	localStorage.setItem("fields", JSON.stringify(items));
}

function get_from_local_storage(type) {
	let profile_id = localStorage.getItem("profile_id");
	let items = localStorage.getItem(type);
	items = JSON.parse(items);
	items = items.filter(i => i.profile_id == profile_id);
	return items;
}

function split_from_local_stroage(type, splited_items) {
	let items = localStorage.getItem(type);
	items = JSON.parse(items);
	for (let item of splited_items) {
		let remove_index = items.findIndex(el => el.profile_id == profile_id && el.plant == item.plant);
		if (remove_index > -1) {
			items.splice(remove_index, 1);
		}
	}
	localStorage.setItem(type, JSON.stringify(items));
}

function update_fields_local_storage() {
	let items = localStorage.getItem("fields");
	items = JSON.parse(items);
	let items_stringify = localStorage.getItem("fields");
	console.log(items_stringify);
	let profile_id = localStorage.getItem("profile_id");
	for (item of items) {
		if (item.profile_id == profile_id) {
			item.fields += 1;
			break;
		}
	}
	localStorage.setItem("fields", JSON.stringify(items));
}

function count_to_refresh() {
	let seconds = 0.2;
	let interval = setInterval(() => {
		if (seconds == 0) {
			clearInterval(interval);
			window.location.reload();
		}
		else {
			seconds -= 0.1;
		}
	}, 100);
}