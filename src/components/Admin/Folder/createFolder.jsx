import React from 'react'
import { useState } from 'react'
import { doc, updateDoc } from "firebase/firestore";  
import {db} from '../../../../firebase'
import { toast } from 'react-toastify';

function CreateFolder(props) {
    const folders = props.user.folders
    const [color, setColor] = useState()
    const [nameFolder, setNameFolder] = useState()
    async function CreateFolder(){
        const result = folders.findIndex(folder => folder.name === nameFolder)
        if(result === -1){
            if(color != undefined && nameFolder.length > 0 ){
                folders.push({name: nameFolder, color: color})
                try{
                    await updateDoc(doc(db, 'users', props.idUser), {
                        folders: props.user.folders
                    })
                    props.setFolders(folders)
                    props.setFoldersFilter(folders)
                    props.folder(false)
                } catch(err){
                    console.log(err)
                }
            } else{
                toast.error("Escolha uma cor e um nome para a pasta.")
            }
        } else{
            toast.error("Já existe uma pasta com esse nome.")
        }

    }



  return (
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50'>
        <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
            <div  className='bg-[#005694] w-full h-[15px] rounded-t-[4px]'/>
            <div className=' px-[10px] pl-[20px]'>
                <p className='text-[26px] mt-[10px] font-[500]'>Criar Nova Pasta</p>
                <p className='text-[20px] mt-[10px] font-[500]'>Nome da Pasta:</p>
                <input onChange={(text) => setNameFolder(text.target.value)} maxLength={30} className='w-[80%] bg-transparent border-black border-[2px] rounded-[8px] text-[20px] max-sm:text-[18px]  max-lsm:text-[16px] px-[5px] py-[3px] outline-none' placeholder='Digite o nome da pasta' />
                <p className='text-[20px] mt-[15px] font-[500]'>Cor da pasta:</p>
                <div className='gap-[10px] flex'>
                    <div className={`w-[30px] h-[30px] bg-[#005694] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#005694" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#005694"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#C7A03C] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#C7A03C" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#C7A03C"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#248B2E] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#248B2E" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#248B2E"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#BE0000] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#BE0000" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#BE0000"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#E135D0] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#E135D0" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#E135D0"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#000000] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#000000" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#000000"))}/>
                    <div className={`w-[30px] h-[30px] bg-[#9E9E9E] rounded-[4px] hover:scale-105 cursor-pointer ${color === "#9E9E9E" ? "border-[#0093FF] border-[3px]" : <></>}`} onClick={() => (setColor("#9E9E9E"))}/>
                </div>
            </div>
            <div className='flex w-full justify-end gap-4 bg-hilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
                <button onClick={() => props.folder(false)} className='bg-strong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] max-sm:text-[18px] text-white '>Cancelar</button>
                <button onClick={() => CreateFolder()} className='bg-greenV/40 border-2 border-greenV hover:scale-[1.10]  duration-300 p-[5px] rounded-[8px] text-[20px] max-sm:text-[18px] text-white '>Confirmar</button>
            </div>
        </div>
    </div>
  )
}

export default CreateFolder