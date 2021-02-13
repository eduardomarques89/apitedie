using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Cupons
    {
        public int IdCupom { get; set; }
        public int IdEmpresa { get; set; }
        public string Codigo { get; set; }
        public string NomeCupom { get; set; }
        public string Beneficio { get; set; }
        public double Valor { get; set; }
        public int Qtde_Cliente { get; set; }
        public int Qtde_Geral { get; set; }
        public string Tipo { get; set; }
        public string NomeEmpresa { get; set; }
        public DateTime Inicio { get; set; }
        public DateTime Final { get; set; }
        public string Status { get; set; }
    }

    public interface ICupomRepositorio
    {
        IEnumerable<Cupons> GetAll();
        Cupons Get(int id);
        Cupons Add(Cupons item);
        void Remove(int id);
        bool Update(Cupons item);
    }
}