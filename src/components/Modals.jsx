import {useState, useEffect, useContext} from 'react';
import AppContext from '../components/AppContext'

function Modal(props) {
  const context = useContext(AppContext)
  const type = props.type
  if(type === "error"){
    return (
      <>
      {context.modalGlobal ? 
        <div className='w-screen h-screen absolute bg-black/40 backdrop-blur-[4px] flex justify-center items-center'>
          <div className='bg-primary w-[350px] max-lsm:w-[320px] pb-[20px] rounded-[4px] flex flex-col items-center'>
            <div  className='bg-red w-full h-[10px] rounded-t-[4px]'/>
              <p className='text-[20px] mt-[10px] mx-[10px]'>{props.message}</p>
              <button onClick={() => context.setModalGlobal(false)} className='bg-secondary hover:scale-[1.10] duration-300 w-[100px] h-[40px] mt-[30px] rounded-[8px] text-[20px] text-white '>Ok</button>
          </div>
        </div>
  
        : <></>}
      </>
    )
  } else if(type === 'sucess'){
    return (
      <>
      {context.modalGlobal ? 
        <div className='w-screen h-screen absolute bg-black/40 backdrop-blur-[4px] flex justify-center items-center'>
          <div className='bg-primary w-[350px] max-lsm:w-[320px] pb-[20px] rounded-[4px] flex flex-col items-center'>
            <div  className='bg-green w-full h-[10px] rounded-t-[4px]'/>
              <p className='text-[20px] mt-[10px] mx-[10px]'>{props.message}</p>
              <button onClick={() => context.setModalGlobal(false)} className='bg-secondary hover:scale-[1.10] duration-300 w-[100px] h-[40px] mt-[30px] rounded-[8px] text-[20px] text-white '>Ok</button>
          </div>
        </div>
  
        : <></>}
      </>
    )
  }

}

export default Modal