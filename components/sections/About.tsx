"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { useApp } from "@/lib/AppContext";
import Kicker from "@/components/ui/Kicker";
import { FiMonitor, FiServer, FiDatabase, FiZap } from "react-icons/fi";
import type { ComponentType } from "react";

interface Profile {
  bio1?: string;
  bio1Ar?: string;
  bio2?: string;
  bio2Ar?: string;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;

const CARDS: {
  icon: ComponentType<{ size?: number | string }>;
  color: string;
  label: { en: string; ar: string };
  desc: { en: string; ar: string };
}[] = [
  {
    icon: FiMonitor, color: "#00d4ff",
    label: { en: "Frontend", ar: "الواجهات" },
    desc: { en: "React, Next.js, TypeScript", ar: "رياكت، Next.js، TypeScript" },
  },
  {
    icon: FiServer, color: "#7c3aed",
    label: { en: "Backend", ar: "الخوادم" },
    desc: { en: "Node.js, Express, REST APIs, Java Spring Boot", ar: "Node.js، Express، REST APIs، Java Spring Boot" },
  },
  {
    icon: FiDatabase, color: "#22c55e",
    label: { en: "Database", ar: "قواعد البيانات" },
    desc: { en: "SQL, PostgreSQL, NeonDB", ar: "SQL، PostgreSQL، NeonDB" },
  },
  {
    icon: FiZap, color: "#f59e0b",
    label: { en: "Mindset", ar: "العقلية" },
    desc: { en: "Clean code, performance-first, solid architecture", ar: "كود نظيف، أداء أولًا، معمارية متينة" },
  },
];

function TiltCard({ card, index, lang }: { card: (typeof CARDS)[number]; index: number; lang: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10);
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.09, type: "spring", stiffness: 130, damping: 16 }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={onLeave}
        animate={{ y: hovered ? -6 : [0, -4, 0] }}
        transition={hovered ? { duration: 0.3 } : { duration: 4.5 + index * 0.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="tech-card relative p-6 overflow-hidden h-full"
      >
        {/* glow wash on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{ background: `radial-gradient(400px circle at 30% 20%, ${card.color}14, transparent 65%)` }}
        />
        {/* icon in orbit */}
        <div className="relative w-11 h-11 mb-4" style={{ transform: "translateZ(28px)" }}>
          <motion.div
            animate={{ rotate: hovered ? 360 : 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -inset-1 rounded-xl border border-dashed"
            style={{ borderColor: hovered ? card.color : "var(--border)" }}
          />
          <div
            className="absolute inset-0 rounded-xl flex items-center justify-center transition-shadow duration-300"
            style={{
              background: `${card.color}14`,
              border: `1px solid ${card.color}30`,
              boxShadow: hovered ? `0 0 22px ${card.color}40` : "none",
              color: card.color,
            }}
          >
            <card.icon size={18} />
          </div>
        </div>
        <h3 className="font-bold mb-1.5 text-base" style={{ color: "var(--text)", transform: "translateZ(18px)" }}>
          {lang === "ar" ? card.label.ar : card.label.en}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", transform: "translateZ(10px)" }}>
          {lang === "ar" ? card.desc.ar : card.desc.en}
        </p>
        {/* corner glow dot */}
        <motion.span
          animate={{ opacity: hovered ? 1 : 0.25 }}
          className="absolute top-4 end-4 w-2 h-2 rounded-full"
          style={{ background: card.color, boxShadow: `0 0 10px ${card.color}` }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function About({ profile, snippets = {} }: { profile: Profile; snippets?: Snippets }) {
  const { t, lang } = useApp();

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === "ar" && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const getBio1 = () => (lang === "ar" && profile.bio1Ar) ? profile.bio1Ar : profile.bio1 || "";
  const getBio2 = () => (lang === "ar" && profile.bio2Ar) ? profile.bio2Ar : profile.bio2 || "";

  const traits = lang === "ar"
    ? ["حلّال مشكلات", "روح الفريق", "سريع التعلم", "مهووس بالتفاصيل"]
    : ["Problem Solver", "Team Player", "Fast Learner", "Detail-Oriented"];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* ambient side glow */}
      <div className="absolute top-1/2 -start-40 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-70"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <Kicker text={snip("kicker.about", "about.md")} />
          <h2 className="section-title gradient-text mb-4">{t("about.title")}</h2>
          <div className="w-24 h-px mx-auto" style={{ background: "linear-gradient(to right, transparent, var(--accent), transparent)" }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Bio column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {getBio1() && (
              <div className="relative">
                <span className="absolute -top-4 -start-2 text-6xl font-display select-none pointer-events-none"
                  style={{ color: "var(--accent)", opacity: 0.15 }}>“</span>
                <p className="leading-[1.9] text-lg relative" style={{ color: "var(--text)" }}>
                  {getBio1()}
                </p>
              </div>
            )}
            {getBio2() && (
              <p className="leading-[1.9] ps-4 relative"
                style={{ color: "var(--text-muted)", borderInlineStart: "2px solid", borderImage: "linear-gradient(var(--accent), var(--accent-2)) 1" }}>
                {getBio2()}
              </p>
            )}
            <div className="flex flex-wrap gap-2.5 pt-3">
              {traits.map((tr, i) => (
                <motion.span
                  key={tr}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.07, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -3, scale: 1.04 }}
                  className="text-xs px-3.5 py-2 rounded-full font-medium cursor-default"
                  style={{
                    background: "var(--accent-glow)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "var(--accent)",
                  }}
                >
                  {tr}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-5">
            {CARDS.map((card, i) => (
              <TiltCard key={card.label.en} card={card} index={i} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
