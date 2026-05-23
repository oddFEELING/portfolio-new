import {
  IconAd2,
  IconApiApp,
  IconBellRinging,
  IconCalendar,
  IconCalendarStats,
  IconClipboardText,
  IconListDetails,
  IconNews,
  IconNotebook,
  IconPencilMinus,
  IconProgressCheck,
  IconSettingsCode,
  IconSofa,
  IconSpy,
} from "@tabler/icons-react";
import { LayoutDashboard, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { NavHeader } from "./sidebar.header";
import type { SidebarData } from "./types";

const AppSidebar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const checkActive = (path: string) => pathname === path;

  return (
    <Sidebar variant="inset">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <NavHeader data={data} />

      {/* ~ =================================== ~ */}
      {/* -- Content -- */}
      {/* ~ =================================== ~ */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/")}
                onClick={() => navigate("/")}
                size="md"
              >
                <IconSofa size={20} stroke={1.5} />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/experience")}
                onClick={() => navigate("/experience")}
                size="md"
              >
                <IconClipboardText size={20} stroke={1.5} />
                <span>Experience</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={checkActive("/projects")}
                onClick={() => navigate("/projects")}
                size="md"
              >
                <IconApiApp size={20} stroke={1.5} />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={checkActive("/blog")}
                  onClick={() => navigate("/blog")}
                >
                  <IconPencilMinus size={20} stroke={1.5} />
                  <span>Blog</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={checkActive("/open-source")}
                  onClick={() => navigate("/open-source")}
                >
                  <IconSpy size={20} stroke={1.5} />
                  <span>Open Source</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;

const data: SidebarData = {
  user: {
    name: "ephraim",
    email: "ephraim@blocks.so",
    avatar: "/avatar-01.png",
  },
  navMain: [
    {
      id: "overview",
      title: "Overview",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      id: "tasks",
      title: "Tasks",
      url: "#",
      icon: IconListDetails,
    },
    {
      id: "meetings",
      title: "Meetings",
      url: "#",
      icon: IconCalendarStats,
    },
    {
      id: "notes",
      title: "Notes",
      url: "#",
      icon: IconNotebook,
    },
    {
      id: "calendar",
      title: "Calendar",
      url: "#",
      icon: IconCalendar,
    },
    {
      id: "completed",
      title: "Completed",
      url: "#",
      icon: IconProgressCheck,
    },
    {
      id: "notifications",
      title: "Notifications",
      url: "#",
      icon: IconBellRinging,
    },
  ],
  navCollapsible: {
    favorites: [
      {
        id: "design",
        title: "Design",
        href: "#",
        color: "bg-green-400 dark:bg-green-300",
      },
      {
        id: "development",
        title: "Development",
        href: "#",
        color: "bg-blue-400 dark:bg-blue-300",
      },
      {
        id: "workshop",
        title: "Workshop",
        href: "#",
        color: "bg-orange-400 dark:bg-orange-300",
      },
      {
        id: "personal",
        title: "Personal",
        href: "#",
        color: "bg-red-400 dark:bg-red-300",
      },
    ],
    teams: [
      {
        id: "engineering",
        title: "Engineering",
        icon: IconSettingsCode,
      },
      {
        id: "marketing",
        title: "Marketing",
        icon: IconAd2,
      },
    ],
    topics: [
      {
        id: "product-updates",
        title: "Product Updates",
        icon: Package,
      },
      {
        id: "company-news",
        title: "Company News",
        icon: IconNews,
      },
    ],
  },
};
