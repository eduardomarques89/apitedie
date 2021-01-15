using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class EnderecosController : ApiController
    {
        static readonly IEnderecoRepositorio repositorio = new EnderecoRepositorio();

        public IEnumerable<Enderecos> GetAllProdutos()
        {
            return repositorio.GetAll();
        }

        public Enderecos GetCliente(int id)
        {
            Enderecos item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostCliente(Enderecos item)
        {
            item = repositorio.Add(item);
            var response = Request.CreateResponse<Enderecos>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { IdCliente = item.IdCliente });
            response.Headers.Location = new Uri(uri);
            return response;
        }

        [Route("api/Enderecos/Cliente/{id}")]
        public IEnumerable<Enderecos> GetPorIdCliente(int id)
        {
            IEnumerable<Enderecos> enderecos = repositorio.GetAll().Where(p => p.IdCliente == id);
            return enderecos;
        }

        [Route("api/Enderecos/LatLong")]
        public object GetPorLatLong(string latitude, string longitude)
        {
            return new localizacao.CEPAbertoV3().LatLgn(latitude, longitude);
        }

        [Route("api/Enderecos/CEP")]
        public object GetPorCEP(string CEP)
        {
            return new localizacao.CEPAbertoV3().Make(CEP);
        }
    }
}
