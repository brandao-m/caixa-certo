import { useEffect, useState } from "react";

import api from "../api/axios";

function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

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

  async function handleCreateClient(event) {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/clients/", {
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        notes: notes || null,
      });

      setFullName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setFormMessage("Cliente cadastrado com sucesso.");

      setTimeout(() => {
        setFormMessage("");
      }, 3000);

      await fetchClients(search);
    } catch {
      setFormMessage("Não foi possível cadastrar o cliente.");
    } finally {
      setIsSubmitting(false);
    }
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Novo cliente</h2>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre um cliente para vinculá-lo a futuros lançamentos.
          </p>

          <form onSubmit={handleCreateClient} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Digite o nome do cliente"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="cliente@email.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Observações sobre o cliente"
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>

            {formMessage && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {formMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Salvando..." : "Cadastrar cliente"}
            </button>
          </form>
        </div>

        <div>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Carregando clientes...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : clients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Nenhum cliente encontrado
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Cadastre seu primeiro cliente para começar a organizar seus atendimentos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
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
      </div>
    </div>
  );
}

export default ClientsPage;