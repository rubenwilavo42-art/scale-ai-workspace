"use client";

import { useEffect, useState } from "react";
import { AgentIcon } from "./AgentIcon";

const agents = [
  { name: "Claude Code", task: "Réécrire les emails d’onboarding", state: "TERMINÉ", },
  { name: "Codex", task: "Construire la page tarifaire", state: "EN COURS", },
  { name: "Kimi", task: "Préparer le planning du mois", state: "TERMINÉ", },
  { name: "Hermes", task: "Organiser le dossier des factures", state: "EN COURS", },
];

export function WorkspacePreview() {
  const [active, setActive] = useState(1);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPulse((value) => value + 1), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto max-w-6xl rounded-[30px] border border-black/10 bg-[#e8e6df] p-2 shadow-[0_35px_100px_rgba(0,0,0,.15)]">
      <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#f5f4ef]">
        {/* App chrome */}
        <div className="flex h-12 items-center justify-between border-b border-black/10 bg-white/70 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/10" />
            </div>
            <span className="font-display text-sm font-extrabold tracking-tight">ScalAI</span>
          </div>
          <div className="hidden items-center gap-1 rounded-lg bg-black/[.035] p-1 text-[10px] font-bold text-black/45 sm:flex">
            <span className="rounded-md bg-white px-2 py-1 text-black shadow-sm">SESSIONS</span>
            <span className="px-2 py-1">ESPACE DE TRAVAIL</span>
            <span className="px-2 py-1">BIBLIOTHÈQUE</span>
          </div>
          <span className="text-xs font-medium text-black/35">LOCAL</span>
        </div>

        <div className="grid min-h-[540px] md:grid-cols-[190px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-black/10 bg-[#efeee8] p-3 md:block">
            <div className="mb-5 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Sessions</span>
              <span className="rounded-md bg-white px-1.5 py-1 text-[10px] font-bold shadow-sm">+</span>
            </div>
            <div className="space-y-1.5">
              {agents.map((agent, index) => (
                <button
                  key={agent.name}
                  onClick={() => setActive(index)}
                  className={`w-full rounded-xl p-2.5 text-left transition ${active === index ? "bg-white shadow-sm" : "hover:bg-white/60"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <AgentIcon name={agent.name === "Claude Code" ? "Claude" : agent.name as "Codex" | "Kimi" | "Hermes"} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold">{agent.name}</span>
                      <span className="block text-[9px] text-black/35">{agent.state}</span>
                    </span>
                    {agent.state === "EN COURS" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 border-t border-black/10 pt-4">
              <span className="px-2 text-[9px] font-bold uppercase tracking-[.15em] text-black/30">Workspace</span>
              <div className="mt-2 rounded-xl bg-white/60 p-2.5 text-[10px] text-black/50">
                <b className="block text-black/65">~/mon-projet</b>
                <span>12 fichiers · 4 dossiers</span>
              </div>
            </div>
          </aside>

          {/* Sessions */}
          <section className="min-w-0 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="font-display text-sm font-extrabold">Vos sessions</p>
                <p className="text-[10px] text-black/35">4 agents travaillent dans le même espace</p>
              </div>
              <button className="rounded-lg bg-black px-3 py-2 text-[10px] font-bold text-white transition hover:bg-black/80">+ Nouvelle session</button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {agents.map((agent, index) => (
                <article
                  key={agent.name}
                  className={`relative min-h-[220px] overflow-hidden rounded-2xl border p-4 transition duration-500 ${active === index ? "border-black/15 bg-white shadow-[0_12px_30px_rgba(0,0,0,.07)]" : "border-black/[.07] bg-white/70"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AgentIcon name={agent.name === "Claude Code" ? "Claude" : agent.name as "Codex" | "Kimi" | "Hermes"} size="sm" />
                      <div>
                        <p className="text-xs font-bold">{agent.name}</p>
                        <p className="text-[9px] text-black/35">~/mon-projet</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] font-bold ${agent.state === "EN COURS" ? "bg-orange-500/10 text-orange-700" : "bg-emerald-500/10 text-emerald-700"}`}>
                      {agent.state === "EN COURS" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />}
                      {agent.state}
                    </span>
                  </div>

                  <p className="mt-7 font-display text-sm font-extrabold leading-tight sm:text-base">{agent.task}</p>

                  <div className="mt-5 space-y-2">
                    <p className="flex gap-2 text-[10px] text-black/55"><span>✓</span> Lire les documents nécessaires</p>
                    <p className="flex gap-2 text-[10px] text-black/55"><span>✓</span> Respecter les instructions</p>
                    <p className="flex gap-2 text-[10px] text-black/55"><span>{agent.state === "EN COURS" ? "●" : "✓"}</span> {agent.state === "EN COURS" ? "Finaliser le travail" : "Enregistrer le résultat"}</p>
                  </div>

                  {agent.state === "EN COURS" && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-black/[.04]">
                      <div key={pulse} className="h-full w-1/2 animate-[slide_2.6s_ease-in-out] bg-[var(--accent)]" />
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
