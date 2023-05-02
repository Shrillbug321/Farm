using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models
{
	public class FarmModel
	{
		public int FarmModelId { get; set; }
		public virtual List<Field> Fields { get; set; } 
	}
}