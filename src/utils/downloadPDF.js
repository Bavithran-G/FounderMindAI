import { jsPDF } from 'jspdf';

// ── Page geometry ──────────────────────────────────────────────
const PW     = 210;          // A4 width  (mm)
const PH     = 297;          // A4 height (mm)
const ML     = 15;           // left margin
const MR     = 15;           // right margin
const CW     = PW - ML - MR; // usable content width = 180mm
const TOP_Y  = 20;           // first content Y (after header)
const BOT_Y  = PH - 18;      // last safe Y (before footer)
const LH     = 5.2;          // base line height (mm)

// ── Brand palette (R, G, B arrays) ────────────────────────────
const SKY    = [14,  165, 233];
const INDIGO = [99,  102, 241];
const NAVY   = [6,   9,   30];
const PANEL  = [15,  20,  50];
const CARD   = [22,  28,  66];
const WHITE  = [241, 245, 249];
const MUTED  = [100, 116, 139];
const EMERALD= [16,  185, 129];
const AMBER  = [245, 158, 11];
const ROSE   = [244, 63,  94];
const VIOLET = [139, 92,  246];

// ── Helpers ────────────────────────────────────────────────────
function setFill(doc, col)              { doc.setFillColor(col[0], col[1], col[2]); }
function setStroke(doc, col, w = 0.3)  { doc.setDrawColor(col[0], col[1], col[2]); doc.setLineWidth(w); }
function setTxt(doc, col)              { doc.setTextColor(col[0], col[1], col[2]); }
function setFont(doc, size, bold=false){ doc.setFontSize(size); doc.setFont('helvetica', bold ? 'bold' : 'normal'); }

function fillRect(doc, x, y, w, h)  { doc.rect(x, y, w, h, 'F'); }
function strokeRect(doc, x, y, w, h){ doc.rect(x, y, w, h, 'S'); }
function rRect(doc, x, y, w, h, r, style='F') {
  try { doc.roundedRect(x, y, w, h, r, r, style); }
  catch (_) { doc.rect(x, y, w, h, style); }
}

function safe(v, fb='—')    { return (v === null || v === undefined || v === '') ? fb : String(v); }
function safeArr(v)          { return Array.isArray(v) ? v : []; }

// ── Dynamic text block — returns new Y after printing ─────────
function textBlock(doc, text, x, y, maxW, lh=LH, maxLines=99) {
  const lines = doc.splitTextToSize(safe(text), maxW);
  const out   = lines.slice(0, maxLines);
  doc.text(out, x, y);
  return y + out.length * lh;
}

// ── Text height estimator ──────────────────────────────────────
function textH(doc, text, maxW, lh=LH) {
  const lines = doc.splitTextToSize(safe(text), maxW);
  return lines.length * lh;
}

// ── Score colour / band ────────────────────────────────────────
function scoreCol(s)  { return s>=86?EMERALD:s>=76?[52,211,153]:s>=66?AMBER:s>=51?[251,146,60]:s>=36?[248,113,113]:ROSE; }
function scoreBand(s) { return s>=86?'EXCEPTIONAL':s>=76?'STRONG':s>=66?'ABOVE AVG':s>=51?'AVERAGE':s>=36?'WEAK':'POOR'; }
function priorityCol(p){ return p==='High'?ROSE:p==='Medium'?AMBER:MUTED; }

// ── Page chrome ────────────────────────────────────────────────
function drawBg(doc) { setFill(doc, NAVY); fillRect(doc, 0, 0, PW, PH); }

function drawPageHeader(doc, label) {
  setFill(doc, SKY);    fillRect(doc, 0, 0, PW/2, 2.5);
  setFill(doc, INDIGO); fillRect(doc, PW/2, 0, PW/2, 2.5);
  setFill(doc, PANEL);  fillRect(doc, 0, 2.5, PW, 12);
  setFont(doc, 7); setTxt(doc, MUTED);
  doc.text('FounderMindAI', ML, 10);
  doc.text(label, PW/2, 10, { align:'center' });
  const d = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  doc.text(d, PW-MR, 10, { align:'right' });
  setStroke(doc, MUTED, 0.25);
  doc.line(0, 14.5, PW, 14.5);
  return TOP_Y;
}

