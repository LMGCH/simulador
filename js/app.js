// ======================================================
// OBSERVABILITY LABS
// Dashboard de Observabilidad (Demo)
// Versión: 0.2
// Autor: Luis Miguel Galacho + ChatGPT
// ======================================================
// ======================================================
// CONFIGURACIÓN
// ======================================================
let currentSimulationMode = 'NORMAL'; 

const metrics = [

{
title:"Latencia",
unit:"ms",
icon:"fa-gauge-high",
color:"#22c55e",
min:90,
max:180,
decimals:0,
trend:-1
},

{
title:"Throughput",
unit:"req/min",
icon:"fa-arrow-trend-up",
color:"#3b82f6",
min:1200,
max:1700,
decimals:0,
trend:1
},

{
title:"Error Rate",
unit:"%",
icon:"fa-circle-exclamation",
color:"#ef4444",
min:0.01,
max:0.35,
decimals:2,
trend:-1
},

{
title:"CPU",
unit:"%",
icon:"fa-microchip",
color:"#f59e0b",
min:15,
max:75,
decimals:0,
trend:1
},

{
title:"Memory",
unit:"%",
icon:"fa-memory",
color:"#8b5cf6",
min:30,
max:88,
decimals:0,
trend:1
},

{
title:"Active Services",
unit:"",
icon:"fa-server",
color:"#06b6d4",
min:8,
max:14,
decimals:0,
trend:0
}

];

const grid=document.getElementById("kpi-grid");

metrics.forEach((m,index)=>{

const card=document.createElement("div");

card.className="card p-6";

card.innerHTML=`

<div class="flex justify-between items-center">

<div>

<div class="text-xs uppercase tracking-widest text-gray-400">

${m.title}

</div>

<div
id="metric${index}"
class="text-4xl font-bold mt-3">

--

</div>

<div
id="trend${index}"
class="text-xs mt-3">

</div>

</div>

<div
class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
style="background:${m.color}22;color:${m.color}">

<i class="fa-solid ${m.icon}"></i>

</div>

</div>

`;

grid.appendChild(card);

});
// ======================================================
// CACHE DE ELEMENTOS DEL DOM
// ======================================================

const metricElements = metrics.map((_, index) =>
    document.getElementById("metric" + index)
);

const trendElements = metrics.map((_, index) =>
    document.getElementById("trend" + index)
);

// ======================================================
// ESTADO GLOBAL
// ======================================================

const system = {
    users: 340,
    throughput: 1450,
    cpu: 38,
    memory: 54,
    latency: 118,
    errorRate: 0.05,
    services: 12
};

// Historial de alertas
const alerts = [];

// Histórico de latencia para la gráfica
const latencyHistory = new Array(60).fill(system.latency);

// ======================================================
// SIMULATION ENGINE
// ======================================================

const simulation = {

    currentScenario: "NORMAL",

    tick: 0,

    scenarioDuration: 30

};

const scenarios = {

    NORMAL: {
        users: {
            min: 300,
            max: 380
        }
    },

    HIGH_TRAFFIC: {
        users: {
            min: 600,
            max: 850
        }
    },

    PAYMENTS_DOWN: {
        users: {
            min: 450,
            max: 650
        }
    },

    DDOS: {
        users: {
            min: 1000,
            max: 1200
        }
    },

    RECOVERY: {
        users: {
            min: 350,
            max: 500
        }
    }

};

function randomBetween(min,max){

    return Math.floor(
        Math.random()*(max-min+1)
    )+min;

}

// ======================================================
// MOTOR DE SIMULACIÓN
// ======================================================

