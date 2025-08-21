import { useNavigate } from "react-router";
import { useAppContext } from "../context/useAppContext";

export default function CardUser() {
  const { user, logout } = useAppContext();

  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    user && (
      <div className="flex flex-row items-center justify-end gap-2 w-[300px]">
        <div className="w-8 h-8 rounded-full bg-neutral-800 flex justify-center items-center text-white">
          <span>{user.name[0]}</span>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <p className="text-neutral-700 text-sm font-semibold">
            {user.name} ({user.username})
          </p>
          <button
            onClick={handleClick}
            className="text-xs text-red-400 cursor-pointer transition-all hover:text-red-500 font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  );
}
