import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const getHashTargetId = (hash: string) => {
  const targetId = hash.replace(/^#/, '');

  try {
    return decodeURIComponent(targetId);
  } catch {
    return targetId;
  }
};

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const frameId = window.requestAnimationFrame(() => {
        const target = document.getElementById(getHashTargetId(hash));

        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
