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
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              CaixaCerto
            </span>

            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              Painel financeiro
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Controle clientes, serviços, lançamentos e despesas.
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

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              {user?.full_name || "Usuário"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {user?.email || "sem e-mail"}
            </p>

            <button
              onClick={handleLogout}
              className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Sair
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Bem-vindo de volta,</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.full_name || "Usuário"}
                </h2>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:hidden"
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