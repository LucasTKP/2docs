
function ErrorCognito(props) {
    const errors = props

        var message = errors.message
        if(errors.code === "UserNotFoundException"){
          message = "Este usuário não esta cadastrado ou foi desativado."
        } else if (errors.code === "NotAuthorizedException"){
          message = "As credenciais do usuários estão incorretas."
        } else if(errors.code === "LimitExceededException"){
          message = "Limite de tentativas excedido, tente novamente mais tarde."
        } else if(errors.code === "CodeMismatchException"){
          message = "O código digitado esta incorreto." 
        } else if (errors.code === "InvalidPasswordException"){
          message = "A senha deve conter caracteres minúsculos." 
        }

    return message
}

export default ErrorCognito
