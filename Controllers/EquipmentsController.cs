using Farm.Data;
using Farm.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farm.Controllers
{
	[Authorize]
	public class EquipmentsController : Controller
	{
		private readonly FarmContext _context;
		private string Sort;
		private string Order;
		private string Query;

		public EquipmentsController(FarmContext context)
		{
			_context = context;
		}

		// GET: Equipments
		public async Task<IActionResult> Index()
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name).Select(u => u.ProfileId)
				.First();
			Equipment equipment = _context.Equipments.Where(e => e.EquipmentId == profileId).Include("Plants").First();
			List<PlantsCount> plantsCounts = _context.PlantsCounts.Where(pc => pc.ProfileId == profileId).ToList();
			ViewData["PlantsCounts"] = plantsCounts;
			return View(equipment);
		}

		// GET: Equipments/Details/5
		public async Task<IActionResult> Details(int? id)
		{
			if (id == null || _context.Equipments == null)
				return NotFound();

			Equipment equipment = await _context.Equipments
				.FirstOrDefaultAsync(m => m.EquipmentId == id);

			if (equipment == null)
				return NotFound();

			return View(equipment);
		}

		// GET: Equipments/Create
		public async Task<IActionResult> Create(string plantName)
		{
			return View();
		}

		// POST: Equipments/Create
		// To protect from overposting attacks, enable the specific properties you want to bind to.
		// For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Create([Bind("EquipmentId,Money")] Equipment equipment)
		{
			if (!ModelState.IsValid) return View(equipment);
			_context.Add(equipment);
			await _context.SaveChangesAsync();
			return RedirectToAction(nameof(Index));
		}

		// GET: Equipments/Edit/5
		public async Task<IActionResult> Edit(int? id)
		{
			if (id == null || _context.Equipments == null)
				return NotFound();

			Equipment equipment = await _context.Equipments.FindAsync(id);

			if (equipment == null)
				return NotFound();
			return View(equipment);
		}

		// POST: Equipments/Edit/5
		// To protect from overposting attacks, enable the specific properties you want to bind to.
		// For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Edit(int id, [Bind("EquipmentId,Money")] Equipment equipment)
		{
			if (id != equipment.EquipmentId)
				return NotFound();

			if (!ModelState.IsValid) return View(equipment);

			try
			{
				_context.Update(equipment);
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!EquipmentExists(equipment.EquipmentId))
					return NotFound();
				throw;
			}

			return RedirectToAction(nameof(Index));
		}

		// GET: Equipments/Delete/5
		public async Task<IActionResult> Delete(int? id)
		{
			if (id == null || _context.Equipments == null)
				return NotFound();

			Equipment equipment = await _context.Equipments
				.FirstOrDefaultAsync(m => m.EquipmentId == id);

			if (equipment == null)
				return NotFound();

			return View(equipment);
		}

		// POST: Equipments/Delete/5
		[HttpPost, ActionName("Delete")]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> DeleteConfirmed(int id)
		{
			if (_context.Equipments == null)
				return Problem("Entity set 'FarmContext.Equipments' is null.");

			var equipment = await _context.Equipments.FindAsync(id);
			if (equipment != null)
				_context.Equipments.Remove(equipment);

			await _context.SaveChangesAsync();
			return RedirectToAction(nameof(Index));
		}

		private bool EquipmentExists(int id)
		{
			return (_context.Equipments?.Any(e => e.EquipmentId == id)).GetValueOrDefault();
		}

		public Plant GetPlant(string plantName)
		{
			Type plantType = typeof(PlantsList);
			var b = plantType.GetProperty(plantName);
			return (Plant)b.GetValue(b);
		}

		[HttpGet]
		public IActionResult DecreaseMoney(int howMany)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name)
				.Select(u => u.ProfileId).First();
			_context.Equipments.First(e => e.EquipmentId == profileId).Money -= howMany;
			_context.SaveChanges();
			return RedirectToAction("Index", "Fields", new { area = "" });
		}

		public void IncreaseMoney(int howMany)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name).Select(u => u.ProfileId)
				.First();
			_context.Equipments.First(e => e.EquipmentId == profileId).Money += howMany;
			_context.SaveChanges();
		}

		public void ChangeSeedsCount(string plantName, int howMany = 1, bool adding = false)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name)
				.Select(u => u.ProfileId).First();
			PlantsCount pc = _context.PlantsCounts
				.First(p => p.ProfileId == profileId && p.PlantName == plantName);
			if (adding)
				pc.Seeds += howMany;
			else
				pc.Seeds -= howMany;
			_context.SaveChanges();
		}

		public void ChangeCollectedCount(string plantName, int howMany = 1, bool adding = false)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name)
				.Select(u => u.ProfileId).First();
			PlantsCount pc = _context.PlantsCounts
				.First(p => p.ProfileId == profileId && p.PlantName == plantName);
			if (adding)
				pc.Collected += howMany;
			else
				pc.Collected -= howMany;
			_context.SaveChanges();
		}

		public void ChangeAllCollectedCount(string plantName, int howMany = 1, bool adding = false)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name).Select(u => u.ProfileId)
				.First();
			PlantsCount pc = _context.PlantsCounts
				.First(p => p.ProfileId == profileId && p.PlantName == plantName);
			if (adding)
				pc.AllCollected += howMany;
			else
				pc.AllCollected -= howMany;
			_context.SaveChanges();
		}

		public void AddHose()
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name).Select(u => u.ProfileId)
				.First();
			_context.Equipments.First(e => e.EquipmentId == profileId).HasHose = true;
			_context.SaveChanges();
		}

		public void ChangeFertilizers(int howMany, bool adding)
		{
			int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name).Select(u => u.ProfileId)
				.First();
			Equipment equipment = _context.Equipments.First(p => p.EquipmentId == profileId);
			if (adding)
				equipment.Fertilizers += howMany;
			else
				equipment.Fertilizers -= howMany;
			_context.SaveChanges();
		}
	}
}