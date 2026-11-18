import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, FileImage } from 'lucide-react';
import { LEVEL0_SPEC, LEVEL1_SPEC } from '../data/diagramGeometry';
import { buildStandaloneSvg, downloadPngFromSvg, downloadSvgFile } from '../utils/svgGenerator';
import { DfdLevel } from '../data/dfdData';

interface SvgSourceViewProps {
  initialLevel: DfdLevel;
  showGrid: boolean;
}

export const SvgSourceView: React.FC<SvgSourceViewProps> = ({ initialLevel, showGrid }) => {
  const [sourceLevel, setSourceLevel] = useState<DfdLevel>(initialLevel);
  const [copied, setCopied] = useState(false);
  const [exportingPng, setExportingPng] = useState(false);

  const spec = sourceLevel === 'level0' ? LEVEL0_SPEC : LEVEL1_SPEC;
  const svgCode = useMemo(() => buildStandaloneSvg(spec, showGrid), [spec, showGrid]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback textarea copy
      const el = document.createElement('textarea');
      el.value = svgCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    setExportingPng(true);
    try {
      await downloadPngFromSvg(
        `medisync-${sourceLevel}-dfd.png`,
        svgCode,
        spec.width,
        spec.height,
        2.5
      );
    } finally {
      setExportingPng(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Standalone W3C SVG Source Code</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Self-contained vector XML ready for Word, LaTeX/Overleaf, Inkscape, Figma, or HTML.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSourceLevel('level0')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                sourceLevel === 'level0'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level 0 SVG
            </button>
            <button
              type="button"
              onClick={() => setSourceLevel('level1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                sourceLevel === 'level1'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level 1 SVG
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SVG' : 'Copy SVG Code'}</span>
          </button>

          <button
            type="button"
            onClick={() => downloadSvgFile(`medisync-${sourceLevel}-dfd.svg`, svgCode)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .svg</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={exportingPng}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>{exportingPng ? 'Exporting...' : 'Download High-Res .png'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-950 p-5">
        <pre className="text-xs font-mono leading-relaxed text-slate-200 whitespace-pre select-all">
          <code>{svgCode}</code>
        </pre>
      </div>
    </div>
  );
};
