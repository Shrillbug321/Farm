#nullable disable
using Farm.Data;
using Farm.Models;
using Farm.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farm.Controllers
{
	public class FieldsController : Controller
    {
        private readonly FarmContext context;

        public FieldsController(FarmContext context)
        {
            this.context = context;
        }

        // GET: Fields
        [Authorize]
        public async Task<IActionResult> Index()
        {
            int profileId = context.Profiles.Where(p=>p.Email == User.Identity.Name).Select(u=>u.ProfileId).First();
            Equipment equipment  = context.Equipments.Where(e => e.EquipmentId == profileId).Include("Plants").First();
            ViewData["Equipment"] = equipment;
            List<Field> fields = await context.Fields.Include("Plant").ToListAsync();
            foreach (Field field in fields)
                field.TimeToCollect = CalculateTimeToCollect(field, field.Plant);
            return View(fields);
        }

        // GET: Fields/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            Field field = await context.Fields
                .FirstOrDefaultAsync(m => m.FieldId == id);
            
            if (field == null)
                return NotFound();

            return View(field);
        }

        // GET: Fields/Create
        public IActionResult Create()
        {
            Field addingField = new Field();
            Profile profile = context.Profiles.First(p => p.Email == User.Identity.Name);
            var v = context.Farms.Include("Fields").First(f => f.FarmModelId == profile.ProfileId);
            v.Fields.Add(addingField);
            context.SaveChanges();
			return RedirectToAction("DecreaseMoney", "Equipments", new { area = "", howMany = 10});
        }
        // GET: Fields/Planting?plantName=&fieldId=
        public IActionResult Planting(string plantName, int fieldId)
        {
            Plant plant = GetPlant(plantName);
            Profile profile = context.Profiles.First(p => p.Email == User.Identity.Name);
            var v = context.Farms.Include("Fields")
                .First(f => f.FarmModelId == profile.ProfileId).Fields.Where(f=>f.FieldId == fieldId).ToList();
            v.First().Plant = plant;
            context.SaveChanges();
			return RedirectToAction(nameof(Index));
        }
        // GET: Fields/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            Field field = await context.Fields.FindAsync(id);
            
            if (field == null)
                return NotFound();
            
            return View(@field);
        }

        // POST: Fields/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("FieldId,IsWatered,IsFertilize,TimeToCollect")] Field @field)
        {
            if (id != field.FieldId)
                return NotFound();

            if (!ModelState.IsValid) return View(field);
            
            try
            {
                context.Update(field);
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FieldExists(field.FieldId))
                    return NotFound();
                throw;
            }
            return RedirectToAction(nameof(Index));
        }

        // GET: Fields/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
                return NotFound();

            Field field = await context.Fields
                .FirstOrDefaultAsync(m => m.FieldId == id);
            
            if (field == null)
                return NotFound();

            return View(@field);
        }

        // POST: Fields/Delete/5
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var field = await context.Fields.FindAsync(id);
            context.Fields.Remove(field);
            await context.SaveChangesAsync();
            Create();
            return RedirectToAction(nameof(Index));
        }

        private bool FieldExists(int id)
        {
            return context.Fields.Any(e => e.FieldId == id);
        }

        private TimeSpan CalculateTimeToCollect(Field field, Plant plant)
        {
            if (plant == null)
                return TimeSpan.Zero;
            TimeSpan timeToCollect = plant.GrowTime;
            TimeSpan a = timeToCollect.Divide(4);
            a += timeToCollect;
            if (!field.IsWatered)
                timeToCollect += timeToCollect.Divide(4);
            if (!field.IsFertilize)
                timeToCollect += timeToCollect.Divide(4);
            field.TimeToCollect = timeToCollect;
            return timeToCollect;
        }

        public double GetSeconds(string plantName)
        {
            Type plantType = typeof(PlantsList);
            var b = plantType.GetProperty(plantName);
            Plant plant = (Plant)b.GetValue(b);
            return plant.GrowTime.TotalSeconds;
        }

        public Plant GetPlant(string plantName)
        {
            Type plantType = typeof(PlantsList);
            var b = plantType.GetProperty(plantName);
            return (Plant)b.GetValue(b);
        }
    }
}