using Microsoft.AspNetCore.Mvc;

namespace Farm.Controllers
{
	public class AdminController : Controller
	{
		public IActionResult Index(string message)
		{
			ViewData["Message"] = message;
			return View();
		}

		public IActionResult AddImageForm()
		{
			return View();
		}

		public IActionResult AddImage()
		{
			IFormFileCollection files = Request.Form.Files;
			foreach (IFormFile file in files)
			{
				string filename = Path.GetFileName(file.FileName);
				string path = $"wwwroot/images/{filename}";
				FileStream fileStream = System.IO.File.Create(path);
				file.CopyTo(fileStream);
				fileStream.Close();
			}
			return RedirectToAction("Index", new { message = "Pomyślnie dodano obrazek" });
		}
	}
}
