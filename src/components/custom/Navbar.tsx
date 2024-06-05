import { useAuthStore } from "@/context/auth-store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DoorOpen, User } from "lucide-react";
import { ToggleTheme } from "../ui/toogle-theme";

export const Navbar = () => {
    const user = useAuthStore().user;
    const logout = useAuthStore().logout;

  return (
    <div className="w-fit flex flex-col items-center gap-3">

        <DropdownMenu>
          <DropdownMenuTrigger className="shrink-0 overflow-hidden">
            {user?.img_url ? (
              <img src={user.img_url} className=" w-10 h-10 rounded-sm" />
            ) : (
              <User />
            )}
            <span className="sr-only">User</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="w-full justify-start gap-2 cursor-pointer"
              onClick={() => logout()}
            >
              <DoorOpen size={20} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleTheme className={"shrink-0"} />
    </div>
  )
}