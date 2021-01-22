using System.Collections.Generic;

namespace apitedie.Models
{
    public class Produtos
    {
        public int Id { get; set; }
        public int IdEmpresa { get; set; }
        public int CEPInicial { get; set; }
        public int CEPFinal { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Categoria { get; set; }
        public int IdCategoria { get; set; }
        public string Codigo_Barras { get; set; }
        public double Preco_De { get; set; }
        //public double Preco_Por { get; set; } // O preco de promoção vem da tabela oferta
        public double Pontos { get; set; }
        public double Qtde_Inicial { get; set; }
        public double Qtde_Final { get; set; }
        public string Imagem { get; set; }
        public double QtdePadrao { get; set; }
        public double Estoque { get; set; }
        public string UnidadeMedida { get; set; }
        public string Status { get; set; }
        public string Token { get; set; }
        public IList<Ofertas> Ofertas { get; set; }
    }
    public class Ofertas
    {
        public int IdOferta;
        public int IdProduto;
        public string Data_inicio;
        public string Data_fim;
        public double Valor;
        public double ValorPromocional;
        public string Status;
    }

    public interface IProdutoRepositorio
    {
        IEnumerable<Produtos> GetAll();
        Produtos Get(int id);    
        Produtos Add(Produtos item);
        void Remove(int id);
        bool Update(Produtos item);
    }
}