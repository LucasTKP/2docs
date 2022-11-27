import { Poiret_One, Poppins } from '@next/font/google'
import {Amplify, Auth} from 'aws-amplify'
import { useEffect, createContext, useState } from 'react';
import awsconfig from '../../aws-exports'
import "../../styles/globals.css";
import AppContext from '../components/AppContext'


Amplify.configure({...awsconfig, ssr: true})

const poiretOne = Poiret_One({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poiretOne',
})

const poppins = Poppins({
  display: 'swap',
  weight: ['400'],
  variable: '--font-poppins',
})


export default function MyApp({ Component, pageProps }) {
  const [modalGlobal, setModalGlobal] = useState(false)
  useEffect(() => {
    const page = window.location.pathname
    if(page == '/'){
        Auth.currentSession()
        .then((userSession) => {
          window.location.href = "/home";
          this.setState({ 
              signedIn: true, 
              isSigningIn: false,
              tokenId: userSession.idToken.jwtToken,
              refreshToken: userSession.refreshToken.token
          });
      })
    } else if (page == '/recoveryPassword') {
      
    } else {
      Auth.currentSession()
      .then((userSession) => {
        window.location.href = "/home";
      })
      .catch(() => {
        window.location.href = "/";
      });
    }
    },[Component])


  return (
      <main className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
       <AppContext.Provider value={{modalGlobal, setModalGlobal}}>
        <Component {...pageProps} />
       </AppContext.Provider>
      </main>
  )
}
