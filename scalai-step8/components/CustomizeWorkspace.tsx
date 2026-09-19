"use client";

import { useState } from "react";
import { Check, FolderOpen, Moon, Plus, Sun, Terminal, UserRound } from "lucide-react";

const agentPresets = [
  { name: "Architecte", mark: "A", role: "Conçoit la structure et propose des plans clairs." },
  { name: "Développeur", mark: "D", role: "Implémente, corrige et améliore le code du projet." },
  { name: "Analyste", mark: "N", role: "Explore les données, compare les pistes et synthétise." },
];

export function CustomizeWorkspace() {
  const [selected, setSelected] = useState(0);
  const [dark, setDark] = useState(true);
  const agent = agentPresets[selected];

  return (
    <div className="mt-14 grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] shadow-[0_30px_90px_rgba(0,0,0,.2)] lg:grid-cols-[1fr_1.12fr]">
      <div className="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-9">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Votre espace</p>
            <p className="mt-1 text-xs text-white/35">Construisez-le autour de votre façon de travailler.</p>
          </div>
          <span className="rounded-full bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white/35">Personnalisé</span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.035] p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.07] text-white/70"><FolderOpen className="h-4 w-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-bold">~/mon-projet</p>
              <p className="mt-1 text-xs text-white/30">12 fichiers · 4 dossiers</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white/45">
            <Terminal className="h-3.5 w-3.5" /> Les agents travaillent ici
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/30">Vos agents</p>
            <button className="inline-flex items-center gap-1 text-[10px] font-bold text-white/45 hover:text-white/70"><Plus className="h-3 w-3" /> Ajouter</button>
          </div>
          <div className="space-y-2">
            {agentPresets.map((item, index) => (
              <button key={item.name} onClick={() => setSelected(index)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected === index ? "border-white/15 bg-white/[.08]" : "border-transparent hover:bg-white/[.04]"}`}>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[.08] text-xs font-extrabold text-white/70">{item.mark}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold">{item.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-white/30">{item.role}</span>
                </span>
                {selected === index && <Check className="h-3.5 w-3.5 text-emerald-300" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`relative overflow-hidden p-5 transition-colors duration-500 sm:p-7 lg:p-9 ${dark ? "bg-[#1a1a1a]" : "bg-[#f5f3ed] text-[#171717]"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${dark ? "bg-white/[.07] text-white/65" : "bg-black/[.06] text-black/60"}`}><UserRound className="h-4 w-4" /></span>
            <div>
              <p className={`text-sm font-bold ${dark ? "text-white" : "text-black"}`}>{agent.name}</p>
              <p className={`text-[10px] ${dark ? "text-white/30" : "text-black/40"}`}>Configuration de l’agent</p>
            </div>
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Changer de thème" className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${dark ? "border-white/10 bg-white/[.05] text-white/50" : "border-black/10 bg-black/[.04] text-black/50"}`}>
            {dark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
            {dark ? "Sombre" : "Clair"}
          </button>
        </div>

        <div className={`mt-8 rounded-2xl border p-5 ${dark ? "border-white/10 bg-black/20" : "border-black/10 bg-white/70"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-[.16em] ${dark ? "text-white/30" : "text-black/35"}`}>Instructions</p>
          <p className={`mt-3 text-sm leading-6 ${dark ? "text-white/75" : "text-black/70"}`}>{agent.role}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {["Travaille dans le dossier choisi", "Garde le contexte de la session", "Peut lire les fichiers du projet", "Reste disponible à tout moment"].map((item) => (
              <div key={item} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] ${dark ? "bg-white/[.045] text-white/45" : "bg-black/[.04] text-black/50"}`}><Check className="h-3 w-3" />{item}</div>
            ))}
          </div>
        </div>

        <div className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 ${dark ? "border-white/10 bg-white/[.025]" : "border-black/10 bg-white/60"}`}>
          <span className={`text-[10px] font-bold uppercase tracking-[.16em] ${dark ? "text-white/30" : "text-black/35"}`}>Votre espace, vos règles</span>
          <span className={`h-2 w-2 rounded-full ${dark ? "bg-emerald-400" : "bg-emerald-500"}`} />
        </div>
      </div>
    </div>
  );
}
