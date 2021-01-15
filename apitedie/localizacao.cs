using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace apitedie
{
    public class localizacao
    {
        public class CEPAbertoV3
        {
            public class CEPAbertoResponse
            {
                public Cidade cidade { get; set; }
                public Estado estado { get; set; }
                public string bairro { get; set; }
                public string cep { get; set; }
                public string logradouro { get; set; }
                public decimal? altitude { get; set; }
                public decimal? latitude { get; set; }
                public decimal? longitude { get; set; }

                public class Cidade
                {
                    public short? ddd { get; set; }
                    public int? ibge { get; set; }
                    public String nome { get; set; }
                }

                public class Estado
                {
                    public String sigla { get; set; }
                }
            }

            public object Make(String cep)
            {
                var url = "http://viacep.com.br/ws/{0}/json/";
                var client = new WebClient { Encoding = Encoding.UTF8 };
                var requestResult = client.DownloadString(string.Format(url, cep));
                var jss = new JavaScriptSerializer();
                var response = jss.Deserialize<object>(requestResult);
                return response;
            }

            public object LatLgn(String lat, String lng)
            {
                var API_KEY = "AIzaSyCXoBOm61XlnQJkAFRiMF80ZGj0HLla36I";
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={0},{1}&key=" + API_KEY;
                var client = new WebClient { Encoding = Encoding.UTF8 };
                var requestResult = client.DownloadString(string.Format(url, lat, lng));
                var jss = new JavaScriptSerializer();
                var response = jss.Deserialize<object>(requestResult);
                return response;
            }

            public CEPAbertoResponse CidadeUF(String cidade, String uf)
            {
                var token = "Token token=5fdca040340b4f40bc4a20fca3e0e6c2";
                var url = "https://www.cepaberto.com/api/v3/address?estado={0}&cidade={1}";

                var client = new WebClient { Encoding = Encoding.UTF8 };
                client.Headers.Add(HttpRequestHeader.Authorization, token);

                var requestResult = client.DownloadString(string.Format(url, uf, cidade));

                var jss = new JavaScriptSerializer();
                var response = jss.Deserialize<CEPAbertoResponse>(requestResult);

                return response;
            }
        }
    }
}