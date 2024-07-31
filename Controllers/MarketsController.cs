using Farm.Data;
using Farm.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farm.Controllers
{
	[Authorize]
    public class MarketsController : Controller
    {
        private readonly FarmContext _context;

        public MarketsController(FarmContext context)
        {
            _context = context;
        }

        // GET: Markets
        public async Task<IActionResult> Index()
        {
            int profileId = _context.Profiles.Where(p => p.Email == User.Identity.Name)
                .Select(u => u.ProfileId).First();
            Equipment equipment = _context.Equipments.Where(e => e.EquipmentId == profileId).Include("Plants").First();
            ViewData["Equipment"] = equipment;
            List<PlantsCount> plantsCounts = _context.PlantsCounts.Where(pc=>pc.ProfileId == profileId).ToList();
            ViewData["PlantsCounts"] = plantsCounts;
            return _context.Markets != null ? 
                          View(await _context.Markets.ToListAsync()) :
                          Problem("Entity set 'FarmContext.Markets' is null.");
        }

        // GET: Markets/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Markets == null)
                return NotFound();

            Market market = await _context.Markets
                .FirstOrDefaultAsync(m => m.MarketId == id);
            
            if (market == null)
                return NotFound();

            return View(market);
        }

        // GET: Markets/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Markets/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MarketId")] Market market)
        {
            if (!ModelState.IsValid) 
                return View(market);
            _context.Add(market);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: Markets/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Markets == null)
                return NotFound();

            Market market = await _context.Markets.FindAsync(id);
            
            if (market == null)
                return NotFound();
            
            return View(market);
        }

        // POST: Markets/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MarketId")] Market market)
        {
            if (id != market.MarketId)
                return NotFound();

            if (!ModelState.IsValid)
                return View(market);
            
            try
            {
                _context.Update(market);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MarketExists(market.MarketId))
                    return NotFound(); 
                throw;
            }
            return RedirectToAction(nameof(Index));
        }

        // GET: Markets/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Markets == null)
                return NotFound();

            Market market = await _context.Markets
                .FirstOrDefaultAsync(m => m.MarketId == id);
            
            if (market == null)
                return NotFound();

            return View(market);
        }

        // POST: Markets/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Markets == null)
                return Problem("Entity set 'FarmContext.Markets' is null.");
            
            Market market = await _context.Markets.FindAsync(id);
            if (market != null)
                _context.Markets.Remove(market);
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MarketExists(int id)
        {
            return (_context.Markets?.Any(e => e.MarketId == id)).GetValueOrDefault();
        }
    }
}