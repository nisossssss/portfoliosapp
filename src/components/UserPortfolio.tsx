import { useEffect, useState } from 'react';
import lauraImage from '../assets/images/laura.png';
import marioImage from '../assets/images/mario.png';
import { API_CONFIG } from '../config/api';
import { useTheme } from '../contexts/ThemeContext';
import FloatingCard from './FloatingCard';
import './Hero.css';
import './Resume.css';
import './UserPortfolio.css';

interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
}

interface Blog {
  id: number;
  title: string;
  description: string;
  author: string;
  authorId: number;
  postCount: number;
  createdAt: string;
}

interface UserPortfolioProps {
  userId: number;
  onBack: () => void;
  onSelectBlog: (blogId: string) => void;
}

export default function UserPortfolio({ userId, onBack, onSelectBlog }: UserPortfolioProps) {
  const [user, setUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    fetchUserData();
    fetchUserBlogs();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BLOGS}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filtra solo i blog dell'utente selezionato usando authorId
        const userBlogs = data.filter((blog: Blog) => blog.authorId === userId);
        setBlogs(userBlogs);
      } else {
        setError('Errore nel caricamento dei blog');
      }
    } catch (err) {
      setError('Errore di connessione');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="user-portfolio-container"><p>Caricamento...</p></div>;
  }

  if (error) {
    return (
      <div className="user-portfolio-container">
        <button onClick={onBack} className="back-button">← Torna ai Portfolio</button>
        <p className="error">{error}</p>
      </div>
    );
  }

  const getUserImage = () => {
    const name = user?.name?.toLowerCase() || '';
    const email = user?.email?.toLowerCase() || '';

    if (name.includes('laura') || email.includes('laura')) {
      return lauraImage;
    }

    if (name.includes('mario') || email.includes('mario')) {
      return marioImage;
    }

    return lauraImage;
  };

  return (
    <div className="user-portfolio-page">
      <button onClick={onBack} className="back-button-portfolio">← Torna ai Portfolio</button>
      
      {/* Hero Section - Original Design */}
      <section className="hero-section" id='about-me'>
        <div className="hero-content">
          <h1 style={{color: colors.darkTextColor}}>
            Ciao,<br />I'm {user?.name || 'User'}
          </h1>
          <p style={{color: colors.darkTextColor}}>
            {user?.bio || 'Benvenuto nel mio portfolio!'}
          </p>
          <div className="link-content" style={{backgroundColor: colors.accentColor, color: colors.lightTextColor}}>
            <a href={`mailto:${user?.email}`}>{user?.email}</a>
          </div>
        </div>
        
        <FloatingCard
          imageSrc={getUserImage()}
          imageAlt={user?.name || 'Profile'}
          contactTitle="Contact"
          contactText={user?.email ? `Madrid - ${user.email}` : 'Madrid - contact'}
        />
      </section>

      {/* Resume Section - Original Design */}
      <section id="resume" className="resume-section" style={{ backgroundColor: colors.accentColor }}>
        <div className="resume-container">
          <div className="resume-column">
            <h2 style={{ color: colors.lightTextColor }}>Education</h2>
            <div className="resume-item">
              <span className="resume-icon" style={{ color: colors.lightTextColor }}>✦</span>
              <div>
                <h3 style={{ color: colors.lightTextColor }}>2022-2023</h3>
                <p style={{ color: colors.lightTextColor }}>Villa Claretta, L'incubo</p>
              </div>
            </div>
            <div className="resume-item">
              <span className="resume-icon" style={{ color: colors.lightTextColor }}>✦</span>
              <div>
                <h3 style={{ color: colors.lightTextColor }}>2021-2022</h3>
                <p style={{ color: colors.lightTextColor }}>Università di Madrid, Il Sogno</p>
              </div>
            </div>
            <div className="resume-item">
              <span className="resume-icon" style={{ color: colors.lightTextColor }}>✦</span>
              <div>
                <h3 style={{ color: colors.lightTextColor }}>2017-2020</h3>
                <p style={{ color: colors.lightTextColor }}>Medie con Anna Pepe, Wow!</p>
              </div>
            </div>
          </div>

          <div className="resume-column">
            <div className="experience-box" style={{ backgroundColor: colors.darkTextColor, color: colors.lightTextColor }}>
              <h2>Experience</h2>
              <p>Sono indubbiamente la migliore dovete assumermi anche perché voglio guadagnare tanti di quei soldi che nemmeno avete idea. Non vi basteranno i fondi aziendali per pagare il giusto valore che valgo. Buona fortuna ad assumermi</p>
            </div>
          </div>

          <div className="resume-column">
            <h2 style={{ color: colors.lightTextColor }}>Languages</h2>
            <div className="languages-grid">
              <div className="language-item">
                <h3 style={{ color: colors.lightTextColor }}>Italian</h3>
                <p style={{ color: colors.lightTextColor }}>Native</p>
              </div>
              <div className="language-item">
                <h3 style={{ color: colors.lightTextColor }}>English</h3>
                <p style={{ color: colors.lightTextColor }}>Fluent</p>
              </div>
              <div className="language-item">
                <h3 style={{ color: colors.lightTextColor }}>Spanish</h3>
                <p style={{ color: colors.lightTextColor }}>Intermediate</p>
              </div>
              <div className="language-item">
                <h3 style={{ color: colors.lightTextColor }}>French</h3>
                <p style={{ color: colors.lightTextColor }}>Beginner</p>
              </div>
            </div>

            <h2 style={{ color: colors.lightTextColor, marginTop: '2rem' }}>Interests</h2>
            <div className="interests-grid">
              <span style={{ color: colors.lightTextColor }}>Snowboard</span>
              <span style={{ color: colors.lightTextColor }}>Dance</span>
              <span style={{ color: colors.lightTextColor }}>Skate</span>
              <span style={{ color: colors.lightTextColor }}>Music</span>
            </div>
          </div>
        </div>
      </section>

      {/* My Blog Section */}
      <section className="my-blog-section">
        <div className="blog-header">
          <h1 className="blog-main-title" style={{ color: colors.darkTextColor }}>My Blog</h1>
          <p className="blog-subtitle" style={{ color: colors.darkTextColor }}>
            Just me and my thoughts <span style={{ color: colors.accentColor }}>🌸</span>
          </p>
        </div>
        
        {blogs.length === 0 ? (
          <p className="no-content" style={{ color: colors.darkTextColor }}>
            Questo utente non ha ancora creato blog.
          </p>
        ) : (
          <div className="blog-cards-container">
            {blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="blog-post-card"
                onClick={() => onSelectBlog(String(blog.id))}
              >
                <h3 className="blog-card-title" style={{ color: colors.accentColor }}>
                  "{blog.title}"
                </h3>
                <p className="blog-card-description" style={{ color: colors.darkTextColor }}>
                  {blog.description}
                </p>
                <div className="blog-card-tags">
                  <span className="blog-tag" style={{ backgroundColor: colors.accentColor, color: colors.lightTextColor }}>
                    {blog.postCount} posts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
