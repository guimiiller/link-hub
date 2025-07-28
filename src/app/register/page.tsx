'use client'
import { useState } from 'react'
import styles from '../../styles/Register.module.css'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErrorMessage(true)
      return
    }

    setErrorMessage(false)

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      window.location.href = '/register-success' 
    } else {
      alert('Erro ao criar usuário')
    }
  }

  return (
    <div className={styles.container}>
      <Link href={'/'}><Image src={'/logo.svg'} alt='Logo LinkHub' width={230} height={70} className={styles.logoRegister}/></Link>
      <div className={styles.contentLogin}>
        <form onSubmit={handleSubmit}>
          <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })}  />
          {errorMessage && <p style={{ color: 'red' }}>Preencha todos os campos corretamente.</p>}
          <button type="submit" className={styles.registerButton}>Register</button>
        </form>
      </div>
    </div>
  )
}
