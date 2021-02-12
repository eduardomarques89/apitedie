using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class PedidosController : ApiController
    {
        static readonly PedidoRepositorio repositorio = new PedidoRepositorio();

        public IEnumerable<Pedidos> GetAllProdutos()
        {
            return repositorio.GetAll();
        }

        public Pedidos GetPedido(string id)
        {
            Pedidos item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostPedido(Pedidos item)
        {
            try
            {
                repositorio.Insere(item);
                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception e)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new { error = e.Message });
            }
        }

        [Route("api/Pedidos/Checkout")]
        public HttpResponseMessage Checkout(Pedidos item)
        {
            if (item == null)
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Você não informou nenhum item");

            try
            {
                repositorio.Update(item);
                return Request.CreateResponse(HttpStatusCode.NoContent);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [Route("api/Pedidos/Usuario/{id}")]
        public IEnumerable<Pedidos> GetPedidosPorUsuario(int id)
        {
            return repositorio.GetAll().Where(p => p.IdCliente == id);
        }

        [Route("api/Pedidos/{id}/Avaliacao/")]
        public HttpResponseMessage PostAvaliacaoPedido(int id, int nota, string observacao)
        {
            try
            {
                repositorio.AvaliarPedido(id, nota, observacao);
                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }
    }
}
