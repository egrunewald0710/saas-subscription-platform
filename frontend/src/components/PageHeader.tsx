import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <section className="page-heading">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot" />{eyebrow}</div>
        <h1>{title}<span className="title-period">.</span></h1>
        <p>{description}</p>
      </div>
      {action && <div className="page-heading-action">{action}</div>}
    </section>
  );
}
