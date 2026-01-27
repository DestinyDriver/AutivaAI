"use client";

import * as React from "react";
import {
  BrainCircuit,
  ChevronsUpDown,
  Github,
  Link,
  Plus,
  Star,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <BrainCircuit className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">AutivaAI</span>
                <i className="truncate text-xs">~By Innovators Here</i>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Members
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <a
                href={`https://www.github.com/${team.github}`}
                key={team.name}
                target="_blank"
                rel="noreferrer"
              >
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Github className="size-3.5 shrink-0" />
                  </div>

                  {team.name}

                  {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </a>
            ))}
            <DropdownMenuSeparator />
            <a
              href="https://www.github.com/DestinyDriver/AutivaAI"
              target="_blank"
              rel="noreferrer"
            >
              <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Star className="size-4 text-yellow-400" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Star on Github
                </div>
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
