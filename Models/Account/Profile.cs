namespace Farm.Models.Account
{
	public class Profile
	{
		public int ProfileId { get; set; }
		public int FarmModelId { get; set; }
		public string UserName { get; set; }
		public string Email { get; set; }
		public bool IsAdmin { get; set; }
	}
}