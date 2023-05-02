using Farm.Models.Interfaces;
using Farm.Models.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models
{
	public class Plant: Equippable
	{
		public int PlantId { get; set; }
		public string Name { get; set; }
		public PlantType PlantType { get; set; }
		public TimeSpan GrowTime { get; set; } = new TimeSpan(0,0,10);
		public PlantState State { get; set; } = PlantState.Zebrane;
	}
	public enum PlantType
	{
		Owoce, Warzywa, Zioła
	}
	public enum PlantState
	{
		Nasiono, Rośnie, Do_zebrania, Zebrane
	}
}