namespace Farm.Models
{
	public class PlantsCount
	{
		public int PlantsCountId { get; set; }
		public int ProfileId { get; set; }
		public string PlantName { get; set; }
		public int Seeds { get; set; }
		public int Collected { get; set; }
		public int AllCollected { get; set; }
	}
}
