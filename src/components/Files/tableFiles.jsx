import React, { useState } from 'react'
import iconAddFile from '../../../public/icons/addFile.svg'
import ArrowFilter from '../../../public/icons/arrowFilter.svg'
import iconSearchFile from '../../../public/icons/searchFile.svg' 
import Image from 'next/image'
import { DownloadIcon, EyeOpenIcon, TrashIcon} from '@radix-ui/react-icons';
import DownloadsFile from './dowloadFiles'

export default function TableFiles(props) {
  const [filter, setFilter] = useState({name: false, size:false, date:false, status:false})
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augusto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const [showItens, setShowItens] = useState({min:-1, max:10})
  const url = window.location.href
  const trash = props.trash

  function filterName(){
    var files = props.searchFile.length == 0 ? [...props.files ]: [...props.filesFilter]
    files.sort(function (x, y){
      let a = x.name.toUpperCase()
      let b = y.name.toUpperCase()
      if(filter.name){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    props.setFilesFilter(files)
  }

  function filterSize(){
    var files = props.searchFile.length == 0 ? [...props.files ]: [...props.filesFilter]
    files.sort(function (x, y){
      let a = x.size
      let b = y.size
      if(filter.size){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    props.setFilesFilter(files)
  }

  function filterStatus(){
    var files = props.searchFile.length == 0 ? [...props.files ]: [...props.filesFilter]
    files.sort(function (x, y){
      let a = x.viwed
      let b = y.viwed
      if(filter.status){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    props.setFilesFilter(files)
  }

  function filterDate(){
    const filesDate = props.searchFile.length == 0 ? [...props.files ]: [...props.filesFilter]
    filesDate.sort(function(a,b) { 
      a.date = new Date(a.date)
      b.date = new Date(b.date)
      if(filter.date){
       return (b.date.getTime() - a.date.getTime()) + ""
      } else {
       return (a.date.getTime() - b.date.getTime()) + ""
      }
    });
    for (var i = 0; i < filesDate.length; i++) {
      filesDate[i].date = filesDate[i].date + ""
    }
    props.setFilesFilter(filesDate)
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
    {props.filesFilter.length > 0 ?
        <table className='w-full mt-[10px] bg-transparent'>
          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <thead>
            <tr className='bg-[#DDDDDD] border-b-[2px] border-t-[2px] border-terciary text-[20px] max-lg:text-[18px] max-md:text-[17px]'>
              <th className='py-[10px]'><input aria-label="checkbox demonstrativo" type="checkbox" disabled={true} className='w-[20px] h-[20px]'/></th>
              
              <th className='font-[400] text-left pl-[20px] max-lg:pl-[10px]'>
                <button id="filterName" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, name:! filter.name, status: false, date:false, size:false}), filterName())} className='flex items-center cursor-pointer'>
                  <p>Nome</p> 
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400] text-left pl-[20px] max-md:hidden'>
                <button id="filterSize" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, size:! filter.size, name:false, status: false, date:false}), filterSize())} className='flex items-center cursor-pointer'>
                  <p>Tamanho</p> 
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.size ? "rotate-180" : ""}`}src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400] max-lg:hidden'>
                <button id="filterData" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, date:! filter.date, status: false, name:false, size:false}) ,filterDate())} className='flex items-center cursor-pointer'>
                  <p className='text-left'>Data de upload</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400]'>
              <button id="filterStatus" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, status:! filter.status, name: false,  size:false, date:false}), filterStatus())}  className='flex items-center cursor-pointer'>
                  <p>Status</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[5px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400]'>Ações</th>

            </tr>
          </thead>
              {/* <--------------------------------- BodyTable ---------------------------------> */}
            <tbody>
                {props.filesFilter.map((file, index) =>{
                    var checked = file.checked
                    if( showItens.min < index && index < showItens.max){
                    return(
                    <tr key={file.id_file} className='border-b-[1px] border-terciary text-[18px] max-lg:text-[16px]' >
                        <th className='h-[50px] max-sm:h-[40px]'>
                            <input aria-label="Selecionar Usuário" type="checkbox" checked={checked} onChange={(e) => checked = e.target.value}  onClick={() => props.SelectFile(index)} className='w-[20px] max-sm:w-[15px] max-sm:h-[15px]  h-[20px] ml-[5px]'/>
                        </th>

                        <th className='font-[400] flex ml-[20px] max-lg:ml-[10px] items-center h-[50px] max-sm:h-[40px]'>
                            <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={40} height={40}  className='text-[10px] mt-[3px] mr-[10px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]'/>
                            <p className='overflow-hidden whitespace-nowrap text-ellipsis  max-w-[180px] max-lg:max-w-[130px] max-lsm:max-w-[80px]'>{file.name}</p>
                        </th>

                        <th className='font-[400] text-left pl-[20px] max-md:hidden w-50'>
                            <p className='overflow-hidden whitespace-nowrap text-ellipsis '>{parseInt(file.size) < 1000 ? file.size + " KB"  : Math.ceil(file.size / 1000) + " MB"} </p>
                        </th>

                        <th className='font-[400] max-lg:hidden text-left'>{formatDate(file.date)}</th>

                        <th className='font-[400] w-[80px] pr-[10px] max-sm:pr-[0px] max-sm:w-[70px] text-[18px] max-sm:text-[14px] '>
                          {file.viwed  ? 
                              <div className='bg-greenV/20 border-greenV text-[#00920f] border-[1px] rounded-full px-[4px]'>
                                  Visualizado
                              </div>
                          :
                              <div className='bg-hilight max-sm:text-[12px] border-terciary text-secondary border-[1px]  px-[4px] rounded-full'>
                                  Visualizado
                              </div>
                          }
                        </th>

                        <th className='font-[400]  w-[90px] max-lg:w-[80px] px-[5px]'>
                            <div className='flex justify-between'>
                              {url.includes("/Clientes") && file.from === "user" ? 
                                <button onClick={() => props.ConfirmationDeleteFile(index)} id="DeletFile" aria-label="Botão de deletar o documento."  className='cursor-pointer bg-red/30 p-[4px] flex justify-center items-center rounded-[8px]'>
                                  <TrashIcon width={25} height={25} className="max-sm:w-[20px] max-sm:h-[18px]"/>
                                </button>
                              :
                                <button id="DowloadFile" aria-label="Botão de fazer dowload do documento." onClick={() => DownloadsFile({filesDownloaded:[file], files:props.files, ResetConfig:props.ResetConfig})} className='cursor-pointer bg-hilight p-[4px] flex justify-center items-center rounded-[8px]'>
                                  <DownloadIcon width={25} height={25} className="max-sm:w-[20px] max-sm:h-[18px]"/>
                                </button>  
                              }

                                <button onClick={() => props.setDocuments({...props.documents, view: true, url: file.url}) }title="Botão De ver documentos" aria-labelledby="labeldiv" className='bg-[#bfcedb] p-[4px] flex justify-center items-center rounded-[8px]'>
                                    <EyeOpenIcon width={25} height={25} className="max-sm:w-[20px] max-sm:h-[18px]"/>
                                </button>
                            </div>
                        </th>
                    </tr>
                )}})}
            </tbody>
        </table>
      : 
        trash ? 
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <Image src={props.files.length <= 0 ? iconAddFile : iconSearchFile} width={80} height={80}  alt="clique para enviar um arquivo" className='w-[170px] h-[170px]'/>
            <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> {props.filesFilter.length <= 0 ? "Nenhum arquivo deletado encontrado." : "Nenhum resultado foi encontrado."} </p>
          </div>
        :
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <Image src={props.files.length <= 0 ? iconAddFile : iconSearchFile} width={80} height={80}  alt="clique para enviar um arquivo" className='w-[170px] h-[170px]'/>
            <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center'>Nada por aqui... <br/> {props.filesFilter.length <= 0 ? "Envie seu primeiro arquivo!" : "Nenhum resultado foi encontrado."}</p>
          </div>
      }

    {/* <--------------------------------- NavBar table ---------------------------------> */}
        {props.filesFilter.length > 0 ?
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
