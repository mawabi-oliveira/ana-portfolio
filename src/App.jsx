import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Github,
  Linkedin,
  MapPin,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

/*
  Design tokens
  -------------
  bg base:        #17131F  (roxo-ardósia bem escuro)
  bg elevated:    #1F1A2B
  text:           #F3EEFA
  text muted:     #A79BC0
  accent lilás:   #C9B6F0
  accent pêssego: #F3C7B4
  accent menta:   #A9E0C8
  Tipografia: "Fraunces" (serifada, destaques) + "Sora" (sans, corpo/UI)
*/

const skills = [
  { group: "Linguagens & Runtime", color: "#C9B6F0", items: ["JavaScript", "TypeScript", "Node.js", "HTML5", "CSS3"] },
  { group: "Front-end", color: "#F3C7B4", items: ["React", "Tailwind CSS", "EJS"] },
  { group: "Back-end & Dados", color: "#A9E0C8", items: ["Express", "MySQL", "SQLite3", "bcrypt", "Bancos não relacionais"] },
  { group: "Ferramentas & Plataformas", color: "#C9B6F0", items: ["Git", "GitHub", "Vercel", "Microsoft Power Platform"] },
  { group: "Em aprendizado", color: "#6EE7F2", items: ["Python", "C"] },
];

const projects = [
  {
    name: "IFAnimal",
    tag: "Impacto social",
    desc: "Plataforma social para proteção, cuidado e adoção de gatos do IFAL Maceió. Conecta animais resgatados a novos lares e divulga as ações do projeto.",
    stack: ["Node.js", "Express", "SQLite3", "bcrypt", "nodemailer"],
    href: "https://github.com/mawabi-oliveira/IFAnimal-main",
    accent: "#A9E0C8",
  },
  {
    name: "Moby",
    tag: "Aplicação full-stack",
    desc: "Sua biblioteca pessoal: cadastro com senha criptografada, cada usuário com sua própria estante, busca por título, autor ou gênero.",
    stack: ["Node.js", "Express", "MySQL", "EJS", "Tailwind CSS"],
    href: "https://github.com/mawabi-oliveira/MobyPersonal",
    accent: "#F3C7B4",
  },
  {
    name: "Próximo projeto",
    tag: "Em construção",
    desc: "Este espaço é reservado para o próximo projeto — em breve, mais um case por aqui.",
    stack: [],
    href: null,
    accent: "#C9B6F0",
    placeholder: true,
  },
];

/* ---------- Gamer-style HUD reticle + pixel trail + hit-spark on click ---------- */
const TRAIL_COLORS = ["#C9B6F0", "#A9E0C8", "#F3C7B4", "#6EE7F2"];
const TRAIL_SIZE = 22;