function simulateSystem(){

    // 1. Variación de usuarios base + modificador por escenario
    let userDelta = Math.floor(Math.random() * 41) - 20;
    
    if (currentSimulationMode === 'HIGH_LOAD') {
        // En carga alta forzamos a que entren muchos más usuarios por ciclo
        userDelta += 60; 
    } else if (currentSimulationMode === 'INCIDENT') {
        // En un incidente técnico, el tráfico web suele caer o fluctuar bruscamente
        userDelta -= 40; 
    }

    system.users += userDelta;
    system.users = Math.max(100, Math.min(1200, system.users));

    // 2. Throughput base
    system.throughput = Math.round(800 + system.users * 2.2);

    // 3. CPU (Fórmula base + anomalías por escenario)
    let cpuAnomalies = 0;
    if (currentSimulationMode === 'HIGH_LOAD') {
        cpuAnomalies = 25; // La alta concurrencia estresa la CPU
    } else if (currentSimulationMode === 'INCIDENT') {
        cpuAnomalies = 50; // Un proceso bloqueado o bucle infinito dispara la CPU al máximo
    }

    system.cpu = 18 + (system.throughput / 55) + (Math.random() * 5 - 2) + cpuAnomalies;
    system.cpu = Math.min(100, Math.max(0, system.cpu)); // Protegemos límites entre 0 y 100

    // 4. Memoria (Hereda el comportamiento de la CPU)
    system.memory = 30 + (system.cpu * 0.65) + (Math.random() * 4 - 2);
    system.memory = Math.min(95, system.memory);

    // 5. Latencia (Fórmula base + penalización crítica por incidente)
    let latencyPenalty = 0;
    if (currentSimulationMode === 'INCIDENT') {
        // En incidente técnico simulamos degradación extrema de la base de datos o microservicios
        latencyPenalty = 80; 
    }
    
    system.latency = 70 + (system.cpu * 1.25) + (Math.random() * 10) + latencyPenalty;

    // 6. Error Rate (Fórmula base + inyección forzada en incidente)
    let errorSpike = 0;
    if (currentSimulationMode === 'INCIDENT') {
        errorSpike = 0.35; // Forzamos un 35% de errores directos (ej: fallos de conexión 502/504)
    }

    system.errorRate = 0.02 + Math.max(0, (system.cpu - 65)) * 0.015 + errorSpike;
}


// ======================================================
// DEVELOPER PANEL
// ======================================================


// ======================================================
// RENDERIZADO DE KPIs
// ======================================================
function renderKPIs(){


    // Valores reales procedentes del motor
    const values = [

        system.latency,
        system.throughput,
        system.errorRate,
        system.cpu,
        system.memory,
        system.services

    ];

    metrics.forEach((m,index)=>{

        let value = values[index];

        if(m.decimals > 0){

            value = Number(value).toFixed(m.decimals);

        }else{

            value = Math.round(value);

        }

        metricElements[index].innerHTML =
        value +
        " <span class='text-lg text-gray-400'>" +
        m.unit +
        "</span>";

        const trend = trendElements[index];

        switch(index){

            // Latencia
            case 0:

                if(system.latency < 120){

                    trend.innerHTML =
                    "<span class='text-green-400'><i class='fa-solid fa-check'></i> Excelente</span>";

                }else if(system.latency < 170){

                    trend.innerHTML =
                    "<span class='text-yellow-400'><i class='fa-solid fa-triangle-exclamation'></i> Normal</span>";

                }else{

                    trend.innerHTML =
                    "<span class='text-red-400'><i class='fa-solid fa-circle-exclamation'></i> Alta</span>";

                }

            break;

            // Throughput
            case 1:

                trend.innerHTML =
                "<span class='text-blue-400'>" +
                system.users +
                " usuarios conectados</span>";

            break;

            // Error Rate
            case 2:

                if(system.errorRate < 0.10){

                    trend.innerHTML =
                    "<span class='text-green-400'>Sin incidencias</span>";

                }else if(system.errorRate < 0.30){

                    trend.innerHTML =
                    "<span class='text-yellow-400'>Advertencias</span>";

                }else{

                    trend.innerHTML =
                    "<span class='text-red-500'>Errores críticos</span>";

                }

            break;

            // CPU
            case 3:

                trend.innerHTML =
                "<span class='text-orange-400'>Carga del sistema</span>";
            break;

            // Memoria
            case 4:

                trend.innerHTML =
                "<span class='text-purple-400'>Uso de memoria</span>";

            break;

            // Servicios
            case 5:

                trend.innerHTML =
                "<span class='text-cyan-400'>Todos operativos</span>";

            break;

        }

    });

}
// ======================================================
// ALERTAS
// ======================================================

