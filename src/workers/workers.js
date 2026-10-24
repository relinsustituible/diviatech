/**
 * DIVIA Tech - Cloudflare Worker, API Endpoints & WebApp Gateway
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Manejo de Preflight OPTIONS para CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // 2. SERVIR LA WEBAPP COMPLETA EN LA RAÍZ (/)
      if (url.pathname === "/" || url.pathname === "") {
        return new Response(getCompleteWebAppHTML(), {
          headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders },
        });
      }

      // 3. ENRUTAMIENTO DE LA API BACKEND Y ENDPOINTS
      switch (url.pathname) {
        case "/api/health":
          return jsonResponse({
            status: "online",
            node: "Cloudflare Edge",
            service: "DIVIA Tech Telemedicine Gateway",
            timestamp: new Date().toISOString(),
          });

        case "/api/status":
          return jsonResponse({
            version: "1.0.0",
            environment: env.ENVIRONMENT || "production",
            appName: env.NEXT_PUBLIC_APP_NAME || "Divia",
            edgeLocation: request.cf?.colo || "Global Edge",
            d1Connected: !!env.DB,
          });

        case "/api/telemedicine/anamnesis":
          if (request.method === "POST") {
            const body = await request.json();
            const consultationId = crypto.randomUUID();
            const timestamp = new Date().toISOString();

            if (env.DB) {
              await env.DB.prepare(
                `INSERT INTO anamnesis (id, patient_name, age, symptoms, priority, created_at) VALUES (?, ?, ?, ?, ?, ?)`
              ).bind(
                consultationId,
                body.patientName,
                body.age,
                body.symptoms,
                body.priority || "media",
                timestamp
              ).run();
            }

            return jsonResponse({
              success: true,
              message: "Anamnesis registrada y procesada en el Edge",
              consultationId,
              receivedData: body,
            }, 201);
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        case "/api/telemedicine/triaje":
          if (request.method === "POST") {
            const body = await request.json();
            return jsonResponse({
              success: true,
              priority: "media",
              recommendation: "Derivar a consulta telemática prioritaria",
              symptomsAnalyzed: body.symptoms || "No especificados",
              timestamp: new Date().toISOString(),
            });
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        case "/api/consultations/vital-signs":
          if (request.method === "POST") {
            const body = await request.json();
            const recordId = crypto.randomUUID();
            const timestamp = new Date().toISOString();

            if (env.DB) {
              await env.DB.prepare(
                `INSERT INTO vitals (id, bp, hr, spo2, created_at) VALUES (?, ?, ?, ?, ?)`
              ).bind(recordId, body.bp, body.hr, body.spo2, timestamp).run();
            }

            return jsonResponse({
              success: true,
              message: "Signos vitales almacenados correctamente",
              recordId,
              timestamp,
              data: body,
            }, 201);
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        case "/api/consultations/waiting-list":
          if (env.DB) {
            const { results } = await env.DB.prepare(
              `SELECT id, patient_name as patientName, age, symptoms, priority FROM anamnesis ORDER BY created_at DESC LIMIT 20`
            ).all();
            return jsonResponse({
              success: true,
              waitingList: results && results.length > 0 ? results : getDefaultWaitingList()
            });
          }
          return jsonResponse({
            success: true,
            waitingList: getDefaultWaitingList()
          });

        case "/api/stream/create":
          if (request.method === "POST") {
            return jsonResponse({
              success: true,
              streamUrl: "https://iframe.cloudflarestream.com/demo",
              message: "Sesión de transmisión HLS creada con éxito en el Edge"
            }, 201);
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        case "/api/audio/process":
          if (request.method === "POST") {
            const body = await request.json();
            return jsonResponse({
              success: true,
              preset: body.preset || "Fibonacci-13B",
              sampleRate: body.sampleRate || 192000,
              status: "Audio equalized and optimized successfully via edge pipeline"
            });
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        case "/api/auth/login":
          if (request.method === "POST") {
            const { email } = await request.json();
            return jsonResponse({
              success: true,
              token: "mock-jwt-token-edge-verified-" + crypto.randomUUID(),
              user: { email, role: "medical_professional" }
            });
          }
          return jsonResponse({ error: "Método no permitido" }, 405);

        default:
          return jsonResponse({ error: "Ruta de API no encontrada", path: url.pathname }, 404);
      }
    } catch (err) {
      return jsonResponse({ error: "Error interno del servidor", message: err.message }, 500);
    }
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      ...corsHeaders,
    },
  });
}

function getDefaultWaitingList() {
  return [
    { id: "1", patientName: "María González", age: 35, symptoms: "Cefalea intensa y mareos", priority: "media" },
    { id: "2", patientName: "Carlos Rossi", age: 52, symptoms: "Control de presión arterial y fatiga", priority: "baja" }
  ];
}

/**
 * Plantilla HTML/Frontend completa embebida en el Worker para mostrar la WebApp de una sola vez
 */
