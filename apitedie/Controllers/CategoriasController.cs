using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class CategoriasController : ApiController
    {
        static readonly ICategoriaRepositorio categoria = new CategoriaRepositorio();

        public IEnumerable<Categorias> GetAllCategorias()
        {
            return categoria.GetAll();
        }

        public Categorias GetCategoria(int id)
        {
            Categorias item = categoria.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }
    }
}
