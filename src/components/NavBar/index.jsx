import React, {useEffect, useState} from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HomeIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons';
import * as Avatar from '@radix-ui/react-avatar';
import iconExit from '../../../public/icons/exit.svg'
import Image from 'next/image'
import { useRouter } from 'next/dist/client/router'
import {Auth} from 'aws-amplify'
import Modals from '../Modals'
import {useContext} from 'react';
import AppContext from '../AppContext'

function index(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(AppContext)
    const page = props.page
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [menu, setMenu] = useState(true)

    useEffect(()=>{
        if(context.actionCancel === true){
            Auth.signOut()
            .then((data) => {
              router.push({
                pathname: "/",
              }); 
            })
            .catch((err) => {
                this.setState({ isSigningOut: false });
                console.log(err);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[context.actionCancel])
  return (
    <div className='fixed w-full h-full'>
        <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild className={`max-lg:flex  hidden`}>
                    <button onClick={() => setMenu(!menu)} className='z-10 absolute top-[20px] left-[30px] flex flex-col'>
                        <div className={`w-[40px] h-[3px] bg-terciary transition duration-500 ease-in-out ${menu ? "" : "rotate-45"}`}/>
                        <div className={`w-[40px] h-[3px] bg-terciary my-[8px] ${menu ? "" : "hidden"}`}/>
                        <div className={`w-[40px] h-[3px] bg-terciary transition duration-500 ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                    </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content  side="right" sideOffset={10}>
                        <p className='ml-[5px] text-[20px] font-[500]'>{menu ? "Menu" : "Fechar Menu"}</p>
                        <Tooltip.Arrow width={15} height={10}/>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>

        </Tooltip.Provider>
        <div className={`bg-primary fixed h-full flex transition duration-1000 left-[0px] ${menu ? "max-lg:left-[-120px]" : ""}  flex-col items-center border-r-2 border-terciary`}> 
            <Tooltip.Provider delayDuration={800} skipDelayDuration={500}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`px-[10px] w-full h-[100px] flex justify-center items-center`}>
                            <Avatar.Root className="mt-[30px] max-lg:mt-[60px] flex flex-col">
                                <Avatar.Image className="w-[80px] h-[80px] rounded-full" src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"alt="Colm Tuite"/>
                                <div className='w-[80px] h-[3px] bg-terciary mt-[20px]'/>
                            </Avatar.Root>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[5px] text-[20px] font-[500]'>Foto de Perfil</p>
                                <Tooltip.Arrow width={15} height={10}/>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`mt-[20px] ${page === "home" ? "bg-secondary/30" : ""} w-full h-[100px] flex justify-center items-center`}>
                            <button className="IconButton"> <HomeIcon className='w-[50px] h-[50px] text-black'/> </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[5px] text-[20px] font-[500]'>Pagina Inicial</p>
                                <Tooltip.Arrow width={15} height={10}/>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`mt-[20px] ${page === "files" ? "bg-secondary/30" : ""} w-full h-[100px] flex justify-center items-center`}>
                            <button className="IconButton"> <FileTextIcon className='w-[50px] h-[50px] text-black'/> </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[5px] text-[20px] font-[500]'>Arquivos</p>
                                <Tooltip.Arrow width={15} height={10}/>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`mt-[20px] ${page === "clientes" ? "bg-secondary/30" : ""} w-full h-[100px] flex justify-center items-center`}>
                            <button className="IconButton"> <PersonIcon className='w-[50px] h-[50px] text-black'/> </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[5px] text-[20px] font-[500]'>Clientes</p>
                                <Tooltip.Arrow width={15} height={10}/>
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                        <div className='absolute bottom-[80px] w-[80px] h-[3px] bg-terciary mt-[20px]'/>
                        <Tooltip.Trigger asChild className={`absolute bottom-[20px] w-full flex justify-center`}>
                            <button className="IconButton" onClick={() => context.setModalGlobal(true)} >  <Image src={iconExit} alt="Icone de sair" className='w-[40px] h-[40px]'/> </button>
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
        <Modals message={"Tem certeza que deseja sair da sua conta?"} type={"error"} size="big"/>
    </div>
  )
}

export default index