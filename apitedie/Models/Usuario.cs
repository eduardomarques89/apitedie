using System.Collections.Generic;

namespace apitedie.Models
{
    public class Usuario
    {
        public Usuario() { _codigo = 0; }
        #region Propriedades do Funcionario
        private int _codigo;
        public int Codigo
        {
            get
            {
                return _codigo;
            }
            set
            {
                _codigo = value;
            }
        }

        private string _login;
        public string Login
        {
            get { return _login; }
            set { _login = value; }
        }

        private string _senha;
        public string Senha
        {
            get { return _senha; }
            set { _senha = value; }
        }
        #endregion
    }

    public interface IUsuarioRepositorio
    {
        IEnumerable<Usuario> GetAll();
        Usuario Get(int id);
        Usuario Add(Usuario item);
        void Remove(int id);
        bool Update(Usuario item);
    }
}