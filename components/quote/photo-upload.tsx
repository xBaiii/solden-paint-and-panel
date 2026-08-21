"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadPhoto } from "@/lib/leads";

const MAX_FILES = 10;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

type Item = {
  /** Local id so React keys stay stable across upload state changes. */
  key: string;
  name: string;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  storageId?: string;
  error?: string;
};

/**
 * Uploads photos to the Convex HTTP endpoint as soon as they're chosen, so the
 * storage ids are already in hand by the time the wizard is submitted. Files
 * that are never attached to a lead are swept by the daily cron.
 */
export function PhotoUpload({
  storageIds,
  onChange,
}: {
  storageIds: string[];
  onChange: (next: string[]) => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncIds = useCallback(
    (next: Item[]) => {
      onChange(
        next
          .filter((item) => item.status === "done" && item.storageId !== undefined)
          .map((item) => item.storageId as string),
      );
    },
    [onChange],
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const room = MAX_FILES - items.length;
      // Pair each row with its own File up front. Matching back by filename
      // later would pick the wrong file whenever two have the same name.
      const pairs: { item: Item; file: File }[] = [];

      for (const file of incoming.slice(0, Math.max(0, room))) {
        const key = `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`;
        if (!ACCEPTED.includes(file.type)) {
          pairs.push({
            file,
            item: {
              key,
              name: file.name,
              previewUrl: "",
              status: "error",
              error: "Only JPEG, PNG, WebP or HEIC images.",
            },
          });
          continue;
        }
        if (file.size > MAX_BYTES) {
          pairs.push({
            file,
            item: {
              key,
              name: file.name,
              previewUrl: "",
              status: "error",
              error: "Larger than 10MB.",
            },
          });
          continue;
        }
        pairs.push({
          file,
          item: {
            key,
            name: file.name,
            previewUrl: URL.createObjectURL(file),
            status: "uploading",
          },
        });
      }

      if (pairs.length === 0) return;
      setItems((current) => [...current, ...pairs.map((pair) => pair.item)]);

      // Upload the valid ones, updating each row as it lands.
      await Promise.all(
        pairs
          .filter((pair) => pair.item.status === "uploading")
          .map(async ({ item, file }) => {
            try {
              const { storageId } = await uploadPhoto(file);
              setItems((current) => {
                const next = current.map((row) =>
                  row.key === item.key
                    ? { ...row, status: "done" as const, storageId }
                    : row,
                );
                syncIds(next);
                return next;
              });
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Upload failed.";
              setItems((current) =>
                current.map((row) =>
                  row.key === item.key
                    ? { ...row, status: "error" as const, error: message }
                    : row,
                ),
              );
            }
          }),
      );
    },
    [items.length, syncIds],
  );

  const remove = (key: string) => {
    setItems((current) => {
      const target = current.find((item) => item.key === key);
      if (target !== undefined && target.previewUrl.length > 0) {
        URL.revokeObjectURL(target.previewUrl);
      }
      const next = current.filter((item) => item.key !== key);
      syncIds(next);
      return next;
    });
  };

  const uploading = items.some((item) => item.status === "uploading");
  const full = items.length >= MAX_FILES;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragging
            ? "border-brand-600 bg-brand-50"
            : "border-black/15 bg-surface-2",
          full && "opacity-60",
        )}
      >
        <div className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-background">
          <ImagePlus className="size-5 text-brand-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          Drag photos here, or
          <button
            type="button"
            disabled={full}
            onClick={() => inputRef.current?.click()}
            className="ml-1 text-brand-700 underline underline-offset-2 disabled:no-underline"
          >
            browse your device
          </button>
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Up to {MAX_FILES} photos, 10MB each. JPEG, PNG, WebP or HEIC.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          A wide shot of the whole panel plus a close-up of the damage is ideal.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files !== null) void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.key}
              className="group relative overflow-hidden rounded-xl border border-black/10 bg-card"
            >
              <div className="relative aspect-4/3 bg-surface-2">
                {item.previewUrl.length > 0 ? (
                  // Local blob preview — next/image can't optimise object URLs.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <AlertCircle className="size-6 text-destructive" />
                  </div>
                )}

                {item.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50">
                    <Loader2 className="size-5 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 p-2">
                <span
                  className={cn(
                    "truncate text-xs",
                    item.status === "error"
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {item.status === "error" ? item.error : item.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(item.key)}
                  aria-label={`Remove ${item.name}`}
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Uploading — you can keep filling in the form.
        </p>
      )}

      {storageIds.length > 0 && !uploading && (
        <p className="text-xs font-medium text-brand-700">
          {storageIds.length} photo{storageIds.length === 1 ? "" : "s"} ready to send.
        </p>
      )}
    </div>
  );
}
