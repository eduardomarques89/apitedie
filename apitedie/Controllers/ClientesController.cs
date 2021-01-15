using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class ClientesController : ApiController
    {
        static readonly IClienteRepositorio repositorio = new ClienteRepositorio();

        public IEnumerable<Clientes> GetAllProdutos()
        {
            return repositorio.GetAll();
        }

        public Clientes GetCliente(int id)
        {
            Clientes item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public HttpResponseMessage PostCliente(Clientes cliente)
        {
            TokenRepositorio tokenRepo = new TokenRepositorio();

            try
            {
                if(cliente == null)
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, "Cliente não informado.");
                }
                repositorio.Insere(cliente);

                var token = tokenRepo.GeraToken(cliente);

                return Request.CreateResponse(HttpStatusCode.Created, new { cliente, token });
            }
            catch (EnderecoNaoSalvoException ex)
            {
                return Request.CreateResponse(HttpStatusCode.Created, cliente, ex.Message);
            }
            catch (GerarTokenException ex)
            {
                return Request.CreateResponse(HttpStatusCode.Created, cliente, ex.Message);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        public HttpResponseMessage PutCliente(Clientes cliente)
        {
            try
            {
                repositorio.Atualiza(cliente);
                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
        }

        [Route("api/clientes/autenticaComToken")]
        public HttpResponseMessage AutenticarComToken(string login, string senha)
        {
            TokenRepositorio tokenRepo = new TokenRepositorio();

            if (login != "" && senha.Trim().Length > 0)
            {
                SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
                SqlCommand _comandoSQL = new SqlCommand("select * from app_cliente where email = @email and senha = @senha", _conn);
                _comandoSQL.Parameters.AddWithValue("@email", login);
                _comandoSQL.Parameters.AddWithValue("@senha", senha);
                try
                {
                    _conn.Open();
                    var dr = _comandoSQL.ExecuteReader();
                    if (!dr.HasRows)
                        return Request.CreateResponse(HttpStatusCode.BadRequest, "Email ou senha inválidos.");
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

            List<Clientes> clientes = (List<Clientes>)repositorio.GetAll();
            Clientes cliente = clientes.Find(c => c.Email.ToLower() == login.ToLower());
            cliente.Enderecos = null;            
            try
            {
                var token = tokenRepo.GeraToken(cliente);
                return Request.CreateResponse(HttpStatusCode.Created, new { cliente, token });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.Created, ex.Message);
            }
        }
    }
}
