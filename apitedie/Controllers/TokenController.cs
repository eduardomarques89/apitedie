using System.Net;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class TokenController : ApiController
    {
        static readonly ITokenRepositorio repositorio = new TokenRepositorio();

        //public IEnumerable<Tokens> GetAllToken()
        //{
        //    return repositorio.GetAll();
        //}

        public Tokens GetToken(string id)
        {
            Tokens item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        //public IEnumerable<Tokens> GetProdutosPorCategoria(string credencialname, string credencialkey)
        //{
        //    return repositorio.GetAll().Where(
        //        p => string.Equals(p.CredencialName, credencialname, StringComparison.OrdinalIgnoreCase)).Where(
        //        p => string.Equals(p.CredencialKey, credencialkey, StringComparison.OrdinalIgnoreCase));
        //}
    }
}