function drawPageFooter(doc, num) {
  setStroke(doc, MUTED, 0.25);
  doc.line(ML, BOT_Y+2, PW-MR, BOT_Y+2);
  setFont(doc, 6.5); setTxt(doc, MUTED);
  doc.text('FounderMindAI Startup Intelligence Report', ML, BOT_Y+6);
  doc.text(`Page ${num}`, PW-MR, BOT_Y+6, { align:'right' });
}

// ── Section sub-heading ────────────────────────────────────────
function subHead(doc, label, y, col=SKY) {
  // Never orphan a heading at page bottom
  if (y > BOT_Y - 20) return y; // handled by caller
  setFont(doc, 8.5, true); setTxt(doc, col);
  doc.text(label, ML, y);
  setStroke(doc, col, 0.4);
  doc.line(ML, y+2, PW-MR, y+2);
  return y+7;
}

// ── Ensure enough vertical space, add page if needed ──────────
function ensureSpace(doc, y, needed, pageRef) {
  if (y + needed > BOT_Y) {
    drawPageFooter(doc, pageRef.page);
    doc.addPage();
    pageRef.page++;
    drawBg(doc);
    const ny = drawPageHeader(doc, pageRef.section);
    return ny;
  }
  return y;
}

// ── Score circle ───────────────────────────────────────────────
function scoreCircle(doc, score, label, cx, y) {
  const col  = scoreCol(score);
  const band = scoreBand(score);
  setStroke(doc, col, 2.2);
  doc.circle(cx, y+13, 10.5, 'S');
  setFont(doc, 14, true); setTxt(doc, col);
  doc.text(String(score), cx, y+14.5, {align:'center'});
  setFont(doc, 6, false); setTxt(doc, MUTED);
  doc.text('/100', cx, y+20.5, {align:'center'});
  setFill(doc, col); rRect(doc, cx-11, y+24, 22, 5, 2, 'F');
  setFont(doc, 5.5, true); setTxt(doc, NAVY);
  doc.text(band, cx, y+28, {align:'center'});
  setFont(doc, 6.5, false); setTxt(doc, MUTED);
  doc.text(label, cx, y+35, {align:'center'});
}

// ── Info card with DYNAMIC height ─────────────────────────────
function infoCard(doc, x, y, w, label, value, col=SKY) {
  setFont(doc, 7.5, false);
  const innerW  = w - 10;
  const valLines = doc.splitTextToSize(safe(value), innerW);
  const h = 6 + valLines.length * LH + 4; // label row + text + padding
  setFill(doc, CARD); fillRect(doc, x, y, w, h);
  setFill(doc, col);  fillRect(doc, x, y, 2.5, h);
  setStroke(doc, col, 0.3); strokeRect(doc, x, y, w, h);
  setFont(doc, 6, false); setTxt(doc, MUTED);
  doc.text(label.toUpperCase(), x+5, y+5.5);
  setFont(doc, 7.5, false); setTxt(doc, WHITE);
  doc.text(valLines, x+5, y+5.5+LH);
  return y + h;
}

