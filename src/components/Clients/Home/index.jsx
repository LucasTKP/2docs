import { auth, db } from '../../../../firebase'
import { collection, where, getDocs, query } from "firebase/firestore";
import Image from 'next/image';
import { useEffect, useState } from 'react'
import styles from './home.module.css'
import DownloadFiles from '../../Files/dowloadFiles'


function ComponentHome () {
  const [urlImage, setUrlImage] = useState()
  const [recentsFile, setRecentsFile] = useState([])
  const [data, setData] = useState({contact:[], question:[]})

   useEffect(() => {
    GetUsers()
    GetFiles()
   },[])

  async function GetUsers(){
    const q = query(collection(db, "users"), where("email", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUrlImage(doc.data().image)
    });
  }

  async function GetFiles(){
    const getFiles = []
    var q = query(collection(db, "files"), where("id_user", "==", auth.currentUser.uid))
      const querySnapshot = await getDocs(q);
      const a = querySnapshot.forEach((doc) => {
        getFiles.push(doc.data())
      }); 
    FilterDate(getFiles)
    GetContact()
  }
  
  async function GetContact(){
    const q = query(collection(db, "data"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setData({...data, contact:doc.data().contact, id:doc.data().id, question:doc.data().question, response: doc.data().response})
    });
  }

  async function FilterDate(getFiles){
    const filesHere = [...getFiles].filter(file => file.trash === false && file.from === "admin")
    const recents = []
    filesHere.sort(function(a,b) { 
      a.date = new Date(a.date)
      b.date = new Date(b.date)
      return (a.date.getTime() - b.date.getTime()) + ""
    });
    for (var i = 0; 5 > i && i < (filesHere.length); i++) {
      recents.push(filesHere[i])
    }
    setRecentsFile(recents)
  }
  
  return (
    <div className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
        {urlImage != undefined ? <Image src={urlImage} alt="Logo da empresa" width={100} height={100} className="max-lg:w-[90px] max-lg:h-[90px] max-md:w-[80px] max-md:h-[80px] max-sm:w-[70px] max-sm:h-[70px] rounded-full absolute right-[20px]"/> : <></>}
          <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Home</p>
          <p  className='text-[18px] flex mx-[5px] text-secondary'>Home</p> 
          <div className='flex gap-[30px] max-md:gap-[10px] flex-wrap mt-[20px]'>
            <div>
              <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Uploads Recentes</p>
              <div className='border-[2px] border-secondary w-[300px] h-[200px] p-[10px] rounded-[12px] scroll-mt-[50px]'>
                <div id={styles.boxFiles} className='w-full h-full overflow-y-auto'>
                  {recentsFile.length > 0 ?
                    recentsFile.map((file) =>{
                      return(
                        <div onClick={() => DownloadFiles({filesDownloaded:[file]})} key={file.id_file} className="cursor-pointer flex items-center gap-[10px] mt-[10px] h-[50px]">
                          <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                          <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                        </div>
                      )
                    })
                  : <></>}
                </div>
              </div>
            </div>

            <div>
              <p  className='font-poiretOne text-[40px] max-sm:text-[35px] '>Contato</p>
              <div className='border-[2px] border-secondary w-[300px] h-[200px] pr-[5px] rounded-[12px]'>
                <div id={styles.boxFiles} className='h-full overflow-y-scroll px-[10px] flex flex-col'>
                    {data.contact.length > 0 ? 
                    data.contact.map((contact) => {
                      const linkWhatsApp = "https://wa.me/55" +  contact.replaceAll("(", "").replaceAll( ")", "").replaceAll( "-", "").replaceAll( " ", "")
                      return(
                        <a key={contact} href={linkWhatsApp } className="flex items-center gap-[10px] mt-[10px] h-[50px]">
                          <Image src={`/icons/whatsapp.svg`} alt="Imagem simbolizando o tipo de arquivo" width={80} height={80} className="w-[40px] h-[40px]"/>
                          <p type="text" className='text-[20px] text-ellipsis pl-[5px] white-space'>{contact}</p>
                        </a> 
                      )
                    })
                  : <></>}
                </div>
              </div>
            </div>
          </div>

          <p  className='font-poiretOne text-[40px] max-sm:text-[35px] mt-[20px]'>Dúvidas Frequentes</p>
          <div className=' w-full'>
            {data.question.length > 0 ? 
            data.question.map((question) => {
              return(
                <div key={question.question} className="w-full">
                  <details>
                    <summary className='text-[18px] font-[600] whitespace-pre-line'>{question.question}</summary>
                    <p type="text" className='text-[18px] pl-[5px] pb-[15px] whitespace-pre-wrap w-full'>{question.response}</p>
                  </details> 
                </div>
              )
            })
          : <></>}
          </div>
        </div>
      </div>
  )
}

export default ComponentHome 