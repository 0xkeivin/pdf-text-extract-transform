import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { FileUpload } from '@/components/FileUpload'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head> PDF to Image to Text ? </Head>
    <FileUpload
      accept="application/pdf"
      onFileUploaded={(data) => {
        console.log(data)
      }}
    />
    </>
  )
}
