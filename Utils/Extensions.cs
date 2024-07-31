namespace Farm.Utils
{
	public static class Extensions
	{
		public static string Translate(string plantName)
		{
			return plantName switch
			{
				"Ogórek" => "Cucumber",
				"Burak" => "Beetroot",
				"Marchewka" => "Carrot",
				"Truskawki" => "Strawberry",
				"Jagody" => "Blueberry",
				"Maliny" => "Raspberry",
				"Mlecz" => "Dandelion",
				"Rumianek" => "Chamomile",
				_ => ""
			};
		}
		public static string ToPolish(string plantName)
		{
			return plantName switch
			{
				"Cucumber" => "Ogórek",
				"Beetroot" => "Burak",
				"Carrot" => "Marchewka",
				"Strawberry" => "Truskawki",
				"Blueberry" => "Jagody",
				"Raspberry" => "Maliny",
				"Dandelion" => "Mlecz",
				"Chamomile" => "Rumianek",
				_ => ""
			};
		}
	}
}