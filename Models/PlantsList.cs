namespace Farm.Models
{
	public static class PlantsList
	{
		public static Plant Cucumber { get; set; } = new Plant
		{
			Name = "Cucumber",
			PlantType = PlantType.Warzywa,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Beetroot { get; set; } = new Plant
		{
			Name = "Beetroot",
			PlantType = PlantType.Warzywa,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Carrot { get; set; } = new Plant
		{
			Name = "Carrot",
			PlantType = PlantType.Warzywa,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Strawberry { get; set; } = new Plant
		{
			Name = "Strawberry",
			PlantType = PlantType.Owoce,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Blueberry { get; set; } = new Plant
		{
			Name = "Blueberry",
			PlantType = PlantType.Owoce,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Raspberry { get; set; } = new Plant
		{
			Name = "Raspberry",
			PlantType = PlantType.Owoce,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Dandelion { get; set; } = new Plant
		{
			Name = "Dandelion",
			PlantType = PlantType.Zioła,
			GrowTime = new TimeSpan(0, 0, 2)
		};
		public static Plant Chamomile { get; set; } = new Plant
		{
			Name = "Chamomile",
			PlantType = PlantType.Zioła,
			GrowTime = new TimeSpan(0, 0, 2)
		};

		public static List<Plant> All()
		{
			return new List<Plant> 
			{
				Cucumber, Beetroot, Carrot, Strawberry, 
				Blueberry, Raspberry, Dandelion, Chamomile
			};
		}
	}
}
