using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models
{
	public class Market
	{
		public int MarketId { get; set; }
		public virtual ICollection<MarketSlot> MarketSlots { get; set; }
	}
}