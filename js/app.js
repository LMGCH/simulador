// ======================================================
// OBSERVABILITY LABS
// Dashboard de Observabilidad (Demo)
// Versión: 0.7.1 
// Autor: Luis Miguel Galacho + ChatGPT
// ======================================================
// ======================================================
// CONFIGURACIÓN
// ======================================================
let currentSimulationMode = 'NORMAL'; 
const timeline = [];
const systemState = {

    cpuHigh: false,
    latencyHigh: false,
    errorHigh: false

};
// ======================================================
// SERVICE ENGINE
// ======================================================

const services = {

    gateway: {
        name: "Gateway API",
        status: "HEALTHY",
        cpu: 15,
        latency: 35,
        dependsOn: ["api"]
    },

    api: {
        name: "Application API",
        status: "HEALTHY",
        cpu: 12,
        latency: 28,
        dependsOn: ["database", "redis", "identity"]
    },

    database: {
        name: "Database",
        status: "HEALTHY",
        cpu: 18,
        latency: 12,
        dependsOn: []
    },

    redis: {
        name: "Redis Cache",
        status: "HEALTHY",
        cpu: 8,
        latency: 2,
        dependsOn: []
    },

    identity: {
        name: "Identity Service",
        status: "HEALTHY",
        cpu: 10,
        latency: 20,
        dependsOn: []
    },

    notifications: {
        name: "Notification Service",
        status: "HEALTHY",
        cpu: 6,
        latency: 15,
        dependsOn: ["api"]
    }

};
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


// Histórico de latencia para la gráfica
const latencyHistory = new Array(60).fill(system.latency);

// ======================================================
// SIMULATION ENGINE
// ======================================================

const simulation = {

    currentScenario: "NORMAL",
    
    targetUsers: 500,

    currentUsers: 500,

    engineState: "Running",
    
    tick: 0,

    // Reservado para futuras transiciones automáticas
    scenarioDuration: 30

};
// ======================================================
// SCENARIOS
// ======================================================
//
// Cada escenario define el objetivo de usuarios del
// Simulation Engine.
//
// El motor será el encargado de aproximarse
// progresivamente a ese objetivo.
//
// Las métricas (CPU, memoria, latencia, etc.) serán
// consecuencia del número de usuarios y no se definirán
// directamente aquí.
//
const scenarios = {

    NORMAL:{

        users:{
            min:300,
            max:380
        },

        cpuOffset:0,
        latencyOffset:0,
        errorOffset:0

    },

    HIGH_LOAD:{

        users:{
            min:900,
            max:1200
        },

        cpuOffset:10,
        latencyOffset:0,
        errorOffset:0

    },

    INCIDENT:{

        users:{
            min:150,
            max:300
        },

        cpuOffset:30,
        latencyOffset:60,
        errorOffset:0.30

    }

};

// ======================================================
// MOTOR DE SIMULACIÓN
// ======================================================

function simulateSystem(){
    const scenario = scenarios[currentSimulationMode];
    // 1. Evolución progresiva de usuarios hacia el objetivo del escenario
const difference = simulation.targetUsers - system.users;

// El sistema avanza aproximadamente un 10 % hacia el objetivo
let userDelta = difference * 0.05;

// Añadimos una pequeña variación natural
userDelta += Math.random() * 6 - 3;

// Evitamos movimientos inferiores a un usuario
userDelta = Math.round(userDelta);

system.users += userDelta;

// Respetamos los límites definidos para el escenario
system.users = Math.max(
    scenarios[currentSimulationMode].users.min,
    Math.min(
        scenarios[currentSimulationMode].users.max,
        system.users
    )
);

    // 2. Throughput base
    system.throughput =
    Math.round(
        800 +
        system.users * 2.15 +
        (Math.random()*60-30)
    );

    // 3. CPU (Fórmula base + anomalías por escenario)
    system.cpu =
    12 +
    (system.throughput / 40) +
    (Math.random() * 4 - 2) +
    scenario.cpuOffset;
    
    system.cpu = Math.min(100, Math.max(0, system.cpu)); // Protegemos límites entre 0 y 100

    // 4. Memoria (Depende de usuarios y CPU)
system.memory =
    35 +
    (system.users / 45) +
    (system.cpu * 0.35) +
    (Math.random() * 3 - 1.5);

// Limitamos el valor
system.memory = Math.min(95, Math.max(20, system.memory));

    // 5. Latencia (Fórmula base + penalización crítica por incidente)
system.latency =
    70 +
    (system.cpu * 1.25) +
    (Math.random() * 10) +
    scenario.latencyOffset;

    // 6. Error Rate (Comienza a crecer solo con alta saturación)
system.errorRate =
    0.02 +                                  // Error base del sistema
    Math.max(0, (system.cpu - 80)) * 0.008 + // Solo aumenta a partir del 80 % de CPU
    (Math.random() * 0.01) +                 // Pequeña variación natural
    scenario.errorOffset;

// Evitamos valores negativos
system.errorRate = Math.max(0, system.errorRate);
}

