import {EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState } from 'react';


export function AlterPassword(){
  const [dataUser, setDataUser] = useState({password:"", confirmationPassword:""})
  const [eye, setEye] = useState(false)
  const [secondEye, setSecontEye] = useState(false)
  function TradePassword(e: { preventDefault: () => void; }){
    e.preventDefault()
  }
return (
        <section className="bg-primary w-screen h-screen flex flex-col justify-center items-center">
          <div className="w-[400px] max-lsm:w-[330px]">
            <p className="text-black text-[40px] font-poiretOne">Recuperar Senha.</p>
            <p className="text-white text-[25px]  font-poiretOne">Altere sua senha e faça login novamente.</p>
           <form onSubmit={TradePassword} className="">
                <fieldset className="flex flex-col mt-[10px]">
                  <label className="text-[18px]" htmlFor="Email">
                    Senha
                  </label>
                  <div className='flex pl-[5px] border-[1px] rounded-[8px] items-center'>
                    <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                    {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                    <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col mt-[20px]">
                  <label className="text-[18px]" htmlFor="username">
                    Confirmar Senha
                  </label>
                  <div className='flex pl-[5px] border-[1px] rounded-[8px] items-center'>
                    <input required minLength={8} type={secondEye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, confirmationPassword:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Confirme sua senha' />
                    {secondEye ? <EyeOpenIcon onClick={() => setSecontEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                    <EyeClosedIcon onClick={() => setSecontEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                  </div>
                </fieldset>
                <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                  Alterar
                </button>
            </form>
          </div>
        </section>
    )
}
