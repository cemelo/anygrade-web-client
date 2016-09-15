export default {
  header: {
    menu: 'Menu',

    search: {
      title: 'Pesquisar',
      placeholder: 'O que você procura?',
      audio_input: 'Pesquisar por voz',
    },

    signin: 'Entrar',
    offline: 'Offline',
  },

  user_menu: {
    profile: 'Perfil',
    logout: 'Sair',

    notifications: 'Notificações recentes',

    status: {
      available: 'Disponível',
      busy: 'Ocupado',
      invisible: 'Invisível',
    },
  },

  auth: {
    greeting: 'Olá, %{name}!',

    signin: 'Entre',
    signup: 'Cadastre-se',
    reset_password: 'Redefina sua senha',

    signin_separator: 'ou insira suas credenciais',
    signup_separator: 'ou cadastre-se',
    reset_password_separator: 'ou redefina sua senha',

    take_photo: 'Clique para tirar uma foto com sua webcam',
    retake_photo: 'Clique para tirar outra foto',

    external: {
      signin: 'Conecte-se com o %{provider}',
      signup: 'Cadastre-se usando o %{provider}',
      reset_password: 'Conecte-se com o %{provider}',
    },

    form: {
      fullname: 'Nome completo',
      email: 'E-mail',
      password: 'Senha',
      forgot_password: 'Esqueceu sua senha?',
    },

    message: {
      signup_successful: 'Cadastro realizado com sucesso!',
      password_reset: `As instruções para redefinir sua senha
        foram enviadas para o seu e-mail.`,
    },

    error: {
      user_exists: `Seu usuário já está registrado.
        Caso tenha esquecido sua senha,
        tente recuperá-la.`,
      Unauthorized: 'Ops! Esta combinação de e-mail/senha é inválida.',
    },
  },
};
