import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { styles } from './styles.const';
import { AnimationDots } from '../animation-dots';

export const Welcome = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignup = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <div className={styles.background.wrapper}>
        <div className={styles.background.lightTopLeft} />
        <div
          className={styles.background.mediumTopRight}
          style={{ animationDelay: '1s' }}
        />
        <div
          className={styles.background.subtleBottomLeft}
          style={{ animationDelay: '2s' }}
        />
        <div
          className={styles.background.lightBottomRight}
          style={{ animationDelay: '0.5s' }}
        />
      </div>
      <AnimationDots />
      <div className={styles.content.wrapper}>
        <div className={styles.heroText.container(isLoaded)}>
          <h1 className={styles.heroText.title}>
            <span
              className={styles.shared.emojiPulse}
              role="img"
              aria-label="toast-icon"
            >
              🍻
            </span>
            <span className={styles.heroText.gradientSpan}>
              ברוכים הבאים לאתר השתיות המדורי
            </span>
            <span
              className={styles.shared.emojiPulse}
              role="img"
              aria-label="toast-icon"
            >
              🍻
            </span>
          </h1>
          <h2 className={styles.heroText.subtitle}>
            כאן אפשר לקבוע שתיות, להזמין אנשים ולרדת על הפושעים והנוכלים הנאלחים
            שלנו
          </h2>
        </div>
        <div className={styles.card.container(isLoaded)}>
          <div className={styles.card.box}>
            <div className="mb-6">
              <div className={styles.card.iconWrapper}>
                <span className="text-4xl" role="img" aria-label="lock-icon">
                  🔐
                </span>
              </div>
            </div>
            <h2 className={styles.card.title}>עליך להתחבר כדי להמשיך</h2>
            <Button onClick={goToLogin} className={styles.card.button.base}>
              <div className={styles.card.button.shine}></div>
              <span className={styles.card.button.content}>
                <span>התחברות</span>
                <span className={styles.card.button.icon}>
                  <ArrowLeftIcon />
                </span>
              </span>
            </Button>
            <Button onClick={goToSignup} className={styles.card.button.base}>
              <div className={styles.card.button.shine}></div>
              <span className={styles.card.button.content}>
                <span>הרשמה</span>
                <span className={styles.card.button.icon}>
                  <ArrowLeftIcon />
                </span>
              </span>
            </Button>
          </div>
        </div>
        <div className={styles.footer.text(isLoaded)}>
          <span role="img" aria-label="confetti-icon">
            🎉
          </span>
          {' בואו נתחיל לחגוג! '}
          <span role="img" aria-label="confetti-icon">
            🎉
          </span>
        </div>
      </div>
    </div>
  );
};
