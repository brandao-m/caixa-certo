import { useEffect, useState } from "react";

import api from "../api/axios";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPrice, setDefaultPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices(searchValue = "") {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/services/", {
        params: {
          search: searchValue || undefined,
        },
      });

      setServices(response.data);
    } catch {
      setErrorMessage("Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    await fetchServices(search);
  }

  async function handleCreateService(event) {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/services/", {
        name,
        description: description || null,
        default_price: Number(defaultPrice),
      });

      setName("");
      setDescription("");
      setDefaultPrice("");
      setFormMessage("Serviço cadastrado com sucesso.");

      setTimeout(() => {
        setFormMessage("");
      }, 3000);

      await fetchServices(search);
    } catch {
      setFormMessage("Não foi possível cadastrar o serviço.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="mt-2 text-gray-600">
            Cadastre e organize os serviços oferecidos.
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
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Novo serviço</h2>
          <p className="mt-2 text-sm text-gray-500">
            Cadastre um serviço para usar nos lançamentos do sistema.
          </p>

          <form onSubmit={handleCreateService} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nome do serviço
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Montagem e configuração de PC"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva o serviço"
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valor padrão
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={defaultPrice}
                onChange={(event) => setDefaultPrice(event.target.value)}
                placeholder="0,00"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
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
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Salvando..." : "Cadastrar serviço"}
            </button>
          </form>
        </div>

        <div>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Carregando serviços...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Nenhum serviço encontrado
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Cadastre seu primeiro serviço para organizar os atendimentos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {service.name}
                      </h2>

                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-800">Descrição:</span>{" "}
                          {service.description || "Sem descrição"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Valor padrão:</span>{" "}
                          {formatCurrency(service.default_price)}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{service.id}
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

export default ServicesPage;