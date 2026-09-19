// The right-click menu of an open tab, built from the tile itself. The same
// list is shown wherever that tab appears — its head on the desk, its head in
// the split, the tab strip across the split's file pane — so the menu is a
// property of the tile, not of the place you clicked it. Pure: the verbs come
// in as ctx and nothing here touches the DOM.
//
// A browser tile can leave for Chrome and hand its address to the session. A
// file tile hands its path over, opens a new window, and only an HTML file
// gets the Chrome line — Chrome has nothing to show for a .md.
export function tileMenuItems(p, ctx) {
  const items = [];
  if (p.kind === 'browser') {
    const showing = p.filePath || (p.url && p.url !== 'about:blank' ? p.url : null);
    if (showing) {
      items.push({ label: 'Ouvrir dans Chrome ↗', run: () => ctx.openOutside(p) });
      items.push({ label: 'Copy address', run: () => ctx.copy(p) });
      items.push({ label: 'Add to session', run: () => ctx.addToSession(p) });
    }
  } else {
    items.push({ label: 'Add to session', run: () => ctx.addToSession(p) });
    items.push({ label: 'Copier le chemin', run: () => ctx.copy(p) });
    items.push({ label: 'Ouvrir dans une nouvelle fenêtre', run: () => ctx.newWindow(p) });
    if (ctx.html(p)) items.push({ label: 'Ouvrir dans Chrome ↗', run: () => ctx.openOutside(p) });
  }
  const move = ctx.move(p);
  if (move.length) { if (items.length) items.push('-'); items.push(...move); }
  return items;
}
