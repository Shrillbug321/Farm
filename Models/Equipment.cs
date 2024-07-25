namespace Farm.Models
{
    public class Equipment
	{
		public int EquipmentId { get; set; }
		public int Money { get; set; } = 10;
		public ICollection<Plant> Plants { get; set; }
		public bool HasHose { get; set; }
		public int Fertilizers { get; set; } = 4;
	}
}