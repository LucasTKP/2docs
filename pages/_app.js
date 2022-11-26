import '../styles/globals.css'
import awsconfig from '../aws-exports'
import {Amplify} from 'aws-amplify'

Amplify.configure({...awsconfig, ssr: true})

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
