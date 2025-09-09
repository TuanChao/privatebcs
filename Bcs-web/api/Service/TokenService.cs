using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using api.Models;
using api.Interfaces;

public class TokenService : ITokenService
{
    private readonly SymmetricSecurityKey _key;
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
        // Use environment variable first, fallback to config
        var signingKey = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY") ?? _config["JWT:SigningKey"];
        if (string.IsNullOrEmpty(signingKey))
        {
            throw new InvalidOperationException("JWT Signing Key is not configured. Please set JWT_SIGNING_KEY environment variable.");
        }
        
        // Ensure key is at least 64 bytes (512 bits) for HMAC SHA512
        var keyBytes = Encoding.UTF8.GetBytes(signingKey);
        if (keyBytes.Length < 64)
        {
            // Pad the key to meet minimum requirements
            var paddedKey = new byte[64];
            Array.Copy(keyBytes, paddedKey, keyBytes.Length);
            // Fill remaining bytes with a pattern based on the original key
            for (int i = keyBytes.Length; i < 64; i++)
            {
                paddedKey[i] = keyBytes[i % keyBytes.Length];
            }
            _key = new SymmetricSecurityKey(paddedKey);
            Console.WriteLine($"⚠️  JWT key was too short ({keyBytes.Length * 8} bits), padded to 512 bits");
        }
        else
        {
            _key = new SymmetricSecurityKey(keyBytes);
        }
    }

    public string CreateToken(Manage user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.GivenName, user.UserName),
            new Claim(ClaimTypes.Role, user.Role), // Thêm role claim để authorization hoạt động
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
        };

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds,
            Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _config["JWT:Issuer"],
            Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _config["JWT:Audience"]
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
