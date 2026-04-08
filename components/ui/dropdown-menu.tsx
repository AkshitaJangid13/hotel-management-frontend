// components/common/DropdownMenu.tsx
"use client";

import { useRef, useState, useEffect } from "react";

type MenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  dividerAfter?: boolean;
};

type Props = {
  items: MenuItem[];
  trigger?: React.ReactNode;
};

export default function DropdownMenu({ items, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
      >
        {trigger ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        )}
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute right-0 top-9 z-50 min-w-40 rounded-md border border-gray-200 bg-white shadow-lg py-1">
          {items.map((item, index) => (
            <div key={index}>
              <button
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  item.className ?? "text-gray-700"
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
              {item.dividerAfter && <hr className="my-1 border-gray-100" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}