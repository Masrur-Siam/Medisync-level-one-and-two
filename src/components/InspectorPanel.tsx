import React from 'react';
import { ArrowRight, Database, Layers, UserCheck } from 'lucide-react';
import { DFD_NODES, LEVEL0_FLOWS, PROJECT_INFO } from '../data/dfdData';
import { DiagramSpec, SvgArrow } from '../data/diagramGeometry';

interface InspectorPanelProps {
  spec: DiagramSpec;
  selectedNodeId: string | null;
  selectedArrow: SvgArrow | null;
  onSelectNode: (nodeId: string | null) => void;
  onSelectArrow: (arrow: SvgArrow | null) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  spec,
  selectedNodeId,
  selectedArrow,
  onSelectNode,
  onSelectArrow,
}) => {
  const selectedNode = selectedNodeId ? DFD_NODES[selectedNodeId] : null;

  if (selectedArrow) {
    const flowDetail = LEVEL0_FLOWS.find((f) => f.id === selectedArrow.flowRefId);
    const fromNode = DFD_NODES[selectedArrow.fromId];
    const toNode = DFD_NODES[selectedArrow.toId];

    return (
      <aside className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 h-full overflow-y-auto">
        <div>
          <div className="text-xs font-mono text-teal-700 mb-1">
            DATA FLOW · {selectedArrow.id}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {selectedArrow.labelLines.join(' ')}
          </h2>
        </div>

        <div className="flex items-center gap-2 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => {
              onSelectArrow(null);
              onSelectNode(selectedArrow.fromId);
            }}
            className="font-semibold text-slate-900 hover:text-teal-700 transition-colors truncate cursor-pointer"
          >
            {fromNode?.code} {fromNode?.title}
          </button>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            type="button"
            onClick={() => {
              onSelectArrow(null);
              onSelectNode(selectedArrow.toId);
            }}
            className="font-semibold text-slate-900 hover:text-teal-700 transition-colors truncate cursor-pointer"
          >
            {toNode?.code} {toNode?.title}
          </button>
        </div>

        {flowDetail && (
          <>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 mb-1.5">Description</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{flowDetail.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-semibold text-slate-500 mb-2">Data Attributes</h3>
              <ul className="space-y-1.5">
                {flowDetail.payload.map((attr) => (
                  <li key={attr} className="text-xs font-mono text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/70">
                    {attr}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onSelectArrow(null)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
          >
            Back to diagram summary
          </button>
        </div>
      </aside>
    );
  }

  if (selectedNode) {
    const incoming = spec.arrows.filter((a) => a.toId === selectedNode.id);
    const outgoing = spec.arrows.filter((a) => a.fromId === selectedNode.id);

    const kindLabel =
      selectedNode.kind === 'entity'
        ? 'EXTERNAL ENTITY'
        : selectedNode.kind === 'process'
        ? 'DFD PROCESS'
        : 'MYSQL DATA STORE';

    return (
      <aside className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 h-full overflow-y-auto">
        <div>
          <div className="text-xs font-mono text-teal-700 mb-1">
            {kindLabel} · {selectedNode.code}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {selectedNode.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{selectedNode.proposalRef}</p>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{selectedNode.summary}</p>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-500 mb-2">Responsibilities</h3>
          <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed list-disc pl-4">
            {selectedNode.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {selectedNode.mysqlColumns && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-2">
              Proposed MySQL Schema ({selectedNode.mysqlTables?.join(', ')})
            </h3>
            <ul className="space-y-1">
              {selectedNode.mysqlColumns.map((col) => (
                <li
                  key={col}
                  className="text-xs font-mono text-amber-900 bg-amber-50/70 px-2.5 py-1 rounded border border-amber-200/70"
                >
                  {col}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-1.5">
              Incoming Flows ({incoming.length})
            </h3>
            {incoming.length === 0 ? (
              <p className="text-xs text-slate-400">None in this level</p>
            ) : (
              <div className="space-y-1">
                {incoming.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      onSelectNode(null);
                      onSelectArrow(a);
                    }}
                    className="w-full text-left text-xs px-2.5 py-1.5 rounded border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate text-slate-800">{a.labelLines.join(' ')}</span>
                    <span className="font-mono text-slate-400 shrink-0">← {a.fromId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 mb-1.5">
              Outgoing Flows ({outgoing.length})
            </h3>
            {outgoing.length === 0 ? (
              <p className="text-xs text-slate-400">None in this level</p>
            ) : (
              <div className="space-y-1">
                {outgoing.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      onSelectNode(null);
                      onSelectArrow(a);
                    }}
                    className="w-full text-left text-xs px-2.5 py-1.5 rounded border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="truncate text-slate-800">{a.labelLines.join(' ')}</span>
                    <span className="font-mono text-slate-400 shrink-0">→ {a.toId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onSelectNode(null)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
          >
            Back to diagram summary
          </button>
        </div>
      </aside>
    );
  }

  // Default Summary State
  const entities = spec.nodes.filter((n) => n.kind === 'entity');
  const processes = spec.nodes.filter((n) => n.kind === 'process');
  const datastores = spec.nodes.filter((n) => n.kind === 'datastore');

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 h-full overflow-y-auto">
      <div>
        <div className="text-xs font-mono text-teal-700 mb-1">
          {spec.level === 'level0' ? 'CONTEXT DIAGRAM · LEVEL 0' : 'SYSTEM DECOMPOSITION · LEVEL 1'}
        </div>
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {PROJECT_INFO.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {PROJECT_INFO.institution} · {PROJECT_INFO.course}
        </p>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Click any entity, process, MySQL data store, or data flow arrow on the canvas to isolate its connections and inspect proposal specifications.
      </p>

      {/* Quick Element Jump Lists */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>External Entities ({entities.length})</span>
          </div>
          <div className="space-y-1">
            {entities.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onSelectNode(n.id)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-slate-800">{n.titleLines.join(' ')}</span>
                <span className="font-mono text-slate-400">{n.code}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
            <Layers className="w-3.5 h-3.5 text-teal-700" />
            <span>Processes ({processes.length})</span>
          </div>
          <div className="space-y-1">
            {processes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onSelectNode(n.id)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-colors flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="font-medium text-slate-800 truncate">{n.titleLines.join(' ')}</span>
                <span className="font-mono text-teal-700 shrink-0">{n.code}</span>
              </button>
            ))}
          </div>
        </div>

        {datastores.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Database className="w-3.5 h-3.5 text-amber-700" />
              <span>MySQL Data Stores ({datastores.length})</span>
            </div>
            <div className="space-y-1">
              {datastores.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onSelectNode(n.id)}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="font-medium text-slate-800 truncate">{n.titleLines.join(' ')}</span>
                  <span className="font-mono text-amber-800 shrink-0">{n.code}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Proposal Metadata */}
      <div className="mt-auto pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
        <div className="font-medium text-slate-700">Group 6 · Teacher: {PROJECT_INFO.teacher}</div>
        <div>{PROJECT_INFO.stack}</div>
      </div>
    </aside>
  );
};
