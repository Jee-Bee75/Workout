// Gevulde silhouetten per oefening, kleur via currentColor (Nike-stijl: bold, minimalistisch)
const ICON_PATHS = {
  push:   '<circle cx="38" cy="17" r="4.6"/><path d="M33 21 L20 27 L13 32 L6 26 L2 30 L11 37 L21 32 L31 28 L33 41 L41 41 L39 26 Z"/>',
  lunge:  '<circle cx="20" cy="6" r="4.4"/><path d="M17 12 H23 L25 24 L32 30 L34 42 L26 42 L25 32 L22 28 L16 38 L7 39 L5 33 L15 31 L19 24 Z"/><path d="M19 14 L27 21 L29 20 L22 13 Z"/>',
  rot:    '<circle cx="15" cy="7" r="4.4"/><path d="M12 13 H18 L19 27 L15 42 L9 42 L12 28 Z"/><path d="M16 16 L20 23 L30 21 L31 16 Z"/><path d="M31 17 H45 M31 21 H45" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2.6 2.6"/>',
  ham:    '<circle cx="7" cy="19" r="4.2"/><path d="M12 20 L23 23 L23 42 L16 42 L16 27 L12 25 L11 33 L4 33 L4 28 L9 27 Z"/><rect x="9" y="33" width="9" height="5" rx="1.6"/><path d="M23 24 L43 19 L44 24 L26 28 Z"/>',
  core:   '<circle cx="7" cy="22" r="4.2"/><path d="M12 26 L44 35 L43 40 L12 31 Z"/><path d="M12 26 V37 L21 37 L21 31 L16 30 V26 Z"/>',
  row:    '<circle cx="16" cy="8" r="4.2"/><path d="M13 14 H19 L17 31 L39 31 L39 37 L11 37 L14 30 Z"/><path d="M14 18 L7 24 L14 27 Z"/><path d="M16 26 L40 30" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="2.6 2.6"/>',
  glute:  '<circle cx="6" cy="20" r="4.2"/><path d="M10 23 H27 L29 42 L22 42 L21 27 L13 27 L12 42 L5 42 Z"/><path d="M27 24 L36 18 L42 25 L35 28 L29 27 Z"/>',
  bridge: '<circle cx="6" cy="35" r="4.2"/><path d="M11 37 L25 26 L35 22 L39 41 L31 41 L28 27 L24 30 L22 41 L14 41 Z"/>',
  calf:   '<circle cx="24" cy="6" r="4.2"/><path d="M21 12 H27 L28 23 L35 29 L37 38 L30 38 L28 31 L24 28 L20 31 L18 38 L11 38 L13 29 L20 23 Z"/><path d="M21 14 L15 21 L17 23 L22 18 Z"/><path d="M27 14 L33 21 L31 23 L26 18 Z"/><path d="M11 38 L9 44 L18 44 L18 38 Z"/><path d="M30 38 L30 44 L39 44 L37 38 Z"/><path d="M41 13 V4 M37.4 7.4 L41 4 L44.6 7.4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
};
function exIcon(id, size){ return `<svg viewBox="0 0 48 48" width="${size||32}" height="${size||32}" fill="currentColor" aria-hidden="true">${ICON_PATHS[id]||''}</svg>`; }
function tint(hex, a){ const n = parseInt(hex.slice(1),16); const m = c => Math.round(c + (255-c)*(1-a)); return `rgb(${m(n>>16)},${m((n>>8)&255)},${m(n&255)})`; }
