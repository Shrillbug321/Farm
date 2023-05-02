using Farm.Models.Interfaces;
using Farm.Models.Tools;
using Farm.Models.Wrappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models
{
	public class Equipment
	{
		public int EquipmentId { get; set; }
		public virtual ICollection<Tool> Tools { get; set; }
		public virtual ICollection<Plant> Plants { get; set; }
	}
}