import { useEffect, useState } from "react";

import api from "../api/axios";

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchDashboardSummary() {
      try {
        const response = await api.get("/dashboard/summary");
        setSummary(response.data);
      } catch {
        setErrorMessage("Não foi possível carregar o resumo financeiro.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardSummary();
  }, []);

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Carregando resumo financeiro...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total recebido",
      value: formatCurrency(summary.total_received),
      accent: "bg-slate-900",
    },
    {
      title: "Total pendente",
      value: formatCurrency(summary.total_pending),
      accent: "bg-amber-400",
    },
    {
      title: "Despesas",
      value: formatCurrency(summary.total_expenses),
      accent: "bg-rose-400",
    },
    {
      title: "Lucro",
      value: formatCurrency(summary.profit),
      accent: "bg-emerald-500",
    },
    {
      title: "Clientes",
      value: summary.clients_count,
      accent: "bg-slate-300",
    },
    {
      title: "Serviços",
      value: summary.services_count,
      accent: "bg-slate-300",
    },
    {
      title: "Lançamentos",
      value: summary.service_records_count,
      accent: "bg-slate-300",
    },
  ];

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Acompanhe aqui o resumo financeiro do seu negócio.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`h-1.5 w-12 rounded-full ${card.accent}`} />
            <p className="mt-4 text-sm font-medium text-slate-500">
              {card.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;