namespace Farm.Models
{
	public class MarketSlot
	{
		public int MarketSlotId { get; set; }
		public Plant Plant { get; set; }
		public decimal Price { get; set; }
		public int Pieces { get; set; }
	}
}
