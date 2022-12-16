'use client'
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import iconNullClient from '../../../public/icons/nullClient.svg'
import iconSearchUser from '../../../public/icons/searchUser.svg'
import React, {useState, useContext, useEffect} from 'react'
import AppContext from '../AppContext';
import {db, auth} from '../../../firebase'
import { collection, where, getDocs, doc, updateDoc, query } from "firebase/firestore";  
import { Pencil1Icon, FileTextIcon } from '@radix-ui/react-icons';
import ArrowFilter from '../../../public/icons/arrowFilter.svg'
import EditUser from './editUser'
import CreateUser from './createUser'
import DeletUser from './deletUser'
import Modals from '../Modals'
import axios from 'axios';
import ErrorFirebase from '../ErrorFirebase';


function ComponentClients(){
  const context = useContext(AppContext)
  const [users, setUsers] = useState([])
  const [usersFilter, setUsersFilter] = useState([])
  const [filter, setFilter] = useState({name: false, date:false, status:false})
  const [searchUser, setSearchUser] = useState("")
  const [userEdit, setUserEdit] = useState()
  const [selectUsers, setSelectUsers] = useState([])
  const [modal, setModal] = useState({status: false, message: "", subMessage1: "", subMessage2: "",  type:"", size:"", user:"" })
  const [showItens, setShowItens] = useState({min:-1, max:10})
  const [windowsAction, setWindowsAction] = useState({createUser: false, updateUser: false, deletUser: false})
  const [pages, setPages] = useState(0)
  const [menu, setMenu] = useState(true)
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augusto", "Setembro", "Outubro", "Novembro", "Dezembro"]

  // <--------------------------------- GetUser --------------------------------->
  useEffect(() =>{
      context.setLoading(true)
      GetUsers()
  },[])

  async function GetUsers(){
    const getUsers = []
      const q = query(collection(db, "users"), where("admin", "!=", true));
      const querySnapshot = await getDocs(q);
      const a = querySnapshot.forEach((doc) => {
        getUsers.push(doc.data())
      });
    for(var i = 0; i < getUsers.length; i++){
      getUsers[i].checked = false
    }
    setPages(Math.ceil(getUsers.length / 10))
    setUsers(getUsers)
    setUsersFilter(getUsers)
    context.setLoading(false)
  }

  // <--------------------------------- Filters Table --------------------------------->

  function filterName(){
    var usersHere = searchUser.length == 0 ? [...users ]: [...usersFilter]
    usersHere.sort(function (x, y){
      let a = x.name.toUpperCase()
      let b = y.name.toUpperCase()
      if(filter.name){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setUsersFilter(usersHere)
  }

  function filterStatus(){
    var usersHere = searchUser.length == 0 ? [...users ]: [...usersFilter]
    usersHere.sort(function (x, y){
      let a = x.status
      let b = y.status
      if(filter.status){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setUsersFilter(usersHere)
  }

  function filterDate(){
    const usersDate = searchUser.length == 0 ? [...users ]: [...usersFilter]
    usersDate.sort(function(a,b) { 
      a.date = new Date(a.date)
      b.date = new Date(b.date)
      if(filter.date){
       return (b.date.getTime() - a.date.getTime()) + ""
      } else {
       return (a.date.getTime() - b.date.getTime()) + ""
      }
    });
    for (var i = 0; i < usersDate.length; i++) {
      usersDate[i].date = usersDate[i].date + ""
    }
  setUsersFilter(usersDate)
  }

  function formatDate(date){
    var newDate = new Date(date)
    if(window.screen.width > 1250){
      var month = newDate.getMonth()
      return date.substr(8, 2) + " de " + months[month] + " de " + date.substr(11, 4)
    } else {
      return newDate.toLocaleDateString()
    }

  }

  useEffect(() => {
    if(searchUser != null){
      const searchUserFilter = []
      for (var i = 0; i < users.length; i++) {
        if(users[i].name.toLowerCase().includes(searchUser.toLowerCase().trim())){
          searchUserFilter.push(users[i])
        }
      }
      setUsersFilter(searchUserFilter)
    }
  },[searchUser])

   // <--------------------------------- Delete User --------------------------------->
   function ConfirmationDeleteUser(){
    context.setModalGlobal(true)
    if(selectUsers.length > 0){
      if(selectUsers.length === 1){
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir o usuário", subMessage1: "Será permanente.", subMessage2:"Os documentos serão apagados também.", type:"error", size:"big", user: selectUsers[0].name})
      } else {
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir estes usuários", subMessage1: "Será permanente.", subMessage2:"Os documentos serão apagados também.", type:"error", size:"big", user:null})
      }
    } else {
      context.setModalGlobal(true)
      setModal({...modal, message: "Selecione um usuário para deletar.", type: "error", size:"little"})
    }
  }

  const childModal = (childdata) => {
    if(childdata === "Delete"){
      context.setLoading(true)
      context.setActionCancel(false)
      DeletUser({childToParentDelet, selectUsers, usersFilter})
    }
  }

  const childToParentDelet = (childdata) => {
    if(childdata.data){
      context.setModalGlobal(true)
      setModal({...modal, message: ErrorFirebase(childdata.data), type: "error", size:"little"})
    } else {
      ResetConfig(childdata)
    }
  }
  // <--------------------------------- Disable User --------------------------------->

  async function DisableUser(){
    const users = [...usersFilter]
    const domain = new URL(window.location.href).origin
    if(selectUsers.length > 0){
      context.setLoading(true)
      const result = await axios.post(`${domain}/api/users/disableUser`, {users: selectUsers, uid: auth.currentUser.uid})
      if(result.data.type === 'success'){
        for (let i = 0; i < selectUsers.length; i++){
          await updateDoc(doc(db, 'users', selectUsers[i].id), {
            status: !selectUsers[i].status,
          })
          const index = users.findIndex( element => element.id === selectUsers[i].id)
          users[index].status = !users[index].status
          users[index].checked = false
        }
        ResetConfig(users)
      } else {
        context.setModalGlobal(true)
        context.setLoading(false)
        setModal({...modal, message: ErrorFirebase(result.data), type: "error", size:"little"})
      }
    } else {
      context.setModalGlobal(true)
      setModal({...modal, message: "Nenhum usuário foi selecionado", type: "error", size:"little"})
    }
  }

  // <--------------------------------- Select User --------------------------------->

  async function SelectUsers(index){
    const users = [...usersFilter]
    users[index].checked = !users[index].checked
    const userSelect = users.filter(user => user.checked === true);
    setSelectUsers(userSelect)
    setUsersFilter(users)
  }

  // <--------------------------------- Create User --------------------------------->
  const childToParentCreate = (childdata) => {
    const users = [...usersFilter]
    users.push(childdata)
    ResetConfig(users)
  }

  const closedWindow = () => {
    setWindowsAction({...windowsAction, createUser: false, updateUser: false})
  }

  // <--------------------------------- Edit User --------------------------------->

  const childToParentEdit = (childdata) => {
    const users = [...usersFilter]
    const index = users.findIndex(user => user.id == childdata.id)
    users.splice(index, 1)
    users.push(childdata)
    ResetConfig(users)
  }
  useEffect(() => {
    if(context.modalGlobal === false){
      setModal({...modal, message: "", type:"", size:""})
    }
  }, [context.modalGlobal]);
  
function ResetConfig(){
  setPages(Math.ceil(users.length / 10))
  setMenu(true)
  setUsersFilter(users)
  setSelectUsers([])
  setUsers(users)
  setWindowsAction({...windowsAction, createUser: false, updateUser: false, deletUser: false})
  context.setLoading(false)
}

return (
      <section className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p className=' font-poiretOne text-[40px]'>Clientes</p>
          <div className=' w-full relative border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center'>
                <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{usersFilter.length} <span className='text-secondary'>Clientes</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input type="text" value={searchUser} onChange={(Text) => setSearchUser(Text.target.value)}  className='w-[300px] text-terciary max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>
              <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-[#959595]"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 ease-in-out ${menu ? "" : "rotate-45"}`}/>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black my-[8px] max-lsm:my-[5px] ${menu ? "" : "hidden"}`}/>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                </button>
                <button onClick={() => DisableUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-terciary"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Trocar Status</button>
                <button onClick={() => ConfirmationDeleteUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight border-terciary text-terciary"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Deletar</button>
                <button onClick={() => setWindowsAction({...windowsAction, createUser:true})} className={`bg-black text-white p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>+ Cadastrar</button>
              </div>
            </div>
            {usersFilter.length > 0 ?
              <table className='w-full mt-[10px]'>

                {/* <--------------------------------- HeadTable ---------------------------------> */}
                <thead>
                  <tr className='bg-[#DDDDDD] border-b-[2px] border-t-[2px] border-terciary text-[20px] max-lg:text-[18px] max-md:text-[17px]'>
                    <th className='py-[10px]'><input type="checkbox" disabled={true} className='w-[20px] h-[20px]'/></th>
                    
                    <th className='font-[400] text-left pl-[20px] max-lg:pl-[10px]'>
                      <button onClick={() => (setFilter({...filter, name:! filter.name, status: false, date:false}), filterName())} className='flex items-center cursor-pointer'>
                        <p>Nome</p> 
                        <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400] text-left pl-[20px] max-md:hidden'>Email</th>

                    <th className='font-[400] max-lg:hidden'>
                      <button onClick={() => (setFilter({...filter, date:! filter.date, status: false, name:false}) ,filterDate())} className='flex items-center cursor-pointer'>
                        <p className='text-left'>Data de cadastro</p>
                        <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400]'>
                    <button onClick={() => (setFilter({...filter, status:! filter.status, name: false, date:false}), filterStatus())}  className='flex items-center cursor-pointer'>
                        <p>Status</p>
                        <Image alt="Imagem de uma flecha" className={`ml-[5px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
                      </button>
                    </th>

                    <th className='font-[400]'>Ações</th>

                  </tr>
                </thead>

                    {/* <--------------------------------- BodyTable ---------------------------------> */}
                <tbody>
                {usersFilter.map((user, index) =>{
                  var checked = user.checked

                  if( showItens.min < index && index < showItens.max){
                return(
                <tr key={user.id} className='border-b-[1px] border-terciary text-[18px] max-lg:text-[16px]' >
                    <th className='h-[50px] max-sm:h-[40px]'>
                      <input type="checkbox" checked={checked} onChange={(e) => checked = e.target.value}  onClick={() => SelectUsers(index)} className='w-[20px] h-[20px] ml-[5px]'/>
                    </th>

                    <th className='font-[400] flex ml-[20px] max-lg:ml-[10px] items-center h-[50px] max-sm:h-[40px]'>
                      <Image src={user.image} width={40} height={40} alt="Perfil"  className='text-[10px] mt-[3px] rounded-full mr-[10px] max-w-[40px] min-w-[40px] min-h-[40px] max-h-[40px]  max-md:min-w-[30px] max-md:max-w-[30px]  max-md:min-h-[30px] max-md:max-h-[30px]'/>
                      <p className='overflow-hidden whitespace-nowrap text-ellipsis  max-w-[180px] max-lg:max-w-[130px] max-lsm:max-w-[80px]'>{user.name}</p>
                    </th>

                    <th className='font-[400] text-left pl-[20px] max-md:hidden'>
                      <p className='overflow-hidden whitespace-nowrap text-ellipsis max-w-[250px]'>{user.email}</p>
                    </th>

                    <th className='font-[400] max-lg:hidden text-left'>{formatDate(user.date)}</th>

                    <th className='font-[400] w-[80px] max-lg:w-[70px]'>
                      {user.status  ? 
                        <div className='bg-red/30 border-red text-red border-[1px] rounded-full'>
                          Inativo
                        </div>
                        :
                        <div className='bg-greenV/30 border-greenV text-greenV border-[1px] rounded-full'>
                          Ativo 
                        </div>
                      }
                    </th>

                    <th className='font-[400]  w-[90px] max-lg:w-[80px] px-[5px]'>
                      <div className='flex justify-between'>
                        <button onClick={() => (setUserEdit(user), setWindowsAction({...windowsAction, updateUser:true}))} className='cursor-pointer bg-terciary p-[4px] flex justify-center items-center rounded-[8px]'>
                          <Pencil1Icon width={25} height={25}/>
                        </button>
                        <div className='bg-[#bfcedb] p-[4px] flex justify-center items-center rounded-[8px]'>
                          <FileTextIcon width={25} height={25}/>
                        </div>
                      </div>
                    </th>
                  </tr>)}     
                })}
                </tbody>
              </table>
            : 
                <div className='w-full h-full flex justify-center items-center flex-col'>
                  <Image src={users.length <= 0 ? iconNullClient : iconSearchUser} width={80} height={80} onClick={() => setWindowsAction({...windowsAction, createUser: true})}  alt="Foto de uma mulher, clique para cadastrar um cliente" className='cursor-pointer w-[170px] h-[170px]'/>
                  <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> {users.length <= 0 ? "Cadastre seu primeiro cliente!" : "Nenhum resultado foi encontrado."}</p>
                </div>
            }

            {/* <--------------------------------- NavBar table ---------------------------------> */}
            {usersFilter.length > 0 ?
            <div className='w-full px-[10px] flex justify-between h-[50px] mt-[10px]'>
              <div className='flex justify-between w-full h-[40px] max-sm:h-[30px]'>
                <button onClick={() => {showItens.max / 10 != 1 ? setShowItens({...showItens, min: showItens.min - 10, max: showItens.max - 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == 1 ? "bg-hilight border-terciary text-terciary" : "bg-black border-black text-white"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Anterior</button>
                <p>{`Página ${showItens.max / 10} de ${pages}`}</p>
                <button onClick={() => {showItens.max / 10 != pages ? setShowItens({...showItens, min: showItens.min + 10, max: showItens.max + 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == pages ? "bg-hilight border-terciary text-terciary" : "bg-black border-black text-white"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Proximo</button>
              </div>
            </div>
            :<></>}
          </div>
        </div>
        {windowsAction.createUser ? <CreateUser childToParentCreate={childToParentCreate} closedWindow={closedWindow} /> : <></>}
        {windowsAction.updateUser ? <EditUser user={userEdit} childToParentEdit={childToParentEdit} closedWindow={closedWindow}/> : <></>}
        <Modals message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} type={modal.type} size={modal.size} user={modal.user} to={"Delete"} childModal={childModal}/>
      </section>
  )
  }
export default ComponentClients;
