import styles from '../../styles/RegisterSuccess.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function RegisterSuccess(){
    return(
        <div className={styles.container}>
            <div className={styles.messageSuccess}>
                <h1>Registration completed successfully! <Image src={'/smile.png'} alt='Smile' width={80} height={80}/></h1>
                <p>Now you can log in with your details.</p>
                <Link href="/login">
                    <button style={{ marginTop: '1rem' }}>Go to login</button>
                </Link>
            </div>
        </div>
    )
}