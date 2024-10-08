using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MapaDeConocimiento.Services;

var builder = WebApplication.CreateBuilder(args);

// Services
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

app.UseAuthorization();

// Map API controllers and Razor Pages
app.MapControllers(); // Map API controllers
app.MapControllerRoute(
    name: "defaultApi",
    pattern: "api/{controller=Home}/{action=Index}/{id?}"
);
app.MapRazorPages(); // Map Razor Pages

app.Run();
