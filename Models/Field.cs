using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models
{
	public class Field
	{
		public int FieldId { get; set; }
		public Plant? Plant { get; set; }
		public bool IsWatered { get; set; }
		public bool IsFertilize { get; set; }
		public TimeSpan TimeToCollect { get; set; }
	}
}