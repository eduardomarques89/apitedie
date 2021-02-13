using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class CuponsController : ApiController
    {
        static readonly CupomRepositorio cupom = new CupomRepositorio();

        public IEnumerable<Cupons> GetAllProdutos()
        {
            return cupom.GetAll();
        }

        public Cupons GetCupom(int id)
        {
            Cupons item = cupom.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostCupom(Cupons item)
        {
            item = cupom.Add(item);
            var response = Request.CreateResponse<Cupons>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { IdCupom = item.IdCupom });
            response.Headers.Location = new Uri(uri);
            return response;
        }
    }
}
