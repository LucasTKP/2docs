import React,{useState} from 'react'
import { Pencil1Icon, FileTextIcon } from '@radix-ui/react-icons';
import ArrowFilter from '../../../../public/icons/arrowFilter.svg'
import Image from 'next/image'
import iconNullClient from '../../../../public/icons/nullClient.svg'
import iconSearchUser from '../../../../public/icons/searchUser.svg'
import Link from 'next/link'

function TableClients(props) {
    const [showItens, setShowItens] = useState({min:-1, max:10})
    const [filter, setFilter] = useState({name: false, date:false, status:false})
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augusto", "Setembro", "Outubro", "Novembro", "Dezembro"]
// <--------------------------------- Filters Table --------------------------------->

  function filterName(){
    var users = props.searchUser.length == 0 ? [...props.users ] : [...props.Filter]
    users.sort(function (x, y){
      let a = x.name.toUpperCase()
      let b = y.name.toUpperCase()
      if(filter.name){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    props.setUsersFilter(users)
  }

  function filterStatus(){
    var users = props.searchUser.length == 0 ? [...props.users ] : [...props.Filter]
    users.sort(function (x, y){
      let a = x.status
      let b = y.status
      if(filter.status){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    props.setUsersFilter(users)
  }

  function filterDate(){
    var users = props.searchUser.length == 0 ? [...props.users ] : [...props.Filter]
    users.sort(function(a,b) { 
      a.date = new Date(a.date)
      b.date = new Date(b.date)
      if(filter.date){
       return (b.date.getTime() - a.date.getTime()) + ""
      } else {
       return (a.date.getTime() - b.date.getTime()) + ""
      }
    });
    for (var i = 0; i < users .length; i++) {
        users[i].date = users[i].date + ""
    }
    props.setUsersFilter(users)
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

  return (
    <>
    {props.usersFilter.length > 0 ?
        <table className='w-full mt-[10px] bg-transparent'>

          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <thead>
            <tr className='bg-[#DDDDDD] border-b-[2px] border-t-[2px] border-terciary text-[20px] max-lg:text-[18px] max-md:text-[17px]'>
              <th className='py-[10px]'><input aria-label="checkbox demonstrativo" type="checkbox" disabled={true} className='w-[20px] h-[20px]'/></th>
              
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
          {props.usersFilter.map((user, index) =>{
            var checked = user.checked

            if( showItens.min < index && index < showItens.max){
          return(
          <tr key={user.id} className='border-b-[1px] border-terciary text-[18px] max-lg:text-[16px]' >
              <th className='h-[50px] max-sm:h-[40px]'>
                <input aria-label="Selecionar Usuário" type="checkbox" checked={checked} onChange={(e) => checked = e.target.value}  onClick={() => props.SelectUsers(index)} className='w-[20px] h-[20px]  max-sm:w-[15px] max-sm:h-[15px] ml-[5px]'/>
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
                  <div className='bg-red/20 border-red text-[#c50000] border-[1px] rounded-full'>
                    Inativo
                  </div>
                  :
                  <div className='bg-greenV/20 border-greenV text-[#00920f] border-[1px] rounded-full'>
                    Ativo 
                  </div>
                }
              </th>

              <th className='font-[400]  w-[90px] max-lg:w-[80px] px-[5px]'>
                <div className='flex justify-between'>
                  <button id="alb" title="Botão De editar usuario" aria-labelledby="labeldiv" onClick={() => (props.setUserEdit(user), props.setWindowsAction({...props.windowsAction, updateUser:true}))} className='cursor-pointer bg-hilight p-[4px] flex justify-center items-center rounded-[8px]'>
                    <Pencil1Icon width={25} height={25} className="max-sm:w-[20px] max-sm:h-[18px]" />
                  </button>
                  <Link href={{ pathname: '/Admin/Pastas', query:{id:user.id}}} className='bg-[#bfcedb] p-[4px] flex justify-center items-center rounded-[8px]'>
                    <FileTextIcon width={25} height={25} className="max-sm:w-[20px] max-sm:h-[18px]" />
                  </Link>
                </div>
              </th>
            </tr>)}     
          })}
          </tbody>
        </table>
      : 
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <Image src={props.users.length <= 0 ? iconNullClient : iconSearchUser} width={80} height={80} onClick={() => setWindowsAction({...windowsAction, createUser: true})}  alt="Foto de uma mulher, clique para cadastrar um cliente" className='cursor-pointer w-[170px] h-[170px]'/>
            <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> {props.users.length <= 0 ? "Cadastre seu primeiro cliente!" : "Nenhum resultado foi encontrado."}</p>
          </div>
      }

      {/* <--------------------------------- NavBar table ---------------------------------> */}
      {props.usersFilter.length > 0 ?
      <div className='w-full px-[10px] flex justify-between h-[50px] mt-[10px]'>
        <div className='flex justify-between w-full h-[40px] max-sm:h-[30px]'>
          <button onClick={() => {showItens.max / 10 != 1 ? setShowItens({...showItens, min: showItens.min - 10, max: showItens.max - 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == 1 ? "bg-hilight border-terciary text-terciary" : "bg-black border-black text-white"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Anterior</button>
          <p>{`Página ${showItens.max / 10} de ${props.pages}`}</p>
          <button onClick={() => {showItens.max / 10 != props.pages ? setShowItens({...showItens, min: showItens.min + 10, max: showItens.max + 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == props.pages ? "bg-hilight border-terciary text-terciary" : "bg-black border-black text-white"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Proximo</button>
        </div>
      </div>
      :<></>}
      </>
  )
}

export default TableClients