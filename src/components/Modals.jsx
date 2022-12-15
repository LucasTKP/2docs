import {useContext} from 'react';
import AppContext from '../components/AppContext'

function Modal(props) {
  const context = useContext(AppContext)
  const type = props.type
  const size = props.size
  const subMessage1 = props.subMessage1
  const subMessage2 = props.subMessage2
  if(type === "error"){
    if(size === "little"){
      return (
        <>
        {context.modalGlobal ? 
          <div className='w-screen h-full fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center z-50'>
            <div className='bg-primary w-[350px] max-lsm:w-[320px] pb-[20px] rounded-[4px] flex flex-col items-center'>
              <div  className='bg-red w-full h-[10px] rounded-t-[4px]'/>
                <p className='text-[20px] mt-[10px] mx-[10px]'>{props.message}</p>
                <button onClick={() => context.setModalGlobal(false)} className='bg-secondary hover:scale-[1.10] duration-300 w-[80px] h-[35px] mt-[30px] rounded-[8px] text-[20px] text-white '>Ok</button>
            </div>
          </div>
    
          : <></>}
        </>
      )
    } else if(size === "big"){
      return (
        <>
        {context.modalGlobal ? 
          <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50'>
            <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
              <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
              <div className=' px-[10px]'>
              <p className='text-[26px] mt-[10px]'>{props.message}<span className='font-[600] font-poppins'> {props.user}</span>?</p>

              {subMessage1 != undefined ? 
                <div className='flex items-start mt-[20px]'>
                  <div className='min-w-[20px] min-h-[20px] bg-hilight rounded-full ml-[20px]'/>
                  <p className='text-[20px] ml-[8px]'>{subMessage1}</p>
                </div>
                :<></>}

              {subMessage2 != undefined ? 
                <div className='flex items-start mt-[20px]'>
                  <div className='min-w-[20px] min-h-[20px] bg-hilight rounded-full ml-[20px]'/>
                  <p className='text-[20px] ml-[8px]'>{subMessage2}</p>
                </div>
              :<></>}
              </div>
              <div className='flex w-full justify-end gap-4 bg-hilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
                  <button onClick={() => (context.setActionCancel(false), context.setModalGlobal(false))} className='bg-strong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] text-white '>Cancelar</button>
                  <button onClick={() => (context.setActionCancel(true), context.setModalGlobal(false))} className='bg-red/40 border-2 border-red hover:scale-[1.10]  duration-300 p-[5px] rounded-[8px] text-[20px] text-white '>Confirmar</button>
                </div>
            </div>
          </div>
    
          : <></>}
        </>
      )
    }


  } else if(type === 'sucess'){
    return (
      <>
      {context.modalGlobal ? 
        <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center z-50'>
          <div className='bg-primary w-[350px] max-lsm:w-[320px] pb-[20px] rounded-[4px] flex flex-col items-center'>
            <div  className='bg-greenV w-full h-[10px] rounded-t-[4px]'/>
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