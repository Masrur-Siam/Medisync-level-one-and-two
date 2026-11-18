import { DiagramSpec, SvgArrow, SvgNodeBox } from '../data/diagramGeometry';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildArrowPath(arrow: SvgArrow): string {
  const pts = arrow.points;
  if (pts.length < 2) return '';

  if (!arrow.bridgeAt) {
    return pts.map(([x, y], idx) => `${idx === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  }

  // Insert a clean vertical jump-arc bridge at bridgeAt (crossing a horizontal line)
  const [bx, by] = arrow.bridgeAt;
  const r = 7;
  const commands: string[] = [`M ${pts[0][0]} ${pts[0][1]}`];

  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    if (
      Math.abs(x1 - bx) < 1 &&
      Math.abs(x2 - bx) < 1 &&
      ((y1 < by && y2 > by) || (y1 > by && y2 < by))
    ) {
      const dir = y2 > y1 ? 1 : -1;
      commands.push(`L ${bx} ${by - dir * r}`);
      commands.push(`A ${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${bx} ${by + dir * r}`);
    }
    commands.push(`L ${x2} ${y2}`);
  }
  return commands.join(' ');
}

export function getLabelBoxDimensions(lines: string[]): { w: number; h: number } {
  const maxLen = Math.max(...lines.map((l) => l.length), 4);
  const w = Math.max(56, Math.round(maxLen * 6.2 + 14));
  const h = lines.length * 14 + 6;
  return { w, h };
}

function renderNodeXml(node: SvgNodeBox): string {
  const { x, y, w, h, kind, code, titleLines, subtitle } = node;

  if (kind === 'entity') {
    const bodyCenterY = y + 28 + (h - 28) / 2;
    const titleStartY = subtitle ? bodyCenterY - 8 : bodyCenterY + 4;
    return [
      `  <!-- External Entity: ${escapeXml(titleLines.join(' '))} -->`,
      `  <g id="node-${escapeXml(node.id)}">`,
      `    <rect x="${x + 4}" y="${y + 4}" width="${w}" height="${h}" rx="3" fill="#CBD5E1" />`,
      `    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.8" />`,
      `    <rect x="${x}" y="${y}" width="${w}" height="28" rx="3" fill="#0F172A" />`,
      `    <rect x="${x}" y="${y + 22}" width="${w}" height="6" fill="#0F172A" />`,
      `    <text x="${x + w / 2}" y="${y + 18}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#F8FAFC">${escapeXml(code)} · EXTERNAL ENTITY</text>`,
      ...titleLines.map(
        (line, idx) =>
          `    <text x="${x + w / 2}" y="${titleStartY + idx * 18}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#0F172A">${escapeXml(line)}</text>`
      ),
      subtitle
        ? `    <text x="${x + w / 2}" y="${titleStartY + titleLines.length * 18 + 2}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="10.5" fill="#475569">${escapeXml(subtitle)}</text>`
        : '',
      `  </g>`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (kind === 'process') {
    const headerH = 28;
    const bodyCenterY = y + headerH + (h - headerH) / 2;
    const blockHeight = titleLines.length * 17 + (subtitle ? 16 : 0);
    const startY = bodyCenterY - blockHeight / 2 + 12;

    return [
      `  <!-- Process ${escapeXml(code)}: ${escapeXml(titleLines.join(' '))} -->`,
      `  <g id="node-${escapeXml(node.id)}">`,
      `    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="#0F766E" stroke-width="1.8" />`,
      `    <path d="M ${x + 12} ${y} H ${x + w - 12} A 12 12 0 0 1 ${x + w} ${y + 12} V ${y + headerH} H ${x} V ${y + 12} A 12 12 0 0 1 ${x + 12} ${y} Z" fill="#0F766E" />`,
      `    <text x="${x + 14}" y="${y + 18}" text-anchor="start" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="600" fill="#CCFBF1">PROCESS ${escapeXml(code)}</text>`,
      ...titleLines.map(
        (line, idx) =>
          `    <text x="${x + w / 2}" y="${startY + idx * 18}" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="13.5" font-weight="700" fill="#0F172A">${escapeXml(line)}</text>`
      ),
      subtitle
        ? `    <text x="${x + w / 2}" y="${startY + titleLines.length * 18 + 2}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="10.5" fill="#475569">${escapeXml(subtitle)}</text>`
        : '',
      `  </g>`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  // Data Store (Gane & Sarson open-right rectangle with ID column)
  const idColW = 42;
  return [
    `  <!-- Data Store ${escapeXml(code)}: ${escapeXml(titleLines.join(' '))} -->`,
    `  <g id="node-${escapeXml(node.id)}">`,
    `    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFBEB" />`,
    `    <rect x="${x}" y="${y}" width="${idColW}" height="${h}" fill="#FEF3C7" />`,
    `    <path d="M ${x + w} ${y} H ${x} V ${y + h} H ${x + w}" fill="none" stroke="#B45309" stroke-width="1.8" />`,
    `    <line x1="${x + idColW}" y1="${y}" x2="${x + idColW}" y2="${y + h}" stroke="#B45309" stroke-width="1.5" />`,
    `    <text x="${x + idColW / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="600" fill="#92400E">${escapeXml(code)}</text>`,
    ...titleLines.map(
      (line, idx) =>
        `    <text x="${x + idColW + (w - idColW) / 2}" y="${y + h / 2 + 4 + idx * 14}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="11.5" font-weight="600" fill="#1E293B">${escapeXml(line)}</text>`
    ),
    `  </g>`,
  ].join('\n');
}

function renderArrowXml(arrow: SvgArrow): string {
  const pathD = buildArrowPath(arrow);
  const { w: boxW, h: boxH } = getLabelBoxDimensions(arrow.labelLines);
  const [lx, ly] = arrow.labelPos;
  const topY = ly - boxH / 2;

  return [
    `  <g id="flow-${escapeXml(arrow.id)}">`,
    `    <path d="${pathD}" fill="none" stroke="#334155" stroke-width="1.55" stroke-linejoin="round" marker-end="url(#dfd-arrow)" />`,
    `    <rect x="${lx - boxW / 2}" y="${topY}" width="${boxW}" height="${boxH}" rx="3" fill="#FFFFFF" fill-opacity="0.95" />`,
    ...arrow.labelLines.map(
      (line, idx) =>
        `    <text x="${lx}" y="${topY + 13 + idx * 13}" text-anchor="middle" font-family="'DM Sans', sans-serif" font-size="10.5" font-weight="500" fill="#1E293B">${escapeXml(line)}</text>`
    ),
    `  </g>`,
  ].join('\n');
}

export function buildStandaloneSvg(spec: DiagramSpec, includeGrid = false): string {
  const { width, height, title, subtitle, nodes, arrows } = spec;

  const gridDef = includeGrid
    ? `    <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">\n      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#E2E8F0" stroke-width="0.6" />\n    </pattern>\n`
    : '';

  const gridRect = includeGrid
    ? `  <rect width="${width}" height="${height}" fill="url(#bp-grid)" />\n`
    : '';

  const hasDatastore = nodes.some((n) => n.kind === 'datastore');

  const legendItems = [
    `<rect x="${width - 430}" y="22" width="18" height="14" rx="2" fill="#F8FAFC" stroke="#0F172A" stroke-width="1.5" />`,
    `<text x="${width - 406}" y="33" font-family="'DM Sans', sans-serif" font-size="11" fill="#334155">External Entity</text>`,
    `<rect x="${width - 310}" y="22" width="20" height="14" rx="5" fill="#FFFFFF" stroke="#0F766E" stroke-width="1.5" />`,
    `<text x="${width - 284}" y="33" font-family="'DM Sans', sans-serif" font-size="11" fill="#334155">Process</text>`,
    ...(hasDatastore
      ? [
          `<path d="M ${width - 208} 22 H ${width - 226} V 36 H ${width - 208}" fill="#FFFBEB" stroke="#B45309" stroke-width="1.5" />`,
          `<text x="${width - 202}" y="33" font-family="'DM Sans', sans-serif" font-size="11" fill="#334155">Data Store</text>`,
        ]
      : []),
    `<line x1="${width - 122}" y1="29" x2="${width - 96}" y2="29" stroke="#334155" stroke-width="1.5" marker-end="url(#dfd-arrow)" />`,
    `<text x="${width - 90}" y="33" font-family="'DM Sans', sans-serif" font-size="11" fill="#334155">Data Flow</text>`,
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <marker id="dfd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1.5 L 9.5 5 L 0 8.5 z" fill="#334155" />
    </marker>
${gridDef}  </defs>

  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
${gridRect}
  <!-- Header & Legend (Gane & Sarson DFD Notation) -->
  <text x="44" y="34" font-family="'Plus Jakarta Sans', sans-serif" font-size="17" font-weight="700" fill="#0F172A">${escapeXml(title)}</text>
  <text x="44" y="52" font-family="'DM Sans', sans-serif" font-size="11.5" fill="#475569">${escapeXml(subtitle)}</text>
  <g id="legend">
    ${legendItems.join('\n    ')}
  </g>
  <line x1="44" y1="62" x2="${width - 44}" y2="62" stroke="#E2E8F0" stroke-width="1" />

  <!-- Data Flow Arrows -->
${arrows.map(renderArrowXml).join('\n')}

  <!-- DFD Nodes -->
${nodes.map(renderNodeXml).join('\n')}
</svg>`;
}

export function downloadSvgFile(filename: string, svgString: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPngFromSvg(
  filename: string,
  svgString: string,
  width: number,
  height: number,
  scale = 2.5
): Promise<void> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          reject(new Error('Failed to encode PNG'));
          return;
        }
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to rasterize SVG'));
    };
    img.src = url;
  });
}
