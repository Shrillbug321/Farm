namespace Farm.Models
{
	public class FarmModel
	{
		public int FarmModelId { get; set; }
		public virtual List<Field> Fields { get; set; } 
	}
}