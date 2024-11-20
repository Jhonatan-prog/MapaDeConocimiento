using MapaDeConocimiento.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MapaDeConocimiento.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace MapaDeConocimiento.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly ControlConexion _controlConexion; // Cambiado a ControlConexion

        public AuthController(TokenService tokenService, ControlConexion controlConexion) // Cambiado a ControlConexion
        {
            _tokenService = tokenService;
            _controlConexion = controlConexion;
        }

        [AllowAnonymous]
        [HttpPost("authenticated")]
        public IActionResult Authenticated([FromBody] LoginModel login)
        {   
            return Ok();
        } 

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult LogIn([FromBody] LoginModel user)
        {
            string userEmail = user.Email;
            List<string> roles = FetchUserRoles(userEmail) ?? [];

            var token = _tokenService.GenerateToken(userEmail, roles);
            return Ok(new { Token = token });
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Append("token", "", new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(-1)
            });

            return Redirect("/index");
        }

        [HttpGet("get-roles")]
        public IActionResult GetUserRoles(string userEmail) 
        {
            try
            {
                var roles = FetchUserRoles(userEmail);

                if (roles == null || roles.Count == 0) {
                    Console.WriteLine("No roles found.");
                    return NotFound();
                }

                return Ok(roles);
            }
            catch (Exception exc)
            {
                Console.WriteLine($"Exception occurred: {exc.Message}");
                return StatusCode(500, $"Internal server error: {exc.Message}");
            }
        }

        private List<string>? FetchUserRoles(string userEmail)
        {
            try
            {
                _controlConexion.AbrirBd();

                string SQLScript = 
                @"
                    IF EXISTS (SELECT 1 FROM rol_usuario WHERE fkemail = @Email)
                    SELECT r.nombre
                    FROM usuario u
                    JOIN rol_usuario ru ON u.email = ru.fkemail
                    JOIN rol r ON ru.fkidrol = r.id
                    WHERE u.email = @Email;
                ";
                var parametros = new[] { new SqlParameter("@Email", userEmail) };

                var query = _controlConexion.EjecutarConsultaSql(SQLScript, parametros);

                _controlConexion.CerrarBd();

                if (query.Rows.Count == 0) {
                    Console.WriteLine("No roles found in the database.");
                    return [];
                }

                List<string> roles = [];

                foreach (DataRow row in query.Rows)
                {
                    roles.Add((string) row["nombre"]);
                }

                return roles;
            }
            catch (Exception exc)
            {
                Console.WriteLine($"Exception occurred during role retrieval: {exc.Message}");
                return null;
            }
        }
    }
}
