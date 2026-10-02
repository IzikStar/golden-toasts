import { styles } from './styles.const';

export const AnimationDots = () => {
  return (
    <div className={styles.animationDots.wrapper}>
      {[...Array(100)].map((_, dotIndex) => (
        <div
          key={dotIndex}
          className={styles.animationDots.dot}
          style={{
            left: `${50 * Math.random() + dotIndex * Math.random()}%`,
            top: `${50 * Math.random() + dotIndex * Math.random()}%`,
            animationDelay: `${dotIndex * Math.random() * 0.2}s`,
            animationDuration: '2.5s',
          }}
        />
      ))}
    </div>
  );
};
