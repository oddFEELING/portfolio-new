"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { IconMessage } from "@tabler/icons-react";
import * as React from "react";
import { useEffect } from "react";
import type { SidebarData } from "./types";

interface NavHeaderProps {
  data: SidebarData;
}

export function NavHeader({ data }: NavHeaderProps) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <SidebarHeader className="border-border/40 border-b p-0">
        <button
          className="group/cmd flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors hover:bg-[#FF9800]/[0.05]"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className="flex items-center gap-2 font-mono text-[0.65rem] text-muted-foreground uppercase tracking-[0.3em] transition-colors group-hover/cmd:text-[#FF9800]">
            <IconMessage size={14} stroke={1.5} />
            BEA
          </span>
          <span className="flex items-center justify-center border border-border/60 px-1.5 py-0.5 transition-colors group-hover/cmd:border-[#FF9800]/40">
            <kbd className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-wider transition-colors group-hover/cmd:text-[#FF9800]">
              ⌘K
            </kbd>
          </span>
        </button>
      </SidebarHeader>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Search everything..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {data.navMain.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Favorites">
            {data.navCollapsible.favorites.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <div className={cn("mr-2 h-3 w-3 rounded-full", item.color)} />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Teams">
            {data.navCollapsible.teams.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator className="my-2" />
          <CommandGroup heading="Topics">
            {data.navCollapsible.topics.map((item) => (
              <CommandItem
                className="py-2!"
                key={item.id}
                onSelect={() => {
                  setOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
