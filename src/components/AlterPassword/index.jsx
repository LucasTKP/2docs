import {EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState, useContext, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Auth} from 'aws-amplify';
import Modals from '../Modals'
import AppContext from '../AppContext';
import ErrorCognito from '../ErrorCognito';



export function AlterPassword(){
  const params = useSearchParams()
  const email = params.get('email')
  const context = useContext(AppContext)
  const router = useRouter()
  const [modal, setModal] = useState({message: "", type:""})
  const [dataUser, setDataUser] = useState({code:"000000", password:""})
  const [eye, setEye] = useState(false)

  function TradePassword(e){
    e.preventDefault()
      Auth.forgotPasswordSubmit(email, dataUser.code, dataUser.password)
      .then(data => {
        context.setModalGlobal(true)
        setModal({message: "Senha alterada com sucesso!", type: "sucess"})
        setTimeout(() => {router.push("/");}, 1000)
      })
      .catch(err => {
        context.setModalGlobal(true)
        setModal({...modal, message:ErrorCognito(err), type: 'error'});
      });
  }

  useEffect(() => {
    if(email === null){
      router.push("/")
    }
  },[email, router])

return (
        <section className="bg-primary text-black w-screen h-screen flex flex-col justify-center items-center">
          <div className="w-[400px] max-lsm:w-[320px]">
            <p className="text-[40px] font-poiretOne">Recuperar Senha.</p>
            <p className="text-[25px]  font-poiretOne">Altere sua senha e faça login novamente.</p>
            <p className="text-[16px] mt-[20px]">Enviamos um codigo para o seu email, anote ele para trocar a senha</p>

           <form onSubmit={TradePassword} className="">
                <fieldset className="flex flex-col mt-[10px]">
                  <label className="text-[18px]" htmlFor="Email">
                    Codigo
                  </label>
                  <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                    <input required minLength={6} maxLength={6} type="text" onChange={(Text) => setDataUser({...dataUser, code:Text.target.value})} className="w-full text-[18px] bg-transparent  outline-none py-[10px]" placeholder='Digite o codigo:' />
                  </div>
                </fieldset>
                <fieldset className="flex flex-col mt-[20px]">
                  <label className="text-[18px]" htmlFor="username">
                    Senha
                  </label>
                  <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                    <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-transparent  outline-none py-[10px]" placeholder='Digite sua nova senha:' />
                    {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                    <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                  </div>
                </fieldset>
                <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                  Alterar
                </button>
            </form>
          </div>
          <Modals  message={modal.message} type={modal.type} size="little"/>
        </section>
    )
}
