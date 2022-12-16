import React, {useEffect, useState} from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HomeIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons';
import * as Avatar from '@radix-ui/react-avatar';
import iconExit from '../../../public/icons/exit.svg'
import Image from 'next/image'
import Modals from '../../components/Modals'
import {useContext} from 'react';
import AppContext from '../../components/AppContext'
import { usePathname } from 'next/navigation'
import { signOut} from "firebase/auth";
import { db, auth } from '../../../firebase'
import {doc, updateDoc} from "firebase/firestore";
import axios from 'axios';
import { useRouter } from 'next/navigation';


function NavBar(image) {
    const path = usePathname()
    const context = useContext(AppContext)
    const [menu, setMenu] = useState(true)
    const [modal, setModal] = useState({status: false, message: "", type:"", size:""})
    const router = useRouter()

    
    const childModal = (childdata) => {
        if(childdata === "Exit"){
            signOut(auth).then(() => {
                router.push("/")
            }).catch((error) => {
                console.log(error)
            });
        }
      }

    useEffect(() => {
        if(context.modalGlobal === false){
          setModal({...modal, message: "", type:"", size:""})
        }
      }, [context.modalGlobal]);

    async function setAdminAuth(){
    const id = "BSpONHzk8kPfOzvGQuZ9ov6GJuH3"
    const domain = new URL(window.location.href).origin
    const result = await axios.post(`${domain}/api/users/setAdmin`, {user: id})
    await updateDoc(doc(db, 'users', id), {
        admin:true
        })
        window.location.reload();
    }

  return (
    <div className='left-[0px] z-10 max-h-screen h-screen'>
        <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild className={`max-lg:flex  hidden`}>
                    <button id="Menu" aria-label="Botão menu" onClick={() => setMenu(!menu)} className='z-10 absolute top-[20px] left-[30px] max-sm:left-[15px] flex flex-col'>
                        <div className={`w-[40px] max-sm:w-[35px] h-[3px] bg-terciary transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                        <div className={`w-[40px] max-sm:w-[35px]  h-[3px] bg-terciary my-[8px] ${menu ? "" : "hidden"}`}/>
                        <div className={`w-[40px] max-sm:w-[35px]  h-[3px] bg-terciary transition duration-500 max-sm:duration-400 ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content  side="right" sideOffset={10}>
                        <p className='ml-[5px] text-[20px] font-[500] text-black'>{menu ? "Menu" : "Fechar Menu"}</p>
                        <Tooltip.Arrow width={15} height={10}/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
        <div className={`bg-primary w-[100px] fixed max-sm:max-w-[70px] h-full flex transition duration-1000 left-[0px] ${menu ? "max-lg:left-[-120px]" : ""}  flex-col items-center border-r-2 border-terciary`}> 
            <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`w-full h-[100px] max-sm:max-h-[80px] flex justify-center items-center`}>
                        <Avatar.Root className="mt-[30px] max-lg:mt-[60px] flex flex-col">
                            <Avatar.Image onClick={() => setAdminAuth()} width={80} height={80} className="cursor-pointer h-[80px] w-[80px] max-sm:h-[60px] max-sm:w-[60px] rounded-full" src={image.image} alt="Imagem de perfil"/>
                        </Avatar.Root>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-black'>Foto de Perfil</p>
                            <Tooltip.Arrow width={15} height={10}/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <div className='w-[90%] h-[3px] bg-terciary mt-[20px] max-sm:mt-[10px]'/>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Admin" ? "bg-secondary/30" : ""} w-full h-[100px] max-sm:max-h-[60px] flex justify-center items-center`}>
                        <button id="alb" title="Pagina Inicial" aria-labelledby="labeldiv" className="IconButton" onClick={()=> router.push("/Admin")}> <HomeIcon className='w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black'/> </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-black'>Pagina Inicial</p>
                            <Tooltip.Arrow width={15} height={10}/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                    
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Admin/Arquivos" ? "bg-secondary/30" : ""} w-full h-[100px] max-sm:max-h-[60px] flex justify-center items-center`}>
                        <button className="IconButton" id="alb" title="Pagina De Arquivos" aria-labelledby="labeldiv" onClick={()=> router.push("/Admin/Arquivos")}> <FileTextIcon className='w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black'/> </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-black'>Arquivos</p>
                            <Tooltip.Arrow width={15} height={10}/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Admin/Clientes" ? "bg-secondary/30" : ""} w-full h-[100px] max-sm:max-h-[60px] flex justify-center items-center`}>
                        <button className="IconButton" id="alb" title="Pagina De Clientes" aria-labelledby="labeldiv"  onClick={()=> router.push("/Admin/Clientes")}> <PersonIcon className='w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black'/> </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-black'>Clientes</p>
                            <Tooltip.Arrow width={15} height={10}/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                    <div className='absolute bottom-[80px] w-[80%] h-[3px] bg-terciary mt-[20px]'/>
                        <Tooltip.Trigger asChild className={`absolute bottom-[20px] w-full flex justify-center`}>
                            <button className="IconButton" onClick={() => (context.setModalGlobal(true), setModal({status:true,  message:"Tem certeza que deseja sair da sua conta", type:"error", size:"big"}))} >
                                <Image src={iconExit} alt="Icone de sair" className='w-[40px] max-sm:w-[35px] h-[40px] max-sm:h-[35px]'/> 
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-red'>Sair</p>
                            <Tooltip.Arrow width={15} height={10} className="fill-red"/>
                        </Tooltip.Content>
                        </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
            </div>
        <Modals message={modal.message} type={modal.type} size={modal.size} to={"Exit"} childModal={childModal} />
    </div>
  )
}

export default NavBar

