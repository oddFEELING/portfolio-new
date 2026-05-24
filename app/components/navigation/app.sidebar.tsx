import {
  IconAd2,
  IconApiApp,
  IconAt,
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
  type TablerIcon,
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
  useSidebar,
} from "../ui/sidebar";
import { NavHeader } from "./sidebar.header";
import type { SidebarData } from "./types";

type NavItem = { path: string; label: string; Icon: TablerIcon };

const primaryNav: NavItem[] = [
  { path: "/", label: "Home", Icon: IconSofa },
  { path: "/experience", label: "Experience", Icon: IconClipboardText },
  { path: "/projects", label: "Projects", Icon: IconApiApp },
  { path: "/contact", label: "Contact", Icon: IconAt },
];

const othersNav: NavItem[] = [
  { path: "/blog", label: "Blog", Icon: IconPencilMinus },
  { path: "/open-source", label: "Open Source", Icon: IconSpy },
];

const AppSidebar = () => {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();

  const checkActive = (path: string) => pathname === path;

  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderItem = (item: NavItem) => (
    <SidebarMenuItem key={item.path}>
      <SidebarMenuButton
        className="group/nav relative h-auto gap-3 rounded-none px-3 py-3 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-[0.2em] transition-colors hover:bg-transparent hover:text-[#FF9800] data-[active=true]:bg-[#FF9800]/[0.06] data-[active=true]:font-normal data-[active=true]:text-[#FF9800]"
        isActive={checkActive(item.path)}
        onClick={() => handleNav(item.path)}
      >
        <item.Icon size={16} stroke={1.5} />
        <span>{item.label}</span>
        <span
          aria-hidden="true"
          className="ml-auto translate-x-1 text-[#FF9800] opacity-0 transition-all duration-300 group-hover/nav:translate-x-0 group-hover/nav:opacity-100 group-data-[active=true]/nav:translate-x-0 group-data-[active=true]/nav:opacity-100"
        >
          ▸
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

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
          <SidebarMenu>{primaryNav.map(renderItem)}</SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="rounded-none font-mono text-[0.6rem] text-muted-foreground/60 uppercase tracking-[0.3em]">
            OTHERS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{othersNav.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter className="border-border/40 border-t px-3 py-3">
        <p className="font-mono text-[0.55rem] text-muted-foreground/40 uppercase tracking-[0.3em]">
          ▒ END_OF_NAV ▒
        </p>
      </SidebarFooter>
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
