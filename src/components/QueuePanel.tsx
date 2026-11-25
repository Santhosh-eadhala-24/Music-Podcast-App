"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import type { Track } from "@/lib/types";
import { usePlayer } from "@/store/player";

function QueueRow({ track, index, current }: { track: Track; index: number; current: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id });
  const { playIndex, removeFromQueue } = usePlayer.getState();

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1 rounded-lg ${current ? "bg-white/10" : ""} ${
        isDragging ? "relative z-10 bg-neutral-800 shadow-lg" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`Drag to reorder ${track.title}`}
        className="flex size-9 shrink-0 cursor-grab touch-none items-center justify-center text-white/40 hover:text-white active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <button
        type="button"
        onClick={() => playIndex(index)}
        aria-current={current}
        className="flex min-w-0 flex-1 items-center gap-3 py-1.5 text-left"
      >
        <Image src={track.cover} alt="" width={40} height={40} className="size-10 shrink-0 rounded object-cover" />
        <span className="min-w-0">
          <span className={`block truncate text-sm font-medium ${current ? "text-emerald-400" : ""}`}>
            {track.title}
          </span>
          <span className="block truncate text-xs text-white/60">{track.artist}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => removeFromQueue(index)}
        aria-label={`Remove ${track.title} from queue`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>
    </li>
  );
}

export function QueuePanel({ onClose }: { onClose: () => void }) {
  const queue = usePlayer((s) => s.queue);
  const currentIndex = usePlayer((s) => s.currentIndex);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = queue.findIndex((t) => t.id === active.id);
    const to = queue.findIndex((t) => t.id === over.id);
    usePlayer.getState().moveInQueue(from, to);
  }

  return (
    <div
      role="dialog"
      aria-label="Queue"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-white/10 bg-neutral-950 pb-36 text-white shadow-2xl"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">Queue</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close queue"
          className="flex size-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>
      {queue.length === 0 ? (
        <p className="px-4 text-sm text-white/60">Nothing in the queue. Play a song or use &quot;Add to queue&quot;.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={queue.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <ul>
                {queue.map((track, i) => (
                  <QueueRow key={track.id} track={track} index={i} current={i === currentIndex} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}