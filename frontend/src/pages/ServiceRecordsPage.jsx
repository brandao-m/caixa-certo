import { useEffect, useState } from "react";

import api from "../api/axios";

function ServiceRecordsPage() {
  const [records, setRecords] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);

  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [description, setDescription] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pendente");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const [recordsResponse, clientsResponse, servicesResponse] =
        await Promise.all([
          api.get("/service-records/"),
          api.get("/clients/"),
          api.get("/services/"),
        ]);

      setRecords(recordsResponse.data);
      setClients(clientsResponse.data);
      setServices(servicesResponse.data);
    } catch {
      setErrorMessage("Não foi possível carregar os lançamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecords(statusValue = "") {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/service-records/", {
        params: {
          payment_status: statusValue || undefined,
        },
      });

      setRecords(response.data);
    } catch {
      setErrorMessage("Não foi possível carregar os lançamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await fetchRecords(paymentStatusFilter);
  }

  async function handleCreateRecord(event) {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/service-records/", {
        description: description || null,
        service_date: serviceDate,
        amount: Number(amount),
        payment_status: paymentStatus,
        client_id: Number(clientId),
        service_id: Number(serviceId),
      });

      setDescription("");
      setServiceDate("");
      setAmount("");
      setPaymentStatus("pendente");
      setClientId("");
      setServiceId("");
      setFormMessage("Lançamento cadastrado com sucesso.");

      setTimeout(() => {
        setFormMessage("");
      }, 3000);

      await fetchRecords(paymentStatusFilter);
    } catch {
      setFormMessage("Não foi possível cadastrar o lançamento.");
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

  function getClientName(clientIdValue) {
    const client = clients.find((item) => item.id === clientIdValue);
    return client ? client.full_name : "Cliente não encontrado";
  }

  function getServiceName(serviceIdValue) {
    const service = services.find((item) => item.id === serviceIdValue);
    return service ? service.name : "Serviço não encontrado";
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lançamentos</h1>
          <p className="mt-2 text-gray-600">
            Registre serviços realizados e acompanhe o status de pagamento.
          </p>
        </div>

        <form onSubmit={handleFilterSubmit} className="flex w-full gap-3 md:max-w-md">
          <select
            value={paymentStatusFilter}
            onChange={(event) => setPaymentStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Filtrar
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Novo lançamento</h2>
          <p className="mt-2 text-sm text-gray-500">
            Vincule um cliente, um serviço e registre o valor cobrado.
          </p>

          <form onSubmit={handleCreateRecord} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <select
                value={clientId}
                onChange={(event) => setClientId(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
                required
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Serviço
              </label>
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
                required
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descreva o atendimento realizado"
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Data do serviço
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(event) => setServiceDate(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valor cobrado
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0,00"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status de pagamento
              </label>
              <select
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
                required
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
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
              {isSubmitting ? "Salvando..." : "Cadastrar lançamento"}
            </button>
          </form>
        </div>

        <div>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Carregando lançamentos...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Nenhum lançamento encontrado
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Cadastre o primeiro lançamento para começar a controlar os recebimentos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {getServiceName(record.service_id)}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            record.payment_status === "pago"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.payment_status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-800">Cliente:</span>{" "}
                          {getClientName(record.client_id)}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Descrição:</span>{" "}
                          {record.description || "Sem descrição"}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Data:</span>{" "}
                          {record.service_date}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Valor:</span>{" "}
                          {formatCurrency(record.amount)}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{record.id}
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

export default ServiceRecordsPage;