function addAlert(level, message){

    const time = new Date().toLocaleTimeString("es-ES");

    alerts.unshift({
        time,
        level,
        message
    });

    if(alerts.length > 8){
        alerts.pop();
    }

}
function renderAlerts(){

    const panel =
        document.getElementById("alertsPanel");

    panel.innerHTML = "";

    alerts.forEach(alert=>{

        panel.innerHTML += `
        <div class="flex justify-between border-b border-gray-700 py-1">

            <span>${alert.time}</span>

            <span>${alert.level}</span>

            <span>${alert.message}</span>

        </div>
        `;

    });

}
// ======================================================
// CHART.JS
// ======================================================
const ctx = document.getElementById("latencyChart");
const latencyChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: Array.from({length: 60}, (_, i) => i - 59),
        datasets: [{
            label: "Latencia",
            data: new Array(60).fill(120),
            borderColor: "#3b82f6",
            borderWidth: 3,
            tension: .35,
            pointRadius: 0,
            fill: true,
            backgroundColor: "rgba(59,130,246,.15)"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { display: false }, border: { display: false }, grid: { color: "#2f3445" } },
            y: { suggestedMin: 80, suggestedMax: 220, ticks: { color: "#94a3b8", stepSize: 20 }, border: { display: false }, grid: { color: "#2f3445" } }
        }
    }
});

// ======================================================
// SYSTEM STATUS
// ======================================================
function renderSystemStatus(){
    const status = document.getElementById("systemStatus");
    if(!status) return; // Protección si el elemento no existe en el HTML

    if(system.errorRate > 0.30){
        status.innerHTML = "🔴 SYSTEM STATUS: CRITICAL";
        status.className = "mt-2 text-sm font-semibold text-red-400";
    }
    else if(system.cpu > 70 || system.latency > 170){
        status.innerHTML = "🟡 SYSTEM STATUS: DEGRADED";
        status.className = "mt-2 text-sm font-semibold text-yellow-400";
    }
    else{
        status.innerHTML = "🟢 SYSTEM STATUS: HEALTHY";
        status.className = "mt-2 text-sm font-semibold text-green-400";
    }
}

// ======================================================
// ACTUALIZACIÓN DE LA GRÁFICA (Alineada con el estado real del sistema)
// ======================================================
function updateLatencyChartVisuals() {
    const dataset = latencyChart.data.datasets[0];
    
    // Inyectamos el valor REAL que generó tu función simulateSystem()
    dataset.data.push(system.latency);
    dataset.data.shift();
    
    // Cambiamos el color de la gráfica basándonos en los umbrales reales de tu sistema
    if (system.errorRate > 0.30) {
        dataset.borderColor = "#ef4444"; // Rojo (Crítico)
        dataset.backgroundColor = "rgba(239, 68, 68, 0.15)";
    } else if (system.cpu > 70 || system.latency > 170) {
        dataset.borderColor = "#f59e0b"; // Ámbar (Degradado)
        dataset.backgroundColor = "rgba(245, 158, 11, 0.15)";
    } else {
        dataset.borderColor = "#3b82f6"; // Azul original (Saludable)
        dataset.backgroundColor = "rgba(59, 130, 246, 0.15)";
    }
    
    latencyChart.update();
}

// ======================================================
// BUCLE PRINCIPAL DE INICIALIZACIÓN
// ======================================================
function tick(){
    // 1. Calcula las nuevas métricas (Modifica el objeto global 'system')
    simulateSystem();

    // 2. Evalúa alertas basadas en las nuevas métricas
    if(system.cpu > 70)      addAlert("🟡 WARNING", "CPU elevada");
    if(system.latency > 170)  addAlert("🔴 CRITICAL", "Latencia alta");
    if(system.errorRate > 0.30) addAlert("🔴 ERROR", "Muchos errores");

    // 3. Renderiza componentes visuales estáticos
    renderKPIs();
    renderAlerts();
    renderSystemStatus();

    // 4. Actualiza la gráfica con la latencia real generada
    updateLatencyChartVisuals();
}

// Ejecución inicial y temporizador unificado cada 2 segundos
tick();
setInterval(tick, 2000);

// ======================================================
// CONTROL DE ESCENARIOS (SELECT HTML)
// ======================================================

// Escuchamos cuando el usuario cambia la opción del desplegable
document.getElementById('scenarioSelect').addEventListener('change', (event) => {
    
    // Capturamos el valor seleccionado ("NORMAL", "HIGH_LOAD" o "INCIDENT")
    const selectedScenario = event.target.value;
    
    // Sincronizamos la variable global de tu simulador
    currentSimulationMode = selectedScenario;
    
    // Opcional: Si tu función simulateSystem() depende directamente de otra variable global
    // llamada por ejemplo 'system.currentMode', puedes asignarla aquí también:
    // system.currentMode = selectedScenario;

    console.log(`Escenario cambiado a: ${selectedScenario}`);
});

