import React, { useState } from 'react';
import { Grid, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { DiagramSpec, SvgArrow, SvgNodeBox } from '../data/diagramGeometry';
import { buildArrowPath, getLabelBoxDimensions } from '../utils/svgGenerator';

interface DiagramCanvasProps {
  spec: DiagramSpec;
  selectedNodeId: string | null;
  selectedArrowId: string | null;
  showGrid: boolean;
  onToggleGrid: () => void;
  onSelectNode: (nodeId: string | null) => void;
  onSelectArrow: (arrow: SvgArrow | null) => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  spec,
  selectedNodeId,
  selectedArrowId,
  showGrid,
  onToggleGrid,
  onSelectNode,
  onSelectArrow,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredArrowId, setHoveredArrowId] = useState<string | null>(null);

  const activeNodeId = hoveredNodeId ?? selectedNodeId;
  const activeArrowId = hoveredArrowId ?? selectedArrowId;

  const isArrowHighlighted = (arrow: SvgArrow) => {
    if (activeArrowId) return arrow.id === activeArrowId;
    if (activeNodeId) return arrow.fromId === activeNodeId || arrow.toId === activeNodeId;
    return true;
  };

  const isNodeHighlighted = (node: SvgNodeBox) => {
    if (activeNodeId) {
      if (node.id === activeNodeId) return true;
      return spec.arrows.some(
        (a) =>
          (a.fromId === activeNodeId && a.toId === node.id) ||
          (a.toId === activeNodeId && a.fromId === node.id)
      );
    }
    if (activeArrowId) {
      const target = spec.arrows.find((a) => a.id === activeArrowId);
      if (target) return node.id === target.fromId || node.id === target.toId;
    }
    return true;
  };

  const hasSelectionOrHover = Boolean(activeNodeId || activeArrowId);
  const hasDatastore = spec.nodes.some((n) => n.kind === 'datastore');

  return (
    <div className="relative flex flex-col h-full bg-slate-100/70 border border-slate-200 rounded-xl overflow-hidden">
      {/* Compact Canvas Toolbar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0">
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            {spec.level === 'level0' ? 'Level 0 · Context Diagram' : 'Level 1 · System DFD'}
          </span>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span className="truncate">
            {spec.nodes.length} nodes · {spec.arrows.length} data flows
          </span>
          {selectedNodeId || selectedArrowId ? (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => {
                  onSelectNode(null);
                  onSelectArrow(null);
                }}
                className="text-teal-700 hover:text-teal-800 font-medium underline underline-offset-2 whitespace-nowrap cursor-pointer"
              >
                Clear selection
              </button>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleGrid}
            title="Toggle blueprint grid"
            aria-pressed={showGrid}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
              showGrid
                ? 'bg-teal-50 text-teal-800 border-teal-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-0.5" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))}
            title="Zoom out"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono tabular-nums text-slate-700 w-11 text-center select-none">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
            title="Zoom in"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            title="Reset zoom to 100%"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            {zoom === 1 ? <Maximize2 className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Scrollable Diagram Sheet */}
      <div
        className="flex-1 overflow-auto p-4 md:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectNode(null);
            onSelectArrow(null);
          }
        }}
      >
        <div
          className="mx-auto bg-white border border-slate-200 rounded-lg shadow-sm transition-transform origin-top-left"
          style={{
            width: `${Math.round(spec.width * zoom)}px`,
            minWidth: `${Math.round(spec.width * zoom)}px`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${spec.width} ${spec.height}`}
            className="w-full h-auto block select-none"
            onClick={(e) => {
              const target = e.target as Element;
              if (target.tagName === 'svg' || target.getAttribute('data-bg') === 'true') {
                onSelectNode(null);
                onSelectArrow(null);
              }
            }}
          >
            <defs>
              <marker
                id="ui-dfd-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 9.5 5 L 0 8.5 z" fill="#334155" />
              </marker>
              <marker
                id="ui-dfd-arrow-active"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7.5"
                markerHeight="7.5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 9.5 5 L 0 8.5 z" fill="#0F766E" />
              </marker>
              {showGrid && (
                <pattern id="ui-bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E8F0" strokeWidth="0.65" />
                </pattern>
              )}
            </defs>

            <rect width={spec.width} height={spec.height} fill="#FFFFFF" data-bg="true" />
            {showGrid && <rect width={spec.width} height={spec.height} fill="url(#ui-bp-grid)" data-bg="true" />}

            {/* Header & Legend */}
            <text
              x="44"
              y="34"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontSize="17"
              fontWeight="700"
              fill="#0F172A"
            >
              {spec.title}
            </text>
            <text
              x="44"
              y="52"
              fontFamily="'DM Sans', sans-serif"
              fontSize="11.5"
              fill="#475569"
            >
              {spec.subtitle}
            </text>

            {/* Gane & Sarson Legend */}
            <g>
              <rect
                x={spec.width - 430}
                y="22"
                width="18"
                height="14"
                rx="2"
                fill="#F8FAFC"
                stroke="#0F172A"
                strokeWidth="1.5"
              />
              <text x={spec.width - 406} y="33" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="#334155">
                External Entity
              </text>

              <rect
                x={spec.width - 310}
                y="22"
                width="20"
                height="14"
                rx="5"
                fill="#FFFFFF"
                stroke="#0F766E"
                strokeWidth="1.5"
              />
              <text x={spec.width - 284} y="33" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="#334155">
                Process
              </text>

              {hasDatastore && (
                <>
                  <path
                    d={`M ${spec.width - 208} 22 H ${spec.width - 226} V 36 H ${spec.width - 208}`}
                    fill="#FFFBEB"
                    stroke="#B45309"
                    strokeWidth="1.5"
                  />
                  <text x={spec.width - 202} y="33" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="#334155">
                    Data Store
                  </text>
                </>
              )}

              <line
                x1={spec.width - 122}
                y1="29"
                x2={spec.width - 96}
                y2="29"
                stroke="#334155"
                strokeWidth="1.5"
                markerEnd="url(#ui-dfd-arrow)"
              />
              <text x={spec.width - 90} y="33" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="#334155">
                Data Flow
              </text>
            </g>

            <line x1="44" y1="62" x2={spec.width - 44} y2="62" stroke="#E2E8F0" strokeWidth="1" />

            {/* Data Flow Arrows */}
            {spec.arrows.map((arrow) => {
              const highlighted = isArrowHighlighted(arrow);
              const isSelected = selectedArrowId === arrow.id;
              const isActive = hasSelectionOrHover && highlighted;
              const pathD = buildArrowPath(arrow);
              const { w: boxW, h: boxH } = getLabelBoxDimensions(arrow.labelLines);
              const [lx, ly] = arrow.labelPos;
              const topY = ly - boxH / 2;

              return (
                <g
                  key={arrow.id}
                  className="cursor-pointer transition-opacity duration-150"
                  style={{ opacity: highlighted ? 1 : 0.2 }}
                  onMouseEnter={() => setHoveredArrowId(arrow.id)}
                  onMouseLeave={() => setHoveredArrowId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(null);
                    onSelectArrow(isSelected ? null : arrow);
                  }}
                >
                  {/* Invisible wider hit-target for effortless clicking */}
                  <path d={pathD} fill="none" stroke="transparent" strokeWidth="14" />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isActive ? '#0F766E' : '#334155'}
                    strokeWidth={isActive ? 2.1 : 1.55}
                    strokeLinejoin="round"
                    markerEnd={isActive ? 'url(#ui-dfd-arrow-active)' : 'url(#ui-dfd-arrow)'}
                  />
                  <rect
                    x={lx - boxW / 2}
                    y={topY}
                    width={boxW}
                    height={boxH}
                    rx="3"
                    fill={isSelected ? '#CCFBF1' : '#FFFFFF'}
                    fillOpacity="0.96"
                    stroke={isSelected ? '#0F766E' : 'none'}
                    strokeWidth={isSelected ? 1 : 0}
                  />
                  {arrow.labelLines.map((line, idx) => (
                    <text
                      key={idx}
                      x={lx}
                      y={topY + 13 + idx * 13}
                      textAnchor="middle"
                      fontFamily="'DM Sans', sans-serif"
                      fontSize="10.5"
                      fontWeight={isActive ? '600' : '500'}
                      fill={isActive ? '#0F766E' : '#1E293B'}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* DFD Nodes */}
            {spec.nodes.map((node) => {
              const highlighted = isNodeHighlighted(node);
              const isSelected = selectedNodeId === node.id;
              const { x, y, w, h, kind, code, titleLines, subtitle } = node;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-opacity duration-150"
                  style={{ opacity: highlighted ? 1 : 0.25 }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectArrow(null);
                    onSelectNode(isSelected ? null : node.id);
                  }}
                >
                  {kind === 'entity' && (() => {
                    const bodyCenterY = y + 28 + (h - 28) / 2;
                    const titleStartY = subtitle ? bodyCenterY - 8 : bodyCenterY + 4;
                    return (
                      <>
                        <rect x={x + 4} y={y + 4} width={w} height={h} rx="3" fill="#CBD5E1" />
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="3"
                          fill="#F8FAFC"
                          stroke={isSelected ? '#0F766E' : '#0F172A'}
                          strokeWidth={isSelected ? 2.5 : 1.8}
                        />
                        <rect x={x} y={y} width={w} height="28" rx="3" fill={isSelected ? '#0F766E' : '#0F172A'} />
                        <rect x={x} y={y + 22} width={w} height="6" fill={isSelected ? '#0F766E' : '#0F172A'} />
                        <text
                          x={x + w / 2}
                          y={y + 18}
                          textAnchor="middle"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="11"
                          fontWeight="600"
                          fill="#F8FAFC"
                        >
                          {code} · EXTERNAL ENTITY
                        </text>
                        {titleLines.map((line, idx) => (
                          <text
                            key={idx}
                            x={x + w / 2}
                            y={titleStartY + idx * 18}
                            textAnchor="middle"
                            fontFamily="'Plus Jakarta Sans', sans-serif"
                            fontSize="15"
                            fontWeight="700"
                            fill="#0F172A"
                          >
                            {line}
                          </text>
                        ))}
                        {subtitle && (
                          <text
                            x={x + w / 2}
                            y={titleStartY + titleLines.length * 18 + 2}
                            textAnchor="middle"
                            fontFamily="'DM Sans', sans-serif"
                            fontSize="10.5"
                            fill="#475569"
                          >
                            {subtitle}
                          </text>
                        )}
                      </>
                    );
                  })()}

                  {kind === 'process' && (() => {
                    const headerH = 28;
                    const bodyCenterY = y + headerH + (h - headerH) / 2;
                    const blockHeight = titleLines.length * 17 + (subtitle ? 16 : 0);
                    const startY = bodyCenterY - blockHeight / 2 + 12;
                    return (
                      <>
                        {isSelected && (
                          <rect
                            x={x - 4}
                            y={y - 4}
                            width={w + 8}
                            height={h + 8}
                            rx="15"
                            fill="none"
                            stroke="#14B8A6"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />
                        )}
                        <rect
                          x={x}
                          y={y}
                          width={w}
                          height={h}
                          rx="12"
                          fill="#FFFFFF"
                          stroke="#0F766E"
                          strokeWidth={isSelected ? 2.4 : 1.8}
                        />
                        <path
                          d={`M ${x + 12} ${y} H ${x + w - 12} A 12 12 0 0 1 ${x + w} ${y + 12} V ${y + headerH} H ${x} V ${y + 12} A 12 12 0 0 1 ${x + 12} ${y} Z`}
                          fill="#0F766E"
                        />
                        <text
                          x={x + 14}
                          y={y + 18}
                          textAnchor="start"
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="11"
                          fontWeight="600"
                          fill="#CCFBF1"
                        >
                          PROCESS {code}
                        </text>
                        {titleLines.map((line, idx) => (
                          <text
                            key={idx}
                            x={x + w / 2}
                            y={startY + idx * 18}
                            textAnchor="middle"
                            fontFamily="'Plus Jakarta Sans', sans-serif"
                            fontSize="13.5"
                            fontWeight="700"
                            fill="#0F172A"
                          >
                            {line}
                          </text>
                        ))}
                        {subtitle && (
                          <text
                            x={x + w / 2}
                            y={startY + titleLines.length * 18 + 2}
                            textAnchor="middle"
                            fontFamily="'DM Sans', sans-serif"
                            fontSize="10.5"
                            fill="#475569"
                          >
                            {subtitle}
                          </text>
                        )}
                      </>
                    );
                  })()}

                  {kind === 'datastore' && (
                    <>
                      <rect x={x} y={y} width={w} height={h} fill="#FFFBEB" />
                      <rect x={x} y={y} width="42" height={h} fill="#FEF3C7" />
                      <path
                        d={`M ${x + w} ${y} H ${x} V ${y + h} H ${x + w}`}
                        fill="none"
                        stroke={isSelected ? '#0F766E' : '#B45309'}
                        strokeWidth={isSelected ? 2.4 : 1.8}
                      />
                      <line x1={x + 42} y1={y} x2={x + 42} y2={y + h} stroke="#B45309" strokeWidth="1.5" />
                      <text
                        x={x + 21}
                        y={y + h / 2 + 4}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono', monospace"
                        fontSize="12"
                        fontWeight="600"
                        fill="#92400E"
                      >
                        {code}
                      </text>
                      {titleLines.map((line, idx) => (
                        <text
                          key={idx}
                          x={x + 42 + (w - 42) / 2}
                          y={y + h / 2 + 4 + idx * 14}
                          textAnchor="middle"
                          fontFamily="'DM Sans', sans-serif"
                          fontSize="11.5"
                          fontWeight="600"
                          fill="#1E293B"
                        >
                          {line}
                        </text>
                      ))}
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
