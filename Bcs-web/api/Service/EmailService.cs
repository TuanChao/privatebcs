// using api.Models;
// using MailKit.Net.Smtp;
// using Microsoft.Extensions.Options;
// using MimeKit;

// public class EmailService
// {
//     private readonly EmailSettings _emailSettings;

//     public EmailService(IOptions<EmailSettings> emailSettings)
//     {
//         _emailSettings = emailSettings.Value;
//     }

//     public async Task SendTokenToEmail(string toEmail, string token)
//     {
//         var message = new MimeMessage();
//         message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
//         message.To.Add(new MailboxAddress("", toEmail));
//         message.Subject = "Your login token";

//         message.Body = new TextPart("plain")
//         {
//             Text = $"Xin chào Boss, đây là token của bạn:\n\n{token}\n\nTrân trọng!"
//         };

//         using (var client = new SmtpClient())
//         {
//             await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
//             await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
//             await client.SendAsync(message);
//             await client.DisconnectAsync(true);
//         }
//     }
// }


