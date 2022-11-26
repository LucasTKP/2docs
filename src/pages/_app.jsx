import { Poiret_One, Poppins } from '@next/font/google'
import {Amplify, Auth} from 'aws-amplify'
import { useEffect } from 'react';
import awsconfig from '../../aws-exports'
import "../../styles/globals.css";

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
  useEffect(() => {
    if(Component().type.name == 'Signin'){
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
    } else if (Component().type.name == 'AlterPassword') {
      
    } else {
      Auth.currentSession()
      .catch(() => {
        window.location.href = "/";
      });
    }
    },[Component])


  return (
    <main className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
    <Component {...pageProps} />
  </main>
  )
}
