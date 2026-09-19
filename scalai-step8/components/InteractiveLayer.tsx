"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Download, Moon, Sun, X } from "lucide-react";

export function InteractiveLayer() {
  const [open, setOpen] = useState<"download" | "workspace" | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("scalai-dark", dark);
    return () => document.documentElement.classList.remove("scalai-dark");
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"} onClick={() => setDark(v => !v)} className="theme-fab">
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button onClick={() => setOpen("workspace")} className="demo-fab"><span className="demo-dot" /> Voir la démo</button>
      {open && <div className="modal-backdrop" onMouseDown={() => setOpen(null)}>
        <div role="dialog" aria-modal="true" onMouseDown={e => e.stopPropagation()} className="demo-modal">
          <button aria-label="Fermer" onClick={() => setOpen(null)} className="modal-close"><X size={18}/></button>
          {open === "workspace" ? <>
            <p className="modal-kicker">APERÇU INTERACTIF</p>
            <h3 className="font-display text-3xl font-extrabold tracking-[-.04em]">Un espace. Plusieurs agents.</h3>
            <p className="mt-3 text-sm leading-6 text-black/55">Imaginez quatre agents qui travaillent côte à côte sur le même dossier, chacun avec sa propre session.</p>
            <div className="modal-workspace mt-7">
              {["Claude Code", "Codex", "Kimi", "Hermes"].map((agent, i) => <div key={agent} className="modal-agent">
                <div className="flex items-center gap-3"><span className={`agent-dot ${i === 1 || i === 3 ? "busy" : ""}`}/><b>{agent}</b><span className="ml-auto text-[10px] font-bold tracking-wider text-black/35">{i === 1 || i === 3 ? "EN COURS" : "TERMINÉ"}</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full bg-[var(--accent)]" style={{width:`${[100,72,100,51][i]}%`}} /></div>
              </div>)}
            </div>
            <button onClick={() => setOpen("download")} className="modal-cta mt-7"><Download size={16}/> Télécharger ScalAI <ArrowUpRight size={15}/></button>
          </> : <>
            <p className="modal-kicker">TÉLÉCHARGEMENT</p>
            <h3 className="font-display text-3xl font-extrabold tracking-[-.04em]">ScalAI sur votre bureau.</h3>
            <p className="mt-3 text-sm leading-6 text-black/55">La landing présente aujourd’hui l’expérience produit. Le bouton est prêt à accueillir le véritable installeur quand l’application desktop sera disponible.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="download-choice"><Sun size={17}/><div><b>macOS</b><p>Apple Silicon / Intel</p></div></div><div className="download-choice"><Check size={17}/><div><b>Version à venir</b><p>Installeur ScalAI</p></div></div></div>
            <button onClick={() => setOpen(null)} className="modal-cta mt-7">Fermer</button>
          </>}
        </div>
      </div>}
    </>
  );
}
