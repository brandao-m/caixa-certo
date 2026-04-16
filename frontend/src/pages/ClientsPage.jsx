import { useEffect, useState } from "react";

import api from "../api/axios";

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients(searchValue = "") {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/clients/", {
        params: {
          search: searchValue || undefined,
        },
      });

      setClients(response.data);
    } catch {
      setErrorMessage("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    await fetchClients(search);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-2 text-gray-600">
            Gerencie os clientes cadastrados no sistema.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full gap-3 md:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Carregando clientes...</p>
        </div>
      ) : errorMessage ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : clients.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Nenhum cliente encontrado
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre seu primeiro cliente para começar a organizar seus atendimentos.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {client.full_name}
                  </h2>

                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">E-mail:</span>{" "}
                      {client.email || "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Telefone:</span>{" "}
                      {client.phone || "Não informado"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Observações:</span>{" "}
                      {client.notes || "Sem observações"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  #{client.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientsPage;