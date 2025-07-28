'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation' 
import styles from '../../styles/Login.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setErrorMessage(false)

    if (!email || !password) {
      setErrorMessage(true)
      return
    }

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.ok && !res.error) {
      const session = await getSession()
      const userId = session?.user?.id

      if (userId) {
        router.push(`/favorites/${userId}`)
      } else {
        router.push('/favorites') 
      }
    } else {
      setErrorMessage(true)
    }
  }


  return (
    <div className={styles.container}>
      <Link href={'/'} ><Image src={'/logo.svg'} alt='Logo LinkHub' width={230} height={70} className={styles.logoRegister}/></Link>
      <div className={styles.contentLogin}>
        <div>
          <input placeholder="E-mail" onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        </div>
        <div className={styles.erroAndRegister}>
          <div>
            {errorMessage && <p style={{ color: 'red', fontSize: '15px' }}>E-mail ou senha inválidos</p>}
          </div>
          <div className={styles.registerLink}>
            <div><Link href={'/register'}>Register</Link></div>
          </div>
        </div>
        <button onClick={handleLogin}>Sign In</button>
      </div>
    </div>
  )
}
