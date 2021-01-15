using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Data;

namespace apitedie.Models
{
    public class TicketClienteRepositorio : ITicketClienteRepositorio
    {
        private List<TicketCliente> ticketCliente = new List<TicketCliente>();
        private int _nextId = 1;

        public TicketClienteRepositorio()
        {
            using (IDataReader reader = DatabaseFactory.CreateDatabase("DefaultConnection").ExecuteReader(CommandType.Text,
                @"SELECT * from APP_TICKET_CLIENTE"))
            {
                while (reader.Read())
                {
                    Add(new TicketCliente
                    {
                        IdTicket = Convert.ToInt32(reader["IDTICKET"].ToString()),
                        IdCliente = Convert.ToInt32(reader["IDECLIENTE"].ToString()),
                        Mensagem = reader["PROTOCOLO"].ToString(),
                        DataCadastro = Convert.ToDateTime(reader["DATACADASTRO"].ToString()),
                        Status = reader["STATUS"].ToString()
                        
                    });
                }
            }
        }

        public TicketCliente Add(TicketCliente item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            item.IdTicket = _nextId++;
            ticketCliente.Add(item);
            return item;
        }

        public TicketCliente Get(int id)
        {
            return ticketCliente.Find(p => p.IdCliente == id);

        }

        public IEnumerable<TicketCliente> GetAll()
        {
            return ticketCliente;
        }

        public void Remove(int id)
        {
            ticketCliente.RemoveAll(p => p.IdTicket == id);
        }

        public bool Update(TicketCliente item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            int index = ticketCliente.FindIndex(p => p.IdTicket == item.IdTicket);

            if (index == -1)
            {
                return false;
            }
            ticketCliente.RemoveAt(index);
            ticketCliente.Add(item);
            return true;
        }
    }
}