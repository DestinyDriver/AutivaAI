"use client";

import * as React from "react";
// "use client";
import { useEffect, useState } from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  ScanFace,
  Home,
  HeartHandshake,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "DestinyDriver",
      github: "DestinyDriver",
    },
    {
      name: "Adi13apr",
      github: "adi13apr",
    },
    {
      name: "Sauraviiitk",
      github: "sauraviiitk",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },

    {
      title: "Screening",
      url: "#",
      icon: ScanFace,
      isActive: true,
      items: [
        {
          title: "Start Assessment",
          url: "/dashboard/screening",
        },
        {
          title: "My Reports",
          url: "/dashboard/reports",
        },
        {
          title: "Tips & Advice",
          url: "/dashboard/tips",
        },
      ],
    },
    {
      title: "Therapy",
      url: "#",
      icon: HeartHandshake,
      items: [
        {
          title: "Games",
          url: "/dashboard/games",
        },
        {
          title: "Parent Modules",
          url: "/dashboard/parent-modules",
        },
       
      ],
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("autiva-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
