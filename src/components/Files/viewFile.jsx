import React from 'react'

function ViewFile(props) {
  return (
    <div className='h-screen w-screen fixed bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-primary flex flex-col min-h-[90%] h-full w-[40%] max-sm:w-full px-[5px]'>
        <div onClick={() => props.setDocuments({...props.document, view: false, url:""})} className={`self-end cursor-pointer mt-[20px] w-[35px] max-lsm:w-[30px]  h-[3px] bg-black rotate-45 
        after:w-[35px] after:max-lsm:w-[30px] after:h-[3px] after:absolute after:bg-black after:rotate-90`}/>
        <object className='w-full h-[90%] mt-[20px]'  data={props.document.url}>
          <p className='text-[20px] text-center'>Não foi possivel exibir este arquivo.</p>  
          {/* . <span className="font-[600] text-[#92d2ff]">Faça dowload deste arquivo.</span> */}
        </object>
      </div>  
    </div>
  )
}

export default ViewFile