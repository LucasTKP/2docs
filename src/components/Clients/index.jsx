'use client'
import { MagnifyingGlassIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import iconNullClient from '../../../public/icons/nullClient.svg'
import React, {useState, useContext, useEffect} from 'react'
import Modals from '../Modals'
import AppContext from '../AppContext';
import ErrorFirebase from '../ErrorFirebase';
import { auth, storage, db } from '../../../firebase'
import { createUserWithEmailAndPassword} from "firebase/auth"
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, where, getDocs  } from "firebase/firestore";  
import { EyeClosedIcon, EyeOpenIcon, Pencil1Icon, FileTextIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import ArrowFilter from '../../../public/icons/arrowFilter.svg'


function ComponentClients(){
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const context = useContext(AppContext)
  const [windowSignUp, setWindowSignUp] = useState(false)
  const [dataUser, setDataUser] = useState({name: "", email:"", cnpj: "", phone:"", password:"", company:""})
  const [file, setFile] = useState({name: "padrao.png"})
  const [modal, setModal] = useState({message: "", type:"", size:""})
  const [fileDataURL, setFileDataURL] = useState(null);
  const [eye , setEye] = useState(false)
  const [users, setUsers] = useState([])
  const [table, setTable] = useState(false)
  const [filter, setFilter] = useState({name: false, date:false, status:false})
  // <--------------------------------- Create User --------------------------------->
  async function UploadPhoto() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ.";
    var passwordLength = 4;
    var code = "";
    var referencesFile = file.name
    for (var i = 0; i < passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      code += chars.substring(randomNumber, randomNumber + 1);
    }
    if(referencesFile != "padrao.png"){
      referencesFile = code + file.name
      const storageRef = ref(storage, "images/" + referencesFile);
      uploadBytes(storageRef, file)
      .then((snapshot) => {
        getDownloadURL(ref(storage, 'images/' + referencesFile))
        .then((url) => {
            SignUpDb(url)
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
          SignUpDb(url)
      })
      .catch((error) => {
          // Handle any errors
      });
    }
  }

  useEffect(() => {
    if(windowSignUp === true){
      var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ.";
      var passwordLength = 12;
      var password = "";
  
      for (var i = 0; i < passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
      }
      setDataUser({...dataUser, password:password})
    }
  },[windowSignUp])

  async function SignUpDb(urlImage){
    var name = (dataUser.name[0].toUpperCase() + dataUser.name.substring(1))
    var date = new Date() + ""
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        email: dataUser.email,
        cnpj: dataUser.cnpj,
        password: dataUser.password,
        phone: dataUser.phone,
        company: dataUser.company,
        image: urlImage,
        date: date,
        status: "Ativo",
        admin: false
      });
      GetUsers()
      context.setLoading(false)
      setFile({...file, name: "padrao.png"})
      setFileDataURL(false)
      setDataUser({...dataUser, name: "", email:"", cnpj: "", phone:"", company:""})
      context.setLoading(false)
      context.setModalGlobal(true)
      setWindowSignUp(false)
      setModal({...modal, message: "Usuário cadastrado com sucesso.", type: "sucess", size:"little"})
    } catch (e) {
      context.setLoading(false)
      context.setLoading(false)
      context.setModalGlobal(true)
      setModal({...modal, message: "Não foi possivel criar o usuário.", type: "error", size:"little"})
    }
  }

  function SignUp(e) {
    e.preventDefault()
    context.setLoading(true)
    context.setLoading(true)
    const email = dataUser.email
    const password = dataUser.password

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      UploadPhoto()
    })
    .catch((error) => {
        context.setLoading(false)
        context.setLoading(false)
        context.setModalGlobal(true)
        setModal({...modal, message: ErrorFirebase(error), type: "error", size:"little"})
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

  // <--------------------------------- GetUser --------------------------------->
  useEffect(() =>{
      context.setLoading(true)
      GetUsers()
  },[])

  async function GetUsers(){
    context.setLoading(true)
    const getUsers = []
    
      const querySnapshot = await getDocs(collection(db, "users"), where("admin", "!=", true));
      querySnapshot.forEach((doc) => {
        getUsers.push(doc.data())
      });
    setUsers(getUsers)
    if(getUsers[0]){
      setTable(true)
    }
    context.setLoading(false)
  }

  function filterName(){
    const filterName = []
    var namesUser = []
      for (var i = 0; i < users.length; i++) {
        namesUser.push({name:users[i].name, email: users[i].email})
      }
      if(filter.name){
       namesUser.sort((a, b) => {
        if (a.name > b.name)
          return -1
        if (a.name < b.name)
          return 1  
        return 0
       })
      } else {
        namesUser.sort((a, b) => {
          if (a.name < b.name)
            return -1
          if (a.name > b.name)
            return 1  
          return 0
         })
      }
      namesUser.forEach(elelement =>{
        for (var i = 0; i < users.length; i++) {
          if(elelement.name === users[i].name && elelement.email === users[i].email){
            filterName.push(users[i])
           }
        }
      })
   setUsers(filterName)
  }

  function filterStatus(){
    const filterStatus = []
    var namesStatus = []
    if(filter.status){
      namesStatus.push("Ativo")
      namesStatus.push("Inativo")

       namesStatus.sort((a, b) => {
        if (a > b)
          return -1
        if (a < b)
          return 1  
        return 0
       })
     
      namesStatus.forEach(elelement =>{
        for (var i = 0; i < users.length; i++) {
        if(elelement === users[i].status){
           filterStatus.push(users[i])
        }
       }
      })
    } else {
        namesStatus.push("Ativo")
        namesStatus.push("Inativo")
     namesStatus.forEach(elelement =>{
      for (var i = 0; i < users.length; i++) {
       if(elelement === users[i].status){
        filterStatus.push(users[i])
       }
     }
     })
    }
   setUsers(filterStatus)
  }

  function filterDate(){
    const usersDate = []
    var filterDate = []
    for (var i = 0; i < users.length; i++) {
      const date = new Date(users[i].date)
      usersDate.push({date: date})
     }

    if(filter.date){
      usersDate.sort(function(a,b) { 
        return b.date.getTime() - a.date.getTime() 
      });
    } else {
      usersDate.sort(function(a,b) { 
        return a.date.getTime() - b.date.getTime() 
      });
    }
    for (var i = 0; i < usersDate.length; i++) {
      const date = usersDate[i].date
      usersDate[i].date = date + ""
     }
  usersDate.forEach(elelement =>{
    for (var i = 0; i < users.length; i++) {
    if(elelement.date == users[i].date){
      filterDate.push(users[i])
    }
   }
  })
  setUsers(filterDate)
  }

  function formatDate(date){
    var month
    if (date.substr(4, 3) === "Jan") month = "Janeiro"
    else if (date.substr(4, 3) === "Feb") month = "Fevereiro"
    else if (date.substr(4, 3) === "Mar") month = "Março"
    else if (date.substr(4, 3) === "Apr") month = "Abril"
    else if (date.substr(4, 3) === "May") month = "Maio"
    else if (date.substr(4, 3) === "Jun") month = "Junho"
    else if (date.substr(4, 3) === "Jul") month = "Julho"
    else if (date.substr(4, 3) === "Aug") month = "Augusto"
    else if (date.substr(4, 3) === "Sep") month = "Setembro"
    else if (date.substr(4, 3) === "Oct") month = "Outubro"
    else if (date.substr(4, 3) === "Nov") month = "Novembro"
    else if (date.substr(4, 3) === "Dec") month = "Dezembro"
    return date.substr(8, 2) + " de " + month + " de " + date.substr(11, 4)
  }

return (
      <section className="bg-primary w-full h-screen  flex flex-col items-center text-black">
        <div className='w-[80%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p className=' font-poiretOne text-[40px]'>Clientes</p>
          <div className='max-h-[600px]  h-[80%] max-lg:h-[70%] w-full relative border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center'>
                <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{table ? users.length : "0"} <span className='text-secondary'>Clientes</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input required type="text" accept="image/*"  className='w-[300px] text-terciary max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>
              <div className='flex gap-[10px] max-sm:gap-[5px]'>
                <button className='bg-hilight border-[1px] border-terciary text-terciary p-[5px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-sm:text-[12px] max-lsm:text-[10px]'>Deletar</button>
                <button onClick={() => setWindowSignUp(true)} className='bg-black text-white p-[5px] rounded-[8px] text-[18px] max-md:text-[16px] max-sm:text-[12px] max-lsm:text-[10px]'>+ Cadastrar</button>
              </div>
            </div>
            {table ?
              <table className='w-full mt-[10px]'>
                <thead>
                  <tr className='bg-[#DDDDDD] border-b-[2px] border-t-[2px] border-terciary text-[20px]'>
                    <th className='py-[10px]'><input type="checkbox" className='w-[20px] h-[20px]'/></th>
                    
                    <th className='font-[400] text-left pl-[20px]'>
                      <button onClick={() => (setFilter({...filter, name:! filter.name, status: false, date:false}), filterName())} className='flex items-center cursor-pointer'>
                        <p>Nome</p> 
                        <Image alt="Imagem de uma flecha" className={`ml-[10px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400] text-left pl-[20px]'>Email</th>

                    <th className='font-[400]'>
                      <button onClick={() => (setFilter({...filter, date:! filter.date, status: false, name:false}) ,filterDate())} className='flex items-center cursor-pointer'>
                        <p>Data de cadastro</p>
                        <Image alt="Imagem de uma flecha" className={`ml-[10px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400]'>
                    <button onClick={() => (setFilter({...filter, status:! filter.status, nome: false, date:false}), filterStatus())}  className='flex items-center cursor-pointer'>
                        <p>Status</p>
                        <Image alt="Imagem de uma flecha" className={`ml-[10px] ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400]'>Ações</th>

                  </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                  <tr key={user.date} className='border-b-[1px] border-terciary text-[18px]'>
                    <th className='py-[10px]'><input type="checkbox" className='w-[20px] h-[20px]'/></th>
                    <th className='font-[400] flex ml-[20px] items-center'>
                    <Image src={user.image} width={40} height={40} alt="Imagem de perfil do usuario." className='rounded-full mr-[10px] max-w-[40px] max-h-[40px]'/>
                      <p>{user.name}</p>
                    </th>
                    <th className='font-[400] text-left pl-[20px]'>{user.email}</th>
                    <th className='font-[400]'>{formatDate(user.date)}</th>
                    <th className='font-[400] w-[100px]'>{user.status === "Ativo" ? 
                      <div className='bg-greenV/30 border-greenV text-greenV border-[1px] rounded-full'>
                        Ativo
                      </div>:
                      <div className='bg-red/30 border-red text-red border-[1px] rounded-full'>
                        Inativo  
                      </div>}
                    </th>
                    <th className='font-[400]  w-[90px] px-[5px]'>
                      <div className='flex justify-between'>
                        <div className='bg-terciary p-[4px] flex justify-center items-center rounded-[8px]'>
                          <Pencil1Icon width={25} height={25}/>
                        </div>
                        <div className='bg-[#bfcedb] p-[4px] flex justify-center items-center rounded-[8px]'>
                          <FileTextIcon width={25} height={25}/>
                        </div>
                      </div>
                    </th>
                  </tr>
                ))}
                </tbody>
              </table>

              : 
                <div className='w-full h-full flex justify-center items-center flex-col'>
                  <Image src={iconNullClient} width={80} height={80} onClick={() => setWindowSignUp(true)}  alt="Icone de sair" className='cursor-pointer w-[170px] h-[170px]'/>
                  <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> Cadastre seu primeiro cliente!</p>
                </div>
                }
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
            <div onClick={()=> (setFileDataURL(false), setFile({name:"padrao.png"}))} className='absolute right-[-10px] top-[5px] w-[30px] h-[4px] bg-strong rotate-45 after:w-[30px] after:h-[4px] after:bg-strong after:block after:rotate-90 '></div>
          </div>

          : 
            <label  className='cursor-pointer self-center w-[180px] h-[180px] max-sm:w-[120px] max-sm:h-[120px] bg-gradient-to-b from-[#D2D2D2] to-[#9E9E9E] rounded-full mt-[30px] max-sm:mt-[15px]'>
              <input  type="file" className='hidden' accept='.png, .jpg, .jpeg' onChange={changeHandler} />
            </label>
          }

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
                Senha
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
                <input required  value={dataUser.company} onChange={(Text) => setDataUser({...dataUser, company:Text.target.value})} type="text"   className='outline-none w-full text-[18px] p-[5px] bg-transparent border-2 border-black rounded-[8px]' placeholder='Digite a empresa'/>
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