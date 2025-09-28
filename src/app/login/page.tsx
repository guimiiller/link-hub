// app/login/page.tsx
'use client'
import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import styles from "../../styles/Login.module.css"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setErrorMessage(false)

    if (!email || !password) {
      setErrorMessage(true)
      return
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // evita reload automático
    })

    if (res?.ok && !res.error) {
      const session = await getSession()
      const userId = session?.user?.id

      router.push(userId ? `/favorites/${userId}` : "/favorites")
    } else {
      setErrorMessage(true)
    }
  }

  return (
    <div className={styles.container}>
      <Link href={"/"}>
        <Image
          src={"/logo.svg"}
          alt="Logo LinkHub"
          width={230}
          height={70}
          className={styles.logoRegister}
        />
      </Link>
      <div className={styles.contentLogin}>
        <div>
          <input
            placeholder="E-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.erroAndRegister}>
          {errorMessage && (
            <p style={{ color: "red", fontSize: "15px" }}>
              E-mail ou senha inválidos
            </p>
          )}
          <div className={styles.registerLink}>
            <Link href={"/register"}>Register</Link>
          </div>
        </div>
        <button onClick={handleLogin}>Sign In</button>
      </div>
    </div>
  )
}
