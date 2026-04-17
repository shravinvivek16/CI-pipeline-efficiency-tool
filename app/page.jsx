"use client";

import { useState } from "react";

export default function HomePage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyzeRepo() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/report");

      if (!response.ok) {
        throw new Error("Failed to fetch report");
      }

      const result = await response.json();
      setReport(result);
    } catch (fetchError) {
      setError("Unable to load report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            CI Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            Analyze your repository
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Generate a simple repository report with a summary and a list of
            actionable issues.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAnalyzeRepo}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              {loading ? "Analyzing..." : "Analyze Repo"}
            </button>
          </div>
          {error ? (
            <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
          ) : null}
        </section>

        {report ? (
          <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Summary</h2>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {report.summary || "No summary available."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-8 py-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  List of issues
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Review the current issues, recommended fixes, and expected
                  impact.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">
                        Issue name
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">
                        Fix
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {(report.issues || []).map((issue, index) => (
                      <tr key={index}>
                        <td className="px-8 py-5 text-sm font-medium text-slate-900">
                          {issue.issue_name || issue.name}
                        </td>
                        <td className="px-8 py-5 text-sm leading-6 text-slate-700">
                          {issue.fix}
                        </td>
                        <td className="px-8 py-5 text-sm leading-6 text-slate-700">
                          {issue.impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
