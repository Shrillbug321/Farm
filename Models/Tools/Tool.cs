using Farm.Models.Interfaces;
using Farm.Models.Wrappers;

namespace Farm.Models.Tools
{
	public class Tool: Equippable
	{
		public int ToolId { get; set; }
		public string Name { get; set; }
	}

	public static class ToolExtensions
	{
		public static List<Tool> GetBasicTools()
		{
			return new List<Tool>
			{
				new Fertiliser{ ToolId=1 },
				new Hoe{ ToolId=2 },
				new WateringCan{ ToolId=3 }
			};
		}
	}
}
