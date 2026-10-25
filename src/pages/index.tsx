import Head from 'next/head';
import Link from 'next/link';

const services = [
  {
    title: 'Telemedicina',
    text: 'Atención rápida y segura con profesionales matriculados para consultas, seguimiento y continuidad de cuidado.',
    badge: 'Turnos',
  },
  {
    title: 'Internación domiciliaria',
    text: 'Coordinación de visitas, órdenes, seguimiento del tratamiento y apoyo en domicilio con atención planificada.',
    badge: 'Domicilio',
  },
  {
    title: 'Divia4',
    text: 'Asistente clínico-guía que organiza dudas, prioriza consultas y conecta a la persona con la opción de atención adecuada.',
    badge: 'IA',
  },
];

const stats = [
  { value: '24', label: 'profesionales activos' },
  { value: '12', label: 'personas en espera' },
  { value: '99%', label: 'seguimiento digital' },
];

const steps = [
  'Evaluás tu necesidad y elegís la modalidad más adecuada.',
  'Tu caso se coordina con un profesional y se genera el plan de atención.',
  'Seguís con control, seguimiento y apoyo digital en cada etapa.',
];

const guarantees = [
  'Confidencialidad y seguridad de la información clínica.',
  'Coordinación clara entre pacientes, enfermería y profesionales.',
  'Seguimiento organizado de turnos, visitas y tratamientos.',
  'Experiencia digital simple, humana y centrada en la persona.',
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>DIVIA | Cuidado humano y digital</title>
        <meta
          name="description"
          content="DIVIA conecta pacientes con telemedicina, atención domiciliaria, seguimiento clínico y un asistente digital para ordenar el cuidado."
        />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-lg font-black text-white shadow-lg shadow-cyan-500/30">
                D
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">DIVIA</p>
                <h1 className="text-base font-semibold text-white">Hospital Evelyn</h1>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#servicios" className="transition hover:text-white">Servicios</a>
              <a href="#proceso" className="transition hover:text-white">Proceso</a>
              <a href="#chat" className="transition hover:text-white">Divia4</a>
            </nav>

            <Link
              href="/login"
              className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20"
            >
              Ingreso profesionales
            </Link>
          </header>

          <main className="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-emerald-200">
                cuidado integral y humanizado
              </div>

              <div className="space-y-5">
                <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                  Atención médica con acompañamiento real, claro y humano.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Coordinamos telemedicina, consultas, atención domiciliaria, seguimiento clínico y apoyo con profesionales de confianza, todo en una sola experiencia digital y segura.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02]"
                >
                  Solicitar turno para telemedicina
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Internación domiciliaria
                </Link>
              </div>

              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <div className="text-3xl font-black text-cyan-300">{stat.value}</div>
                    <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-[30px] border border-white/10 bg-gradient-to-b from-white to-slate-100 p-5 text-slate-900 shadow-2xl shadow-cyan-950/40">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Acceso</p>
                  <h3 className="text-2xl font-bold text-slate-900">Ingreso profesional</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  verificado
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu.email@dominio.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Ingresar
                </button>
              </form>

              <div className="mt-5 space-y-3">
                <Link
                  href="/login"
                  className="block w-full rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-center text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
                >
                  Solicitar turno para telemedicina
                </Link>
                <Link
                  href="/login"
                  className="block w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-center text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100"
                >
                  Gestionar internación domiciliaria
                </Link>
              </div>
            </aside>
          </main>

          <section id="servicios" className="mt-14 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/20"
              >
                <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  {service.badge}
                </span>
                <h3 className="mt-5 text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{service.text}</p>
              </article>
            ))}
          </section>

          <section id="proceso" className="mt-14 rounded-[30px] border border-white/10 bg-slate-900/80 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Proceso</p>
            <h3 className="mt-3 text-3xl font-black text-white">Un flujo simple para cuidar mejor.</h3>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-200">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="chat" className="mt-14 rounded-[30px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Divia4</p>
                <h3 className="mt-3 text-3xl font-black text-white">Asistente clínico para organizar tu cuidado.</h3>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-bold text-slate-950">
                    D4
                  </div>
                  <div>
                    <p className="font-semibold text-white">Divia4</p>
                    <p className="text-xs text-slate-400">Guía clínica y coordinadora</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 p-3 text-slate-200">
                    Puedo ayudarte a organizar tu consulta, dudas de tratamiento, seguimiento y contacto con profesionales.
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-cyan-500 p-3 font-medium text-slate-950">
                    Quiero saber si corresponde telemedicina o una visita domiciliaria.
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 p-3 text-slate-200">
                    Revisamos el caso, coordino la prioridad y te indico la mejor opción de atención.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-[30px] border border-white/10 bg-slate-900/80 p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Garantía y seguridad</p>
                <h3 className="mt-3 text-3xl font-black text-white">Documentación segura, seguimiento claro y cuidado responsable.</h3>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2">
                {guarantees.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-200">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-sm text-slate-400 md:flex-row">
            <p>DIVIA • Cuidado humano y digital</p>
            <div className="flex gap-5">
              <Link href="/login" className="transition hover:text-white">Ingresar</Link>
              <Link href="/login" className="transition hover:text-white">Registrarse</Link>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

