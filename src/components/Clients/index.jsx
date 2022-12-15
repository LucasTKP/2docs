'use client'
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import iconNullClient from '../../../public/icons/nullClient.svg'
import iconSearchUser from '../../../public/icons/searchUser.svg'
import React, {useState, useContext, useEffect} from 'react'
import AppContext from '../AppContext';
import {db, auth, storage } from '../../../firebase'
import { collection, where, getDocs, doc, deleteDoc, updateDoc, query } from "firebase/firestore";  
import { Pencil1Icon, FileTextIcon } from '@radix-ui/react-icons';
import { ref, deleteObject } from "firebase/storage";
import ArrowFilter from '../../../public/icons/arrowFilter.svg'
import EditUser from './editUser'
import CreateUser from './createUser'
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
  const [delet, setDelet] = useState(false)
  const [modal, setModal] = useState({status: false, message: "", subMessage1: "", subMessage2: "",  type:"", size:"", user:"" })
  const [showItens, setShowItens] = useState({min:-1, max:10})
  const [pages, setPages] = useState(0)
  const [menu, setMenu] = useState(true)
  // <--------------------------------- GetUser --------------------------------->
  useEffect(() =>{
      context.setLoading(true)
      GetUsers()
  },[])

  async function GetUsers(){
    context.setLoading(true)
    const getUsers = []
         const q = query(collection(db, "users"), where("admin", "!=", true));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
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

  function filterName(){
    const filterName = []
    var namesUser = []
    var usersHere
    if (searchUser.length == 0){
      usersHere = users
    } else {
      usersHere = usersFilter
    }
      for (var i = 0; i < usersHere.length; i++) {
        namesUser.push({name:usersHere[i].name, email: usersHere[i].email})
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
        for (var i = 0; i < usersHere.length; i++) {
          if(elelement.name === usersHere[i].name && elelement.email === usersHere[i].email){
            filterName.push(usersHere[i])
           }
        }
      })
      setUsersFilter(filterName)
  }

  function filterStatus(){
    const filterStatus = []
    var namesStatus = []
    var usersHere
    if (searchUser.length == 0){
      usersHere = users
    } else {
      usersHere = usersFilter
    }

    if(filter.status){
      namesStatus.push(false)
      namesStatus.push(true)
  
      namesStatus.forEach(elelement =>{
        for (var i = 0; i < usersHere.length; i++) {
        if(elelement === usersHere[i].status){
           filterStatus.push(usersHere[i])
        }
       }
      })
    } else {
        namesStatus.push(true)
        namesStatus.push(false)
       namesStatus.forEach(elelement =>{
          for (var i = 0; i < usersHere.length; i++) {
            if(elelement === usersHere[i].status){
              filterStatus.push(usersHere[i])
            }
          }
      })
    }
    setUsersFilter(filterStatus)
  }

  function filterDate(){
    const usersDate = []
    var filterDate = []
    var usersHere
    if (searchUser.length == 0){
      usersHere = users
    } else {
      usersHere = usersFilter
    }

    for (var i = 0; i < usersHere.length; i++) {
      const date = new Date(usersHere[i].date)
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
    for (var i = 0; i < usersHere.length; i++) {
    if(elelement.date == usersHere[i].date){
      filterDate.push(usersHere[i])
    }
   }
  })
  setUsersFilter(filterDate)
  }

  function formatDate(date){
    if(window.screen.width > 1250){
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
    } else {
      var newDate = new Date(date)
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

  useEffect(() => {
    if(context.actionCancel === true && modal.status === true){
      DeleteAuth()
      context.setActionCancel(false)
    }
},[context.actionCancel])

  async function DeleteAuth(){
    const domain = new URL(window.location.href).origin
      context.setLoading(true)
      const result = await axios.post(`${domain}/api/users/deleteUser`, {users: selectUsers, uid: auth.currentUser.uid})
      if(result.data.type === 'success'){
        DeletePhoto()
      } else {
        context.setModalGlobal(true)
        setModal({...modal, message: ErrorFirebase(result.data), type: "error", size:"little"})
      }
  }

  async function DeletePhoto(){
      try{
        for(let i = 0; i < selectUsers.length; i++){
          if(selectUsers[i].nameImage != "padrao.png"){
            const desertRef = ref(storage, 'images/' + selectUsers[i].nameImage);
            const result = await deleteObject(desertRef )
          }
        }
        DeleteFile()
      } catch(e){
        console.log(e)
      }
  }

  async function DeleteFile(){
    const users = usersFilter
    for(let i = 0; i < selectUsers.length; i++){
      const result = await deleteDoc(doc(db, "users", selectUsers[i].id));
    }

    for(let i = 0; i < selectUsers.length; i++){
      const index = users.findIndex(user => user.id === selectUsers[i].id)
      users.splice(index, 1);
    } 
    setSelectUsers([])
    setMenu(!menu)
    setUsersFilter(users);
    context.setLoading(false)
  }

  useEffect(() => {
    if(context.modalGlobal === false){
      setModal({...modal, message: "", type:"", size:""})
    }
  }, [context.modalGlobal]);
  // <--------------------------------- Disable User --------------------------------->

  async function DisableUser(){
    const users = []
    const domain = new URL(window.location.href).origin

    for(let i = 0; i < usersFilter.length; i++){
      users.push(usersFilter[i])
    }
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
        context.setLoading(false)
        setSelectUsers([])
        setMenu(true)
        setUsersFilter(users)
      } else {
        context.setModalGlobal(true)
        setModal({...modal, message: ErrorFirebase(result.data), type: "error", size:"little"})
      }

    } else {
      context.setModalGlobal(true)
      setModal({...modal, message: "Nenhum usuário foi selecionado", type: "error", size:"little"})
    }
  }

  // <--------------------------------- Select User --------------------------------->

  async function SelectUsers(index){
    const users = []
    const select = []
    for (var i = 0; i < usersFilter.length; i++) {
      users.push(usersFilter[i])
    }
    users[index].checked = !users[index].checked
    for(let i = 0; i < users.length; i++){
      if(users[i].checked === true){
        select.push(users[i])
      }
    }
    setSelectUsers(select)
    setUsersFilter(users)
  }


