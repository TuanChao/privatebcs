using api.Interfaces;
using api.Models;
using api.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using MongoDB.Driver;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file (if available)
try
{
    // DotNetEnv.Env.Load(); // Optional - only if package is installed
}
catch
{
    // .env file loading is optional - environment variables can be set at system level
}

// Configure configuration to read from environment variables
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =============== CONFIGURE FILE UPLOAD LIMITS ===============
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 15 * 1024 * 1024; // 15MB for images
});

builder.Services.Configure<KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 15 * 1024 * 1024; // 15MB for images
});
// ==========================================================

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddSingleton<SendGridEmailServiceV2>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPasswordHasher<Manage>, PasswordHasher<Manage>>();

// MongoDB setup - Use environment variable first, fallback to config
var mongoConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("MongoDb")
    ?? builder.Configuration["MongoDb"];
var mongoClient = new MongoClient(mongoConnectionString);
builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddScoped<IManageRepository, ManageRepository>();

// ====================== SECURE CORS CONFIGURATION ======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("SecurePolicy", policy =>
    {
        var allowedOrigins = builder.Environment.IsDevelopment()
            ? new[] {
                "http://localhost:3000",
                "https://localhost:3000",
                "https://localhost:7225",
                "http://localhost:5199"
              }
            : new[] {
                "https://security.bkav.com"
              };

        policy.WithOrigins(allowedOrigins)
              .WithHeaders("Content-Type", "Authorization")
              .WithMethods("GET", "POST", "PUT", "DELETE")
              .AllowCredentials();
    });
});
// =========================================================================

// ======== Sửa cấu hình Session CHUẨN để cookie cross-origin =========
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Sửa lại thành Always
});
builder.Services.AddDistributedMemoryCache();
// ====================================================================

