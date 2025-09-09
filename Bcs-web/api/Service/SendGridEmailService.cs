using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

public class SendGridEmailServiceV2
{
    private readonly string _apiKey;
    private readonly string _senderEmail;
    private readonly string _senderName;

    public SendGridEmailServiceV2(IConfiguration config)
    {
        // Use environment variables first, fallback to config
        _apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY") ?? config["SendGrid:ApiKey"] ?? "dummy-key";
        _senderEmail = Environment.GetEnvironmentVariable("SENDGRID_SENDER_EMAIL") ?? config["SendGrid:SenderEmail"] ?? "noreply@example.com";
        _senderName = Environment.GetEnvironmentVariable("SENDGRID_SENDER_NAME") ?? config["SendGrid:SenderName"] ?? "BCS System";
        
        // Log warning instead of throwing exception
        if (string.IsNullOrEmpty(_apiKey) || _apiKey == "dummy-key")
        {
            Console.WriteLine("⚠️  SendGrid API Key is not configured. Email functionality will be disabled.");
        }
    }

    public async Task SendTokenToEmail(string toEmail, string token)
    {
        if (_apiKey == "dummy-key")
        {
            Console.WriteLine($"📧 Mock email sending: Token {token} to {toEmail} (SendGrid not configured)");
            return;
        }

        try
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress(_senderEmail, _senderName);
            var to = new EmailAddress(toEmail);
            var subject = "Your login token";
            var plainTextContent = $"Xin chào, đây là token của bạn:\n\n{token}\n\nTrân trọng!";
            var htmlContent = $"<b>Xin chào, đây là token của bạn:</b><br>{token}<br><i>Trân trọng!</i>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            if ((int)response.StatusCode >= 400)
                throw new Exception($"Gửi mail thất bại: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Email sending failed: {ex.Message}");
            throw;
        }
    }
}
