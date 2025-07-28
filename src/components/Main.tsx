import Link from 'next/link'
import styles from '../styles/Main.module.css'

export function Main(){
    return(
        <div className={styles.mainContainer}>
            <div className={styles.mainContent}>
                <h1>Organize seus favoritos com LinkHub</h1>
                <h3>Comece agora é rápido, fácil e grátis!</h3>
                <Link href={'/register'}><button>Crie sua conta agora</button></Link>
            </div>
        </div>
    )
}