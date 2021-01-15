using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Empresas
    {
        public int IdEmpresa { get; set; }
        public string Nome { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Uf { get; set; }
        public string Num { get; set; }
        public string Logo { get; set; }
        public int CEP { get; set; }
        public double Score { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string TipoEntrega { get; set; }
        public string Status { get; set; }
        public string Token { get; set; }
    }

    public interface IEmpresaRepositorio
    {
        IEnumerable<Empresas> GetAll();
        Empresas Get(int id);
        Empresas Add(Empresas item);        
    }
}