return (
      <section className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p className=' font-poiretOne text-[40px]'>Clientes</p>
          <div className=' w-full relative border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center'>
                <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{users.length} <span className='text-secondary'>Clientes</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input type="text" value={searchUser} onChange={(Text) => setSearchUser(Text.target.value)}  className='w-[300px] text-terciary max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>
              <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-[#959595]"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 ease-in-out ${menu ? "" : "rotate-45"}`}/>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black my-[8px] max-lsm:my-[5px] ${menu ? "" : "hidden"}`}/>
                    <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                </button>
                <button  onClick={() => DisableUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-terciary"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Trocar Status</button>
                <button  onClick={() => ConfirmationDeleteUser()} className={` border-[2px] ${selectUsers.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight border-terciary text-terciary"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Deletar</button>
                <button onClick={() => context.setCreateUserModal(true)} className={`bg-black text-white p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>+ Cadastrar</button>
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
                    <button onClick={() => (setFilter({...filter, status:! filter.status, nome: false, date:false}), filterStatus())}  className='flex items-center cursor-pointer'>
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
                        <button onClick={() => (setUserEdit(user), context.setEditUserModal(true))} className='cursor-pointer bg-terciary p-[4px] flex justify-center items-center rounded-[8px]'>
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
                  <Image src={users.length <= 0 ? iconNullClient : iconSearchUser} width={80} height={80} onClick={() => context.setCreateUserModal(true)}  alt="Foto de uma mulher, clique para cadastrar um cliente" className='cursor-pointer w-[170px] h-[170px]'/>
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
        {context.createUserModal ? <CreateUser /> : <></>}
        {context.editUserModal ? <EditUser user={userEdit}/> : <></>}
        <Modals message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} type={modal.type} size={modal.size} user={modal.user}/>
      </section>
  )
  }
export default ComponentClients;
