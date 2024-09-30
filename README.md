## .NET Command line

1. dotnet -h | --help (Displays all commands to use)
2. dotnet new [List project references of a .NET project.]
3. dotnet new list [Displays every template dotnet uses]
4. dotnet add [Add a package]
5. dotnet build [It builds a .NET project]
6. dotnet remove [It removes a package from the project]
7. dotnet run [Build and run a .NET project output.]
8. dotnet restore [It restores the packages]
9. dotnet tool [Install or manage tools that extend the .NET experience.]
10. dotnet sdk [Manage .NET SDK installation.]
11. dotnet clean [Clean build outputs of a .NET project.] -> similar to rebuild (only build the chaged files)
12. dotnet --info [Gives info about .NET]


````c#
// prev program
using Microsoft.AspNetCore.Builder; // Importa el espacio de nombres necesario para construir y configurar la aplicación web.
using Microsoft.Extensions.DependencyInjection; // Importa el espacio de nombres necesario para configurar los servicios de la aplicación.
using Microsoft.Extensions.Hosting; // Importa el espacio de nombres necesario para trabajar con diferentes entornos (desarrollo, producción, etc.).
using ProyectoBackendCsharp.Services; // Importa los servicios personalizados que se utilizarán en la aplicación.

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowAllOrigins"); 

app.UseAuthorization();

app.MapRazorPages();

app.Run();

```
