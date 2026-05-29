import type { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  sideContent?: ReactNode;
  className?: string;
}

const PageHero = ({ title, description, actions, sideContent, className }: PageHeroProps) => {
  const hasAside = Boolean(actions || sideContent);
  const heroClassName = [
    'cinema-page-hero',
    'page-hero',
    hasAside ? 'page-hero--with-aside' : 'page-hero--solo',
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={heroClassName}>
      <div className="container">
        <div className="page-hero__inner">
          <div className="page-hero__copy">
            <h1 className="page-hero__title">{title}</h1>
            {description ? <p className="page-hero__description">{description}</p> : null}
          </div>
          {hasAside ? (
            <div className="page-hero__aside">
              {actions ? <div className="page-hero__actions">{actions}</div> : null}
              {sideContent}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
