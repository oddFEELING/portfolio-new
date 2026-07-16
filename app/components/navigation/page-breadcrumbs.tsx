import { Link } from "react-router";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[];
  suffix?: string;
  className?: string;
};

/** Path-style crumbs: ancestors link, current segment is plain text. */
export function PageBreadcrumbs({
  items,
  suffix,
  className,
}: PageBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ??
        "font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]"
      }
    >
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li className="flex items-center gap-x-2" key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  className="text-foreground/80 underline-offset-4 transition-colors hover:text-[#FF9800] hover:underline"
                  to={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
        {suffix ? (
          <li className="text-muted-foreground/80">{suffix}</li>
        ) : null}
      </ol>
    </nav>
  );
}
