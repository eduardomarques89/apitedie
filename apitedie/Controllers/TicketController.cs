using apitedie.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace apitedie.Controllers
{
    public class TicketController : ApiController
    {
        static readonly ITicketRepositorio repositorio = new TicketRepositorio();

        public IEnumerable<Ticket> GetAllTicket()
        {
            return repositorio.GetAll();
        }

        public Ticket GetTicket(int id)
        {
            Ticket item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostTicket(Ticket item)
        {
            item = repositorio.Add(item);
            var response = Request.CreateResponse<Ticket>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { IdTicket = item.IdTicket });
            response.Headers.Location = new Uri(uri);
            return response;
        }

        [Route("api/Ticket/Cliente/{id}")]
        public IEnumerable<Ticket> GetTicketPorCliente(int id)
        {
            return repositorio.GetAll().Where(p => p.IdCliente == id);
        }

        [Route("api/Ticket/{id}")]
        public HttpResponseMessage PostMessagem(int id, string mensagem)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("INSERT INTO APP_TICKET_CLIENTE (IDTICKET, MENSAGEM) VALUES (@ID, @MENSAGEM)", _conn);
            _comandoSQL.Parameters.AddWithValue("@ID", id);
            _comandoSQL.Parameters.AddWithValue("@MENSAGEM", mensagem);
            try
            {
                _conn.Open();
                int affectedRows = _comandoSQL.ExecuteNonQuery();
                if (affectedRows > 0)
                    return Request.CreateResponse(HttpStatusCode.OK);
                else throw new Exception("Ticket não encontrado.");
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            finally
            {
                _conn.Close();
            }
        }
    }
}