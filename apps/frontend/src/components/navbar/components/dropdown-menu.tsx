import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { MenuIcon, PlusIcon, LogOutIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearToken } from '@/store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';

export const NavbarDropdownMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(clearToken());
    navigate('/login');
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger
        className="
          focus:outline-none 
          w-[3%] px-[1%] h-[2%]
          text-3xl
        "
      >
        <MenuIcon />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
          bg-gradient-to-br from-dusk-600/80 via-sunset-700/60 to-dusk-500/70
          backdrop-blur-2xl mt-6
          ring-2 ring-sunset-500
          rounded-lg border-none
        "
      >
        <DropdownMenuItem
          className="
            flex items-center gap-2
            text-white font-bold cursor-pointer
            hover:bg-sunset-500 hover:text-black

            focus:outline-none focus:ring-0
            focus-visible:outline-none focus-visible:ring-0

            data-[highlighted]:bg-sunset-500
            data-[highlighted]:text-black
            data-[highlighted]:outline-none
            data-[highlighted]:ring-0
          "
        >
          <PlusIcon className="h-5 w-5" />
          הוספת שתייה
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="
            flex items-center gap-2
            text-white
            hover:text-red-600 hover:bg-red-200 hover:font-medium cursor-pointer

            focus:outline-none focus:ring-0
            focus-visible:outline-none focus-visible:ring-0

            data-[highlighted]:bg-red-200
            data-[highlighted]:text-red-600
            data-[highlighted]:outline-none
            data-[highlighted]:ring-0
          "
        >
          <LogOutIcon className="h-5 w-5" />
          התנתקות
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