// ======================================================
// SERVICE STATUS ENGINE
// ======================================================
function updateServiceStatus(service){

    service.cpu = Math.max(1, Math.min(100, service.cpu));
    service.latency = Math.max(1, service.latency);

    if(service.cpu > 85 || service.latency > 220){

        service.status = "CRITICAL";

    }else if(service.cpu > 60 || service.latency > 120){

        service.status = "WARNING";

    }else{

        service.status = "HEALTHY";

    }

}
// ======================================================
// SERVICE STATUS ENGINE
// ======================================================
function updateServiceStatus(service){

    service.cpu = Math.max(1, Math.min(100, service.cpu));
    service.latency = Math.max(1, service.latency);

    if(service.cpu > 85 || service.latency > 220){

        service.status = "CRITICAL";

    }else if(service.cpu > 60 || service.latency > 120){

        service.status = "WARNING";

    }else{

        service.status = "HEALTHY";

    }

}

// ======================================================
// MICROSERVICIOS PANEL
// ======================================================
function simulateServices(){

    Object.entries(services).forEach(([key, service])=>{

        let cpuBase = 15;
        let latencyBase = 20;

        switch(currentSimulationMode){

            case "NORMAL":

                cpuBase = 15;
                latencyBase = 20;

                break;

            case "HIGH_LOAD":

                if(key==="gateway" || key==="api"){

                    cpuBase = 70;
                    latencyBase = 120;

                }else{

                    cpuBase = 30;
                    latencyBase = 40;

                }

                break;

case "INCIDENT":

    if (key === "database") {

        cpuBase = 95;
        latencyBase = 280;

    } else if (key === "gateway") {

        cpuBase = 75;
        latencyBase = 180;

    } else if (key === "api") {

        cpuBase = 60;
        latencyBase = 140;

    } else if (key === "identity") {

        cpuBase = 40;
        latencyBase = 80;

    } else if (key === "redis") {

        cpuBase = 35;
        latencyBase = 25;

    } else if (key === "notifications") {

        cpuBase = 30;
        latencyBase = 60;

    }

    break;

        }

        service.cpu += (cpuBase - service.cpu) * 0.15;
        service.latency += (latencyBase - service.latency) * 0.15;

        service.cpu += Math.random()*4-2;
        service.latency += Math.random()*8-4;

updateServiceStatus(service);
});
    // ==========================================
    // SEGUNDA FASE: PROPAGACIÓN DE DEPENDENCIAS
    // ==========================================

for(let iteration = 0; iteration < 2; iteration++){

    Object.values(services).forEach(service => {

        service.dependsOn.forEach(dependency => {

            const parent = services[dependency];

// ==========================================
// PROPAGACIÓN PROPORCIONAL
// ==========================================

if(parent.status !== "HEALTHY"){

    // La carga heredada depende del estado real del servicio padre
    const cpuImpact =
        (parent.cpu - 60) * 0.08;

    const latencyImpact =
        (parent.latency - 100) * 0.06;

    service.cpu += Math.max(0, cpuImpact);
    service.latency += Math.max(0, latencyImpact);

}

        });

    });

// Recalcular estados tras cada pasada
Object.values(services).forEach(service => {

    updateServiceStatus(service);

});

}
}

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
/*
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
*/
function addTimelineEvent(icon, message){

    const now = new Date();

    const time =
        now.toLocaleTimeString("es-ES",{
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        });

    timeline.unshift({

        time,
        icon,
        message

    });

    if(timeline.length>12){

        timeline.pop();

    }

}
function renderAlerts(){

    const panel = document.getElementById("alertsPanel");

    if(!panel) return;

    panel.innerHTML = "";

    const alerts = [];

    if(systemState.cpuHigh){

        alerts.push({
            icon:"🟡",
            title:"WARNING",
            text:"CPU elevada"
        });

    }

    if(systemState.latencyHigh){

        alerts.push({
            icon:"🔴",
            title:"CRITICAL",
            text:"Latencia alta"
        });

    }

    if(systemState.errorHigh){

        alerts.push({
            icon:"🔴",
            title:"ERROR",
            text:"Muchos errores"
        });

    }

    if(alerts.length===0){

        panel.innerHTML = `
            <div class="text-green-400 font-semibold">
                ✅ No hay alertas activas
            </div>
        `;

        return;

    }

    alerts.forEach(alert=>{

        panel.innerHTML += `

            <div class="flex justify-between items-center border-b border-slate-700 py-2">

                <div>

                    ${alert.icon}
                    <strong>${alert.title}</strong>

                </div>

                <div>

                    ${alert.text}

                </div>

            </div>

        `;

    });

}

