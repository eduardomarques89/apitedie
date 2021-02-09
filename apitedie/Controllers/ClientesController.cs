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
                if (cliente == null)
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

        [Route("api/clientes/PostCartao")]
        public HttpResponseMessage PostCartao(CartaoCredito card)
        {
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);

            _conn.Open();
            SqlCommand _comandoSQL = new SqlCommand(
                            " INSERT INTO APP_CARTAO (idcliente, numero, datavenc, cpf, nome, cvv, idbandeira) " +
                            " output INSERTED.IDCARTAO VALUES (@idcliente, @numero, @datavenc, @cpf, @nome, @cvv, @idbandeira) ", _conn);

            _comandoSQL.Parameters.AddWithValue("@idcliente", card.IdCliente);
            _comandoSQL.Parameters.AddWithValue("@numero", card.Numero);
            _comandoSQL.Parameters.AddWithValue("@datavenc", card.Validade);
            _comandoSQL.Parameters.AddWithValue("@cpf", card.CPF);
            _comandoSQL.Parameters.AddWithValue("@nome", card.Titular);
            _comandoSQL.Parameters.AddWithValue("@cvv", card.CVV);
            _comandoSQL.Parameters.AddWithValue("@idbandeira", card.IdBandeira);

            int idCartao = (int)_comandoSQL.ExecuteScalar();
            if (idCartao > 0)
                return Request.CreateResponse(HttpStatusCode.Created);
            else
                return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        [Route("api/clientes/GetCartao")]
        public HttpResponseMessage GetCartao(int idCliente)
        {
            List<CartaoCredito> cartoes = new List<CartaoCredito>();
            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);

            SqlCommand _comandoSQL = new SqlCommand(
                            " SELECT datavenc, idcartao, idcliente, numero, b.idbandeira, cpf, nome, cvv, nomebandeira" +
                            " FROM APP_CARTAO c LEFT JOIN app_bandeira B ON B.idbandeira= c.idbandeira" +
                            " WHERE idCliente= @idCliente", _conn);

            _comandoSQL.Parameters.AddWithValue("@idCliente", idCliente);

            try
            {
                _conn.Open();
                var dr = _comandoSQL.ExecuteReader();
                while (dr.Read())
                {
                    cartoes.Add(new CartaoCredito
                    {
                        IdCliente = dr["idcliente"].ToString() == "" ? 0 : Convert.ToInt32(dr["idcliente"]),
                        Numero = dr["numero"].ToString(),
                        IdCartao = dr["idCartao"].ToString() == "" ? 0 : Convert.ToInt32(dr["idCartao"]),
                        Validade = dr["datavenc"].ToString(),
                        CPF = dr["cpf"].ToString(),
                        Titular = dr["nome"].ToString(),
                        CVV = dr["cvv"].ToString(),
                        IdBandeira = dr["idbandeira"].ToString(),
                        Bandeira = dr["nomebandeira"].ToString(),
                    });
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            finally
            {
                _conn.Close();
            }

            return Request.CreateResponse(HttpStatusCode.Created, cartoes);
        }
    }
}
