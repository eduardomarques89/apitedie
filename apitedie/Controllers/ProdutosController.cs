using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class ProdutosController : ApiController
    {
        static readonly IProdutoRepositorio repositorio = new ProdutoRepositorio();

        public IEnumerable<Produtos> GetAllProdutos()
        {
            return repositorio.GetAll();
        }

        public Produtos GetProduto(int id)
        {
            Produtos item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public IEnumerable<Produtos> GetProdutosPorCategoria(string token, int idempresa, string categoria)
        {
            return repositorio.GetAll().Where(
                p => string.Equals(p.Categoria, categoria, StringComparison.OrdinalIgnoreCase)).Where(
                p => string.Equals(p.IdEmpresa.ToString(), idempresa.ToString(), StringComparison.OrdinalIgnoreCase));
        }

        public IEnumerable<Produtos> GetProdutosPorEmpresa(string token, int idempresa, int idproduto)
        {
            return repositorio.GetAll().Where(
                p => string.Equals(p.Id.ToString(), idproduto.ToString(), StringComparison.OrdinalIgnoreCase)).Where(
                p => string.Equals(p.IdEmpresa.ToString(), idempresa.ToString(), StringComparison.OrdinalIgnoreCase));
        }

        public IEnumerable<Produtos> GetProdutosEmpresa(string token, int idempresa)
        {
            return repositorio.GetAll().Where(
                p => string.Equals(p.IdEmpresa.ToString(), idempresa.ToString(), StringComparison.OrdinalIgnoreCase));
        }

        public HttpResponseMessage PostProduto(Produtos item)
        {
            item = repositorio.Add(item);
            var response = Request.CreateResponse<Produtos>(HttpStatusCode.Created, item);

            string uri = Url.Link("DefaultApi", new { idempresa = item.IdEmpresa });
            response.Headers.Location = new Uri(uri);
            return response;
        }

        [Route("api/produtos/CEPCategoriaPaginado")]
        public IEnumerable<Produtos> GetProdutosPorCEPCategoriaPaginado(int CEP, string Categoria, int offset, int limite, string searchQuery)
        {
            IEnumerable<Produtos> produtos = repositorio.GetAll();

            if (!string.IsNullOrEmpty(Categoria))
                produtos = produtos.Where(p => string.Equals(p.Categoria, Categoria, StringComparison.OrdinalIgnoreCase));

            produtos = produtos.Where(p => p.CEPInicial <= CEP && p.CEPFinal >= CEP);

            if (!string.IsNullOrEmpty(searchQuery) && searchQuery != "\"\"")
                produtos = produtos.Where(p => p.Nome.ToLower().Contains(searchQuery.ToLower()));

            produtos = produtos.Skip(offset).Take(limite);

            return produtos;
        }

        [Route("api/produtos/Ofertas")]
        public HttpResponseMessage GetOfertasPorCEPPaginado(int CEP, int offset, int limite, string searchQuery)
        {
            IEnumerable<Produtos> produtos = repositorio.GetAll()
               .Where(p => p.CEPInicial <= CEP && p.CEPFinal >= CEP);

            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            SqlCommand _comandoSQL = new SqlCommand("SELECT * FROM APP_OFERTA WHERE CONVERT(date, DATA_INICIO) <= CONVERT(date, GETDATE()) " +
                "AND CONVERT(date, DATA_FIM) >= CONVERT(date, GETDATE())", _conn);
            try
            {
                List<Produtos> produtosComOfertas = produtos.ToList();
                _conn.Open();
                var dr = _comandoSQL.ExecuteReader();
                while (dr.Read())
                {
                    int idProduto = Convert.ToInt32(dr["idproduto"]);
                    produtos.Where(p => p.Id == idProduto).ToList().ForEach(pa =>
                    {
                        if (pa.Ofertas == null)
                            pa.Ofertas = new List<Ofertas>();
                        pa.Ofertas.Add(new Ofertas
                        {
                            IdOferta = Convert.ToInt32(dr["idoferta"]),
                            Data_inicio = dr["data_inicio"].ToString(),
                            Data_fim = dr["data_fim"].ToString(),
                            Valor = dr["valor"].ToString() == "" ? 0 : Convert.ToDouble(dr["valor"]),
                            ValorPromocional = dr["valor_promocional"].ToString() == "" ? 0 : Convert.ToDouble(dr["valor_promocional"]),
                            Status = dr["status"].ToString(),
                        });
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

            produtos = produtos.Where(p => p.Ofertas != null && p.Ofertas.Count() > 0);

            if (!string.IsNullOrEmpty(searchQuery) && searchQuery != "\"\"")
                produtos = produtos.Where(p => p.Nome.ToLower().Contains(searchQuery.ToLower()));
            produtos = produtos.Skip(offset).Take(limite);

            return Request.CreateResponse(HttpStatusCode.OK, produtos);
        }
    }
}