function GamerCursor() {
  const reticleRef = useRef(null);
  const trailRef = useRef(null);
  const burstRef = useRef(null);

  const raw = useRef({ x: -100, y: -100 });
  const smooth = useRef({ x: -100, y: -100 });
  const trailIndex = useRef(0);
  const frameCount = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      raw.current = { x: e.clientX, y: e.clientY };

      // spawn a pixel of the trail every few frames, round-robin over a fixed pool
      frameCount.current += 1;
      if (frameCount.current % 2 === 0 && trailRef.current) {
        const pool = trailRef.current.children;
        const el = pool[trailIndex.current % pool.length];
        trailIndex.current += 1;
        const color = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
        el.style.left = `${e.clientX}px`;
        el.style.top = `${e.clientY}px`;
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 0 6px ${color}`;
        el.classList.remove("pixel-trail-active");
        // force reflow so the animation restarts
        void el.offsetWidth;
        el.classList.add("pixel-trail-active");
      }
    };

    const onClick = (e) => {
      if (!burstRef.current) return;
      const burst = document.createElement("div");
      burst.className = "hit-spark";
      burst.style.left = `${e.clientX}px`;
      burst.style.top = `${e.clientY}px`;
      burstRef.current.appendChild(burst);
      setTimeout(() => burst.remove(), 500);
    };

    let raf;
    const loop = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * 0.18;
      smooth.current.y += (raw.current.y - smooth.current.y) * 0.18;
      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate(${smooth.current.x}px, ${smooth.current.y}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  const pixels = Array.from({ length: 16 });

  return (
    <>
      {/* pixel trail pool */}
      <div ref={trailRef} aria-hidden="true">
        {pixels.map((_, i) => (
          <span key={i} className="pixel-trail" />
        ))}
      </div>

      {/* hit-spark burst container */}
      <div ref={burstRef} aria-hidden="true" />

      {/* HUD reticle */}
      <div ref={reticleRef} aria-hidden="true" className="hud-reticle">
        <svg width="34" height="34" viewBox="0 0 34 34">
          <circle cx="17" cy="17" r="12" fill="none" stroke="#C9B6F0" strokeWidth="1.4" strokeDasharray="4 5" className="hud-ring" />
          <line x1="17" y1="0" x2="17" y2="7" stroke="#F3EEFA" strokeWidth="1.4" />
          <line x1="17" y1="27" x2="17" y2="34" stroke="#F3EEFA" strokeWidth="1.4" />
          <line x1="0" y1="17" x2="7" y2="17" stroke="#F3EEFA" strokeWidth="1.4" />
          <line x1="27" y1="17" x2="34" y2="17" stroke="#F3EEFA" strokeWidth="1.4" />
          <circle cx="17" cy="17" r="1.6" fill="#A9E0C8" />
        </svg>
      </div>

      <style>{`
        .hud-reticle {
          position: fixed;
          top: 0;
          left: 0;
          width: 34px;
          height: 34px;
          pointer-events: none;
          z-index: 50;
          mix-blend-mode: screen;
        }
        .hud-ring {
          transform-origin: 17px 17px;
          animation: hud-spin 6s linear infinite;
        }
        @keyframes hud-spin {
          to { transform: rotate(360deg); }
        }
        .pixel-trail {
          position: fixed;
          top: -20px;
          left: -20px;
          width: ${TRAIL_SIZE * 0.3}px;
          height: ${TRAIL_SIZE * 0.3}px;
          background: #C9B6F0;
          pointer-events: none;
          z-index: 40;
          opacity: 0;
          transform: translate(-50%, -50%) scale(1);
        }
        .pixel-trail-active {
          animation: pixel-fade 0.55s ease-out forwards;
        }
        @keyframes pixel-fade {
          0%   { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0;   transform: translate(-50%, -50%) scale(0.2); }
        }
        .hit-spark {
          position: fixed;
          width: 8px;
          height: 8px;
          border: 1.5px solid #A9E0C8;
          border-radius: 50%;
          pointer-events: none;
          z-index: 45;
          transform: translate(-50%, -50%);
          animation: hit-spark-anim 0.5s ease-out forwards;
        }
        @keyframes hit-spark-anim {
          0%   { width: 8px; height: 8px; opacity: 1; }
          100% { width: 46px; height: 46px; opacity: 0; }
        }
        @media (hover: none) {
          .hud-reticle, .pixel-trail, .hit-spark { display: none; }
        }
      `}</style>
    </>
  );
}

/* ---------- Reveal on scroll ---------- */
function Reveal({ children, id, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </section>
  );
}

/* ---------- Card with 3D tilt + spotlight that follows the cursor ---------- */
function TiltCard({ children, style, accent = "#C9B6F0", ...rest }) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const px = x / r.width - 0.5;
      const py = y / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateX(${-py * 8}deg) rotateY(${px * 10}deg) translateZ(0)`;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--spot-opacity", "1");
    },
    []
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
    el.style.setProperty("--spot-opacity", "0");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        ...style,
        position: "relative",
        transition: "transform 0.15s ease-out, border-color 0.3s",
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: "var(--spot-opacity, 0)",
          transition: "opacity 0.3s",
          background: `radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), ${accent}22, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Button that leans gently toward the cursor ---------- */
function MagneticButton({ children, href, style, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, transition: "transform 0.18s ease-out", display: "inline-flex" }}
      {...rest}
    >
      {children}
    </a>
  );
}

function Pill({ children, color }) {
  const ref = useRef(null);
  return (
    <span
      ref={ref}
      onMouseEnter={() => {
        if (ref.current) ref.current.style.transform = "translateY(-3px) scale(1.05)";
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translateY(0) scale(1)";
      }}
      className="text-sm px-3 py-1 rounded-full inline-block"
      style={{
        color,
        backgroundColor: `${color}1A`,
        border: `1px solid ${color}40`,
        fontFamily: "Sora, sans-serif",
        transition: "transform 0.2s ease-out, background-color 0.2s",
        cursor: "default",
      }}
    >
      {children}
    </span>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Sobre", id: "sobre" },
    { label: "Experiência", id: "experiencia" },
    { label: "Habilidades", id: "habilidades" },
    { label: "Projetos", id: "projetos" },
    { label: "Contato", id: "contato" },
  ];
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md" style={{ backgroundColor: "#17131FCC" }}>
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
        <a href="#topo" style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-lg tracking-tight">
          Ana Mawabi
        </a>
        <nav className="hidden sm:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif", position: "relative" }}
              className="text-sm nav-link"
            >
              {l.label}
            </a>
          ))}
          <MagneticButton
            href="https://www.linkedin.com/in/anagsoliveira/"
            target="_blank"
            rel="noreferrer"
            className="text-sm px-4 py-2 rounded-full"
            style={{ backgroundColor: "#C9B6F0", color: "#17131F", fontFamily: "Sora, sans-serif", fontWeight: 600 }}
          >
            LinkedIn
          </MagneticButton>
        </nav>
        <button
          className="sm:hidden"
          style={{ color: "#F3EEFA", fontFamily: "Sora, sans-serif" }}
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>
      {open && (
        <div className="sm:hidden px-6 pb-5 flex flex-col gap-4">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-sm">
              {l.label}
            </a>
          ))}
        </div>
      )}
      <style>{`
        .nav-link {
          padding: 2px 12px;
        }
        .nav-link::before, .nav-link::after {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: #A9E0C8;
          font-family: 'Sora', sans-serif;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .nav-link::before {
          content: "[";
          left: -2px;
          transform: translateY(-50%) translateX(6px);
        }
        .nav-link::after {
          content: "]";
          right: -2px;
          transform: translateY(-50%) translateX(-6px);
        }
        .nav-link:hover {
          color: #F3EEFA !important;
          text-shadow: 0 0 10px #C9B6F080;
        }
        .nav-link:hover::before,
        .nav-link:hover::after {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
      `}</style>
    </header>
  );
}

function Hero() {
  const artRef = useRef(null);

  const onMove = (e) => {
    const el = artRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${-py * 10}deg) rotateY(${px * 14}deg)`;
    el.querySelectorAll("[data-depth]").forEach((node) => {
      const depth = parseFloat(node.getAttribute("data-depth"));
      node.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  };
  const onLeave = () => {
    const el = artRef.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
    el.querySelectorAll("[data-depth]").forEach((node) => {
      node.style.transform = "translate(0px, 0px)";
    });
  };

  return (
    <section id="topo" className="max-w-5xl mx-auto px-6 pt-16 pb-24 grid sm:grid-cols-5 gap-12 items-center relative z-10">
      <div className="sm:col-span-3">
        <div
          className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full mb-6"
          style={{ color: "#A9E0C8", backgroundColor: "#A9E0C81A", border: "1px solid #A9E0C840", fontFamily: "Sora, sans-serif" }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: "#A9E0C8" }} />
          Buscando novas oportunidades
        </div>
        <h1 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA", lineHeight: 1.08 }} className="text-5xl sm:text-6xl mb-6">
          Ana Mawabi
          <br />
          <span style={{ color: "#C9B6F0" }}>Oliveira</span>
        </h1>
        <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif", maxWidth: "34ch" }} className="text-lg mb-8">
          Desenvolvedora full stack construindo aplicações web com JavaScript
          e Node.js.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <MagneticButton
            href="#projetos"
            className="px-5 py-3 rounded-full text-sm"
            style={{ backgroundColor: "#F3EEFA", color: "#17131F", fontFamily: "Sora, sans-serif", fontWeight: 600 }}
          >
            Ver projetos
          </MagneticButton>
          <MagneticButton
            href="https://github.com/mawabi-oliveira"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm"
            style={{ border: "1px solid #A79BC050", color: "#F3EEFA", fontFamily: "Sora, sans-serif" }}
          >
            <Github size={16} /> GitHub
          </MagneticButton>
        </div>
      </div>

      <div
        className="sm:col-span-2 relative h-72 sm:h-96"
        style={{ perspective: "800px" }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          ref={artRef}
          className="absolute inset-0 rounded-[2rem]"
          style={{ transition: "transform 0.2s ease-out", transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 rounded-[2rem]"
            data-depth="6"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, #C9B6F033, transparent 55%), radial-gradient(circle at 75% 70%, #F3C7B433, transparent 55%), radial-gradient(circle at 50% 100%, #A9E0C833, transparent 60%)",
              transition: "transform 0.2s ease-out",
            }}
          />
          <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
            <circle data-depth="-4" cx="150" cy="150" r="90" fill="none" stroke="#C9B6F055" strokeWidth="1" style={{ transition: "transform 0.2s ease-out" }} />
            <circle data-depth="-8" cx="150" cy="150" r="60" fill="none" stroke="#F3C7B455" strokeWidth="1" style={{ transition: "transform 0.2s ease-out" }} />
            <text data-depth="14" x="90" y="130" fontFamily="Fraunces, serif" fontSize="46" fill="#C9B6F0" style={{ transition: "transform 0.2s ease-out" }}>{"{"}</text>
            <text data-depth="18" x="185" y="180" fontFamily="Fraunces, serif" fontSize="46" fill="#F3C7B4" style={{ transition: "transform 0.2s ease-out" }}>{"}"}</text>
            <circle data-depth="22" cx="150" cy="150" r="4" fill="#A9E0C8" style={{ transition: "transform 0.2s ease-out" }} />
            <circle data-depth="10" cx="105" cy="95" r="3" fill="#F3EEFA" style={{ transition: "transform 0.2s ease-out" }} />
            <circle data-depth="16" cx="205" cy="205" r="3" fill="#F3EEFA" style={{ transition: "transform 0.2s ease-out" }} />
            <circle data-depth="12" cx="220" cy="100" r="2.5" fill="#A9E0C8" style={{ transition: "transform 0.2s ease-out" }} />
            <circle data-depth="8" cx="80" cy="210" r="2.5" fill="#C9B6F0" style={{ transition: "transform 0.2s ease-out" }} />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <Reveal id="sobre" className="max-w-5xl mx-auto px-6 py-20 grid sm:grid-cols-5 gap-12">
      <div className="sm:col-span-3">
        <h2 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-3xl mb-6">Sobre mim</h2>
        <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="mb-4 leading-relaxed">
          Sou desenvolvedora full stack júnior, com experiência prática em
          desenvolvimento web, automações corporativas e testes de software.
          Já atuei em projetos acadêmicos e institucionais usando JavaScript,
          TypeScript, Node.js, bancos de dados relacionais e não relacionais
          e Microsoft Power Platform . Além disso, estou em constante aprendizado.
        </p>
        <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="leading-relaxed">
          Tenho experiência no desenvolvimento de aplicações internas,
          automação de processos empresariais, criação de interfaces e
          integração de sistemas. Me destaco pela rápida capacidade de
          aprendizado, pensamento analítico, organização e facilidade para
          solucionar problemas.
        </p>
      </div>
      <div className="sm:col-span-2 flex flex-col gap-4">
        <TiltCard accent="#C9B6F0" className="rounded-2xl p-5 flex items-start gap-4" style={{ backgroundColor: "#1F1A2B", border: "1px solid #2A2438" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <MapPin size={20} style={{ color: "#C9B6F0" }} className="mt-0.5 shrink-0" />
            <div>
              <p style={{ color: "#F3EEFA", fontFamily: "Sora, sans-serif" }} className="text-sm font-medium">Maceió, Alagoas, Brasil</p>
              <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-sm">Aberta a trabalho meio período remoto ou híbrido em Maceió</p>
            </div>
          </div>
        </TiltCard>
        <TiltCard accent="#F3C7B4" className="rounded-2xl p-5 flex items-start gap-4" style={{ backgroundColor: "#1F1A2B", border: "1px solid #2A2438" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <GraduationCap size={20} style={{ color: "#F3C7B4" }} className="mt-0.5 shrink-0" />
            <div>
              <p style={{ color: "#F3EEFA", fontFamily: "Sora, sans-serif" }} className="text-sm font-medium">Técnico em Desenvolvimento de Sistemas — IFAL</p>
              <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-sm">2022.1 – 2024.2</p>
            </div>
          </div>
        </TiltCard>
        <TiltCard accent="#A9E0C8" className="rounded-2xl p-5 flex items-start gap-4" style={{ backgroundColor: "#1F1A2B", border: "1px solid #2A2438" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <GraduationCap size={20} style={{ color: "#A9E0C8" }} className="mt-0.5 shrink-0" />
            <div>
              <p style={{ color: "#F3EEFA", fontFamily: "Sora, sans-serif" }} className="text-sm font-medium">Universidade Federal de Alagoas</p>
              <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-sm">Formação acadêmica em andamento</p>
            </div>
          </div>
        </TiltCard>
      </div>
    </Reveal>
  );
}

const experiences = [
  {
    role: "Aprendiz",
    place: "Caetex",
    period: "03/2025 – 09/2025",
    desc: "Desenvolvimento de aplicações internas com Power Apps e automações corporativas com Power Automate. Manutenção de funcionalidades em JavaScript, integração de fluxos empresariais na Power Platform, prototipação de interfaces no Figma e apoio no levantamento de requisitos.",
    accent: "#C9B6F0",
  },
  {
    role: "Pesquisadora",
    place: "Projeto AMO, através do IFAL, Fapeal, Pibic Jr",
    period: "08/2022 – 07/2024",
    desc: "Pesquisa científica e programação voltadas à análise de problemas históricos da OBI (2014–2016) e avaliação da acurácia de inteligência artificial na resolução de problemas de lógica computacional. Produção e edição de conteúdo técnico para mídias sociais e YouTube.",
    accent: "#A9E0C8",
  },
  {
    role: "Testadora de Software",
    place: "Projeto Seja, pelo IFAL, Observatório do Mundo do Trabalho",
    period: "11/2023 – 12/2023",
    desc: "Execução de testes funcionais e validação de interfaces front-end. Identificação, documentação e reporte de bugs, com apoio em processos de garantia de qualidade (QA) e experiência do usuário.",
    accent: "#F3C7B4",
  },
];

function Experiencia() {
  return (
    <Reveal id="experiencia" className="max-w-5xl mx-auto px-6 py-20">
      <h2 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-3xl mb-10">Experiência</h2>
      <div style={{ position: "relative" }} className="pl-8 sm:pl-10">
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "1px", background: "#2A2438" }}
        />
        <div className="flex flex-col gap-10">
          {experiences.map((exp) => (
            <div key={exp.role + exp.period} style={{ position: "relative" }}>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-27px",
                  top: "6px",
                  width: "11px",
                  height: "11px",
                  borderRadius: "50%",
                  backgroundColor: exp.accent,
                  boxShadow: `0 0 0 4px #17131F, 0 0 10px ${exp.accent}90`,
                }}
              />
              <p style={{ color: exp.accent, fontFamily: "Sora, sans-serif" }} className="text-xs font-medium mb-1">
                {exp.period}
              </p>
              <h3 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-xl mb-1">
                {exp.role} <span style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif", fontSize: "0.95rem" }}>· {exp.place}</span>
              </h3>
              <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif", maxWidth: "60ch" }} className="text-sm leading-relaxed">
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function Habilidades() {
  return (
    <Reveal id="habilidades" className="max-w-5xl mx-auto px-6 py-20">
      <h2 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-3xl mb-10">Habilidades</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        {skills.map((s) => (
          <div key={s.group}>
            <p style={{ color: s.color, fontFamily: "Sora, sans-serif" }} className="text-sm font-medium mb-3">{s.group}</p>
            <div className="flex flex-wrap gap-2">
              {s.items.map((item) => (
                <Pill key={item} color={s.color}>{item}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function Projetos() {
  return (
    <Reveal id="projetos" className="max-w-5xl mx-auto px-6 py-20">
      <h2 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-3xl mb-10">Projetos</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {projects.map((p) => (
          <TiltCard
            key={p.name}
            accent={p.accent}
            className="rounded-2xl p-6"
            style={{
              backgroundColor: p.placeholder ? "transparent" : "#1F1A2B",
              border: p.placeholder ? `1.5px dashed ${p.accent}50` : "1px solid #2A2438",
              minHeight: "230px",
            }}
          >
            <div>
              <p style={{ color: p.accent, fontFamily: "Sora, sans-serif" }} className="text-xs font-medium mb-2">{p.tag}</p>
              <h3 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-xl mb-3">{p.name}</h3>
              <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-sm leading-relaxed mb-4">{p.desc}</p>
              {p.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {p.stack.map((s) => (
                    <span key={s} style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif" }} className="text-xs">{s}</span>
                  ))}
                </div>
              )}
            </div>
            {p.href && (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: p.accent, fontFamily: "Sora, sans-serif" }}
                className="text-sm inline-flex items-center gap-1 mt-2 group"
              >
                Ver no GitHub <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </TiltCard>
        ))}
      </div>
    </Reveal>
  );
}

function Contato() {
  return (
    <Reveal id="contato" className="max-w-5xl mx-auto px-6 py-24">
      <TiltCard
        accent="#C9B6F0"
        className="rounded-3xl p-10 sm:p-14 text-center"
        style={{ background: "linear-gradient(135deg, #1F1A2B 0%, #241E33 100%)", border: "1px solid #2A2438" }}
      >
        <div>
          <Sparkles size={24} style={{ color: "#C9B6F0" }} className="mx-auto mb-5" />
          <h2 style={{ fontFamily: "Fraunces, serif", color: "#F3EEFA" }} className="text-3xl sm:text-4xl mb-4">Vamos conversar</h2>
          <p style={{ color: "#A79BC0", fontFamily: "Sora, sans-serif", maxWidth: "40ch" }} className="mx-auto mb-8">
            Se você tem um projeto, uma vaga ou só quer conversar acerca de tecnologia, entra em contato comigo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton
              href="https://www.linkedin.com/in/anagsoliveira/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm"
              style={{ backgroundColor: "#C9B6F0", color: "#17131F", fontFamily: "Sora, sans-serif", fontWeight: 600 }}
            >
              <Linkedin size={16} /> LinkedIn
            </MagneticButton>
            <MagneticButton
              href="https://github.com/mawabi-oliveira"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full text-sm"
              style={{ border: "1px solid #A79BC050", color: "#F3EEFA", fontFamily: "Sora, sans-serif" }}
            >
              <Github size={16} /> GitHub
            </MagneticButton>
          </div>
        </div>
      </TiltCard>
      <p style={{ color: "#6E6480", fontFamily: "Sora, sans-serif" }} className="text-center text-xs mt-10">
        Ana Mawabi Oliveira · Maceió, AL
      </p>
    </Reveal>
  );
}

export default function AnaPortfolio() {
  return (
    <div style={{ backgroundColor: "#17131F", minHeight: "100vh", position: "relative" }}>
      <GamerCursor />
      <Nav />
      <Hero />
      <Sobre />
      <Experiencia />
      <Habilidades />
      <Projetos />
      <Contato />
    </div>
  );
}
