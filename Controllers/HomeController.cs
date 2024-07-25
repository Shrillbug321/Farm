using Farm.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.JSInterop;
using System.Diagnostics;

namespace Farm.Controllers
{
	public class HomeController : Controller
	{
		private readonly ILogger<HomeController> _logger;
		private UserManager<IdentityUser> _userManager;
		private RoleManager<IdentityRole> _roleManager;

		public HomeController(ILogger<HomeController> logger, UserManager<IdentityUser> userManager,RoleManager<IdentityRole> roleManager)
		{
			_logger = logger;
			_userManager = userManager;
			_roleManager = roleManager;
		}

		public async Task<IActionResult> Index(bool u = false)
		{
			if (u)	await setDefaultUsers();
			return View();
		}

		public IActionResult Privacy()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

		private async Task setDefaultUsers()
		{
			await _roleManager.CreateAsync(new IdentityRole { Name = "User" });
			await _roleManager.CreateAsync(new IdentityRole { Name = "Admin" });
			IdentityUser admin = new IdentityUser { UserName = "admin@a.pl" };
			var result = await _userManager.CreateAsync(admin, "Adm!n123");
			if (result.Succeeded)
			{
				var user1 = await _userManager.FindByNameAsync(admin.UserName);
				user1.Email = user1.UserName;
				user1.EmailConfirmed = true;
				await _userManager.AddToRoleAsync(admin, "Admin");
			}
			IdentityUser user = new IdentityUser { UserName = "Janek@onet.pl" };
			var resultUser = await _userManager.CreateAsync(user, "Janek9)");
			if (resultUser.Succeeded)
			{
				var user1 = await _userManager.FindByNameAsync(user.UserName);
				user1.Email = user1.UserName;
				user1.EmailConfirmed = true;
				await _userManager.AddToRoleAsync(user, "User");
			}
		}
	}
}