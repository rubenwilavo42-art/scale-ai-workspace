"use client";

import { useState } from "react";
import { Check, FolderOpen, Moon, Search, Settings, Sun, Terminal } from "lucide-react";

const sessions = [
  { agent: "Claude Code", task: "Prépare la structure du projet", state: "TERMINÉ" },
  { agent: "Codex", task: "Analyse les fichiers existants", state: "EN COURS" },
  { agent: "Kimi", task: "Propose trois pistes d'amélioration", state: "TERMINÉ" },
];

export function ThemeShowcase() {
  const [dark, setDark] = useState(false);

  const c = dark
    ? { shell: "bg-[#151515] text-white", panel: "bg-[#1c1c1c]", soft: "bg-white/[.045]", border: "border-white/10", muted: "text-white/38", sub: "text-white/58", line: "bg-white/10" }
    : { shell: "bg-[#f7f6f2] text-[#171717]", panel: "bg-white", soft: "bg-black/[.035]", border: "border-black/10", muted: "text-black/38", sub: "text-black/58", line: "bg-black/10" };

  return (
    <div className={`mt-14 overflow-hidden rounded-[2rem] border ${c.border} shadow-[0_30px_90px_rgba(0,0,0,.14)] transition-colors duration-500`}>
      <div className={`${c.shell} transition-colors duration-500`}>
        <div className={`flex flex-col gap-4 border-b ${c.border} px-5 py-4 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.soft}`}><span className="font-display text-sm font-extrabold">S</span></div>
            <div><p className="text-sm font-bold">ScalAI</p><p className={`text-[10px] ${c.muted}`}>Votre espace de travail</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(false)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${!dark ? `${c.soft} border-current/10` : "border-transparent"}`}><Sun className="h-3 w-3" /> Clair</button>
            <button onClick={() => setDark(true)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${dark ? `${c.soft} border-current/10` : "border-transparent"}`}><Moon className="h-3 w-3" /> Sombre</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[210px_1fr]">
          <aside className={`border-b ${c.border} p-4 lg:border-b-0 lg:border-r`}>
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${c.soft}`}><Search className="h-3.5 w-3.5" /><span className={`text-[10px] ${c.muted}`}>Rechercher</span></div>
            <p className={`mt-7 px-2 text-[9px] font-bold uppercase tracking-[.16em] ${c.muted}`}>Espace</p>
            <div className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 ${c.soft}`}><FolderOpen className="h-3.5 w-3.5" /><span className="text-[10px] font-bold">~/mon-projet</span></div>
            <p className={`mt-7 px-2 text-[9px] font-bold uppercase tracking-[.16em] ${c.muted}`}>Sessions</p>
            <div className="mt-2 space-y-1.5">
              {sessions.map((s, i) => <div key={s.agent} className={`rounded-xl px-3 py-2.5 ${i === 1 ? c.soft : ""}`}><p className="text-[10px] font-bold">{s.agent}</p><p className={`mt-1 text-[9px] ${c.muted}`}>{s.state}</p></div>)}
            </div>
            <div className={`mt-7 flex items-center gap-2 px-2 text-[10px] ${c.muted}`}><Settings className="h-3 w-3" /> Préférences</div>
          </aside>

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className={`text-[9px] font-bold uppercase tracking-[.16em] ${c.muted}`}>ESPACE DE TRAVAIL</p><h3 className="font-display mt-2 text-xl font-extrabold">Vos sessions</h3><p className={`mt-1 text-xs ${c.sub}`}>3 agents travaillent dans le même dossier.</p></div>
              <span className={`w-fit rounded-full px-3 py-1.5 text-[9px] font-bold ${c.soft}`}>12 fichiers · 4 dossiers</span>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {sessions.map((s, i) => <div key={s.agent} className={`rounded-2xl border ${c.border} ${c.panel} p-4 transition-colors duration-500`}><div className="flex items-center justify-between"><span className="text-[11px] font-bold">{s.agent}</span><span className={`h-2 w-2 rounded-full ${i === 1 ? "bg-amber-400" : "bg-emerald-400"}`} /></div><p className={`mt-6 min-h-10 text-[10px] leading-5 ${c.sub}`}>{s.task}</p><div className={`mt-5 h-1.5 overflow-hidden rounded-full ${c.line}`}><div className={`h-full rounded-full ${i === 1 ? "w-2/3 bg-amber-400" : "w-full bg-emerald-400"}`} /></div><p className={`mt-2 text-[9px] ${c.muted}`}>{s.state}</p></div>)}
            </div>
            <div className={`mt-4 flex items-center gap-2 rounded-2xl border ${c.border} ${c.soft} px-4 py-3`}><Terminal className="h-3.5 w-3.5" /><span className={`text-[10px] ${c.sub}`}>Tous les agents ont accès au même espace de travail.</span><Check className="ml-auto h-3.5 w-3.5 text-emerald-400" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
