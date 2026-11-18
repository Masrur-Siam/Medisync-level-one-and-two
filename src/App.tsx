import { useState } from 'react';
import { Check, Copy, Download, FileImage } from 'lucide-react';
import { DfdLevel, PROJECT_INFO } from './data/dfdData';
import { LEVEL0_SPEC, LEVEL1_SPEC, SvgArrow } from './data/diagramGeometry';
import { buildStandaloneSvg, downloadPngFromSvg, downloadSvgFile } from './utils/svgGenerator';
import { DiagramCanvas } from './components/DiagramCanvas';
import { InspectorPanel } from './components/InspectorPanel';
import { BalancingMatrix } from './components/BalancingMatrix';
import { SvgSourceView } from './components/SvgSourceModal';

type WorkspaceTab = 'level0' | 'level1' | 'balancing' | 'source';

export function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('level1');
  const [lastDiagramLevel, setLastDiagramLevel] = useState<DfdLevel>('level1');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedArrow, setSelectedArrow] = useState<SvgArrow | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [copiedQuick, setCopiedQuick] = useState<boolean>(false);
  const [exportingPng, setExportingPng] = useState<boolean>(false);

  const currentSpec =
    activeTab === 'level0' || (activeTab !== 'level1' && lastDiagramLevel === 'level0')
      ? LEVEL0_SPEC
      : LEVEL1_SPEC;

  const handleSwitchTab = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    if (tab === 'level0' || tab === 'level1') {
      setLastDiagramLevel(tab);
      setSelectedNodeId(null);
      setSelectedArrow(null);
    }
  };

  const handleDownloadActiveSvg = () => {
    const svg = buildStandaloneSvg(currentSpec, showGrid);
    downloadSvgFile(`medisync-${currentSpec.level}-dfd.svg`, svg);
  };

  const handleDownloadActivePng = async () => {
    setExportingPng(true);
    try {
      const svg = buildStandaloneSvg(currentSpec, showGrid);
      await downloadPngFromSvg(
        `medisync-${currentSpec.level}-dfd.png`,
        svg,
        currentSpec.width,
        currentSpec.height,
        2.5
      );
    } finally {
      setExportingPng(false);
    }
  };

  const handleCopyActiveSvg = async () => {
    const svg = buildStandaloneSvg(currentSpec, showGrid);
    try {
      await navigator.clipboard.writeText(svg);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = svg;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Three-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleSwitchTab('level1')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          MediSync DFD Studio
        </button>

        <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto">
          {[
            { id: 'level0' as const, label: 'Level 0 DFD' },
            { id: 'level1' as const, label: 'Level 1 DFD' },
            { id: 'balancing' as const, label: 'Balancing Matrix' },
            { id: 'source' as const, label: 'SVG Source' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSwitchTab(item.id)}
                className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-teal-800 border-teal-700 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownloadActiveSvg}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </header>

      {/* Workspace Sub-header & Export Strip */}
      <div className="px-6 py-3 bg-white/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-slate-900">{PROJECT_INFO.title}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{PROJECT_INFO.course}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>Gane &amp; Sarson DFD Notation</span>
        </div>

        {(activeTab === 'level0' || activeTab === 'level1') && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyActiveSvg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              {copiedQuick ? (
                <Check className="w-3.5 h-3.5 text-teal-700" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedQuick ? 'SVG Copied' : 'Copy SVG Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadActivePng}
              disabled={exportingPng}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
            >
              <FileImage className="w-3.5 h-3.5" />
              <span>{exportingPng ? 'Exporting PNG...' : 'Export High-Res PNG'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Viewport */}
      <main className="flex-1 p-4 md:p-6 min-h-0 flex flex-col">
        {(activeTab === 'level0' || activeTab === 'level1') && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 min-h-[640px]">
            <DiagramCanvas
              spec={currentSpec}
              selectedNodeId={selectedNodeId}
              selectedArrowId={selectedArrow?.id ?? null}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid((g) => !g)}
              onSelectNode={setSelectedNodeId}
              onSelectArrow={setSelectedArrow}
            />
            <InspectorPanel
              spec={currentSpec}
              selectedNodeId={selectedNodeId}
              selectedArrow={selectedArrow}
              onSelectNode={setSelectedNodeId}
              onSelectArrow={setSelectedArrow}
            />
          </div>
        )}

        {activeTab === 'balancing' && (
          <div className="flex-1 min-h-[620px]">
            <BalancingMatrix />
          </div>
        )}

        {activeTab === 'source' && (
          <div className="flex-1 min-h-[620px]">
            <SvgSourceView initialLevel={lastDiagramLevel} showGrid={showGrid} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
