using apitedie.Models;
using Quartz;
using System;
using System.Net;
using System.Net.Mail;

namespace ScheduledTaskExample.ScheduledTasks
{
    // TODO verificacao de pagamentos na juno.
    public class EmailJob : IJob
    {
        readonly PedidoRepositorio repo = new PedidoRepositorio();
        public void Execute(IJobExecutionContext context)
        {
            repo.UpdateTransacao();
        }
    }
}