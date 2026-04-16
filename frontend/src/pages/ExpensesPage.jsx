import { useEffect, useState } from "react";

import api from "../api/axios";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses(categoryValue = "") {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.get("/expenses/", {
        params: {
          category: categoryValue || undefined,
        },
      });

      setExpenses(response.data);
    } catch {
      setErrorMessage("Não foi possível carregar as despesas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await fetchExpenses(categoryFilter);
  }

  async function handleCreateExpense(event) {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/expenses/", {
        description,
        amount: Number(amount),
        expense_date: expenseDate,
        category: category || null,
      });

      setDescription("");
      setAmount("");
      setExpenseDate("");
      setCategory("");
      setFormMessage("Despesa cadastrada com sucesso.");

      setTimeout(() => {
        setFormMessage("");
      }, 3000);

      await fetchExpenses(categoryFilter);
    } catch {
      setFormMessage("Não foi possível cadastrar a despesa.");
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
          <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
          <p className="mt-2 text-gray-600">
            Registre os gastos do negócio e acompanhe seu impacto financeiro.
          </p>
        </div>

        <form onSubmit={handleFilterSubmit} className="flex w-full gap-3 md:max-w-md">
          <input
            type="text"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            placeholder="Filtrar por categoria"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-gray-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Filtrar
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Nova despesa</h2>
          <p className="mt-2 text-sm text-gray-500">
            Registre um gasto para acompanhar o lucro real do negócio.
          </p>

          <form onSubmit={handleCreateExpense} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ex: Gasolina para atendimento"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valor
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
                Data da despesa
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Ex: combustível"
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
              {isSubmitting ? "Salvando..." : "Cadastrar despesa"}
            </button>
          </form>
        </div>

        <div>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Carregando despesas...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : expenses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Nenhuma despesa encontrada
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Cadastre a primeira despesa para acompanhar melhor seus gastos.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {expense.description}
                      </h2>

                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-800">Valor:</span>{" "}
                          {formatCurrency(expense.amount)}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Data:</span>{" "}
                          {expense.expense_date}
                        </p>
                        <p>
                          <span className="font-medium text-gray-800">Categoria:</span>{" "}
                          {expense.category || "Sem categoria"}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{expense.id}
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

export default ExpensesPage;