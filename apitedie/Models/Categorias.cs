using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Categorias
    {
        public int IdEmpresa { get; set; }
        public int IdCategoria { get; set; }
        public string NomeCategoria { get; set; }
        public string Icone { get; set; }
    }

    public interface ICategoriaRepositorio
    {
        IEnumerable<Categorias> GetAll();
        Categorias Get(int id);
    }
}