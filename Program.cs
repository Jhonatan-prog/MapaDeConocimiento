using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MapaDeConocimiento.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddRazorPages(); // Add Razor Pages support
builder.Services.AddControllers(); // Add support for API controllers
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

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error"); // Handle exceptions
    app.UseHsts(); // Enforce HTTP Strict Transport Security
}

app.UseHttpsRedirection(); // Redirect HTTP to HTTPS
app.UseStaticFiles(); // Serve static files from wwwroot

app.UseRouting(); // Enable routing

app.UseAuthorization(); // Enable authorization

// Map API controllers and Razor Pages
app.MapControllers(); // Map API controllers
app.MapControllerRoute(
    name: "defaultApi",
    pattern: "api/{controller=Home}/{action=Index}/{id?}"
);
app.MapRazorPages(); // Map Razor Pages

// Optional: You can define a default route if you have a main page
app.MapGet("/", () => Results.Redirect("/Index"));

app.Run(); // Start the application
