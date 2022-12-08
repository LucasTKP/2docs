
function ErrorCognito(props) {
    const errors = props
    console.log(errors.code)
    var message = errors.message
      if(errors.code === "auth/too-many-requests"){
        message = "Limite de tentativas de login excedido, tente novamente mais tarde."
      } else if (errors.code === "auth/wrong-password"){
        message = "Sua senha está incorreta!"
      } else if(errors.code === "auth/user-not-found"){
        message = "Este usuário não foi cadastrado."
      } else if(errors.code === "auth/email-already-in-use"){
        message = "Este email ja foi cadastrado em nosso sistema." 
      } else if (errors.code === "InvalidPasswordException"){
        message = "A senha deve conter caracteres minúsculos." 
      } else if(errors === "No current user"){
        message = "As credenciais do usuários estão incorretas."
      } else if(errors.code === "UsernameExistsException"){
        message = "Já existe um usuário cadastrado com este email." 
      }
    return message
}

export default ErrorCognito
