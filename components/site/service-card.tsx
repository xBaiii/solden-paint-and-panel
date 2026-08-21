import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";

export function ServiceCard({
  service,
  priority = false,
}: {
  service: Service;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-3 text-lg font-semibold tracking-tight text-foreground">
          {service.name}
          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {service.excerpt}
        </p>
      </div>
    </Link>
  );
}
