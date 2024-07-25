using System.Net;
using System.Net.Mail;
namespace Farm.Utils
{
	public class Mailer
	{
		public static void SendMail(string from, string to, string subject, string body)
		{
			MailMessage mailMessage = new MailMessage(from, to)
			{
				Subject = subject, Body = body
			};

			/*SmtpClient smtpClient = new()
			{
				Host = "localhost", Port = 25,
				Credentials = new NetworkCredential()
				{
					UserName = "sebastiandreszer1999@gmail.com", Password = "AbcdGrafik1"
				},
				EnableSsl = true
			};*/
			SmtpClient smtpClient = new SmtpClient { Host = "localhost", Port = 25 };
			smtpClient.Send(mailMessage);
		}
	}
}
