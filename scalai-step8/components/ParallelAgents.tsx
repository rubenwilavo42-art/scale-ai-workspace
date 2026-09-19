"use client";

import { useEffect, useState } from "react";
import { Check, CircleDot, Copy, Play, Sparkles } from "lucide-react";

const runs = [
  { name: "Claude Code", mark: "C", tone: "bg-[#f0e9df] text-[#8c5b35]", result: "Structure analysée · 12 fichiers" },
  { name: "Codex", mark: "⌘", tone: "bg-[#e8eee9] text-[#315c43]", result: "Plan proposé · 8 étapes" },
  { name: "Kimi", mark: "K", tone: "bg-[#e6edf1] text-[#3f6476]", result: "3 pistes identifiées" },
];

export function ParallelAgents() {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((v) => v + 1), 700);
    return () => window.clearInterval(id);
  }, [running]);

  const progress = running ? Math.min(96, 22 + (tick % 9) * 9) : 0;

  return (
    <div className="mt-14 overflow-hidden rounded-[2rem] border border-black/10 bg-[#171717] text-white shadow-[0_30px_90px_rgba(0,0,0,.13)]">
      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-white/45">Une tâche · plusieurs agents</span>
            <Sparkles className="h-4 w-4 text-white/30" />
          </div>
          <h3 className="mt-12 text-2xl font-extrabold tracking-tight sm:text-3xl">Comparez les réponses au même endroit.</h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/45">Donnez la même mission à plusieurs agents et laissez-les travailler côte à côte dans votre espace.</p>

          <div className="mt-9 rounded-2xl border border-white/10 bg-white/[.045] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/30">Votre tâche</p>
            <p className="mt-3 text-sm leading-6 text-white/80">Analyse ce projet et propose la meilleure façon de structurer la prochaine version.</p>
          </div>

          <button
            onClick={() => { setRunning(true); setTick(0); }}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-black transition hover:bg-white/90"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {running ? "Agents en cours…" : "Lancer les 3 agents"}
          </button>
        </div>

        <div className="bg-[#1d1d1d] p-4 sm:p-6 lg:p-8">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-bold">Sessions parallèles</p>
              <p className="mt-1 text-xs text-white/30">3 agents · même dossier · même mission</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white/[.06] px-3 py-1.5 text-[10px] font-bold text-white/45">
              <CircleDot className="h-3 w-3" /> {running ? "EN COURS" : "PRÊT"}
            </span>
          </div>

          <div className="space-y-3">
            {runs.map((run, index) => (
              <div key={run.name} className="rounded-2xl border border-white/10 bg-white/[.045] p-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold ${run.tone}`}>{run.mark}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-bold">{run.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">{running ? "Travaille" : "En attente"}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.07]">
                      <div className="h-full rounded-full bg-white/60 transition-all duration-500" style={{ width: running ? `${Math.min(100, progress + index * 4)}%` : "0%" }} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-white/30">
                  <span>{running ? run.result : "Prêt à démarrer"}</span>
                  {running && <Check className="h-3.5 w-3.5 text-emerald-300" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.025] px-4 py-3 text-xs text-white/35">
            <span>Un seul espace de travail · aucun aller-retour</span>
            <Copy className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
