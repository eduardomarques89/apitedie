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
    public class TicketClienteController : ApiController
    {
        static readonly ITicketClienteRepositorio repositorio = new TicketClienteRepositorio();

        public IEnumerable<TicketCliente> GetAllTicket()
        {
            return repositorio.GetAll();
        }

        public TicketCliente GetTicket(int id)
        {
            TicketCliente item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        [Route("api/Ticket/{id}/Mensagem")]
        public IEnumerable<string> GetMensagensPorCliente(int id)
        {
            return repositorio.GetAll().Where(p => p.IdTicket == id).Select(t=>t.Mensagem);
        }
    }
}