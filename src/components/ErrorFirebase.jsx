import {toast} from 'react-toastify'

function ErrorFirebase(props) {
    const errors = props
    var message = errors.message
      if(errors.code === "auth/too-many-requests"){
        message = "Limite de tentativas de login excedido, tente novamente mais tarde."
      } else if (errors.code === "auth/wrong-password"){
        message = "Sua senha está incorreta!"
      } else if(errors.code === "auth/user-not-found"){
        message = "Este usuário não foi cadastrado."
      } else if(errors.code === "auth/email-already-in-use"){
        message = "Este email ja foi cadastrado em nosso sistema." 
      } else if(errors.code === "auth/email-already-exists"){
        message = "Já existe um usuário cadastrado com este email." 
      } else if( errors.code === "auth/user-disabled"){
        message = "Este usuário foi desabilidado"
      } else if( errors.code === "auth/invalid-email"){
        message = "O formato de email digitado não é aceito pelo nosso sistema."
      }
      toast.error(message)
}

export default ErrorFirebase
