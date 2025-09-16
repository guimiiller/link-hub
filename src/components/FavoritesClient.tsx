'use client';

import { useEffect, useState, useMemo } from 'react';
import { getSession, signOut } from 'next-auth/react';
import styles from '../styles/Favorite.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Avatares pré-definidos
const avatars = [
  '/avatars/iconVader.jpg',
  '/avatars/iconMando.jpg',
  '/avatars/iconYoda.jpg',
  '/avatars/iconGrogu.jpg',
  '/avatars/iconStorm.jpg',
  '/avatars/iconAhsoka.jpg',
];

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<{ link: string; category: string }[]>([]);
  const [newLink, setNewLink] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('/avatars/mickey.png');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLink, setEditLink] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // ---- Fetch favoritos ----
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/get-favorites');
      const data = await res.json();
      setFavorites(
        (data.favorites || []).map((fav: any) =>
          typeof fav === 'string' ? { link: fav, category: 'Sem categoria' } : fav
        )
      );
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---- Busca dados do usuário (nome + avatar) ----
  const fetchUserData = async () => {
    const session = await getSession();
    if (session?.user?.name) setUserName(session.user.name);

    try {
      const res = await fetch('/api/user/avatar');
      if (res.ok) {
        const data = await res.json();
        if (data.avatar) setAvatar(data.avatar);
      }
    } catch (err) {
      console.error('Erro ao carregar avatar:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchUserData();
  }, []);

  // ---- Atualiza avatar no banco ----
  const handleAvatarChange = async (newAvatar: string) => {
    try {
      const res = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: newAvatar }),
      });

      if (res.ok) {
        setAvatar(newAvatar);
        setShowAvatarModal(false);
      } else {
        console.error('Erro ao atualizar avatar');
      }
    } catch (error) {
      console.error('Erro na atualização de avatar:', error);
    }
  };

  // ---- Adicionar favorito ----
  const handleAddLink = async () => {
    if (!newLink || !newCategory) return;

    try {
      const res = await fetch('/api/add-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: newLink, category: newCategory }),
      });

      if (res.ok) {
        setNewLink('');
        setNewCategory('');
        fetchFavorites();
      } else {
        const errorData = await res.json();
        console.error('Erro ao adicionar link:', errorData);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  // ---- Editar favorito ----
  const handleEditLink = async (oldLink: string) => {
    try {
      const res = await fetch('/api/edit-favorite', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldLink, newLink: editLink, newCategory: editCategory }),
      });

      if (res.ok) {
        setEditIndex(null);
        setEditLink('');
        setEditCategory('');
        fetchFavorites();
      } else {
        const errorData = await res.json();
        console.error('Erro ao editar link:', errorData);
      }
    } catch (error) {
      console.error('Erro na edição:', error);
    }
  };

  // ---- Deletar favorito ----
  const handleDeleteLink = async (linkToDelete: string) => {
    try {
      const res = await fetch('/api/delete-favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: linkToDelete }),
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites);
      } else {
        console.error('Erro ao deletar link');
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error);
    }
  };

  // ---- Compartilhar favorito ----
  const handleShare = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Link Favorito', url: link });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência.');
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    }
  };

  // ---- Filtro por categorias ----
  const categories = useMemo(
    () => ['Todos', ...new Set(favorites.map((fav) => fav.category))],
    [favorites]
  );

  const filteredFavorites = favorites.filter(
    (fav) => selectedCategory === 'Todos' || fav.category === selectedCategory
  );

  return (
    <div className={styles.container}>
      {/* Logo */}
      <Image src={'/logo.svg'} alt='Logo LinkHub' width={150} height={30} className={styles.logoFavorites} />

      {/* Avatar */}
      <div
        className={styles.avatarContainer}
        onClick={() => setShowAvatarModal(true)}
        style={{ position: 'absolute', right: '20px', top: '12px', cursor: 'pointer' }}
      >
        <Image
          src={avatar}
          alt='Avatar'
          width={47}
          height={47}
          style={{ borderRadius: '100%', border: '2px solid #000', objectFit: 'cover' }}
        />
      </div>

      {/* Modal de escolha de avatar */}
      <AnimatePresence>
        {showAvatarModal && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                zIndex: 999,
              }}
              onClick={() => setShowAvatarModal(false)}
            />
            <motion.div
              className={styles.avatarModalContent}
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '12px',
                zIndex: 1000,
                width: '300px',
                textAlign: 'center',
              }}
            >
              <h3>Choose your Avatar</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '15px' }}>
                {avatars.map((item, index) => (
                  <Image
                    key={index}
                    src={item}
                    alt={`Avatar ${index}`}
                    width={60}
                    height={60}
                    style={{
                      borderRadius: '100%',
                      border: avatar === item ? '3px solid #000' : '2px solid #ccc',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleAvatarChange(item)}
                  />
                ))}
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                style={{
                  marginTop: '15px',
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Close
              </button>
                      
              {/* Logout */}
              <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logoutButton}>
                <Image src={'/signOut.png'} alt='Sign Out Icon' width={30} height={30} />
              </button>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={styles.header}>
        <h1>Hello {userName || 'usuário'}</h1>
      </div>

      {/* Conteúdo principal */}
      <div className={styles.containerContent}>
        {/* Formulário de adição */}
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

        {/* Filtro */}
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <label htmlFor="categoryFilter">Filter by category: </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectFilter}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de favoritos */}
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
                      placeholder="New link"
                    />
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      placeholder="New category"
                    />
                    <button onClick={() => handleEditLink(fav.link)}>Save</button>
                    <button onClick={() => setEditIndex(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className={styles.linkBox}>
                    <Link href={fav.link || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#000', fontSize: '17px' }}>
                      {fav.link}
                    </Link>
                    <span style={{ fontSize: '0.9rem', color: 'gray' }}>Category: {fav.category}</span>
                    <div className={styles.buttonsContainer}>
                      <button onClick={() => handleDeleteLink(fav.link)}>
                        <Image src={'/deleteTaskIcon.svg'} alt='Delete Icon' width={27} height={27} />
                      </button>
                      <button onClick={() => handleShare(fav.link)}>
                        <Image src={'/shareIcon.svg'} alt='Share Icon' width={27} height={27} />
                      </button>
                      <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditLink(fav.link);
                          setEditCategory(fav.category);
                        }}
                      >
                        <Image src={'/editIcon.png'} alt='Edit Icon' width={27} height={27} />
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
  );
}
