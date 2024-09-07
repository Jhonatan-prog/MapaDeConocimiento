using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Text.Json;
using MapaDeConocimiento.Controllers;

namespace MapaDeConocimiento.Services {

    /// <summary>
    /// Servicio para manejar las operaciones CRUD con una API externa.
    /// Proporciona métodos para obtener, añadir, editar y eliminar entidades.
    /// </summary>
    class ApiService {
        // Cliente HTTP para realizar las peticiones a la API
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Constructor que inicializa el servicio con un cliente HTTP.
        /// </summary>
        /// <param name="httpClient">Cliente HTTP inyectado por el contenedor de dependencias.</param>
        public ApiService(HttpClient httpClient) {
            _httpClient = httpClient;
        }

    }
}
