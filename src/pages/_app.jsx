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



  return (
    <main className={`${poiretOne.variable} ${poppins.variable} text-white font-poppins`}>
    <Component {...pageProps} />
  </main>
  )
}
