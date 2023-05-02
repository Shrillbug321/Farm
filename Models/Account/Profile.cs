using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Farm.Models.Account
{
	public class Profile
	{
		public int ProfileId { get; set; }
		public int FarmId { get; set; }
		public string UserName { get; set; }
		public string Email { get; set; }
		public virtual FarmModel Farm { get; set; }
	}
}