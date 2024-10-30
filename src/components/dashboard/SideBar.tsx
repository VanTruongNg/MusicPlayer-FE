import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Music,
  Mic2,
  Tags,
  Disc,
  PlayCircle,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Songs",
    href: "/admin/songs",
    icon: Music,
  },
  {
    title: "Artists",
    href: "/admin/artists",
    icon: Mic2,
  },
  {
    title: "Albums",
    href: "/admin/albums",
    icon: Disc,
  },
  {
    title: "Genres",
    href: "/admin/genres",
    icon: Tags,
  },
  {
    title: "Playlists",
    href: "/admin/playlists",
    icon: PlayCircle,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-gray-50/50 dark:bg-gray-900/50 p-4 space-y-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold px-4">Music Admin</h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href && "bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
