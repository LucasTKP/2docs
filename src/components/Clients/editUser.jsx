'use client'
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useContext, useEffect} from 'react'
import Modals from '../Modals'
import AppContext from '../AppContext';
import ErrorFirebase from '../ErrorFirebase';
import { auth, storage, db } from '../../../firebase'
import { ref,  uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import axios from 'axios';


function EditUser(props){
  const user = props.user
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const context = useContext(AppContext)
  const [dataUser, setDataUser] = useState({id:user.id, name: user.name, email:user.email, cnpj: user.cnpj, phone:user.phone, password:user.password, company:user.company, imageName: user.nameImage, urlImage: user.image})
  const [file, setFile] = useState({name: "padrao.png"})
  const [modal, setModal] = useState({message: "", type:"", size:""})
  const [fileDataURL, setFileDataURL] = useState(user.image);
  const [eye , setEye] = useState(false)
  const domain = new URL(window.location.href).origin

  async function UpdateDataUser(e) {
    e.preventDefault()
    context.setLoading(true)
    if(dataUser.email != user.email){
      const result = await axios.post(`${domain}/api/users/updateUser`, {userId: user.id, data:{email: dataUser.email}, uid: auth.currentUser.uid})
    }
    UpdatePhoto()
  }

  function UpdatePhoto(){
    if(fileDataURL != user.image){
      const referencesFile = Math.floor(Math.random() * 65536) + file.name;
      if(file.name != "padrao.png"){

        DeletePhoto()
        const storageRef = ref(storage, "images/" + referencesFile);
        uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(ref(storage, 'images/' + referencesFile))
          .then((url) => {
              UpdateBdUser({imageName: referencesFile, urlImage: url})
          })
          .catch((error) => {
            context.setLoading(false)
          }); 
        })
        .catch((error) => {
          context.setLoading(false)
          context.setModalGlobal(true)
          setModal({...modal, message: ErrorFirebase(error), type: "error", size:"little"})
      });
      } else {
        getDownloadURL(ref(storage, 'images/' + referencesFile))
        .then((url) => {
          UpdateBdUser({imageName: "padrao.png", urlImage: url})
        })
        .catch((error) => {
            // Handle any errors
        });
      }
    } else {
      UpdateBdUser({imageName: user.nameImage, urlImage: user.image})
    }
  }


  function DeletePhoto(){
    if(user.nameImage != "padrao.png"){
      const desertRef = ref(storage, 'images/' + user.nameImage);
      deleteObject(desertRef).then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  async function UpdateBdUser(data){
    await updateDoc(doc(db, 'users', user.id), {
      name: dataUser.name,
      email: dataUser.email,
      cnpj: dataUser.cnpj,
      password: dataUser.password,
      phone: dataUser.phone,
      company: dataUser.company,
      image: data.urlImage,
      nameImage: data.imageName,
      admin:false
    })
    window.location.reload();
  }
  
  const cnpjMask = (value) => {
  return value
    .replaceAll("-", "")
    .replaceAll("/", "")
    .replaceAll(".", "")
    .replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura os dois últimos 2 números, com um - antes dos dois números
  } 

  const phoneMask = (value) => {
  return value
    .replaceAll("(", "")
    .replaceAll("(", "")
    .replaceAll("-", "")
    .replaceAll("-", "")
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
    if(context.modalGlobal === false){
      setModal({message: "", type:"", size:""})
    }
  }, [context.modalGlobal]);

return (
      <>
      {context.editUserModal ? 
        <div className='w-[600px] max-sm:w-screen bg-[#DDDDDD] min-h-screen absolute pb-[100px] right-0 flex flex-col items-center max-sm:z-10'>
          <div className='bg-[#D2D2D2] flex justify-center items-center h-[142px] max-md:h-[127px] max-sm:h-[80px] border-b-[2px] border-terciary w-full '>
            <DoubleArrowRightIcon onClick={() => context.setEditUserModal(false)} className='text-black cursor-pointer h-[40px] w-[40px] max-sm:w-[35px]  max-sm:h-[35px] absolute left-[5px]'/>
            <p  className='font-poiretOne text-[40px] max-sm:text-[35px] flex'>Editar</p>
          </div>
          <form  onSubmit={UpdateDataUser} className='w-full px-[10%] flex flex-col gap-y-[20px] max-sm:gap-y-[5px] text-[20px] max-sm:text-[18px]'>

          <label className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] mt-[30px] max-sm:mt-[15px] relative'>
            <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
            <Image src={fileDataURL} width={180} height={180} alt="preview" className='w-full h-full rounded-full'/> 
          </label>

            <label  className='flex flex-col max-sm'>
              Nome
              <input type="text" value={dataUser.name} required  onChange={(Text) => setDataUser({...dataUser, name:Text.target.value})}  className='outline-none w-full p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o nome do cliente'/>
            </label>

            <label className='flex flex-col'>
              Email
              <input required  value={dataUser.email} onChange={(Text) => setDataUser({...dataUser, email:Text.target.value})} type="email"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o email'/>
            </label>
            <div className='flex max-sm:flex-col justify-between gap-[5px] '>
              <label className='flex flex-col'>
                CNPJ
                <input  required  value={cnpjMask(dataUser.cnpj)} onChange={(Text) => setDataUser({...dataUser, cnpj:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o cnpj'/>
              </label>

              <label className='flex flex-col'>
                Telefone
                <input required  value={phoneMask(dataUser.phone)} onChange={(Text) => setDataUser({...dataUser, phone:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite o telefone'/>
              </label>
            </div>

            <div className='flex max-sm:flex-col justify-between gap-[5px]'>
              <label className='flex flex-col '>
                Senha provisória
                {eye ?
                  <div className='border-2 border-black rounded-[8px] flex items-center'>
                    <input required type="text" value={dataUser.password} disabled={true} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
                    <EyeOpenIcon onClick={() => setEye(false)}  width={20} height={20} className="w-[40px] cursor-pointer" />
                  </div>

                : 
                  <div className='border-2 border-black rounded-[8px] flex items-center'>
                    <input required type="password" value={dataUser.password} disabled={true} className='outline-none w-full text-[18px] p-[5px] bg-transparent' placeholder='Senha provisória'/>
                    <EyeClosedIcon onClick={() => setEye(true)}  width={20} height={20} className="w-[40px] cursor-pointer" />
                  </div>
                }
              </label>

              <label className='flex flex-col'>
                Empresa
                <input required  value={dataUser.company} onChange={(Text) => setDataUser({...dataUser, company:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite a empresa'/>
              </label>
            </div>
            <button type="submit" className='hover:scale-105 text-[#fff] cursor-pointer text-[22px] flex justify-center items-center w-full max-sm:w-[80%] self-center h-[55px] max-sm:h-[50px] bg-gradient-to-r from-[#000] to-strong rounded-[8px] mt-[20px]'>
                Salvar
            </button>
          </form>
          <Modals message={modal.message} type={modal.type} size={modal.size}/>
        </div>
        : <></>
        }
      </>
  )
  }


export default EditUser;

