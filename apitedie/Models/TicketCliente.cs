using System;
using System.Collections.Generic;

namespace apitedie.Models
{
    public class TicketCliente
    {
        public int IdTicket { get; set; }
        public int IdCliente { get; set; }
        public string Mensagem { get; set; }
        public DateTime DataCadastro { get; set; }
        public string Status { get; set; }
    }
    public interface ITicketClienteRepositorio
    {
        IEnumerable<TicketCliente> GetAll();
        TicketCliente Get(int id);
        TicketCliente Add(TicketCliente item);
        void Remove(int id);
        bool Update(TicketCliente item);
    }
}