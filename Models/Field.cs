using System.ComponentModel.DataAnnotations;

namespace Farm.Models
{
	public class Field
	{
		public int FieldId { get; set; }
		[Display(Name="Roślina")]
		public Plant? Plant { get; set; }
		[Display(Name = "Podlane")]
		public bool IsWatered { get; set; }
		[Display(Name ="Nawożone")]
		public bool IsFertilize { get; set; }
		[Display(Name = "Czas rośnięcia")]
		public TimeSpan TimeToCollect { get; set; }
		public TimeSpan TimeToWatered { get; set; }
		public int TimesToFertilize { get; set; }
	}
}