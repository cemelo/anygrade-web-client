
const errors = {
  'auth.error.Unauthorized': __('Combinação e-mail/senha inválida.'),
  'auth.error.offline': __('Conexão ao servidor indisponível.'),
  'auth.error.user_exists': __(`Você já possui uma conta. Insira suas credenciais
        ou, se necessário, recupere sua senha.`),
};

export default function decodeError(code) {
  return errors[code];
}
