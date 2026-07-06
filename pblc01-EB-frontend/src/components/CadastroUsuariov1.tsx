import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

//esse é meu módulo antigo (da primeira entrega), que eu estava usando com o css. 
import './CadastroUsuario.css';

const schema = yup.object({
  nome: yup.string().required('O nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('A senha é obrigatória'),
  tipo: yup
    .string()
    .oneOf(['USUARIO', 'PRODUTOR'] as const, 'Selecione um perfil')
    .required('O tipo é obrigatório'),
  telefoneContato: yup.string().default(''),
  cnpj: yup.string().default(''),
  nomeEmpresa: yup.string().default(''),
}).required();

type ICadastroUsuario = yup.InferType<typeof schema>;

export default function CadastroUsuario() {
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ICadastroUsuario>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      tipo: '' as 'USUARIO' | 'PRODUTOR',
      telefoneContato: '',
      cnpj: '',
      nomeEmpresa: '',
    },
  });

  const tipoSelecionado = watch('tipo');

  const onSubmit = (data: ICadastroUsuario) => {
    console.log('Payload:', data);
    setMensagemSucesso(`Usuário ${data.nome} cadastrado com sucesso!`);
    reset();
    setTimeout(() => setMensagemSucesso(''), 5000);
  };

  return (
    <div className="pagina">

      <div className="painel-esquerdo">
        <div className="painel-blob painel-blob--top" />
        <div className="painel-blob painel-blob--bottom" />

        <div className="painel-logo-circulo">
          <img src="src/assets/painel-logo-img.jpeg" alt="Nutristack" className="painel-logo-img" />
        </div>
        <span className="painel-brand">NutriStack</span>

        <h2 className="painel-titulo">Bem-vindo<br />de volta!</h2>
        <p className="painel-subtitulo">
          Para continuar conectado,<br />entre com suas informações pessoais.
        </p>
        <a href="/login" className="painel-botao-outline">
          JÁ TENHO CONTA
        </a>
      </div>
      
      <div className="painel-direito">

        <div className="cabecalho-formulario">
          <h2 className="titulo">Criar Conta</h2>
          <p className="subtitulo">Preencha os dados para registrar um novo acesso</p>
          <p className="legenda-obrigatorio">
            <span className="campo-obrigatorio">*</span> Campos obrigatórios
          </p>
        </div>

        {mensagemSucesso && (
          <div className="alerta-sucesso">{mensagemSucesso}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="formulario-grid">

          <div className={`campo col-6 ${errors.nome ? 'campo--erro' : ''}`}>
            <label htmlFor="nome">
              Nome Completo <span className="campo-obrigatorio">*</span>
            </label>
            <input type="text" id="nome" placeholder="Digite o nome completo" {...register('nome')} />
            {errors.nome && <span className="mensagem-erro">{errors.nome.message}</span>}
          </div>

          <div className={`campo col-6 ${errors.email ? 'campo--erro' : ''}`}>
            <label htmlFor="email">
              E-mail <span className="campo-obrigatorio">*</span>
            </label>
            <input type="email" id="email" placeholder="exemplo@nutristack.com" {...register('email')} />
            {errors.email && <span className="mensagem-erro">{errors.email.message}</span>}
          </div>

          <div className={`campo col-4 ${errors.senha ? 'campo--erro' : ''}`}>
            <label htmlFor="senha">
              Senha <span className="campo-obrigatorio">*</span>
            </label>
            <input type="password" id="senha" placeholder="Mínimo 6 caracteres" {...register('senha')} />
            {errors.senha && <span className="mensagem-erro">{errors.senha.message}</span>}
          </div>

          <div className={`campo col-4 ${errors.tipo ? 'campo--erro' : ''}`}>
            <label htmlFor="tipo">
              Perfil de Acesso <span className="campo-obrigatorio">*</span>
            </label>
            <select id="tipo" {...register('tipo')}>
              <option value="">Selecione um perfil...</option>
              <option value="USUARIO">Usuário Comum</option>
              <option value="PRODUTOR">Produtor</option>
            </select>
            {errors.tipo && <span className="mensagem-erro">{errors.tipo.message}</span>}
          </div>

          <div className="campo col-4">
            <label htmlFor="telefoneContato">
              Telefone <span className="label-opcional">(Opcional)</span>
            </label>
            <input type="text" id="telefoneContato" placeholder="(00) 00000-0000" {...register('telefoneContato')} />
          </div>

          {tipoSelecionado === 'PRODUTOR' && (
            <div className="secao-produtor">
              <div className="secao-label">Especificações de Produtor</div>
              <div className="campo col-6">
                <label htmlFor="cnpj">CNPJ <span className="label-opcional">(Opcional)</span></label>
                <input type="text" id="cnpj" placeholder="00.000.000/0000-00" {...register('cnpj')} />
              </div>
              <div className="campo col-6">
                <label htmlFor="nomeEmpresa">
                  Nome da Empresa <span className="label-opcional">(Opcional)</span>
                </label>
                <input type="text" id="nomeEmpresa" placeholder="Nome Fantasia" {...register('nomeEmpresa')} />
              </div>
            </div>
          )}

          <div className="container-botao">
            <button type="submit" className="botao-enviar" disabled={isSubmitting || !isValid}>
              {isSubmitting ? 'Processando...' : 'Registrar Usuário'}
            </button>
          </div>

        </form>

        <p className="rodape-formulario">
          NutriStack - EB © 2026
        </p>
      </div>
    </div>
  );
}