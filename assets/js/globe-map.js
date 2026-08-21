/* Interactive 3D jurisdiction globe.

   This keeps the map dependency-free: Natural Earth topology is projected to
   an orthographic sphere directly on Canvas. Drag rotates the planet, wheel or
   pinch zooms it, and volume markers are rendered as illuminated 3D stems.
   The public API intentionally mirrors the old WorldMap so maps-page.js can
   keep its data and detail-panel logic.
*/

import { decodeTopology } from './geo.js';
import {
  PALETTE, seqColor, perceptual, fmtUsd, fmtNum, setupCanvas, debounce, el,
} from './utils.js';

const DEG = Math.PI / 180;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const wrapLon = (value) => ((value + 540) % 360) - 180;

export class GlobeMap {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.tooltip = opts.tooltip || null;
    this.onSelect = opts.onSelect || (() => {});
    this.viewLabel = opts.viewLabel || null;
    this.countries = [];
    this.data = null;
    this.centerLon = 12;
    this.centerLat = 12;
    this.zoomLevel = 1;
    this.minZoom = .82;
    this.maxZoom = 2.35;
    this.showLabels = true;
    this.autoRotate = true;
    this.selectedName = null;
    this.hoverName = null;
    this.markers = [];
    this.ready = false;
    this.drag = null;
    this.moved = false;
    this.lastInteraction = performance.now();
    this.lastFrame = performance.now();
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._bind();
    this._animate = this._animate.bind(this);
    requestAnimationFrame(this._animate);
  }

  setTopology(topo) {
    this.countries = decodeTopology(topo, 'countries').filter((feature) => feature.name !== 'Antarctica');
    this.ready = true;
    this.resize();
  }

  setData(agg) {
    this.data = agg;
    this.maxVol = agg.rows[0]?.volUsd || 0;
    this.fillByGeo = new Map();
    for (const row of agg.rows) {
      if (row.geoName) this.fillByGeo.set(row.geoName, row);
    }
    this.render();
  }

  setAutoRotate(enabled) {
    this.autoRotate = Boolean(enabled);
    this.lastInteraction = performance.now();
    this.render();
  }

  zoom(factor) {
    this.zoomLevel = clamp(this.zoomLevel * factor, this.minZoom, this.maxZoom);
    this._interacted();
    this.render();
  }

  reset() {
    this.centerLon = 12;
    this.centerLat = 12;
    this.zoomLevel = 1;
    this.selectedName = null;
    this._interacted();
    this.render();
    this.onSelect(null);
  }

  focus(name) {
    const row = this.data?.rows?.find((item) => item.name === name && item.lat != null && item.lon != null);
    if (!row) return;
    this.centerLon = wrapLon(row.lon);
    this.centerLat = clamp(row.lat, -58, 68);
    this.zoomLevel = Math.max(this.zoomLevel, 1.35);
    this.selectedName = row.name;
    this._interacted();
    this.render();
    this.onSelect(row);
  }

  resize() {
    const { ctx, w, h, dpr } = setupCanvas(this.canvas);
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.render();
  }

  _interacted() {
    this.lastInteraction = performance.now();
  }

  _bind() {
    const canvas = this.canvas;

    canvas.addEventListener('pointerdown', (event) => {
      canvas.setPointerCapture?.(event.pointerId);
      this.drag = { x: event.clientX, y: event.clientY, lon: this.centerLon, lat: this.centerLat };
      this.moved = false;
      this._interacted();
    });

    canvas.addEventListener('pointermove', (event) => {
      if (this.drag) {
        const dx = event.clientX - this.drag.x;
        const dy = event.clientY - this.drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) this.moved = true;
        this.centerLon = wrapLon(this.drag.lon - dx * .28 / this.zoomLevel);
        this.centerLat = clamp(this.drag.lat + dy * .22 / this.zoomLevel, -70, 70);
        this._interacted();
        this._tooltip(null);
        this.render();
        return;
      }
      const point = this._pos(event);
      const marker = this._hitTest(point.x, point.y);
      const name = marker?.row?.name || null;
      if (name !== this.hoverName) {
        this.hoverName = name;
        this.render();
      }
      this._tooltip(marker, event);
      canvas.style.cursor = marker ? 'pointer' : 'grab';
    });

    const release = (event) => {
      if (!this.drag) return;
      this.drag = null;
      canvas.releasePointerCapture?.(event.pointerId);
      canvas.style.cursor = 'grab';
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', () => {
      if (!this.drag) {
        this.hoverName = null;
        this._tooltip(null);
        this.render();
      }
    });

    canvas.addEventListener('click', (event) => {
      if (this.moved) return;
      const point = this._pos(event);
      const marker = this._hitTest(point.x, point.y);
      this.selectedName = marker?.row?.name === this.selectedName ? null : marker?.row?.name || null;
      this._interacted();
      this.render();
      this.onSelect(marker && this.selectedName ? marker.row : null);
    });

    canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    let pinch = null;
    canvas.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) pinch = this._pinchDistance(event);
    }, { passive: true });
    canvas.addEventListener('touchmove', (event) => {
      if (event.touches.length !== 2 || !pinch) return;
      const distance = this._pinchDistance(event);
      this.zoom(distance / pinch);
      pinch = distance;
      event.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => { pinch = null; });

    this._sync = debounce(() => this.resize(), 100);
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(this._sync);
      this._ro.observe(canvas);
    }
    window.addEventListener('resize', this._sync);
    document.addEventListener('visibilitychange', this._sync);
  }

  _pos(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  _pinchDistance(event) {
    const [a, b] = [event.touches[0], event.touches[1]];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  _geometry() {
    const r = Math.min(this.w, this.h) * .405 * this.zoomLevel;
    return { cx: this.w * .5, cy: this.h * .5, r };
  }

  _project(lon, lat) {
    const lambda = (lon - this.centerLon) * DEG;
    const phi = lat * DEG;
    const tilt = this.centerLat * DEG;
    const cosPhi = Math.cos(phi);
    const x0 = cosPhi * Math.sin(lambda);
    const y0 = Math.sin(phi);
    const z0 = cosPhi * Math.cos(lambda);
    const cosTilt = Math.cos(tilt);
    const sinTilt = Math.sin(tilt);
    const y = y0 * cosTilt - z0 * sinTilt;
    const z = y0 * sinTilt + z0 * cosTilt;
    const { cx, cy, r } = this._geometry();
    return { x: cx + x0 * r, y: cy - y * r, z, nx: x0, ny: -y };
  }

  _hitTest(x, y) {
    for (let i = this.markers.length - 1; i >= 0; i -= 1) {
      const marker = this.markers[i];
      const rr = Math.max(11, marker.radius + 5);
      if ((x - marker.x) ** 2 + (y - marker.y) ** 2 <= rr * rr) return marker;
      if (x >= marker.x - 8 && x <= marker.x + 8 && y >= marker.tipY - 8 && y <= marker.y + 6) return marker;
    }
    return null;
  }

  _animate(now) {
    const dt = Math.min(50, now - this.lastFrame);
    this.lastFrame = now;
    if (!document.hidden && this.ready && this.autoRotate && !this.reduceMotion && !this.drag
      && now - this.lastInteraction > 2400 && !this.selectedName) {
      this.centerLon = wrapLon(this.centerLon + dt * .0016);
      this.render();
    }
    requestAnimationFrame(this._animate);
  }

  render() {
    if (!this.ctx || !this.ready) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!this._resizing && (dpr !== this.dpr
      || Math.abs(this.canvas.clientWidth - this.w) > 1
      || Math.abs(this.canvas.clientHeight - this.h) > 1)) {
      this._resizing = true;
      this.resize();
      this._resizing = false;
      return;
    }

    const { ctx, w, h } = this;
    const { cx, cy, r } = this._geometry();
    ctx.clearRect(0, 0, w, h);
    this._drawBackdrop(ctx, cx, cy, r);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    this._drawOcean(ctx, cx, cy, r);
    this._drawGraticule(ctx);
    this._drawCountries(ctx);
    ctx.restore();

    this._drawAtmosphere(ctx, cx, cy, r);
    this._drawMarkers(ctx);
    if (this.showLabels) this._drawLabels(ctx);
    this._syncViewLabel();
  }

  _drawBackdrop(ctx, cx, cy, r) {
    const halo = ctx.createRadialGradient(cx, cy, r * .55, cx, cy, r * 1.32);
    halo.addColorStop(0, 'rgba(54, 126, 255, 0.08)');
    halo.addColorStop(.72, 'rgba(42, 113, 235, 0.11)');
    halo.addColorStop(1, 'rgba(42, 113, 235, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.32, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawOcean(ctx, cx, cy, r) {
    const ocean = ctx.createRadialGradient(cx - r * .34, cy - r * .38, r * .04, cx, cy, r);
    ocean.addColorStop(0, seqColor(.32));
    ocean.addColorStop(.38, PALETTE.map.land);
    ocean.addColorStop(1, PALETTE.plane);
    ctx.fillStyle = ocean;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  _drawAtmosphere(ctx, cx, cy, r) {
    const glow = ctx.createRadialGradient(cx, cy, r * .91, cx, cy, r * 1.09);
    glow.addColorStop(0, 'rgba(90, 171, 255, 0)');
    glow.addColorStop(.63, 'rgba(90, 171, 255, 0.16)');
    glow.addColorStop(.85, 'rgba(90, 171, 255, 0.34)');
    glow.addColorStop(1, 'rgba(90, 171, 255, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = 'rgba(174, 218, 255, 0.38)';
    ctx.stroke();
  }

  _drawGraticule(ctx) {
    ctx.save();
    ctx.strokeStyle = PALETTE.map.grid;
    ctx.lineWidth = .8;
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 4) points.push(this._project(lon, lat));
      this._strokeVisible(points, ctx);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const points = [];
      for (let lat = -85; lat <= 85; lat += 3) points.push(this._project(lon, lat));
      this._strokeVisible(points, ctx);
    }
    ctx.restore();
  }

  _strokeVisible(points, ctx) {
    ctx.beginPath();
    let drawing = false;
    for (const point of points) {
      if (point.z <= .005) {
        drawing = false;
        continue;
      }
      if (!drawing) {
        ctx.moveTo(point.x, point.y);
        drawing = true;
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
  }

  _drawCountries(ctx) {
    for (const country of this.countries) {
      const row = this.fillByGeo?.get(country.name);
      const t = row ? perceptual(row.volUsd, this.maxVol) : 0;
      ctx.strokeStyle = row
        ? seqColor(.42 + .5 * t)
        : PALETTE.map.stroke;
      ctx.lineWidth = row ? 1.05 : .68;
      for (const ring of country.rings) {
        const points = ring.map(([lon, lat]) => this._project(lon, lat));
        this._strokeVisible(points, ctx);
      }
    }
  }

  _drawMarkers(ctx) {
    if (!this.data?.rows?.length) {
      this.markers = [];
      return;
    }
    const topMapped = this.data.rows.find((row) => row.lat != null && row.lon != null);
    const markers = this.data.rows
      .filter((row) => row.lat != null && row.lon != null)
      .map((row) => {
        const point = this._project(row.lon, row.lat);
        const t = perceptual(row.volUsd, this.maxVol);
        const radius = 4.5 + 7.5 * Math.sqrt(row.volUsd / (this.maxVol || 1));
        const stem = 12 + 46 * Math.sqrt(row.volUsd / (this.maxVol || 1));
        return { row, ...point, t, radius, stem, tipY: point.y - stem, isTop: row === topMapped };
      })
      .filter((marker) => marker.z > .03)
      .sort((a, b) => a.z - b.z);

    for (const marker of markers) {
      const active = marker.row.name === this.hoverName || marker.row.name === this.selectedName;
      const color = marker.isTop ? PALETTE.status.warning : seqColor(.5 + .48 * marker.t);
      const stemTop = marker.tipY - (active ? 5 : 0);

      const halo = ctx.createRadialGradient(marker.x, marker.y, marker.radius * .2, marker.x, marker.y, marker.radius * 3.2);
      halo.addColorStop(0, marker.isTop ? 'rgba(255, 210, 85, .28)' : 'rgba(85, 166, 255, .26)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, marker.radius * 3.2, 0, Math.PI * 2);
      ctx.fill();

      const stemGradient = ctx.createLinearGradient(marker.x, marker.y, marker.x, stemTop);
      stemGradient.addColorStop(0, 'rgba(255,255,255,.08)');
      stemGradient.addColorStop(1, color);
      ctx.strokeStyle = stemGradient;
      ctx.lineWidth = active ? 3.2 : 2.1;
      ctx.beginPath();
      ctx.moveTo(marker.x, marker.y);
      ctx.lineTo(marker.x, stemTop);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(marker.x, stemTop, marker.radius * (active ? 1.18 : .9), 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = active ? PALETTE.ink : 'rgba(255,255,255,.42)';
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.globalAlpha = .76;
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, Math.max(2.2, marker.radius * .48), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (marker.isTop) {
        ctx.strokeStyle = PALETTE.status.warning;
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = .66;
        ctx.beginPath();
        ctx.arc(marker.x, stemTop, marker.radius * 1.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    this.markers = markers;
  }

  _drawLabels(ctx) {
    const candidates = this.markers
      .filter((marker) => marker.t > .24 || marker.row.name === this.hoverName || marker.row.name === this.selectedName)
      .sort((a, b) => b.row.volUsd - a.row.volUsd)
      .slice(0, this.zoomLevel > 1.25 ? 12 : 7);
    ctx.save();
    ctx.font = '600 10px Geist, Segoe UI, sans-serif';
    ctx.textBaseline = 'middle';
    for (const marker of candidates) {
      const text = marker.row.name;
      const width = ctx.measureText(text).width;
      const x = marker.x + marker.radius + 8;
      const y = marker.tipY;
      ctx.fillStyle = PALETTE.map.labelBg;
      ctx.fillRect(x - 5, y - 10, width + 10, 20);
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  _tooltip(marker, event) {
    if (!this.tooltip) return;
    if (!marker || !event) {
      this.tooltip.hidden = true;
      this.tooltip.replaceChildren();
      return;
    }
    const rank = this.data?.rows?.indexOf(marker.row) + 1;
    this.tooltip.replaceChildren(
      el('strong', {}, marker.row.name),
      el('div', { class: 'muted' }, `${marker.row.region} · rank #${rank}`),
      el('div', { class: 'num' }, fmtUsd(marker.row.volUsd)),
      el('small', { class: 'muted' }, `${(marker.row.share * 100).toFixed(2)}% mapped share · ${fmtNum(marker.row.count)} exchanges`),
    );
    const point = this._pos(event);
    const maxX = Math.max(8, this.w - 286);
    const maxY = Math.max(8, this.h - 118);
    this.tooltip.style.left = `${clamp(point.x + 16, 8, maxX)}px`;
    this.tooltip.style.top = `${clamp(point.y + 14, 8, maxY)}px`;
    this.tooltip.hidden = false;
  }

  _syncViewLabel() {
    if (!this.viewLabel) return;
    const lon = Math.round(this.centerLon);
    const lat = Math.round(this.centerLat);
    this.viewLabel.textContent = `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'} · ${this.zoomLevel.toFixed(1)}×`;
  }
}
