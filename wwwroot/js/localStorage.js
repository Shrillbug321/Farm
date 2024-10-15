/*
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
	console.log("storage")
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
}*/
