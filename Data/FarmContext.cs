#nullable disable
using Farm.Models;
using Farm.Models.Account;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Farm.Data
{
	public class FarmContext : IdentityDbContext
    {
        public FarmContext (DbContextOptions<FarmContext> options)
            : base(options)
        {
        }

        public DbSet<Plant> Plants { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<FarmModel> Farms { get; set; }
        public DbSet<Field> Fields { get; set; }
        public DbSet<Market> Markets { get; set; }
        //public DbSet<Tool> Tools { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<PlantsCount> PlantsCounts{ get; set; }
    }
}