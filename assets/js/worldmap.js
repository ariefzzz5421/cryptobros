/* Dashboard compatibility wrapper.
   The dashboard historically imported WorldMap, while /maps/ now uses the
   richer GlobeMap. Keeping this export name lets the existing dashboard data,
   controls, tooltips, selection and detail-card logic use the same 3D engine
   without duplicating orchestration code. */

export { GlobeMap as WorldMap } from './globe-map.js';

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}
