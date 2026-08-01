import { useEffect, useRef, type ComponentType, type CSSProperties, type PointerEvent } from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";

import useDashboardLayoutStore, { DEFAULT_HEIGHT } from "@/store/dashboard-layout";
import { cn } from "@/lib/utils";

const GRID_GAP_PX = 16;

export type DragHandleProps = {
  dragHandle?: React.ReactNode;
};

type CardDef = {
  id: string;
  Component: ComponentType<DragHandleProps>;
};

type Props = {
  cards: CardDef[];
  defaultWidth?: number;
  defaultHeight?: number;
};

function DashboardGrid({ cards, defaultWidth = 6, defaultHeight = DEFAULT_HEIGHT }: Props) {
  const items = useDashboardLayoutStore(s => s.items);
  const init = useDashboardLayoutStore(s => s.init);
  const setItems = useDashboardLayoutStore(s => s.setItems);

  useEffect(() => {
    init(cards.map(c => ({ id: c.id, width: defaultWidth, height: defaultHeight })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    if (event.canceled) return;
    setItems(move(items, event));
  }

  if (!items.length) return null;

  const componentById = Object.fromEntries(cards.map(c => [c.id, c.Component]));

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
        {items.map((item, index) => (
          <GridItem
            key={item.id}
            id={item.id}
            index={index}
            width={item.width}
            height={item.height ?? defaultHeight}
            Component={componentById[item.id]}
          />
        ))}
      </div>
    </DragDropProvider>
  )
}

type GridItemProps = {
  id: string;
  index: number;
  width: number;
  height: number;
  Component: ComponentType<DragHandleProps>;
};

function GridItem({ id, index, width, height, Component }: GridItemProps) {
  const resize = useDashboardLayoutStore(s => s.resize);
  const resizeHeight = useDashboardLayoutStore(s => s.resizeHeight);
  const elRef = useRef<HTMLDivElement | null>(null);
  const widthDrag = useRef<{ startX: number; startWidth: number; colPx: number } | null>(null);
  const heightDrag = useRef<{ startY: number; startHeight: number } | null>(null);

  const { ref, handleRef, isDragging } = useSortable({ id, index });

  function handleWidthResizeStart(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    const rect = elRef.current?.getBoundingClientRect();
    if (!rect) return;

    const colPx = (rect.width - (width - 1) * GRID_GAP_PX) / width;
    widthDrag.current = { startX: e.clientX, startWidth: width, colPx };

    const handleMove = (ev: globalThis.PointerEvent) => {
      if (!widthDrag.current) return;
      const deltaCols = Math.round((ev.clientX - widthDrag.current.startX) / widthDrag.current.colPx);
      resize(id, widthDrag.current.startWidth + deltaCols);
    };

    const handleUp = () => {
      widthDrag.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  function handleHeightResizeStart(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    heightDrag.current = { startY: e.clientY, startHeight: height };

    const handleMove = (ev: globalThis.PointerEvent) => {
      if (!heightDrag.current) return;
      const deltaY = ev.clientY - heightDrag.current.startY;
      resizeHeight(id, heightDrag.current.startHeight + deltaY);
    };

    const handleUp = () => {
      heightDrag.current = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  const dragHandle = (
    <button
      type="button"
      ref={handleRef}
      className="flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
      aria-label="Drag to reorder card"
    >
      <GripVertical className="size-4" />
    </button>
  )

  return (
    <div
      ref={node => {
        ref(node);
        elRef.current = node;
      }}
      style={{ "--col-span": width, height } as CSSProperties}
      className={cn(
        "group/grid-item relative bg-background lg:[grid-column:span_var(--col-span)]",
        isDragging && "z-10 rounded-xl shadow-xl",
      )}
    >
      <Component dragHandle={dragHandle} />

      <div
        onPointerDown={handleWidthResizeStart}
        className="absolute right-0 top-1/2 z-10 hidden h-12 w-1.5 -translate-y-1/2 cursor-col-resize rounded-full bg-border opacity-0 transition-opacity hover:bg-primary group-hover/grid-item:opacity-100 lg:block"
        aria-label="Drag to resize card width"
      />

      <div
        onPointerDown={handleHeightResizeStart}
        className="absolute bottom-0 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 cursor-row-resize rounded-full bg-border opacity-0 transition-opacity hover:bg-primary group-hover/grid-item:opacity-100"
        aria-label="Drag to resize card height"
      />
    </div>
  )
}

export default DashboardGrid
