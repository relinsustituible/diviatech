import Head from 'next/head';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>DIVIA | Ingreso</title>
        <meta name="description" content="Inicia sesión en la plataforma DIVIA para acceder a tu panel de cuidado y atención." />
      </Head>

      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
        <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-950/40">
          <div className="grid md:grid-cols-2">
            <section className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),transparent_25%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl font-black text-white backdrop-blur-sm">
                      D
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-100">DIVIA</div>
                      <div className="text-xl font-semibold text-white">Hospital Evelyn</div>
                    </div>
                  </div>

                  <h1 className="max-w-sm text-3xl font-black leading-tight text-white sm:text-4xl">
                    El cuidado empieza con una conexión clara.
                  </h1>
                </div>

                <div className="mt-8 space-y-4 text-sm text-cyan-50/90">
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                    Telemedicina segura y organizada.
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                    Seguimiento clínico y atención domiciliaria coordinada.
                  </div>
                </div>
              </div>
            </section>

            <section className="p-6 sm:p-8 md:p-10">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Acceso</p>
                <h2 className="mt-3 text-3xl font-black text-white">Iniciar sesión</h2>
              </div>

              <div className="mb-6 flex rounded-2xl border border-white/10 bg-slate-800/80 p-1">
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  Paciente
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Profesional
                </button>
              </div>

              <form className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu.email@dominio.com"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500" />
                    Recordarme
                  </label>
                  <a href="#" className="text-cyan-300 transition hover:text-cyan-200">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-105"
                >
                  Ingresar
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                ¿No tenés cuenta?{' '}
                <Link href="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Registrate aquí
                </Link>
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

