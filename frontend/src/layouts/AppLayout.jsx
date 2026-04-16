import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const navItemClass = (path) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive(path)
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-gray-200 bg-white p-6 lg:flex">
          <div>
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
              CaixaCerto
            </span>

            <h1 className="mt-4 text-2xl font-bold">Painel financeiro</h1>
            <p className="mt-2 text-sm text-gray-500">
              Sistema para controle financeiro de autônomos.
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            <Link to="/dashboard" className={navItemClass("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/clients" className={navItemClass("/clients")}>
              Clientes
            </Link>
            <Link to="/services" className={navItemClass("/services")}>
              Serviços
            </Link>
            <Link
              to="/service-records"
              className={navItemClass("/service-records")}
            >
              Lançamentos
            </Link>
            <Link to="/expenses" className={navItemClass("/expenses")}>
              Despesas
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">
              {user?.full_name || "Usuário"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {user?.email || "sem e-mail"}
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Sair
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bem-vindo de volta,</p>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.full_name || "Usuário"}
                </h2>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 lg:hidden"
              >
                Sair
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;