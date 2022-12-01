'use client'
import { Poiret_One, Poppins } from '@next/font/google'
import {Amplify, Auth, Cache} from 'aws-amplify'
import { useEffect, useState } from 'react';
import awsconfig from '../../aws-exports'
import "../../styles/globals.css";
import AppContext from '../components/AppContext'
import { usePathname } from 'next/navigation';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  Amplify.configure({...awsconfig, ssr: true})

// const poiretOne = Poiret_One({
//   display: 'swap',
//   weight: ['400'],
//   variable: '--font-poiretOne',
// })

// const poppins = Poppins({
//   display: 'swap',
//   weight: ['400'],
//   variable: '--font-poppins',
// })
const path = usePathname()


useEffect(() => {
  const sessionStorageCache = Cache.createInstance({
    keyPrefix: "auth",
    storage:localStorage.sessionStorage === "true" ? window.sessionStorage :window.localStorage
  });

  Auth.configure({
    storage: sessionStorageCache  
  });

const page = window.location.pathname
if(page == '/'){
    Auth.currentSession()
    .then((userSession) => {
      window.location.href = "/Admin";
  })
} else if (page == '/recoveryPassword') {
  
} else {
  Auth.currentSession()
  .catch((err) => {
    console.log(err)
    window.location.href = "/";
  });
}
},[children])

const [modalGlobal, setModalGlobal] = useState(false)
const [actionCancel, setActionCancel] = useState(false)

  return (
    <html>
      <head />
      <body >
      <AppContext.Provider value={{modalGlobal, setModalGlobal, actionCancel, setActionCancel}}>
          {children}
      </AppContext.Provider>
      </body>
    </html>
  )
}
