using apitedie.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace apitedie.Controllers
{
    public class PerfilController : ApiController
    {
        static readonly IPerfilRepositorio repositorio = new PerfilRepositorio();

        public IEnumerable<Perfil> GetAllPerfil()
        {
            return repositorio.GetAll();
        }

        public Perfil GetPeril(int id)
        {
            Perfil item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostPerfil(Perfil item)
        {
            item = repositorio.Add(item);
            var response = Request.CreateResponse<Perfil>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { IdCliente = item.IdCliente });
            response.Headers.Location = new Uri(uri);
            return response;
        }
    }
}