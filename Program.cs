using Microsoft.AspNetCore.Authentication.JwtBearer;
using MapaDeConocimiento.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
var jwtSecretKey = configuration["Jwt:Key"]!;
var issuer = configuration["Jwt:Issuer"];
var audience = configuration["Jwt:Audience"];
// MyApp // MyAppUsers //

// Services
builder.Services.AddAuthentication(options => 
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => 
{
    options.TokenValidationParameters = new TokenValidationParameters 
    {
        ValidateIssuer  = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        RoleClaimType = ClaimTypes.Role, // ClaimTypes.Role,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var tokenFromCookie = context.Request.Cookies["token"]; // Read token from cookie
            if (!string.IsNullOrEmpty(tokenFromCookie))
            {
                context.Token = tokenFromCookie;  // Set the token to be validated
            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserPolicy", policy => policy.RequireRole("Active"));
});

builder.Services.AddRazorPages();
builder.Services.AddControllers();
builder.Services.AddSingleton<ControlConexion>();
builder.Services.AddSingleton<TokenService>();

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

var app = builder.Build();

// HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.Use(async (context, next) =>
{
    // Log the request method and URL
    Console.WriteLine($"Request Method: {context.Request.Method}, Request URL: {context.Request.Path}");

    // Log the headers, including the Authorization header
    foreach (var header in context.Request.Headers)
    {
        Console.WriteLine($"Header: {header.Key} = {header.Value}");
    }

    // Check if the Authorization header is present
    if (context.Request.Headers.ContainsKey("Authorization"))
    {
        Console.WriteLine("Authorization Header Found");
        Console.WriteLine($"Authorization: {context.Request.Headers["Authorization"]}");
    }
    else
    {
        Console.WriteLine("Authorization Header Not Found");
    }

    // Call the next middleware in the pipeline
    await next.Invoke();
});

app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute(
    name: "defaultApi",
    pattern: "api/{controller=Home}/{action=Index}/{id?}"
);
app.MapRazorPages();

app.Run();
