using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace apitedie.Models
{
    public class Pedidos
    {
        public int Id { get; set; }
        public int IdCliente { get; set; }
        public string NumeroPedido { get; set; }
        public DateTime Data { get; set; }
        public double Valor { get; set; }
        public double Desconto { get; set; }
        public double Taxa { get; set; }
        public string Cupom { get; set; }
        public string TipoEntrega { get; set; }
        public string DiaSemana { get; set; }
        public string Horario { get; set; }
        public string Status { get; set; }
        public string Endereco { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
        public string CEP { get; set; }
        public string Num { get; set; }
        public string Complemento { get; set; }
        public string FormaPagamento { get; set; }
        public int QtdeParcela { get; set; }
        public string Observacao { get; set; }
        public double Score { get; set; }
    }

    public interface IPedidoRepositorio
    {
        IEnumerable<Pedidos> GetAll();
        Pedidos Get(string id);
        Pedidos Add(Pedidos item);
        void Update(Pedidos item);
        void AvaliarPedido(int id, int nota, string observacao);
    }
}