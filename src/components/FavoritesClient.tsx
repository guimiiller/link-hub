'use client'

import { useEffect, useState, useMemo } from 'react'
import { getSession, signOut } from 'next-auth/react'
import styles from '../styles/Favorite.module.css'
import Link from 'next/link'
import Image from 'next/image'

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<{ link: string; category: string }[]>([])
  const [newLink, setNewLink] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState<string>('')

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editLink, setEditLink] = useState<string>('')
  const [editCategory, setEditCategory] = useState<string>('')

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/get-favorites')
      const data = await res.json()

      setFavorites(
        (data.favorites || []).map((fav: any) =>
          typeof fav === 'string' ? { link: fav, category: 'Sem categoria' } : fav
        )
      )
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserName = async () => {
    const session = await getSession()
    if (session?.user?.name) setUserName(session.user.name)
  }

  useEffect(() => {
    fetchFavorites()
    fetchUserName()
  }, [])

  const handleDeleteLink = async (linkToDelete: string) => {
    const res = await fetch('/api/delete-favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: linkToDelete }),
    })

    if (res.ok) {
      const data = await res.json()
      setFavorites(data.favorites)
    } else {
      console.error('Erro ao deletar link')
    }
  }

  const handleAddLink = async () => {
    if (!newLink || !newCategory) return

    try {
      const res = await fetch('/api/add-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: newLink, category: newCategory }),
      })

      if (res.ok) {
        setNewLink('')
        setNewCategory('')
        fetchFavorites()
      } else {
        const errorData = await res.json()
        console.error('Erro ao adicionar link:', errorData)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    }
  }

  const handleEditLink = async (oldLink: string) => {
    try {
      const res = await fetch('/api/edit-favorite', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldLink, newLink: editLink, newCategory: editCategory }),
      })

      if (res.ok) {
        setEditIndex(null)
        setEditLink('')
        setEditCategory('')
        fetchFavorites()
      } else {
        const errorData = await res.json()
        console.error('Erro ao editar link:', errorData)
      }
    } catch (error) {
      console.error('Erro na edição:', error)
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

  const categories = useMemo(
    () => ['Todos', ...new Set(favorites.map((fav) => fav.category))],
    [favorites]
  )

  const filteredFavorites = favorites.filter(
    (fav) => selectedCategory === 'Todos' || fav.category === selectedCategory
  )

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
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Type the category"
          />
          <button onClick={handleAddLink}>Add Link</button>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label htmlFor="categoryFilter">Filtrar por categoria: </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredFavorites.length > 0 ? (
          <ul className={styles.favoritesList}>
            {filteredFavorites.map((fav, index) => (
              <li key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                {editIndex === index ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <input
                      type="text"
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      placeholder="Novo link"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="Nova categoria"
                    />
                    <button onClick={() => handleEditLink(fav.link)}>Salvar</button>
                    <button onClick={() => setEditIndex(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link href={fav.link || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#000' }}>
                      {fav.link}
                    </Link>
                    <span style={{ fontSize: '0.9rem', color: 'gray' }}>Categoria: {fav.category}</span>
                    <div className={styles.buttonsContainer}>
                      <button onClick={() => handleDeleteLink(fav.link)}>
                        <Image src={'/deleteTaskIcon.svg'} alt='Delete Icon' width={27} height={27} />
                      </button>
                      <button onClick={() => handleShare(fav.link)}>
                        <Image src={'/shareIcon.svg'} alt='Share Icon' width={27} height={27} />
                      </button>
                      <button
                        onClick={() => {
                          setEditIndex(index)
                          setEditLink(fav.link)
                          setEditCategory(fav.category)
                        }}
                      >
                        <Image src={'/editIcon.png'} alt='Edit Icon' width={27} height={27}/>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ marginTop: '20px' }}>No favorite link found.</p>
        )}
      </div>
    </div>
  )
}
