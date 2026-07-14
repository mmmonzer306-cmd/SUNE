"use client";
import { motion } from "framer-motion";
import { useApp } from "@/lib/AppContext";
import { FaIcons } from "react-icons/fa";

interface Profile {
  bio1?: string;
  bio1Ar?: string;
  bio1Fr?: string;
  bio2?: string;
  bio2Ar?: string;
  bio2Fr?: string;
}

export default function About({ profile }: { profile: Profile }) {
  const { t, lang } = useApp();

  const getBio1 = () => {
    if (lang === "ar" && profile.bio1Ar) return profile.bio1Ar;
    if (lang === "fr" && profile.bio1Fr) return profile.bio1Fr;
    return profile.bio1 || "";
  };

  const getBio2 = () => {
    if (lang === "ar" && profile.bio2Ar) return profile.bio2Ar;
    if (lang === "fr" && profile.bio2Fr) return profile.bio2Fr;
    return profile.bio2 || "";
  };

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className=" text-sm tracking-widest uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            &gt; about.md
          </p>
          <h2 className="section-title gradient-text mb-4">
            {t("about.title")}
          </h2>
          <div
            className="w-24 h-px mx-auto"
            style={{
              background: `linear-gradient(to right, transparent, var(--accent), transparent)`,
            }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {getBio1() && (
              <p
                className="leading-relaxed text-lg"
                style={{ color: "var(--text-muted)" }}
              >
                {getBio1()}
              </p>
            )}
            {getBio2() && (
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {getBio2()}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Problem Solver",
                "Team Player",
                "Fast Learner",
                "Detail-Oriented",
              ].map((t) => (
                <span
                  key={t}
                  className=" text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                label: "Frontend",
                desc: "React, Next.js, TypeScript",
              },
              { label: "Backend", desc: "Node.js, Express, REST APIs, Java Spring Boot" },
              { label: "Database", desc: "SQL, PostgreSQL, NeonDB" },
              {
                label: "Mindset",
                desc: "Clean code, performance-first, software Archtucture",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="tech-card p-6 !text-left"
              >
                <h3
                  className="font-bold mb-1 "
                  style={{ color: "var(--text)" }}
                >
                  {item.label}
                </h3>
                <p className="text-xs " style={{ color: "var(--text-muted)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