// JWT Authentication Configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "Bearer";
    options.DefaultChallengeScheme = "Bearer";
})
.AddJwtBearer("Bearer", options =>
{
    var jwtSigningKey = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY") ?? builder.Configuration["JWT:SigningKey"];
    var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? builder.Configuration["JWT:Issuer"];
    var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? builder.Configuration["JWT:Audience"];

    // Validate required JWT configuration
    if (string.IsNullOrEmpty(jwtSigningKey))
        throw new InvalidOperationException("JWT Signing Key is required. Set JWT_SIGNING_KEY environment variable or JWT:SigningKey in appsettings.json");

    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSigningKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Configure JWT to read from both cookies and Authorization header
    options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Try to get JWT from cookie first (more secure)
            var token = context.Request.Cookies["jwt"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(Directory.GetCurrentDirectory(), "keys")));

var app = builder.Build();

// Seed Admin User với password hashing
using (var scope = app.Services.CreateScope())
{
    await SeedAdminUser(scope.ServiceProvider);
    await SeedSamplePosters(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Comprehensive Security Headers Middleware
app.Use(async (context, next) =>
{
    // Prevent Clickjacking
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");

    // Prevent information disclosure
    context.Response.Headers.Remove("Server");
    context.Response.Headers.Remove("X-Powered-By");
    context.Response.Headers.Add("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");

    // HSTS - Force HTTPS for 1 year (only in production)
    if (app.Environment.IsProduction())
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }

    // Permissions Policy (formerly Feature Policy)
    context.Response.Headers.Add("Permissions-Policy",
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()");

    // Stricter Content Security Policy
    context.Response.Headers.Add("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "media-src 'self'; " +
        "object-src 'none'; " +
        "frame-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'; " +
        "upgrade-insecure-requests");

    await next();
});

// Simple Rate Limiting Middleware
var rateLimitStore = new Dictionary<string, (DateTime LastRequest, int RequestCount)>();
var rateLimitLock = new object();

app.Use(async (context, next) =>
{
    var clientIP = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var now = DateTime.UtcNow;
    bool overLimit = false;
    bool isLoginAttempt = false;
    lock (rateLimitLock)
    {
        if (rateLimitStore.TryGetValue(clientIP, out var existing))
        {
            // Reset counter every minute
            if (now - existing.LastRequest > TimeSpan.FromMinutes(1))
            {
                rateLimitStore[clientIP] = (now, 1);
            }
            else
            {
                rateLimitStore[clientIP] = (now, existing.RequestCount + 1);
                isLoginAttempt = context.Request.Path.StartsWithSegments("/api/Manage/login");
                var limit = isLoginAttempt ? 5 : 100;
                if (existing.RequestCount + 1 > limit)
                {
                    overLimit = true;
                }
            }
        }
        else
        {
            rateLimitStore[clientIP] = (now, 1);
        }

        // Clean up old entries every 100 requests
        if (rateLimitStore.Count > 1000)
        {
            var cutoff = now.AddMinutes(-5);
            var toRemove = rateLimitStore.Where(kvp => kvp.Value.LastRequest < cutoff).Select(kvp => kvp.Key).ToList();
            foreach (var key in toRemove)
            {
                rateLimitStore.Remove(key);
            }
        }
    }

    if (overLimit)
    {
        context.Response.StatusCode = 429;
        if (!context.Response.Headers.ContainsKey("Retry-After"))
        {
            context.Response.Headers.Add("Retry-After", "60");
        }
        context.Response.ContentType = "text/plain";
        var responseBytes = System.Text.Encoding.UTF8.GetBytes("Rate limit exceeded. Please try again later.");
        await context.Response.Body.WriteAsync(responseBytes, 0, responseBytes.Length);
        return;
    }

    await next();
});

app.UseRouting();
app.UseCors("SecurePolicy");
app.UseSession();
app.UseAuthentication(); // Kích hoạt authentication
app.UseAuthorization();  // Kích hoạt authorization
app.UseStaticFiles();

app.MapControllers();

app.Run();

// Hàm tạo Admin User với password hashing chuẩn
static async Task SeedAdminUser(IServiceProvider services)
{
    var manageRepo = services.GetRequiredService<IManageRepository>();
    var passwordHasher = services.GetRequiredService<IPasswordHasher<Manage>>();

    try
    {
        // Kiểm tra nếu chưa có admin
        var all = await manageRepo.GetAll();
        var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? "admin@bkav.com";
        var existingAdmin = all.FirstOrDefault(x => x.Email.ToLower() == adminEmail.ToLower());

        if (existingAdmin == null)
        {
            // Use environment variables for admin credentials  
            var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "TempPass123!@#";

            var adminUser = new Manage
            {
                UserName = "Administrator",
                Email = adminEmail,
                Password = adminPassword,
                Role = "Admin",
                IsActive = true,
                JoiningDate = DateTime.UtcNow,
                Type = DataType.User,
                Secret2FA = null,
                ViewCount = 0
            };
            adminUser.Password = passwordHasher.HashPassword(adminUser, adminUser.Password);
            await manageRepo.AddAsync(adminUser);
            Console.WriteLine("✅ Admin user created successfully!");
            Console.WriteLine($"📧 Email: {adminEmail}");
            Console.WriteLine("⚠️  Please change password after first login!");
        }
        else
        {
            // Nếu bản ghi admin đã tồn tại nhưng role bị sai, hướng dẫn xóa bản ghi cũ
            if (existingAdmin.Role != "Admin")
            {
                Console.WriteLine($"⚠️  Found {adminEmail} but role is '{existingAdmin.Role}'. Please delete this user in DB and restart to seed correct admin.");
            }
            else
            {
                Console.WriteLine("ℹ️  Admin user already exists and has correct role.");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error creating admin user: {ex.Message}");
    }
}

// HttpContext.Session.SetString("UserRole", user.Role);

// Hàm tạo Sample Posters cho banner
static async Task SeedSamplePosters(IServiceProvider services)
{
    var manageRepo = services.GetRequiredService<IManageRepository>();

    try
    {
        Console.WriteLine("🔍 Checking existing posters...");

        // Kiểm tra nếu chưa có poster nào
        var all = await manageRepo.GetAll();
        var existingPosters = all.Where(x => x.Type == DataType.Poster).ToList();
        var activePosters = existingPosters.Where(x => x.IsActive).ToList();

        Console.WriteLine($"📊 Total posters: {existingPosters.Count}");
        Console.WriteLine($"📊 Active posters: {activePosters.Count}");

        if (!existingPosters.Any())
        {
            Console.WriteLine("📝 Creating sample posters...");

            var samplePosters = new List<Manage>
            {
                new Manage
                {
                    UserName = "Banner Chào Mừng",
                    Description = "Chào mừng bạn đến với hệ thống BCS",
                    ImageUrl = "/assets/cybeart.jpg", // Sử dụng ảnh có sẵn
                    Content = "<p>Nội dung banner chào mừng...</p>",
                    Type = DataType.Poster,
                    IsActive = true,
                    PostingDate = DateTime.UtcNow,
                    ViewCount = 0
                },
                new Manage
                {
                    UserName = "Dịch Vụ Chuyên Nghiệp",
                    Description = "Cung cấp các dịch vụ IT chuyên nghiệp",
                    ImageUrl = "/assets/cybeart.jpg",
                    Content = "<p>Nội dung về dịch vụ...</p>",
                    Type = DataType.Poster,
                    IsActive = true,
                    PostingDate = DateTime.UtcNow,
                    ViewCount = 0
                }
            };

            foreach (var poster in samplePosters)
            {
                await manageRepo.AddAsync(poster);
                Console.WriteLine($"✅ Created poster: {poster.UserName}");
            }

            Console.WriteLine("✅ Sample posters created successfully!");
        }
        else
        {
            Console.WriteLine($"ℹ️  Found {existingPosters.Count} existing posters in database.");
            foreach (var poster in existingPosters)
            {
                Console.WriteLine($"📄 Poster: {poster.UserName} - Active: {poster.IsActive}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error creating sample posters: {ex.Message}");
        Console.WriteLine($"❌ Stack trace: {ex.StackTrace}");
    }
}
