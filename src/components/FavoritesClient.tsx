'use client'

import { useEffect, useState } from 'react'
import { getSession, signOut } from 'next-auth/react'
import styles from '../styles/Favorite.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [newLink, setNewLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-favorites')
      const data = await res.json()
      setFavorites(data.favorites || [])
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserName = async () => {
    const session = await getSession()
    if (session?.user?.name) {
      setUserName(session.user.name)
    }
  }

  useEffect(() => {
    fetchFavorites()
    fetchUserName()
  }, [])

  const handleDeleteLink = async (linkToDelete: string) => {
    const res = await fetch('/api/delete-favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: linkToDelete })
    })

    if (res.ok) {
      const data = await res.json()
      setFavorites(data.favorites)
    } else {
      console.error('Erro ao deletar link')
    }
  }

  const handleAddLink = async () => {
    if (!newLink) return

    try {
      const res = await fetch('/api/add-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: newLink })
      })

      if (res.ok) {
        setNewLink('')
        fetchFavorites()
      } else {
        console.error('Erro ao adicionar link')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  }

  const handleEditLink = async (oldLink: string, newLink: string) => {
    const res = await fetch('/api/edit-favorite', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldLink, newLink })
    })

    if (res.ok) {
      setEditIndex(null)
      setEditValue('')
      fetchFavorites()
    } else {
      console.error('Erro ao editar link')
    }
  }

  const handleShare = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Link Favorito', url: link })
      } catch (error) {
        console.error('Erro ao compartilhar:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(link)
        alert('Link copiado para a área de transferência.')
      } catch (err) {
        console.error('Erro ao copiar link:', err)
      }
    }
  }

  return (
    <div className={styles.container}>
      <Image src={'/logo.svg'} alt='Logo LinkHub' width={150} height={30} className={styles.logoFavorites} />
      <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logoutButton}>
        <Image src={'/signOut.png'} alt='Sign Out Icon' width={30} height={30} />
      </button>

      <div className={styles.header}>
        <h1>Hello {userName || 'usuário'}</h1>
      </div>

      <div className={styles.containerContent}>
        <div className={styles.formAddLink}>
          <input
            type="text"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            placeholder="Type the link"
          />
          <button onClick={handleAddLink}>Add Link</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : favorites.length > 0 ? (
          <ul className={styles.favoritesList}>
            {favorites.map((fav, index) => (
              <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {editIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => handleEditLink(fav, editValue)}>Save</button>
                    <button onClick={() => setEditIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <Link
                      href={fav}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#000', textDecoration: 'underline', flex: 1 }}
                    >
                      {fav}
                    </Link>

                    <div className={styles.buttonsContainer}>
                      <button onClick={() => { setEditIndex(index); setEditValue(fav) }}>
                        <Image src={'/editIcon.png'} alt='Edit Icon' width={27} height={27} />
                      </button>

                      <button onClick={() => handleDeleteLink(fav)}>
                        <Image src={'/deleteTaskIcon.svg'} alt='Delete Icon' width={27} height={27} />
                      </button>

                      <button onClick={() => handleShare(fav)}>
                        <Image src={'/shareIcon.svg'} alt='Share Icon' width={27} height={27} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{marginTop: '20px'}}>No favorite link found.</p>
        )}
      </div>
    </div>
  )
}
