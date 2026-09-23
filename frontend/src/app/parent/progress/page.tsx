"use client";

import React, { useState } from "react";
import { 
  Sparkles, CheckCircle2, Award, TrendingUp, MessageSquare, 
  Smile, ShieldCheck, HeartPulse, Palette, BookOpen, Brain, Zap,
  FileText, Download
} from "lucide-react";
import SpotlightCard from "@/components/teacher/SpotlightCard";
import ReportCardModal from "@/components/parent/ReportCardModal";
import { useParent } from "@/context/ParentContext";

export default function HolisticProgressPage() {
  const { selectedChild } = useParent();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const child = selectedChild || {
    firstName: "Aarav",
    lastName: "Sharma",
    grade: "LKG",
  };

  const categories = [
    {
      id: "communication",
      title: "Language & Communication",
      icon: MessageSquare,
      color: "text-[#0050CB]",
      bg: "bg-[#E5EEFF] dark:bg-[#0050CB]/20",
      progress: 92,
      status: "Progressing",
      observation: "Participates actively during morning circle and group conversations. Speaks in clear 4–6 word sentences and expresses feelings with confidence.",
      milestones: [
        { label: "Vocabulary Range", level: "Mastered", detail: "Exceeds 400+ active words" },
        { label: "Story Retelling", level: "Progressing", detail: "Can summarize key narrative points" },
        { label: "Phonic Awareness", level: "Mastered", detail: "Recognizes starting consonant sounds" },
      ],
    },
    {
      id: "cognitive",
      title: "Cognitive & Numeracy",
      icon: Brain,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      progress: 88,
      status: "Mastered",
      observation: "Demonstrates keen interest in counting patterns, grouping objects by color and size, and solving 6-piece wooden jigsaw puzzles.",
      milestones: [
        { label: "Number Recognition 1–20", level: "Mastered", detail: "Accurately identifies numerals" },
        { label: "Pattern Sequencing", level: "Mastered", detail: "Completes ABAB colour chains" },
        { label: "Spatial Logic", level: "Progressing", detail: "Understands above, below, near & far" },
      ],
    },
    {
      id: "motor",
      title: "Physical & Motor Skills",
      icon: Zap,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      progress: 95,
      status: "Mastered",
      observation: "Has developed strong tripod grasp for jumbo crayons and shows excellent balance on the beam and outdoor trike.",
      milestones: [
        { label: "Fine Motor Grip", level: "Mastered", detail: "Tripod pencil control" },
        { label: "Scissor Safety Cutting", level: "Progressing", detail: "Cuts along straight guide lines" },
        { label: "Outdoor Agility", level: "Mastered", detail: "Runs, hops and navigates obstacles" },
      ],
    },
    {
      id: "social",
      title: "Social & Emotional Growth",
      icon: Smile,
      color: "text-[#FF690C]",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      progress: 84,
      status: "Progressing",
      observation: "Shares classroom toys willingly, offers comfort to upset friends, and follows classroom transition routines attentively.",
      milestones: [
        { label: "Peer Collaboration", level: "Mastered", detail: "Engages in cooperative group play" },
        { label: "Emotional Regulation", level: "Progressing", detail: "Expresses needs with words" },
        { label: "Classroom Etiquette", level: "Mastered", detail: "Puts toys back in labeled trays" },
      ],
    },
    {
      id: "creativity",
      title: "Creativity & Aesthetic Expression",
      icon: Palette,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      progress: 90,
      status: "Mastered",
      observation: "Enjoys finger painting, rhythmic movement to nursery rhymes, and dramatizing animal characters during pretend play.",
      milestones: [
        { label: "Rhythm & Music", level: "Mastered", detail: "Claps and sings on beat" },
        { label: "Imaginative Pretend Play", level: "Mastered", detail: "Creates original play scenarios" },
        { label: "Clay Modeling", level: "Progressing", detail: "Molds recognizable spheres & shapes" },
      ],
    },
    {
      id: "habits",
      title: "Daily Habits & Independence",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      progress: 96,
      status: "Mastered",
      observation: "Unpacks school bag independently, hangs water bottle on assigned hook, and washes hands thoroughly before meal time.",
      milestones: [
        { label: "Hand Hygiene", level: "Mastered", detail: "Washes hands with soap correctly" },
        { label: "Independent Dining", level: "Mastered", detail: "Eats without teacher intervention" },
        { label: "Belongings Care", level: "Mastered", detail: "Zips and unzips backpack unassisted" },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[22px] bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
            Developmental Psychology Framework
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#000E28] dark:text-white">
            Child Development: {child.firstName} {child.lastName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Holistic six-dimensional early childhood growth indicators evaluated by certified faculty.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0050CB] hover:bg-[#0041A8] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Official Report Card</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 text-[#0050CB]" />
            <span>Development: <strong>Thriving (92%)</strong></span>
          </div>
        </div>
      </div>

      {/* Developmental Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <SpotlightCard key={cat.id} className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${cat.bg} ${cat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#000E28] dark:text-white">
                        {cat.title}
                      </h2>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {cat.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[#000E28] dark:text-white">
                    {cat.progress}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0050CB]"
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>

                {/* Educator Observation Note */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Educator Note
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{cat.observation}&rdquo;
                  </p>
                </div>

                {/* Specific Milestones Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Observed Competencies
                  </span>
                  <div className="space-y-2 text-xs">
                    {cat.milestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60">
                        <div>
                          <p className="font-bold text-[#000E28] dark:text-white">{m.label}</p>
                          <p className="text-[11px] text-slate-400">{m.detail}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          m.level === "Mastered"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-blue-100 text-[#0050CB] dark:bg-blue-950/60 dark:text-blue-300"
                        }`}>
                          {m.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Report Card Modal */}
      <ReportCardModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        child={{
          _id: (child as any)._id || "c-01",
          firstName: child.firstName,
          lastName: child.lastName,
          grade: child.grade,
        }}
      />
    </div>
  );
}
