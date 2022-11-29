/* eslint-disable react/jsx-no-comment-textnodes */
import * as Tabs from '@radix-ui/react-tabs';
import styles from "./signIn.module.css"
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useState, useContext} from 'react';
import InputMask from "react-input-mask";
import Link from 'next/link'
import { Auth, Cache} from 'aws-amplify';
import Modals from '../Modals'
import AppContext from '../AppContext';
import { useRouter } from 'next/dist/client/router'
import ErrorCognito from '../ErrorCognito';




function Signin(){
  const context = useContext(AppContext)
  const [dataUser, setDataUser] = useState({email: "", password: "", checked: false})
  const [eye, setEye] = useState(false)
  const [modal, setModal] = useState({message: "", type: "error"})
  const router = useRouter()

function selectStoreCache(){
  localStorage.setItem("sessionStorage", false)
  if (dataUser.checked) {
    const localStorageCache = Cache.createInstance({
        keyPrefix: "auth",
        storage: window.localStorage
    });

    Auth.configure({
        storage: localStorageCache
    });
} else {
    localStorage.setItem("sessionStorage", true)
    const sessionStorageCache = Cache.createInstance({
        keyPrefix: "auth",
        storage: window.sessionStorage
    });

    Auth.configure({
        storage: sessionStorageCache
    });
}
}
  
  function handleSubmit(e) {
    e.preventDefault();
    selectStoreCache()
    const username = dataUser.email
    const password = dataUser.password

    Auth.signIn({username, password})
    .then((cognitoUser) => {
        Auth.currentSession()
        .then((userSession) => window.location.href = "/home")
        .catch((err) =>{
          context.setModalGlobal(true)
          setModal({...modal, message:ErrorCognito(err), type: 'error'});
        });
    }).catch((err) => {
      context.setModalGlobal(true)
      setModal({...modal, message:ErrorCognito(err), type: 'error'});
    });
  }

  function resetPassword() {
    var result = '';
    for (var i = 80; i > 0; --i) result += (Math.floor(Math.random()*256)).toString(16);     
    Auth.forgotPassword(dataUser.email)
    .then(data =>   {
      router.push({
        pathname: "/recoveryPassword",
        query: { token: result, email: dataUser.email },
      }); 
      localStorage.setItem("token", result)
    })
    .catch(err => {
      context.setModalGlobal(true)
      setModal({...modal, message:ErrorCognito(err), type: 'error'});
    });
  }
    return (
      <section className="bg-primary w-screen h-screen flex flex-col justify-center items-center text-black">
        <Tabs.Root  className="w-[400px] max-lsm:w-[320px]" defaultValue="tab1">
          <p className="text-[40px] font-poiretOne">Login</p>
          <p className="text-[25px]  font-poiretOne">Entre com os dados enviados</p>
          <Tabs.List className="w-full mt-[20px] border-b-2 border-black flex justify-between" aria-label="Manage your account">
            <Tabs.Trigger id={styles.tabsTrigger1} className={`text-[22px] w-[50%] rounded-tl-[8px] py-[5px]}`}value="tab1">
              Email
            </Tabs.Trigger>
            <Tabs.Trigger id={styles.tabsTrigger2} className={`text-[22px] w-[50%] rounded-tr-[8px] py-[5px]`}value="tab2">
              CNPJ
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="mt-[20px]" value="tab1">
            <form onSubmit={handleSubmit} className="outline-none">
              <fieldset className="flex flex-col">
                <label className="text-[18px]" htmlFor="Email">
                  Email
                </label>
                <input required type="email" value={dataUser.email} name="Email" onChange={(Text) => setDataUser({...dataUser, email: Text.target.value})} className="pl-[5px] text-[18px] bg-[#0000] border-[1px] border-black rounded-[8px] outline-none py-[10px]" placeholder='Digite seu email' />
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px]" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                  <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                </div>
              </fieldset>

              <div className='flex items-center mt-[10px] justify-between'>
                <div>
                  <Checkbox.Root  onClick={() => setDataUser({...dataUser, checked:!dataUser.checked})} className="w-[20px] h-[20px] bg-[#fff] border-2 border-[#666666] rounded-[4px]" defaultChecked={false} id="c1">
                    <Checkbox.Indicator id={styles.checkbox} className="bg-[#000]">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className="ml-[5px] text-[18px] max-lsm:text-[16px]"  htmlFor="c1">
                    Lembrar de mim
                  </label>
                </div>
                <button type="button" onClick={resetPassword} className='underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</button>
              </div>
              <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Entrar
              </button>
            </form>
          </Tabs.Content>
          <Tabs.Content className="mt-[20px] TabsContent" value="tab2">
          <form onSubmit={"teste"} className="">
              <fieldset className="flex flex-col">
                <label className="text-[18px]" htmlFor="Email">
                  CNPJ
                </label>
                <InputMask mask="99.999.999/9999-99" required type="text" onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} className="pl-[5px] text-[18px] bg-[#0000] border-[1px] border-black rounded-[8px] outline-none py-[10px]" placeholder='Digite seu CNPJ' />
              </fieldset>
              <fieldset className="flex flex-col mt-[20px]">
                <label className="text-[18px]" htmlFor="username">
                  Senha
                </label>
                <div className='flex pl-[5px] border-[1px] border-black rounded-[8px] items-center'>
                  <input required minLength={8} type={eye ? "text" : "password"} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className="w-full text-[18px] bg-[#0000] outline-none py-[10px]" placeholder='Digite sua senha' />
                  {eye ? <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer"/> :
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer"/>}
                </div>
              </fieldset>

              <div className='flex items-center mt-[10px] justify-between'>
                <div>
                  <Checkbox.Root className="w-[20px] h-[20px] bg-[#fff] border-2 border-[#666666] rounded-[4px]" defaultChecked={false} id="c1">
                    <Checkbox.Indicator id={styles.checkbox} className="bg-[#000]">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className="ml-[5px] text-[18px] max-lsm:text-[16px]" htmlFor="c1">
                    Lembrar de mim
                  </label>
                </div>
                  <Link href="/recoveryPassword" className='underline text-[18px] max-lsm:text-[14px]  text-[#005694] cursor-pointer'>Esqueci a senha</Link>
              </div>
              <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full h-[55px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Entrar
              </button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
        <Modals message={modal.message} type={modal.type}/>
      </section>
  )
  }

export default Signin;
