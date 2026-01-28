import Link from "next/link";

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export function NavigationCard({
  title,
  description,
  href,
  icon,
}: NavigationCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-4 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h2 className="mb-2 text-lg font-semibold group-hover:text-blue-600 transition-colors">
            {title}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none ml-1">
              →
            </span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