// ══════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export function downloadReportPDF(result) {
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const pageRef = { page: 1, section: '' };

  // ────────────────────────────────────────────────────────────
  // PAGE 1 — Cover
  // ────────────────────────────────────────────────────────────
  drawBg(doc);
  setFill(doc, SKY);    fillRect(doc, 0, 0, PW/2, 3);
  setFill(doc, INDIGO); fillRect(doc, PW/2, 0, PW/2, 3);

  setFill(doc, PANEL); rRect(doc, PW/2-40, 40, 80, 10, 5, 'F');
  setFont(doc, 10, true); setTxt(doc, SKY);
  doc.text('FounderMindAI', PW/2, 47, {align:'center'});

  setFont(doc, 28, true); setTxt(doc, WHITE);
  doc.text('FounderMindAI', PW/2, 78, {align:'center'});
  setFont(doc, 10, false); setTxt(doc, MUTED);
  doc.text('Startup Intelligence Report', PW/2, 88, {align:'center'});
  setFill(doc, INDIGO); fillRect(doc, PW/2-28, 93, 56, 0.6);

  // Idea box — dynamic height
  setFont(doc, 11, true);
  const ideaLines = doc.splitTextToSize(`"${safe(result.idea)}"`, CW-32);
  const ideaH = Math.max(34, 16 + ideaLines.length * 6);
  setFill(doc, PANEL); rRect(doc, ML+8, 100, CW-16, ideaH, 4, 'F');
  setStroke(doc, SKY, 0.5); rRect(doc, ML+8, 100, CW-16, ideaH, 4, 'S');
  setFont(doc, 7, false); setTxt(doc, MUTED);
  doc.text('STARTUP IDEA', PW/2, 107, {align:'center'});
  setFont(doc, 11, true); setTxt(doc, WHITE);
  doc.text(ideaLines, PW/2, 116, {align:'center'});

  const statsY = 100 + ideaH + 8;
  const stats = [
    { v:'6', l:'AI Agents' },
    { v:'5', l:'Report Sections' },
    { v: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), l:'Generated' },
  ];
  const sw = (CW-16)/3;
  stats.forEach((s, i) => {
    const sx = ML+8 + i*sw;
    setFill(doc, CARD); rRect(doc, sx+2, statsY, sw-4, 22, 3, 'F');
    setFont(doc, 14, true); setTxt(doc, SKY);
    doc.text(s.v, sx+sw/2, statsY+11, {align:'center'});
    setFont(doc, 7, false); setTxt(doc, MUTED);
    doc.text(s.l, sx+sw/2, statsY+18, {align:'center'});
  });

  setFont(doc, 7, false); setTxt(doc, MUTED);
  doc.text('Powered by FounderMindAI  |  Confidential', PW/2, PH-8, {align:'center'});
  setFill(doc, INDIGO); fillRect(doc, 0, PH-3, PW, 3);
  drawPageFooter(doc, pageRef.page);

  // ────────────────────────────────────────────────────────────
  // PAGE 2 — Market Research
  // ────────────────────────────────────────────────────────────
  const mr = result.marketResearch;
  if (mr) {
    doc.addPage(); pageRef.page++;
    pageRef.section = 'Market Research';
    drawBg(doc);
    let y = drawPageHeader(doc, 'Market Research');

    // Score circle + analysis (left 24mm for circle, rest for card)
    const circW = 28;
    const cardX = ML + circW + 4;
    const cardW = CW - circW - 4;
    scoreCircle(doc, mr.opportunityScore||0, 'Opportunity', ML+circW/2, y);
    const cardBotY = infoCard(doc, cardX, y, cardW, 'Market Analysis', mr.analysis, SKY);
    // TAM tag below card
    setFont(doc, 7.5, true); setTxt(doc, EMERALD);
    const tamY = Math.max(y+38, cardBotY+3);
    doc.text('TAM: ' + safe(mr.targetMarketSize), cardX+3, tamY);
    y = tamY + 7;

    // Competitors — single-column rows for reliability
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, `Competitors (${safeArr(mr.competitors).length})`, y, SKY); }

    safeArr(mr.competitors).forEach(c => {
      setFont(doc, 7.5, false);
      const nameH   = LH;
      const descH   = textH(doc, c.description, CW-10, LH);
      const weakH   = textH(doc, 'Weakness: '+safe(c.weakness), CW-10, LH);
      const rowH    = nameH + descH + weakH + 8;
      y = ensureSpace(doc, y, rowH, pageRef);
      if (y >= BOT_Y) return;

      setFill(doc, CARD); fillRect(doc, ML, y, CW, rowH);
      setFill(doc, SKY);  fillRect(doc, ML, y, 2.5, rowH);
      setStroke(doc, MUTED, 0.2); strokeRect(doc, ML, y, CW, rowH);

      setFont(doc, 8, true); setTxt(doc, WHITE);
      doc.text(safe(c.name), ML+5, y+nameH+2);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      y = y + nameH + 3;
      y = textBlock(doc, c.description, ML+5, y+LH, CW-10, LH) + 1;
      setTxt(doc, AMBER);
      y = textBlock(doc, 'Weakness: '+safe(c.weakness), ML+5, y+LH, CW-10, LH) + 1;
      y += 5;
    });
    y += 4;

    // Trends
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Market Trends', y, INDIGO); }
    safeArr(mr.trends).forEach(t => {
      setFont(doc, 7.5, false);
      const h = textH(doc, t, CW-8, LH);
      y = ensureSpace(doc, y, h+4, pageRef);
      if (y >= BOT_Y) return;
      setFill(doc, SKY); fillRect(doc, ML, y, 1.5, h+1);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      y = textBlock(doc, t, ML+5, y+LH, CW-8, LH);
      y += 3;
    });
    y += 3;

    // Gaps
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Market Gaps', y, VIOLET); }
    safeArr(mr.gaps).forEach((g, i) => {
      setFont(doc, 7.5, false);
      const h = textH(doc, g, CW-12, LH);
      y = ensureSpace(doc, y, h+4, pageRef);
      if (y >= BOT_Y) return;
      setFill(doc, INDIGO); rRect(doc, ML, y, 5, 5, 1, 'F');
      setFont(doc, 6, true); setTxt(doc, WHITE);
      doc.text(String(i+1), ML+2.5, y+3.8, {align:'center'});
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      y = textBlock(doc, g, ML+8, y+LH, CW-12, LH);
      y += 3;
    });

    drawPageFooter(doc, pageRef.page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 3 — Business Strategy
  // ────────────────────────────────────────────────────────────
  const bs = result.businessStrategy;
  if (bs) {
    doc.addPage(); pageRef.page++;
    pageRef.section = 'Business Strategy';
    drawBg(doc);
    let y = drawPageHeader(doc, 'Business Strategy');

    // Value Proposition — dynamic height
    setFont(doc, 10, true);
    const vpLines = doc.splitTextToSize(safe(bs.valueProposition), CW-12);
    const vpH = Math.max(20, 8 + vpLines.length * 6 + 4);
    setFill(doc, CARD); rRect(doc, ML, y, CW, vpH, 3, 'F');
    setStroke(doc, INDIGO, 0.5); rRect(doc, ML, y, CW, vpH, 3, 'S');
    setFont(doc, 6.5, false); setTxt(doc, MUTED);
    doc.text('VALUE PROPOSITION', ML+5, y+5.5);
    setFont(doc, 9.5, true); setTxt(doc, WHITE);
    doc.text(vpLines, ML+5, y+5.5+LH+1);
    y += vpH + 5;

    // 3 info cards — compute max height then draw all at same height
    setFont(doc, 7.5, false);
    const c3W = (CW-8)/3;
    const moatLines = doc.splitTextToSize(safe(bs.moat),       c3W-10);
    const uspLines  = doc.splitTextToSize(safe(bs.usp),        c3W-10);
    const revLines  = doc.splitTextToSize(safe(bs.revenueModel),c3W-10);
    const maxCardLines = Math.max(moatLines.length, uspLines.length, revLines.length);
    const triH = 7 + maxCardLines * LH + 4;

    const drawTriCard = (x, lbl, lines, col) => {
      setFill(doc, CARD); fillRect(doc, x, y, c3W, triH);
      setFill(doc, col);  fillRect(doc, x, y, 2.5, triH);
      setStroke(doc, col, 0.3); strokeRect(doc, x, y, c3W, triH);
      setFont(doc, 6, false); setTxt(doc, MUTED);
      doc.text(lbl.toUpperCase(), x+5, y+5.5);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(lines, x+5, y+5.5+LH);
    };
    drawTriCard(ML,             'Competitive Moat',     moatLines, INDIGO);
    drawTriCard(ML+c3W+4,       'Unique Selling Point', uspLines,  SKY);
    drawTriCard(ML+2*(c3W+4),   'Revenue Model',        revLines,  EMERALD);
    y += triH + 7;

    // Pricing tiers — dynamic height per tier
    y = ensureSpace(doc, y, 30, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Pricing Tiers', y, SKY); }

    const tiers = safeArr(bs.pricingTiers);
    const tw    = CW / Math.max(tiers.length, 1);
    // Compute max tier height
    let maxTierH = 0;
    tiers.forEach(tier => {
      setFont(doc, 7, false);
      let th = 28; // name + price + divider
      safeArr(tier.features).forEach(f => {
        th += doc.splitTextToSize('+ '+safe(f), tw-8).length * LH;
      });
      th += 6;
      maxTierH = Math.max(maxTierH, th);
    });
    maxTierH = Math.max(maxTierH, 50);
    y = ensureSpace(doc, y, maxTierH+8, pageRef);

    tiers.forEach((tier, i) => {
      const tx = ML + i*tw;
      const featured = i===1;
      setFill(doc, featured ? CARD : PANEL);
      rRect(doc, tx+1, y, tw-2, maxTierH, 3, 'F');
      if (featured) {
        setStroke(doc, INDIGO, 0.7);
        rRect(doc, tx+1, y, tw-2, maxTierH, 3, 'S');
        // Popular badge above card
        setFill(doc, INDIGO); rRect(doc, tx+tw/2-11, y-4, 22, 6, 2, 'F');
        setFont(doc, 5.5, true); setTxt(doc, WHITE);
        doc.text('POPULAR', tx+tw/2, y-0.5, {align:'center'});
      }
      setFont(doc, 9, true); setTxt(doc, WHITE);
      doc.text(safe(tier.name), tx+tw/2, y+9, {align:'center'});
      setFont(doc, 13, true); setTxt(doc, featured ? [149,152,255] : SKY);
      // Price — wrap if needed
      const priceLines = doc.splitTextToSize(safe(tier.price), tw-6);
      doc.text(priceLines, tx+tw/2, y+18, {align:'center'});
      const priceBlockH = priceLines.length * 6;
      setStroke(doc, MUTED, 0.25);
      const divY = y + 18 + priceBlockH + 2;
      doc.line(tx+4, divY, tx+tw-4, divY);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      let fy = divY + LH + 1;
      safeArr(tier.features).forEach(f => {
        const fl = doc.splitTextToSize('+ '+safe(f), tw-8);
        doc.text(fl, tx+4, fy);
        fy += fl.length * LH;
      });
    });
    y += maxTierH + 12;

    // Customer segments
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Customer Segments', y, VIOLET); }
    let sx = ML;
    const segStartY = y;
    safeArr(bs.customerSegments).forEach(seg => {
      setFont(doc, 7.5, false);
      const segW = doc.getTextWidth(safe(seg)) + 14;
      if (sx + segW > PW-MR) { sx = ML; y += 10; }
      y = ensureSpace(doc, y, 12, pageRef);
      setFill(doc, CARD); rRect(doc, sx, y-5, segW, 8, 2, 'F');
      setStroke(doc, INDIGO, 0.25); rRect(doc, sx, y-5, segW, 8, 2, 'S');
      setFont(doc, 7.5, false); setTxt(doc, INDIGO);
      doc.text(safe(seg), sx+7, y+0.5);
      sx += segW + 5;
    });
    y += 8;

    drawPageFooter(doc, pageRef.page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 4 — Product Architecture
  // ────────────────────────────────────────────────────────────
  const pa = result.productArchitect;
  if (pa) {
    doc.addPage(); pageRef.page++;
    pageRef.section = 'Product Architecture';
    drawBg(doc);
    let y = drawPageHeader(doc, 'Product Architecture');

    // MVP Features
    y = subHead(doc, 'MVP Features — Priority Order', y, EMERALD);
    safeArr(pa.mvpFeatures).slice(0, 8).forEach((f, i) => {
      setFont(doc, 7.5, false);
      const fl = doc.splitTextToSize(safe(f), CW-32);
      const rowH = fl.length * LH + 6;
      y = ensureSpace(doc, y, rowH+2, pageRef);
      if (y >= BOT_Y) return;
      const bCol = i===0?ROSE:i===1?AMBER:MUTED;
      const bLbl = i===0?'MUST HAVE':i===1?'HIGH':'NORMAL';
      setFill(doc, CARD); fillRect(doc, ML, y-2.5, CW, rowH);
      setFill(doc, EMERALD); doc.circle(ML+4.5, y+rowH/2-2.5, 3, 'F');
      setFont(doc, 6.5, true); setTxt(doc, NAVY);
      doc.text(String(i+1), ML+4.5, y+rowH/2-0.5, {align:'center'});
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(fl, ML+11, y+LH);
      setFill(doc, bCol); rRect(doc, PW-MR-22, y-0.5, 22, 6, 1.5, 'F');
      setFont(doc, 5.5, true); setTxt(doc, WHITE);
      doc.text(bLbl, PW-MR-11, y+3.5, {align:'center'});
      y += rowH + 2;
    });
    y += 4;

    // User Flow
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'User Flow', y, SKY); }
    safeArr(pa.userFlow).slice(0,6).forEach((step, i) => {
      setFont(doc, 7.5, false);
      const fl = doc.splitTextToSize(safe(step), CW-12);
      const rowH = fl.length * LH + 5;
      y = ensureSpace(doc, y, rowH+2, pageRef);
      if (y >= BOT_Y) return;
      setFill(doc, SKY); rRect(doc, ML, y, 5, 5, 1, 'F');
      setFont(doc, 6, true); setTxt(doc, NAVY);
      doc.text(String(i+1), ML+2.5, y+3.8, {align:'center'});
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(fl, ML+8, y+LH);
      y += rowH + 1;
      if (i < safeArr(pa.userFlow).length-1) {
        setTxt(doc, MUTED);
        doc.text('↓', ML+2, y+1);
        y += 4;
      }
    });
    y += 4;

    // Roadmap — one row per phase for clean wrapping
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Development Roadmap', y, SKY); }
    const phCols = [SKY, EMERALD, VIOLET, AMBER];
    safeArr(pa.roadmap).forEach((ph, i) => {
      setFont(doc, 7, false);
      const goals = safeArr(ph.goals);
      let phH = 12; // heading + duration
      goals.forEach(g => { phH += doc.splitTextToSize('· '+safe(g), CW-12).length * LH + 1; });
      phH += 4;
      y = ensureSpace(doc, y, phH+2, pageRef);
      if (y >= BOT_Y) return;
      const col = phCols[i % phCols.length];
      setFill(doc, CARD); fillRect(doc, ML, y, CW, phH);
      setFill(doc, col);  fillRect(doc, ML, y, 2.5, phH);
      setStroke(doc, MUTED, 0.2); strokeRect(doc, ML, y, CW, phH);
      setFont(doc, 8, true); setTxt(doc, col);
      doc.text(safe(ph.phase || `Phase ${i+1}`), ML+6, y+6);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      doc.text(safe(ph.duration), ML+6, y+11);
      setFont(doc, 7, false); setTxt(doc, WHITE);
      let gy = y+11+LH;
      goals.forEach(g => {
        const gl = doc.splitTextToSize('· '+safe(g), CW-12);
        doc.text(gl, ML+6, gy);
        gy += gl.length * LH + 1;
      });
      y += phH + 3;
    });
    y += 3;

    // Tech Stack
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Recommended Tech Stack', y, VIOLET); }
    const cats = safeArr(pa.techStack);
    // Flow: 2-col grid
    const catW2 = (CW-4)/2;
    cats.forEach((cat, i) => {
      const cx = ML + (i%2) * (catW2+4);
      const rowI = Math.floor(i/2);
      if (i%2 === 0 && i > 0) y += 0; // already advanced
      setFont(doc, 6.5, true);
      const tools = safeArr(cat.tools);
      const toolH = 8 + tools.length * LH + 4;
      if (i%2 === 0) {
        y = ensureSpace(doc, y, toolH+2, pageRef);
      }
      if (y >= BOT_Y) return;
      setFill(doc, CARD); rRect(doc, cx, y, catW2, toolH, 2, 'F');
      setFont(doc, 6.5, true); setTxt(doc, VIOLET);
      doc.text(safe(cat.category).toUpperCase(), cx+catW2/2, y+7, {align:'center'});
      setStroke(doc, VIOLET, 0.2);
      doc.line(cx+4, y+9.5, cx+catW2-4, y+9.5);
      setFont(doc, 7, false); setTxt(doc, SKY);
      tools.forEach((t, ti) => {
        doc.text(safe(t), cx+catW2/2, y+14+ti*LH, {align:'center'});
      });
      if (i%2 === 1 || i === cats.length-1) {
        y += toolH + 3;
      }
    });

    drawPageFooter(doc, pageRef.page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 5 — VC Investor Report
  // ────────────────────────────────────────────────────────────
  const inv = result.investor;
  if (inv) {
    doc.addPage(); pageRef.page++;
    pageRef.section = 'VC Investor Report';
    drawBg(doc);
    let y = drawPageHeader(doc, 'VC Investor Report');

    const circW2 = 28;
    const vcardX = ML + circW2 + 4;
    const vcardW = CW - circW2 - 4;
    scoreCircle(doc, inv.fundingScore||0, 'Funding Score', ML+circW2/2, y);

    // Verdict — dynamic height
    setFont(doc, 8.5, false);
    const vl = doc.splitTextToSize(safe(inv.verdict), vcardW-14);
    const verdH = Math.max(40, 12 + vl.length * LH + 12);
    setFill(doc, CARD); rRect(doc, vcardX, y, vcardW, verdH, 3, 'F');
    setStroke(doc, AMBER, 0.5); rRect(doc, vcardX, y, vcardW, verdH, 3, 'S');
    setFont(doc, 6.5, false); setTxt(doc, MUTED);
    doc.text('VC VERDICT', vcardX+5, y+6);
    setStroke(doc, MUTED, 0.2);
    doc.line(vcardX, y+9, vcardX+vcardW, y+9);
    setFont(doc, 8.5, false); setTxt(doc, WHITE);
    doc.text(vl, vcardX+5, y+9+LH);
    setFont(doc, 7.5, true); setTxt(doc, AMBER);
    doc.text('Recommended Stage: '+safe(inv.recommendedFundingStage), vcardX+5, y+verdH-5);
    y += Math.max(verdH, 40) + 6;

    // Market + Defensibility — side by side with dynamic height
    const halfW = (CW-4)/2;
    setFont(doc, 7.5, false);
    const msal = doc.splitTextToSize(safe(inv.marketSizeAssessment), halfW-10);
    const defl  = doc.splitTextToSize(safe(inv.defensibility), halfW-10);
    const pairH = Math.max(msal.length, defl.length)*LH + 12;
    y = ensureSpace(doc, y, pairH+4, pageRef);

    const drawHalf = (x, lbl, lines, col) => {
      setFill(doc, CARD); fillRect(doc, x, y, halfW, pairH);
      setFill(doc, col);  fillRect(doc, x, y, 2.5, pairH);
      setStroke(doc, col, 0.3); strokeRect(doc, x, y, halfW, pairH);
      setFont(doc, 6, false); setTxt(doc, MUTED);
      doc.text(lbl.toUpperCase(), x+5, y+5.5);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(lines, x+5, y+5.5+LH);
    };
    drawHalf(ML,         'Market Size Assessment', msal, SKY);
    drawHalf(ML+halfW+4, 'Defensibility',          defl, VIOLET);
    y += pairH + 7;

    // VC Questions
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'VC Due Diligence Questions', y, AMBER); }
    safeArr(inv.vcQuestions).forEach((q, i) => {
      setFont(doc, 8, false);
      const ql = doc.splitTextToSize(safe(q.question), CW-18);
      const al = doc.splitTextToSize(safe(q.answer),   CW-18);
      const qH = ql.length*LH + al.length*LH + 10;
      y = ensureSpace(doc, y, qH+3, pageRef);
      if (y >= BOT_Y) return;
      setFill(doc, CARD); fillRect(doc, ML, y, CW, qH);
      setFill(doc, AMBER); fillRect(doc, ML, y, 2.5, qH);
      setFont(doc, 8, true); setTxt(doc, AMBER);
      doc.text('Q'+(i+1), ML+5, y+LH+2);
      setFont(doc, 8, true); setTxt(doc, WHITE);
      doc.text(ql, ML+14, y+LH+2);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      doc.text(al, ML+14, y+ql.length*LH+LH+4);
      y += qH + 4;
    });
    y += 2;

    // Risks
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Key Risks & Mitigations', y, ROSE); }
    safeArr(inv.risks).forEach((r, i) => {
      setFont(doc, 7.5, false);
      const rl = doc.splitTextToSize(safe(r.risk),       CW/2-10);
      const ml = doc.splitTextToSize(safe(r.mitigation), CW/2-10);
      const rH = Math.max(rl.length, ml.length)*LH + 8;
      y = ensureSpace(doc, y, rH+3, pageRef);
      if (y >= BOT_Y) return;
      setFill(doc, CARD); fillRect(doc, ML, y, CW, rH);
      setFill(doc, ROSE); fillRect(doc, ML, y, 2.5, rH);
      setFont(doc, 7.5, true); setTxt(doc, ROSE);
      doc.text('Risk '+String(i+1)+':',  ML+5, y+LH+2);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(rl, ML+5, y+LH*2+2);
      setFont(doc, 7, true); setTxt(doc, EMERALD);
      doc.text('Mitigation:', ML+CW/2+2, y+LH+2);
      setFont(doc, 7, false); setTxt(doc, WHITE);
      doc.text(ml, ML+CW/2+2, y+LH*2+2);
      y += rH + 4;
    });

    drawPageFooter(doc, pageRef.page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 6 — Execution Plan
  // ────────────────────────────────────────────────────────────
  const ex = result.execution;
  if (ex) {
    doc.addPage(); pageRef.page++;
    pageRef.section = '90-Day Execution Plan';
    drawBg(doc);
    let y = drawPageHeader(doc, '90-Day Execution Plan');

    // Milestones — rows
    y = subHead(doc, 'Key Milestones', y, VIOLET);
    const milCols = [SKY, EMERALD, VIOLET, AMBER];
    safeArr(ex.milestones).forEach((m, i) => {
      setFont(doc, 7.5, false);
      const ml = doc.splitTextToSize(safe(m), CW-12);
      const mH = ml.length * LH + 8;
      y = ensureSpace(doc, y, mH+2, pageRef);
      if (y >= BOT_Y) return;
      const col = milCols[i % milCols.length];
      setFill(doc, CARD); fillRect(doc, ML, y, CW, mH);
      setFill(doc, col);  fillRect(doc, ML, y, 2.5, mH);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      doc.text(ml, ML+6, y+LH+2);
      y += mH + 3;
    });
    y += 3;

    // KPIs — wrap tags
    y = ensureSpace(doc, y, 20, pageRef);
    if (y < BOT_Y) { y = subHead(doc, 'Key Performance Indicators', y, SKY); }
    let kx = ML;
    safeArr(ex.kpis).forEach(kpi => {
      setFont(doc, 7, false);
      const kw = doc.getTextWidth(safe(kpi)) + 14;
      if (kx + kw > PW-MR) { kx = ML; y += 10; }
      y = ensureSpace(doc, y, 12, pageRef);
      setFill(doc, CARD); rRect(doc, kx, y-5, kw, 8, 2, 'F');
      setStroke(doc, SKY, 0.25); rRect(doc, kx, y-5, kw, 8, 2, 'S');
      setFont(doc, 7, false); setTxt(doc, SKY);
      doc.text(safe(kpi), kx+7, y+0.5);
      kx += kw + 5;
    });
    y += 10;

    // 30/60/90 tasks
    const periods = [
      { label:'Day 1–30 Action Plan',  tasks: ex.day30||[], col:SKY    },
      { label:'Day 31–60 Action Plan', tasks: ex.day60||[], col:EMERALD},
      { label:'Day 61–90 Action Plan', tasks: ex.day90||[], col:VIOLET },
    ];
    periods.forEach(p => {
      y = ensureSpace(doc, y, 20, pageRef);
      if (y < BOT_Y) { y = subHead(doc, p.label, y, p.col); }
      safeArr(p.tasks).forEach(task => {
        setFont(doc, 7.5, false);
        const tl = doc.splitTextToSize(safe(task.task), CW-36);
        const rowH = tl.length * LH + 7;
        y = ensureSpace(doc, y, rowH+2, pageRef);
        if (y >= BOT_Y) return;
        const pc = priorityCol(task.priority);
        setFill(doc, CARD); fillRect(doc, ML, y-2.5, CW, rowH);
        setFill(doc, pc);   fillRect(doc, ML, y-2.5, 2.5, rowH);
        setFont(doc, 7.5, false); setTxt(doc, WHITE);
        doc.text(tl, ML+5, y+LH);
        setFont(doc, 6, false); setTxt(doc, MUTED);
        if (task.owner) doc.text('Owner: '+safe(task.owner), ML+5, y+LH+tl.length*LH+1);
        setFill(doc, pc); rRect(doc, PW-MR-20, y-1, 20, 6, 1.5, 'F');
        setFont(doc, 5.5, true); setTxt(doc, WHITE);
        doc.text(safe(task.priority).toUpperCase(), PW-MR-10, y+3, {align:'center'});
        y += rowH + 3;
      });
      y += 4;
    });

    drawPageFooter(doc, pageRef.page);
  }

  // ────────────────────────────────────────────────────────────
  // FINAL PAGE — End
  // ────────────────────────────────────────────────────────────
  doc.addPage(); pageRef.page++;
  drawBg(doc);
  setFill(doc, SKY);    fillRect(doc, 0, 0, PW/2, 3);
  setFill(doc, INDIGO); fillRect(doc, PW/2, 0, PW/2, 3);
  setFill(doc, INDIGO); fillRect(doc, 0, PH-3, PW, 3);

  setFont(doc, 22, true); setTxt(doc, WHITE);
  doc.text('FounderMindAI', PW/2, PH/2-18, {align:'center'});
  setFont(doc, 10, false); setTxt(doc, MUTED);
  doc.text('Startup Intelligence Report', PW/2, PH/2-9, {align:'center'});
  setFill(doc, SKY); fillRect(doc, PW/2-25, PH/2-4, 50, 0.6);
  setFont(doc, 8, false); setTxt(doc, MUTED);
  doc.text('Validate all insights with real-world data before making decisions.', PW/2, PH/2+6, {align:'center'});

  drawPageFooter(doc, pageRef.page);

  // ── Save ─────────────────────────────────────────────────────
  const slug = safe(result.idea).replace(/[^a-z0-9]/gi,'_').slice(0,40);
  doc.save(`FounderMindAI_Report_${slug}.pdf`);
}
