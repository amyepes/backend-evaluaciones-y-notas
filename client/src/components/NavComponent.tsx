import CardUser from "./CardUser";


export default function NavComponent() {
  return (
    <nav className="w-full flex flex-row justify-between items-center p-2 border-b border-b-gray-200">
      <h3 className="p-2 text-xl font-semibold uppercase text-neutral-800">
        Sistema de Evaluaciones
      </h3>
      <CardUser />
    </nav>
  );
}