function renderTimeline(){

    const container = document.getElementById("timelineContainer");

    if(!container) return;

    container.innerHTML = "";

    timeline.forEach(event=>{

        container.innerHTML += `

            <div class="timeline-item">

                <div class="timeline-time">

                    ${event.time}

                </div>

                <div class="timeline-message">

                    ${event.icon} ${event.message}

                </div>

            </div>

        `;

    });

}

function renderServicesMap(){

    const container = document.getElementById("servicesMap");

    if(!container) return;

    container.innerHTML = "";

    Object.values(services).forEach(service=>{

        let statusColor = "🟢";

        if(service.status === "WARNING"){

            statusColor = "🟡";

        }else if(service.status === "CRITICAL"){

            statusColor = "🔴";

        }

        container.innerHTML += `

            <div class="bg-[#252b3d] rounded-lg p-3 border border-[#394056]">

                <div class="flex justify-between items-center mb-2">

                    <strong>

                        ${statusColor} ${service.name}

                    </strong>

                    <span class="text-xs text-gray-400">

                        ${service.status}

                    </span>

                </div>

                <div class="text-sm text-gray-300">

                    CPU:
                    <strong>${service.cpu.toFixed(0)}%</strong>

                </div>

                <div class="text-sm text-gray-300">

                    Latencia:
                    <strong>${service.latency.toFixed(0)} ms</strong>

                </div>

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
// RENDERIZACIÓN DEL PANEL
// ======================================================
function renderSimulationPanel(){

    document.getElementById("targetUsers").textContent =
        simulation.targetUsers;

    document.getElementById("currentUsers").textContent =
        system.users;

}
    // =====================================================
    // INICIO MOTOR SIMULACIÓN
    // =====================================================
addTimelineEvent(
    "🚀",
    "Simulation Engine iniciado"
);
// Ejecución inicial y temporizador unificado cada 2 segundos
tick();
setInterval(tick, 2000);

function evaluateSystemState(){

    // =====================================================
    // CPU
    // =====================================================

    if(system.cpu > 70){

        if(!systemState.cpuHigh){

            systemState.cpuHigh = true;

            addTimelineEvent(
                "🟡",
                "CPU supera el 70 %"
            );

        }

    }else{

        if(systemState.cpuHigh){

            systemState.cpuHigh = false;

            addTimelineEvent(
                "🟢",
                "CPU vuelve a valores normales"
            );

        }

    }

    // =====================================================
    // LATENCIA
    // =====================================================

    if(system.latency > 170){

        if(!systemState.latencyHigh){

            systemState.latencyHigh = true;

            addTimelineEvent(
                "🔴",
                "Latencia supera los 170 ms"
            );

        }

    }else{

        if(systemState.latencyHigh){

            systemState.latencyHigh = false;

            addTimelineEvent(
                "🟢",
                "Latencia vuelve a valores normales"
            );

        }

    }

    // =====================================================
    // ERROR RATE
    // =====================================================

    if(system.errorRate > 0.30){

        if(!systemState.errorHigh){

            systemState.errorHigh = true;

            addTimelineEvent(
                "🔴",
                "La tasa de errores supera el 30 %"
            );

        }

    }else{

        if(systemState.errorHigh){

            systemState.errorHigh = false;

            addTimelineEvent(
                "🟢",
                "La tasa de errores vuelve a la normalidad"
            );

        }

    }

}
// ======================================================
// BUCLE PRINCIPAL DE INICIALIZACIÓN
// ======================================================
function tick(){

    // Calcula el nuevo estado del sistema
    simulateSystem();

    simulateServices();

    // Evalúa umbrales y genera eventos
    evaluateSystemState();

    // Actualiza la interfaz
    renderKPIs();
    renderSimulationPanel();
    renderAlerts();
    renderTimeline();
    renderServicesMap();
    renderSystemStatus();

    // Actualiza la gráfica
    updateLatencyChartVisuals();

}

// ======================================================
// CONTROL DE ESCENARIOS (SELECT HTML)
// ======================================================

document.getElementById('scenarioSelect').addEventListener('change', (event) => {

    const selectedScenario = event.target.value;

    currentSimulationMode = selectedScenario;

    simulation.currentScenario = selectedScenario;

    const scenario = scenarios[selectedScenario];

    simulation.targetUsers =
        Math.round(
            (scenario.users.min + scenario.users.max) / 2
        );

    console.log(
        `Escenario: ${selectedScenario} | Target: ${simulation.targetUsers}`
    );

    addTimelineEvent(
        "🎯",
        `Escenario ${selectedScenario} activado (Objetivo: ${simulation.targetUsers} usuarios)`
    );

});

