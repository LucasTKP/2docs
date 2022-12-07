'use client'
import NavBar from '../NavBar'
import { MagnifyingGlassIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import iconNullClient from '../../../public/icons/nullClient.svg'
import {useState, useContext} from 'react'
import Modals from '../Modals'
import AppContext from '../AppContext';
import ErrorFirebase from '../ErrorFirebase';
import { useEffect } from 'react';
import { auth, storage, db } from '../../../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { ref,  uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";  



function ComponentClients(){
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const context = useContext(AppContext)
  const [windowSignUp, setWindowSignUp] = useState(false)
  const [dataUser, setDataUser] = useState({name: "", email:"", cnpj: "", phone:"", password:"", company:""})
  const [file, setFile] = useState({name:"WhatsApp Image 2022-11-24 at 12.14.51.jpeg"})
  const [modal, setModal] = useState({message: "", type:"", size:""})
  const [fileDataURL, setFileDataURL] = useState(null);

  async function UploadPhoto() {
    const storageRef = ref(storage, "images/" + file);
    uploadBytes(storageRef, file)
    .then((snapshot) => {
      SignUpDb()
    })
    .catch((error) => {
      context.setModalGlobal(true)
      setModal({...modal, message: ErrorFirebase(error), type: "error", size:"little"})
  });
  }

  async function SignUpDb(){
    console.log(file.name)
    try {
      const docRef = await addDoc(collection(db, "users"), {
        nome: dataUser.name,
        email: dataUser.email,
        cnpj: dataUser.cnpj,
        phone: dataUser.phone,
        company: dataUser.company,
        file: file.name
      });
      context.setModalGlobal(true)
      setModal({...modal, message: "Usúario cadastrado com sucesso.", type: "sucess", size:"little"})
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  function SignUp(e) {
    e.preventDefault()
    const email = dataUser.email
    const password = dataUser.password

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      UploadPhoto()
    })
    .catch((error) => {
        context.setModalGlobal(true)
        setModal({...modal, message: ErrorFirebase(error), type: "error", size:"little"})
      // ..
    });
  }
  
  const cnpjMask = (value) => {
  return value
    .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
  } 

  const phoneMask = (value) => {
  return value
    .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
    .replace(/^(\d{2})(\d)/g,"($1) $2")
    .replace(/(\d)(\d{4})$/,"$1-$2")// captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
  }

  const changeHandler = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      context.setModalGlobal(true)
      setModal({...modal, message:"Não é permitido armazenar este tipo de arquivo, escolha uma imagem.", type:"error", size:"little"});
      return;
    }
    setFile(file);
  }
  useEffect(() => {
    if (file.name != "WhatsApp Image 2022-11-24 at 12.14.51.jpeg"){
      let fileReader, isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setFileDataURL(result)
          }
        }
        fileReader.readAsDataURL(file);
      }
      return () => {
        isCancel = true;
        if (fileReader && fileReader.readyState === 1) {
          fileReader.abort();
        }
      }
    }
  }, [file]);
  
  useEffect(() => {
    if(context.modalGlobal){
      setModal({message: "", type:"", size:""})
    }
  }, [context.modalGlobal]);

return (
      <section className="bg-primary w-full h-screen  flex flex-col items-center text-black">
        <NavBar />
        <div className='w-[80%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p className=' font-poiretOne text-[40px]'>Clientes</p>
          <div className='max-h-[600px]  h-[80%] max-lg:h-[70%] w-full border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center'>
                <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>0 <span className='text-secondary'>Clientes</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input required type="text" accept="image/*"  className='w-[300px] text-terciary max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>

              <div className='flex gap-[10px] max-sm:gap-[5px]'>
                <button className='bg-hilight border-[1px] border-terciary text-terciary p-[5px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-sm:text-[12px] max-lsm:text-[10px]'>Deletar</button>
                <button onClick={() => setWindowSignUp(true)} className='bg-black text-white p-[5px] rounded-[8px] text-[18px] max-md:text-[16px] max-sm:text-[12px] max-lsm:text-[10px]'>+ Cadastrar</button>
              </div>
            </div>

            <div className='w-full h-full flex justify-center items-center flex-col'>
              <Image src={iconNullClient} width={80} height={80} onClick={() => setWindowSignUp(true)}  alt="Icone de sair" className='cursor-pointer w-[170px] h-[170px]'/>
              <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> Cadastre seu primeiro cliente!</p>
            </div>
          </div>
        </div>

        {windowSignUp ? 
        <div className='w-[600px] max-sm:w-screen bg-[#DDDDDD] min-h-screen absolute max-sm:pb-[10px] right-0 flex flex-col items-center '>
          <div className='bg-[#D2D2D2] flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary w-full '>
            <DoubleArrowRightIcon onClick={() => setWindowSignUp(false)} className='text-black cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
            <p onClick={() => (context.setModalGlobal(true), setModal({...modal, message: "Usúario cadastrado com sucesso.", type: "sucess", size:"little"}))} className='font-poiretOne text-[40px] max-sm:text-[35px] flex'>Cadastrar</p>
          </div>
          <form  onSubmit={SignUp} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
          {fileDataURL ? 
          <div className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
            <Image src={fileDataURL} width={180} height={180} alt="preview" className='w-full h-full rounded-full'/> 
            <div onClick={()=> (setFileDataURL(false), setFile({name:"WhatsApp Image 2022-11-24 at 12.14.51.jpeg"}))} className='absolute right-[-10px] top-[5px] w-[30px] h-[4px] bg-strong rotate-45 after:w-[30px] after:h-[4px] after:bg-strong after:block after:rotate-90 '></div>
          </div>
          : 
            <label  className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] bg-gradient-to-b from-[#D2D2D2] to-[#9E9E9E] rounded-full mt-[30px] max-sm:mt-[15px]'>
              <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
            </label>
          }

            <label  className='flex flex-col max-sm'>
              Nome
              <input type="text" required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o nome do cliente'/>
            </label>

            <label className='flex flex-col'>
              Email
              <input required  onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o email'/>
            </label>
            <div className='flex max-sm:flex-col justify-between gap-[5px] '>
              <label className='flex flex-col'>
                CNPJ
                <input  required  value={cnpjMask(dataUser.cnpj)} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o cnpj'/>
              </label>

              <label className='flex flex-col'>
                Telefone
                <input required  value={phoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} mask="+99(99)99999-9999" type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o telefone'/>
              </label>
            </div>

            <div className='flex max-sm:flex-col justify-between gap-[5px]'>
              <label className='flex flex-col'>
                Senha
                <input required  minLength={8} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Senha provisória'/>
              </label>

              <label className='flex flex-col'>
                Empresa
                <input required  onChange={(Text) => setDataUser({...dataUser, company:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite a empresa'/>
              </label>
            </div>

            <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Salvar
            </button>

          </form>

        </div>
        : <></> }
        <Modals message={modal.message} type={modal.type} size={modal.size}/>
      </section>
  )
  }

export default ComponentClients;