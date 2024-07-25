using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Farm.Models
{
    public class Plant
	{
		[ForeignKey("PlantId")]
		public int PlantId { get; set; }
		[Display(Name="Nazwa")]
		public string Name { get; set; }
		[Display(Name = "Rodzaj")]
		public PlantType PlantType { get; set; }
		[Display(Name = "Czas rośnięcia")]
		public TimeSpan GrowTime { get; set; } = new TimeSpan(0,0,2);
		[Display(Name = "Stan")]
		public PlantState State { get; set; } = PlantState.Nasiono;
	}
	public enum PlantType
	{
		Owoce, Warzywa, Zioła
	}
	public enum PlantState
	{
		Nasiono, Zasadzone, Rośnie, Do_zebrania, Zebrane
	}
}