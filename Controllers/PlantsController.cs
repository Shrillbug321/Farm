﻿#nullable disable
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Farm.Data;
using Farm.Models;

namespace Farm.Controllers
{
    public class PlantsController : Controller
    {
        private readonly FarmContext _context;

        public PlantsController(FarmContext context)
        {
            _context = context;
        }

        // GET: Plants
        public async Task<IActionResult> Index()
        {
            return View(await _context.Plants.ToListAsync());
        }

        // GET: Plants/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            Plant plant = await _context.Plants
                .FirstOrDefaultAsync(m => m.PlantId == id);
            if (plant == null)
                return NotFound();

            return View(plant);
        }

        // GET: Plants/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Plants/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PlantId,Name,PlantType,GrowTime")] Plant plant)
        {
            if (!ModelState.IsValid)
                return View(plant);
            _context.Add(plant);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: Plants/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            Plant plant = await _context.Plants.FindAsync(id);
            if (plant == null)
                return NotFound();
            
            return View(plant);
        }

        // POST: Plants/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PlantId,Name,PlantType,GrowTime")] Plant plant)
        {
            if (id != plant.PlantId)
                return NotFound();

            if (!ModelState.IsValid)
                return View(plant);
            
            try
            {
                _context.Update(plant);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlantExists(plant.PlantId))
                    return NotFound(); 
                throw;
            }
            return RedirectToAction(nameof(Index));
        }

        // GET: Plants/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
                return NotFound();

            Plant plant = await _context.Plants
                .FirstOrDefaultAsync(m => m.PlantId == id);
            
            if (plant == null)
                return NotFound();

            return View(plant);
        }

        // POST: Plants/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var plant = await _context.Plants.FindAsync(id);
            _context.Plants.Remove(plant);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlantExists(int id)
        {
            return _context.Plants.Any(e => e.PlantId == id);
        }
    }
}