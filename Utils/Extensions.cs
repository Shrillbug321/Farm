namespace Farm.Utils
{
	public static class Extensions
	{
		public static string Translate(string plantName)
        {
			switch (plantName)
            {
				case "Ogorek":
					return "Cucumber";
				case "Burak":
					return "Beetroot";
				case "Marchewka":
					return "Carrot";
				case "Truskawki":
					return "Strawberry";
				case "Jagody":
					return "Blueberry";
				case "Maliny":
					return "Raspberry";
				case "Mlecz":
					return "Dandelion";
				case "Rumianek":
					return "Chamomile";
				default:
					return "";
            }
        }
		public static string ToPolish(string plantName)
        {
			switch (plantName)
            {
				case "Cucumber":
					return "Ogórek";
				case "Beetroot":
					return "Burak";
				case "Carrot":
					return "Marchewka";
				case "Strawberry":
					return "Truskawki";
				case "Blueberry":
					return "Jagody";
				case "Raspberry":
					return "Maliny";
				case "Dandelion":
					return "Mlecz";
				case "Chamomile":
					return "Rumianek";
				default:
					return "";
            }
        }
	}
}
