using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using apitedie.Models;

namespace apitedie.Controllers
{
    public class EmpresasController : ApiController
    {
        static readonly IEmpresaRepositorio repositorio = new EmpresaRepositorio();

        public IEnumerable<Empresas> GetAllEmpresas()
        {
            return repositorio.GetAll();
        }

        public Empresas GetEmpresa(int id)
        {
            Empresas item = repositorio.Get(id);
            if (item == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return item;
        }

        public IEnumerable<Empresas> GetListaEmpresa(string token, int idempresa)
        {
            return repositorio.GetAll().Where(
                p => string.Equals(p.IdEmpresa.ToString(), idempresa.ToString(), StringComparison.OrdinalIgnoreCase));
        }

        [Route("api/empresas/GetListaEmpresaByCEP")]
        public IEnumerable<Empresas> GetListaEmpresaByCEP(int CEP)
        {
            var repo = repositorio.GetAll();
            repo = repo.Where(p => p.CEPInicial <= CEP && p.CEPFinal >= CEP).ToList();
            return repo;
        }

        [Route("api/empresas/getMarketsListByIds")]
        public HttpResponseMessage getMarketsListByIds([FromUri] int[] ids)
        {
            if (ids == null) return Request.CreateResponse(HttpStatusCode.BadRequest);
            var emps = repositorio.GetAll();
            emps = emps.Where(e => ids.Contains(e.IdEmpresa));
            return Request.CreateResponse(HttpStatusCode.OK, emps);
        }

        [Route("api/empresas/horarios")]
        public HttpResponseMessage GetHorarios([FromUri] int id)
        {
            List<object> horarios = new List<object>();

            SqlConnection _conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
            var sql = " select  EH.IDHORARIO horacod, EH.IDTIPOENTREGA identrega, Etp.TAXA, HO.horario, TP.TIPOENTREGA  from APP_EMPRESA_HORARIO EH " +
                    " join APP_EMPRESA_TIPOENTREGA Etp on EH.idempresa = Etp.IDEMPRESA AND Etp.STATUS = 'A' " +
                    " join APP_TIPOENTREGA TP ON TP.IDTIPOENTREGA = Etp.IDTIPOENTREGA AND TP.STATUS = 'A' and tp.IDTIPOENTREGA = eh.IDTIPOENTREGA " +
                    " join APP_HORARIO HO ON HO.IDHORARIO = EH.IDHORARIO AND HO.STATUS = 'A' and eh.IDHORARIO = ho.IDHORARIO " +
                    " where etp.IDEMPRESA = " + id +
                    " group by  EH.IDHORARIO , EH.IDTIPOENTREGA , Etp.TAXA, HO.horario, TP.TIPOENTREGA; ";
            SqlCommand _comandoSQL = new SqlCommand(sql, _conn);
            try
            {
                _conn.Open();
                var dr = _comandoSQL.ExecuteReader();
                while (dr.Read())
                {
                    horarios.Add(new
                    {
                        horacod = dr["horacod"].ToString(),
                        identrega = dr["identrega"].ToString(),
                        TAXA = dr["TAXA"].ToString(),
                        horario = dr["horario"].ToString(),
                        TIPOENTREGA = dr["TIPOENTREGA"].ToString(),
                    });
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
            }
            finally
            {
                _conn.Close();
            }

            return Request.CreateResponse(HttpStatusCode.OK, horarios);
        }
    }
}
