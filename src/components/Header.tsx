'use client'

import Image from "next/image"
import styles from '../styles/Header.module.css'
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <Image src={'/logo.svg'} alt="Logo LinkHub" width={180} height={60} />
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        <Link href={'/login'}><button className={styles.signInButton}>Sign In</button></Link>
        <Link href={'/register'}><button className={styles.registerButton}>Get Started</button></Link>
      </nav>

      <div className={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>
        <Image 
          src={menuOpen ? '/close.svg' : '/menu.svg'} 
          alt="Menu Icon" 
          width={28} 
          height={28} 
        />
      </div>
    </header>
  )
}
