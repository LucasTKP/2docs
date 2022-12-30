'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useEffect} from 'react'
import ErrorFirebase from '../../ErrorFirebase';
import { auth, storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { collection, where, getDocs, query } from "firebase/firestore";
import axios from 'axios';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';


function CreateUser({childToParentCreate, closedWindow}){
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [dataUser, setDataUser] = useState({id:"", name: "", email:"", cnpj: "", phone:"", password:"", company:""})
  const [file, setFile] = useState({name: "padrao.png"})
  const [fileDataURL, setFileDataURL] = useState(null);
  const [eye , setEye] = useState(true)
  const domain = new URL(window.location.href).origin

  async function VerifyCnpj(e){
    e.preventDefault()
    var user = undefined
    const q = query(collection(db, "users"), where("cnpj", "==", dataUser.cnpj));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {user = doc.data() });
    if(user != undefined){
      toast.error("Este CNPJ já está cadastrado.")
    } else {
      toast.promise(SignUp(),{pending:"Criando usuário..."})
    }
  }

  async function UploadPhoto(id) {
    const referencesFile = Math.floor(Math.random() * 65536) + file.name;
    if(file.name != "padrao.png"){
      const storageRef = ref(storage, "images/" + referencesFile);
      uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(ref(storage, 'images/' + referencesFile))
        .then((url) => { SignUpDb({url: url, referencesFile: referencesFile, id: id}) })
        .catch((error) => {
          console.log(error)
        }); 
      })
      .catch((error) => {
        ErrorFirebase(error)
      });
    } else {
      getDownloadURL(ref(storage, 'images/padrao.png'))
      .then((url) => {
        SignUpDb({url: url, referencesFile: "padrao.png", id: id})
      })
      .catch((error) => {
        console.log(error)
      });
    }
  }
  
  async function SignUpDb(image){
    var name = (dataUser.name[0].toUpperCase() + dataUser.name.substring(1))
    var date = new Date() + ""
    const data = {
      id: image.id,
      name: name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      company: dataUser.company,
      image: image.url,
      nameImage: image.referencesFile,
      date: date,
      status: false,
      admin: false,
      folders: []
    }
    childToParentCreate(data)

    try {
      const docRef = await setDoc(doc(db, "users", image.id), {
        id: image.id,
        name: name,
        email: dataUser.email,
        cnpj: dataUser.cnpj,
        password: dataUser.password,
        phone: dataUser.phone,
        company: dataUser.company,
        image: image.url,
        nameImage: image.referencesFile,
        date: date,
        status: false,
        admin: false,
        folders: []
      });
    } catch (e) {
      console.log(e)
      toast.error("Não foi possivel criar o usuário.")
    }
  }

  async function SignUp() {
    const data ={
      email: dataUser.email,
      password: dataUser.password
    }
    try{
      const result = await axios.post(`${domain}/api/users/createUser`, {data: data, uid: auth.currentUser.uid})
      if(result.data.uid){
        const id = result.data.uid
        UploadPhoto(id)
      } else {
        ErrorFirebase(result.data)
        throw "error"
      }
    } catch (e){
      console.log(e)
    }

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
      return toast.error("Não é permitido armazenar este tipo de arquivo, escolha uma imagem.")
    }
    setFile(file);
  }

  useEffect(() => {
    if(file.name != "padrao.png"){
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
    const password = dataUser.name.substr(0, 5).replace(/\s+/g, '') + Math.floor(Math.random() * 100000)
    
    setDataUser({...dataUser, password: password})
  },[dataUser.name])


return (
    <>
      <div className='w-[600px] max-sm:w-screen bg-[#DDDDDD] min-h-screen pb-[100px] absolute right-0 flex flex-col items-center max-sm:z-10'>
        <div className='bg-[#D2D2D2] flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary w-full '>
          <DoubleArrowRightIcon onClick={() => closedWindow()} className='text-black cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
          <p className='font-poiretOne text-[40px] max-sm:text-[35px] flex'>Cadastrar</p>
        </div>
        <form  onSubmit={VerifyCnpj} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>
        {fileDataURL ? 
        <div className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
          <Image src={fileDataURL} width={180} height={180} alt="preview" className='w-full h-full rounded-full'/> 
          <div onClick={()=> (setFileDataURL(false), setFile({name:"padrao.png"}))} className='absolute right-[-10px] top-[5px] w-[30px] h-[4px] bg-strong rotate-45 after:w-[30px] after:h-[4px] after:bg-strong after:block after:rotate-90 '></div>
        </div>

        : 
          <label  className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] bg-gradient-to-b from-[#D2D2D2] to-[#9E9E9E] rounded-full mt-[30px] max-sm:mt-[15px]'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
          </label>
        }

          <label  className='flex flex-col max-sm'>
            Nome
            <input type="text" maxLength={30} value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o nome do cliente'/>
          </label>

          <label className='flex flex-col'>
            Email
            <input required  maxLength={40} value={dataUser.email} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o email'/>
          </label>
          <div className='flex max-sm:flex-col justify-between gap-[5px] '>
            <label className='flex flex-col'>
              CNPJ
              <InputMask  required  mask="99.999.999/9999-99" value={dataUser.cnpj} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o cnpj'/>
            </label>

            <label className='flex flex-col'>
              Telefone
              <input maxLength={15} required  value={phoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o telefone'/>
            </label>
          </div>

          <div className='flex max-sm:flex-col justify-between gap-[5px]'>
            <label className='flex flex-col '>
              Senha Provisória
              {eye ?
                <div className='border-2 border-black rounded-[8px] flex items-center'>
                  <input required type="text" value={dataUser.password} minLength={8} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
                  <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer" />
                </div>

              : 
                <div className='border-2 border-black rounded-[8px] flex items-center'>
                  <input required type="password" value={dataUser.password} minLength={8} onChange={(Text) => setDataUser({...dataUser, password:Text.target.value})} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
                  <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer" />
                </div>
              }
            </label>

            <label className='flex flex-col'>
              Empresa
              <input required maxLength={25} value={dataUser.company} onChange={(Text) => setDataUser({...dataUser, company:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite a empresa'/>
            </label>
          </div>

          <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
              Salvar
          </button>
        </form>
      </div>
    </>
  )
  }

export default CreateUser;