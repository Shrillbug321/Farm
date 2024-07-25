using System.Security.Cryptography;
using Farm.Models;
using Microsoft.AspNetCore.Identity;
using static Farm.Models.PlantsList;
namespace Farm.Data
{
	public static class FarmInitializer
	{
		public static void Initialize(FarmContext context)
		{
			context.Database.EnsureDeleted();
			context.Database.EnsureCreated();
			if (context.Farms.Any())
			{
				return;
			}

			#region Equipment
			Plant[] plantsEquipment = new Plant[]
			{
				Cucumber,	Beetroot,
				Strawberry, Chamomile
			};
			foreach (Plant p in plantsEquipment)
			{
				p.State = PlantState.Nasiono;
			}
			//List<Tool> tools = ToolExtensions.GetBasicTools();
			context.Equipments.Add(new Equipment { 
				Money = 10, HasHose = true,
			});
			context.SaveChanges();
			context.Equipments.Add(new Equipment
			{
				Money = 15
			});
			context.SaveChanges();
			#endregion
			#region Fields
			Plant[] plantsFields = new Plant[] 
			{
				Cucumber, Beetroot, Beetroot, Strawberry
			};
			foreach (Plant p in plantsFields)
			{
				p.State = PlantState.Zasadzone;
			}
			List<Field> fields = new List<Field>
			{
				new Field
				{
					Plant = plantsFields[0],
					IsFertilize = true,
					IsWatered = true,
					TimeToWatered = new TimeSpan(0, 0, 5),
					TimesToFertilize = 5
				},
				new Field
				{
					Plant = plantsFields[1],
					IsFertilize = false,
					IsWatered = true,
					TimeToWatered = new TimeSpan(0, 0, 5),
					TimesToFertilize = 5
				},
				new Field
				{
					Plant = plantsFields[2],
					IsFertilize = true,
					IsWatered = false,
					TimeToWatered = new TimeSpan(0, 0, 5),
					TimesToFertilize = 5
				},
				new Field
				{
					Plant = plantsFields[3],
					IsFertilize = true,
					IsWatered = true,
					TimeToWatered = new TimeSpan(0, 0, 5),
					TimesToFertilize = 5
				}
			};

			fields.ForEach(f => context.Fields.Add(f));
			#endregion
			context.Farms.AddRange(new FarmModel
			{
				Fields = fields
			});
			context.Farms.AddRange(new FarmModel
			{
				Fields = fields
			});
			#region PlantsCounts
			context.PlantsCounts.AddRange(new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Cucumber",
				Seeds = 1,
				Collected = 1, AllCollected = 1
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Beetroot",
				Seeds = 1,
				Collected = 2, AllCollected = 2
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Carrot"
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Strawberry",
				Seeds = 1,
				Collected = 1, AllCollected = 1
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Blueberry"
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Raspberry"
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Dandelion"
			}, 
			new PlantsCount
			{
				ProfileId = 1,
				PlantName = "Chamomile"
			});
			context.SaveChanges();
			context.PlantsCounts.AddRange(new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Cucumber",
				Seeds = 1
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Beetroot"
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Carrot"
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Strawberry",
				Collected = 1,
				AllCollected = 1
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Blueberry"
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Raspberry"
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Dandelion"
			}, 
			new PlantsCount
			{
				ProfileId = 2,
				PlantName = "Chamomile"
			});
			context.SaveChanges();
			#endregion
			#region Profiles
			context.Profiles.AddRange(
				new Models.Account.Profile
				{
					Email = "admin@a.pl",
					FarmModelId = 1,
					UserName = "admin",
					IsAdmin = true
				},
				new Models.Account.Profile
				{
					Email = "Janek@onet.pl",
					FarmModelId = 2,
					UserName = "Janek",
					IsAdmin = false
				}
			);
			#endregion
			context.Users.AddRange(new IdentityUser
			{
				UserName = "admin@a.pl",
				NormalizedUserName = "ADMIN@A.PL",
				Email = "admin@a.pl",
				NormalizedEmail = "ADMIN@A.PL",
				EmailConfirmed = true,
				PasswordHash = "AQAAAAEAACcQAAAAEIkjfIM2Nf5a2LTtzUsMtTRdDfsLFsIsWBURMEAj5k/tPS1NOx56t7bipufU+2bo2g==",
				SecurityStamp = "2J6OLLQYWRBSEYC3JDDCWWJMYON5NVTP",
				ConcurrencyStamp = "a8168f00-a4f4-452f-bb68-1f134b6bc078"
			}, 
			new IdentityUser
			{
				UserName = "Janek@onet.pl",
				NormalizedUserName = "JANEK@ONET.PL",
				Email = "Janek@onet.pl",
				NormalizedEmail = "JANEK@ONET.PL",
				EmailConfirmed = true,
				PasswordHash = "AQAAAAEAACcQAAAAELE+PwTY4p6tPWNiyBliSR7NR8iabe6Um77dvGRE6y7VHbwV9x5U2MtIfOK/uKi4rA==",
				SecurityStamp = "RKPHNFCQ7LBPLHRL3SLSHQU7SDMMRTI6",
				ConcurrencyStamp = "06425b6f-95f2-4588-88d2-1d178506f183"
			});
			context.SaveChanges();
		}
		public static string HashPassword(string password)
		{
			byte[] salt;
			byte[] buffer2;
			if (password == null)
			{
				throw new ArgumentNullException("password");
			}
			using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, 0x10, 0x3e8))
			{
				salt = bytes.Salt;
				buffer2 = bytes.GetBytes(0x20);
			}
			byte[] dst = new byte[0x31];
			Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
			Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
			return Convert.ToBase64String(dst);
		}
		public static void PlantsCountsInitialize(this FarmContext context, int profileId)
		{
			context.PlantsCounts.AddRange(new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Cucumber"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Beetroot"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Carrot"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Strawberry"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Blueberry"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Raspberry"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Dandelion"
			},
			new PlantsCount
			{
				ProfileId = profileId,
				PlantName = "Chamomile"
			});
			context.SaveChanges();
		}
	}
}