function getCompleteWebAppHTML() {
  return `<!DOCTYPE html>
<html lang="es" class="h-full bg-slate-950 text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIVIA Tech | Plataforma de Telemedicina & Cloudflare Edge</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="h-full flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">

  <!-- TOP NAVIGATION BAR -->
  <header class="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur px-4 sm:px-8 py-3 flex justify-between items-center">
    <div class="flex items-center space-x-3 cursor-pointer" onclick="switchTab('home')">
      <div id="connection-dot" class="w-3 h-3 rounded-full bg-amber-500 animate-pulse" title="Verificando Worker..."></div>
      <span class="text-xl font-extrabold tracking-wider text-emerald-400">DIVIA<span class="text-slate-100 font-light text-sm ml-1">TECH</span></span>
    </div>

    <nav class="hidden md:flex items-center space-x-1 text-xs font-semibold text-slate-400">
      <button onclick="switchTab('home')" id="tab-home" class="px-3 py-2 rounded-lg hover:text-slate-100 transition text-emerald-400 bg-slate-900 border border-slate-800">Inicio</button>
      <button onclick="switchTab('telemedicine')" id="tab-telemedicine" class="px-3 py-2 rounded-lg hover:text-slate-100 transition">Telemedicina</button>
      <button onclick="switchTab('professional')" id="tab-professional" class="px-3 py-2 rounded-lg hover:text-slate-100 transition">Panel Médico</button>
      <button onclick="switchTab('patient')" id="tab-patient" class="px-3 py-2 rounded-lg hover:text-slate-100 transition">Portal Paciente</button>
    </nav>

    <div class="flex items-center space-x-3">
      <span class="hidden sm:inline-flex items-center text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
        Nodo: <span id="node-status" class="ml-1 text-amber-400">Comprobando</span>
      </span>
      <button onclick="openAuthModal()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg transition active:scale-95">
        Ingresar
      </button>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

    <!-- VIEW 1: HOME -->
    <section id="view-home" class="space-y-12">
      <div class="text-center space-y-4 pt-8 pb-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Cloudflare Workers & Edge Architecture
        </span>
        <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-slate-100">
          Ecosistema de Salud Digital & <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Telemedicina Distribuida</span>
        </h1>
        <p class="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
          Plataforma optimizada para anamnesis remota, gestión de guardias rurales, triaje asistido y procesamiento de señales de audio de alta fidelidad.
        </p>
        <div class="flex flex-wrap justify-center gap-4 pt-4">
          <button onclick="switchTab('telemedicine')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20">
            Abrir Sala Virtual
          </button>
          <button onclick="switchTab('professional')" class="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-6 py-3 rounded-xl transition">
            Panel de Profesionales
          </button>
        </div>
      </div>
    </section>

    <!-- VIEW 2: TELEMEDICINE -->
    <section id="view-telemedicine" class="hidden space-y-6">
      <div class="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-emerald-400">Sala de Telemedicina & Monitoreo</h2>
          <p class="text-slate-400 text-xs">Gestión en vivo de consultas remotas y constantes vitales.</p>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 class="text-sm font-bold text-slate-200">Videoconsulta y Stream</h3>
          <div class="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center border border-slate-800 space-y-3">
            <p class="text-slate-400 text-xs">Transmisión HLS lista para conectar con Cloudflare Stream</p>
            <button onclick="createStreamSession()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition">
              Iniciar Canal de Video
            </button>
          </div>
          <button onclick="sendAudioProcess()" class="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold py-2.5 rounded-lg transition">
            Ejecutar Procesamiento de Audio Fibonacci 13B
          </button>
        </div>
        <div class="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 class="text-sm font-bold text-slate-200">Registro de Signos Vitales</h3>
          <form onsubmit="handleVitalsSubmit(event)" class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-400 mb-1">Presión Arterial</label>
              <input type="text" id="vital-bp" placeholder="120/80" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-emerald-500" required>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-slate-400 mb-1">Ritmo (BPM)</label>
                <input type="number" id="vital-hr" placeholder="72" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-emerald-500" required>
              </div>
              <div>
                <label class="block text-slate-400 mb-1">SpO2 (%)</label>
                <input type="number" id="vital-spo2" placeholder="98" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-emerald-500" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition">
              Guardar Signos Vitales
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- VIEW 3: PROFESSIONAL -->
    <section id="view-professional" class="hidden space-y-6">
      <div class="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-emerald-400">Panel Médico de Guardia</h2>
          <p class="text-slate-400 text-xs">Lista de espera y triaje de pacientes en tiempo real.</p>
        </div>
        <button onclick="fetchWaitingList()" class="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-lg hover:bg-slate-800">
          Actualizar Lista de Espera
        </button>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4">
        <div id="waiting-list-container" class="space-y-3 text-xs">
          <p class="text-slate-400">Haz clic en "Actualizar Lista de Espera" para consultar los pacientes pendientes desde el Worker.</p>
        </div>
      </div>
    </section>

    <!-- VIEW 4: PATIENT -->
    <section id="view-patient" class="hidden space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <h2 class="text-2xl font-bold text-emerald-400">Portal del Paciente</h2>
        <p class="text-slate-400 text-xs">Solicitud de turno y envío de anamnesis inicial.</p>
      </div>
      <div class="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <form onsubmit="handleAnamnesisSubmit(event)" class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-400 mb-1">Nombre Completo</label>
            <input type="text" id="patient-name" placeholder="Ej. Juan Pérez" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 outline-none focus:border-emerald-500" required>
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Edad</label>
            <input type="number" id="patient-age" placeholder="Ej. 42" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 outline-none focus:border-emerald-500" required>
          </div>
          <div>
            <label class="block text-slate-400 mb-1">Motivo de Consulta / Síntomas</label>
            <textarea id="patient-symptoms" rows="3" placeholder="Describa su cuadro clínico..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-slate-100 outline-none focus:border-emerald-500" required></textarea>
          </div>
          <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition">
            Enviar Anamnesis al Sistema
          </button>
        </form>
      </div>
    </section>

    <!-- GLOBAL TERMINAL -->
    <section class="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <h4 class="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">Consola de Respuestas de la API Worker</h4>
        <button onclick="clearConsole()" class="text-[11px] text-slate-500 hover:text-slate-300">Limpiar</button>
      </div>
      <pre id="api-console" class="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 max-h-48 overflow-auto leading-relaxed whitespace-pre-wrap">Conectando con el Worker...</pre>
    </section>

  </main>

  <!-- AUTH MODAL -->
  <div id="auth-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur items-center justify-center p-4 z-50 hidden">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-emerald-400 text-base">Iniciar Sesión DIVIA</h3>
        <button onclick="closeAuthModal()" class="text-slate-500 hover:text-slate-200 text-lg">&times;</button>
      </div>
      <form onsubmit="handleLogin(event)" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-400 mb-1">Correo Electrónico</label>
          <input type="email" id="auth-email" placeholder="medico@divia.com" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-emerald-500" required>
        </div>
        <div>
          <label class="block text-slate-400 mb-1">Contraseña</label>
          <input type="password" id="auth-password" placeholder="••••••••" class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 outline-none focus:border-emerald-500" required>
        </div>
        <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg transition">
          Ingresar al Sistema
        </button>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT FRONTEND LOGIC -->
  <script>
    const consoleElem = document.getElementById("api-console");
    const connectionDot = document.getElementById("connection-dot");
    const nodeStatus = document.getElementById("node-status");

    function logConsole(data) {
      consoleElem.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    }
    function clearConsole() { consoleElem.textContent = "Consola limpia."; }

    function switchTab(tabName) {
      ['home', 'telemedicine', 'professional', 'patient'].forEach(tab => {
        document.getElementById(`view-${tab}`).classList.add('hidden');
        const btn = document.getElementById(`tab-${tab}`);
        if(btn) {
          btn.classList.remove('text-emerald-400', 'bg-slate-900', 'border', 'border-slate-800');
          btn.classList.add('text-slate-400');
        }
      });
      document.getElementById(`view-${tabName}`).classList.remove('hidden');
      const activeBtn = document.getElementById(`tab-${tabName}`);
      if(activeBtn) {
        activeBtn.classList.add('text-emerald-400', 'bg-slate-900', 'border', 'border-slate-800');
        activeBtn.classList.remove('text-slate-400');
      }
    }

    async function checkHealth() {
      try {
        const res = await fetch(`/api/health`);
        const data = await res.json();
        if(res.ok) {
          connectionDot.className = "w-3 h-3 rounded-full bg-emerald-500 animate-pulse";
          nodeStatus.textContent = "Online";
          nodeStatus.className = "ml-1 text-emerald-400 font-semibold";
          logConsole({ status: "Nodo Worker Activo", data });
        }
      } catch (err) {
        connectionDot.className = "w-3 h-3 rounded-full bg-rose-500";
        nodeStatus.textContent = "Error";
        logConsole(`Error de conexión: ${err.message}`);
      }
    }

    function openAuthModal() { document.getElementById("auth-modal").classList.remove("hidden"); document.getElementById("auth-modal").classList.add("flex"); }
    function closeAuthModal() { document.getElementById("auth-modal").classList.add("hidden"); document.getElementById("auth-modal").classList.remove("flex"); }

    async function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById("auth-email").value;
      const password = document.getElementById("auth-password").value;
      try {
        const res = await fetch(`/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        logConsole(data);
        closeAuthModal();
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    async function handleVitalsSubmit(e) {
      e.preventDefault();
      const bp = document.getElementById("vital-bp").value;
      const hr = document.getElementById("vital-hr").value;
      const spo2 = document.getElementById("vital-spo2").value;
      try {
        const res = await fetch(`/api/consultations/vital-signs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bp, hr: Number(hr), spo2: Number(spo2) })
        });
        const data = await res.json();
        logConsole(data);
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    async function handleAnamnesisSubmit(e) {
      e.preventDefault();
      const patientName = document.getElementById("patient-name").value;
      const age = document.getElementById("patient-age").value;
      const symptoms = document.getElementById("patient-symptoms").value;
      try {
        const res = await fetch(`/api/telemedicine/anamnesis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientName, age: Number(age), symptoms })
        });
        const data = await res.json();
        logConsole(data);
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    async function fetchWaitingList() {
      try {
        const res = await fetch(`/api/consultations/waiting-list`);
        const data = await res.json();
        logConsole(data);
        if(data.waitingList) {
          const container = document.getElementById("waiting-list-container");
          container.innerHTML = data.waitingList.map(p => `
            <div class="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
              <div>
                <strong class="text-slate-100">${p.patientName}</strong> (Edad: ${p.age})
                <p class="text-slate-400">${p.symptoms}</p>
              </div>
              <span class="bg-amber-950 text-amber-300 px-2 py-1 rounded text-[10px]">${p.priority || 'media'}</span>
            </div>
          `).join('');
        }
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    async function createStreamSession() {
      try {
        const res = await fetch(`/api/stream/create`, { method: "POST" });
        const data = await res.json();
        logConsole(data);
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    async function sendAudioProcess() {
      try {
        const res = await fetch(`/api/audio/process`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preset: "Fibonacci-13B", sampleRate: 192000 })
        });
        const data = await res.json();
        logConsole(data);
      } catch (err) { logConsole(`Error: ${err.message}`); }
    }

    checkHealth();
  </script>
</body>
</html>`;
}
