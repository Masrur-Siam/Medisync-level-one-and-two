import React, { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { BALANCING_MATRIX } from '../data/dfdData';

export const BalancingMatrix: React.FC = () => {
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const rows = useMemo(() => {
    return BALANCING_MATRIX.filter((row) => {
      if (entityFilter !== 'all' && !row.entity.startsWith(entityFilter)) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          row.level0Flow.toLowerCase().includes(q) ||
          row.level1Process.toLowerCase().includes(q) ||
          row.level1Flow.toLowerCase().includes(q) ||
          row.dataStores.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entityFilter, query]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Level 0 ↔ Level 1 DFD Balancing Verification
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Every external entity input and output in the Context Diagram is conserved across Processes 1.0–6.0.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'Patient', label: 'Patient (E1)' },
              { id: 'Doctor', label: 'Doctor (E2)' },
              { id: 'Assistant', label: 'Assistant (E3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEntityFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  entityFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter flows or stores..."
              aria-label="Filter balancing matrix"
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 w-52"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-700">No matching data flows found.</p>
            <button
              type="button"
              onClick={() => {
                setEntityFilter('all');
                setQuery('');
              }}
              className="mt-2 text-xs font-medium text-teal-700 hover:text-teal-800 underline underline-offset-2 cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">External Entity</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Level 0 Context Flow</th>
                <th className="py-3 px-4">Level 1 Process</th>
                <th className="py-3 px-4">Level 1 Decomposition</th>
                <th className="py-3 px-4">MySQL Stores</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.entity}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{row.direction}</td>
                  <td className="py-3 px-4 text-slate-800 font-medium">{row.level0Flow}</td>
                  <td className="py-3 px-4 font-mono text-teal-800 whitespace-nowrap">
                    {row.level1Process}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{row.level1Flow}</td>
                  <td className="py-3 px-4 font-mono text-amber-800 whitespace-nowrap">
                    {row.dataStores}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Balanced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
