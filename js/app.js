// ======================================================
// OBSERVABILITY LABS
// Dashboard de Observabilidad (Demo)
// Versión: 1.0.0 funcional 
// Autor: Luis Miguel Galacho + ChatGPT
// ======================================================
// ======================================================
// CONFIGURACIÓN
// ======================================================
let currentSimulationMode = 'NORMAL'; 
const timeline = [];

// ======================================================
// SYSTEM STATE
// ======================================================

const systemState = {

    cpuHigh: false,
    latencyHigh: false,
    errorHigh: false

};

// ======================================================
// SIMULATION CONTROL
// ======================================================

let simulationPaused = false;

// ======================================================
// LOGS ENGINE
// ======================================================

const logs = [];

function addLog(level, source, message){

    const now = new Date();

    const time =
        now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    logs.unshift({
        time,
        level,
        source,
        message
    });

    if(logs.length > 100){
        logs.pop();
    }

}


// ======================================================
// RENDER LOGS
// ======================================================

function renderLogs(){

    const container =
        document.getElementById("logsContainer");

    if(!container) return;


    // ==================================================
    // FILTROS
    // ==================================================

    const search =
        (
            document.getElementById("logSearch")?.value ||
            ""
        ).toLowerCase();

    const level =
        activeLogLevel;

    const source =
        document.getElementById("logSourceFilter")?.value ||
        "ALL";


    // ==================================================
    // FILTRAR LOGS
    // ==================================================

    const filteredLogs = logs.filter(log => {

        const matchesLevel =
            level === "ALL" ||
            log.level === level;

        const matchesSource =
            source === "ALL" ||
            log.source === source;

        const text =
            `${log.time} ${log.level} ${log.source} ${log.message}`
            .toLowerCase();

        const matchesSearch =
            !search ||
            text.includes(search);

        return (
            matchesLevel &&
            matchesSource &&
            matchesSearch
        );

    });


    // ==================================================
    // CONTADOR
    // ==================================================

    const resultCount =
        document.getElementById("logsResultCount");

    if(resultCount){

        resultCount.textContent =
            `${filteredLogs.length} ${
                filteredLogs.length === 1
                    ? "event"
                    : "events"
            }`;

    }


    // ==================================================
    // SIN RESULTADOS
    // ==================================================

    if(filteredLogs.length === 0){

        container.innerHTML = `

            <div class="p-10 text-center">

                <div class="text-3xl mb-3">
                    🔎
                </div>

                <div class="text-gray-400">
                    Ningún registro coincide con los filtros actuales.
                </div>

            </div>

        `;

        return;

    }


    // ==================================================
    // RENDER
    // ==================================================

    container.innerHTML =
        filteredLogs.map(log => {

            let levelClass =
                "text-blue-400";

            let levelIcon =
                "ℹ️";

            if(log.level === "WARNING"){

                levelClass =
                    "text-yellow-400";

                levelIcon =
                    "⚠️";

            }

            if(log.level === "CRITICAL"){

                levelClass =
                    "text-red-400";

                levelIcon =
                    "🔴";

            }

            return `

                <div
                    class="px-6 py-4
                           border-b border-[#2f3445]
                           hover:bg-[#202536]
                           transition">

                    <div
                        class="flex flex-col lg:flex-row
                               lg:items-center gap-3">

                        <!-- TIME -->

                        <div
                            class="text-xs
                                   text-gray-500
                                   font-mono
                                   w-20">

                            ${log.time}

                        </div>


                        <!-- LEVEL -->

                        <div
                            class="${levelClass}
                                   font-semibold
                                   text-xs
                                   w-24">

                            ${levelIcon}
                            ${log.level}

                        </div>


                        <!-- SOURCE -->

                        <div
                            class="text-xs
                                   text-gray-500
                                   font-mono
                                   w-24">

                            ${log.source}

                        </div>


                        <!-- MESSAGE -->

                        <div
                            class="text-sm
                                   text-gray-300
                                   flex-1">

                            ${log.message}

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}

// ======================================================
// LOG SUMMARY
// ======================================================

function renderLogsSummary(){

    const container =
        document.getElementById("logsSummary");

    if(!container) return;


    const total =
        logs.length;

    const info =
        logs.filter(log =>
            log.level === "INFO"
        ).length;

    const warning =
        logs.filter(log =>
            log.level === "WARNING"
        ).length;

    const critical =
        logs.filter(log =>
            log.level === "CRITICAL"
        ).length;


    const cards = [

        {
            title: "Total de eventos",
            value: total,
            icon: "fa-list",
            color: "#3b82f6"
        },

        {
            title: "Información",
            value: info,
            icon: "fa-circle-info",
            color: "#22c55e"
        },

        {
            title: "Advertencias",
            value: warning,
            icon: "fa-triangle-exclamation",
            color: "#f59e0b"
        },

        {
            title: "Críticos",
            value: critical,
            icon: "fa-circle-exclamation",
            color: "#ef4444"
        }

    ];


    container.innerHTML =
        cards.map(card => `

            <div class="card p-5">

                <div
                    class="flex justify-between
                           items-center">

                    <div>

                        <div
                            class="text-xs uppercase
                                   tracking-widest
                                   text-gray-400">

                            ${card.title}

                        </div>

                        <div
                            class="text-3xl font-bold mt-2">

                            ${card.value}

                        </div>

                    </div>

                    <div
                        class="w-11 h-11 rounded-lg
                               flex items-center
                               justify-center text-lg"
                        style="
                            background:${card.color}22;
                            color:${card.color};
                        ">

                        <i
                            class="fa-solid ${card.icon}">
                        </i>

                    </div>

                </div>

            </div>

        `).join("");

}



// ======================================================
// LOG FILTER CONTROLS
// ======================================================

let activeLogLevel = "ALL";

function initializeLogFilters(){

    const search =
        document.getElementById("logSearch");

    const source =
        document.getElementById("logSourceFilter");

    const levelButtons =
        document.querySelectorAll(
            "#logsFilters .log-filter"
        );
    

    // ==============================================
    // BUSCADOR
    // ==============================================

    if(search){

        search.addEventListener("input", () => {

            logSearchTerm =
                search.value
                    .trim()
                    .toLowerCase();

            renderLogs();

        });

    }


    // ==============================================
    // ORIGEN
    // ==============================================

    if(source){

        source.addEventListener("change", () => {

            renderLogs();

        });

    }


    // ==============================================
    // NIVELES
    // ==============================================

    levelButtons.forEach(button => {

        button.addEventListener("click", () => {

            console.log(
                "LOG FILTER CLICK:",
                button.dataset.level
            );

            activeLogLevel =
                button.dataset.level;

            levelButtons.forEach(item => {

                item.classList.remove("active");

            });

            button.classList.add("active");

            renderLogs();

        });

    });

}


let systemInitialized = false;
// ======================================================
// SERVICE TOPOLOGY
// ======================================================

const serviceTopology = {

    gateway:["api"],

    api:["database"],

    database:[],

    redis:[],

    identity:[],

    notifications:["api"],

};

// ======================================================
// SERVICE ENGINE
// ======================================================

const services = {

gateway: {
    name: "API Gateway",
    status: "HEALTHY",

    cpu: 15,
    memory: 28,
    latency: 35,

    requests: 0,

    dependsOn: ["api"],
    healthScore: 100,
    autoHealing: true
},

   api: {
    name: "API de Aplicación",
    status: "HEALTHY",

    cpu: 12,
    memory: 32,
    latency: 28,

    requests: 0,

    dependsOn: ["database", "redis", "identity"],
    healthScore: 100,
    autoHealing: true
},

    database: {
    name: "Base de Datos",
    status: "HEALTHY",

    cpu: 18,
    memory: 42,
    latency: 12,

    requests: 0,

    dependsOn: [],
    healthScore: 100,
    autoHealing: true
},

   redis: {
    name: "Caché Redis",
    status: "HEALTHY",

    cpu: 8,
    memory: 18,
    latency: 2,

    requests: 0,

    dependsOn: [],
    healthScore: 100,
    autoHealing: true
},

    identity: {
    name: "Servicio de Identidad",
    status: "HEALTHY",

    cpu: 10,
    memory: 22,
    latency: 20,

    requests: 0,

    dependsOn: [],
    healthScore: 100,
    autoHealing: true
},
    notifications: {
    name: "Servicio de Notificaciones",
    status: "HEALTHY",

    cpu: 6,
    memory: 15,
    latency: 15,

    requests: 0,

    dependsOn: ["api"],
    healthScore: 100,
    autoHealing: true
}
};

// ======================================================
// INITIAL SERVICE STATE
// ======================================================

const initialServiceState = {};

Object.entries(services).forEach(([key, service]) => {

    initialServiceState[key] = {

        cpu: service.cpu,

        memory: service.memory,

        latency: service.latency,

        requests: service.requests,

        healthScore: service.healthScore,

        status: service.status

    };

});

// ======================================================
// MEMORIA DEL ESTADO DE LOS SERVICIOS
// ======================================================

const serviceState = {};

Object.keys(services).forEach(key => {

    serviceState[key] = services[key].status;

});

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
title:"Tasa de errores",
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
title:"Memoria",
unit:"%",
icon:"fa-memory",
color:"#8b5cf6",
min:30,
max:88,
decimals:0,
trend:1
},

{
title:"Servicios activos",
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
    services: 0,

    status: "HEALTHY"
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
    scenarioDuration: 30,

    // ==============================================
    // OFFSETS DINÁMICOS PARA TRANSICIONES GRADUALES
    // ==============================================

    cpuOffset: 0,

    latencyOffset: 0,

    errorOffset: 0

};

// ======================================================
// SCENARIOS
// ======================================================
//
// Cada escenario define el comportamiento global del
// sistema durante la simulación.
//
// Incluye:
//
// • Rango objetivo de usuarios.
// • Ajustes sobre las métricas principales.
// • Comportamiento base de los microservicios.
//
// Los distintos motores de simulación consultan esta
// configuración para calcular la evolución del sistema,
// evitando reglas específicas para cada escenario.
//
const scenarios = {

NORMAL:{

    users:{
        min:300,
        max:380
    },

    cpuOffset:0,
    latencyOffset:0,
    errorOffset:0,

    services:{

        gateway:{cpu:15, latency:20},
        api:{cpu:15, latency:20},
        database:{cpu:15, latency:20},
        redis:{cpu:15, latency:20},
        identity:{cpu:15, latency:20},
        notifications:{cpu:15, latency:20}

    }

},

HIGH_LOAD:{

    users:{
        min:900,
        max:1200
    },

    cpuOffset:10,
    latencyOffset:0,
    errorOffset:0,

    services:{

        gateway:{cpu:70, latency:120},
        api:{cpu:70, latency:120},
        database:{cpu:30, latency:40},
        redis:{cpu:30, latency:40},
        identity:{cpu:30, latency:40},
        notifications:{cpu:30, latency:40}

    }

},

    INCIDENT:{

    users:{
        min:150,
        max:300
    },

    cpuOffset:30,
    latencyOffset:60,
    errorOffset:0.30,

    services:{

        gateway:{cpu:75, latency:180},
        api:{cpu:60, latency:140},
        database:{cpu:95, latency:280},
        redis:{cpu:35, latency:25},
        identity:{cpu:40, latency:80},
        notifications:{cpu:30, latency:60}

    }

}  // ← Cierra INCIDENT

}; // ← Cierra el objeto scenarios

// ======================================================
// THRESHOLDS
// ======================================================

const thresholds = {

    services: {

        warning: {
            cpu: 60,
            latency: 120
        },

        critical: {
            cpu: 85,
            latency: 220
        }

    },

    // ==================================================
    // SYSTEM ALERT THRESHOLDS
    // ==================================================

    system: {

        cpu: 70,
        latency: 170,
        errorRate: 0.30

    },

    // ==================================================
    // RECOVERY THRESHOLDS
    // ==================================================

    recovery: {

        cpu: 60,
        latency: 150,
        errorRate: 0.10

    }

};

// ======================================================
// MOTOR DE SIMULACIÓN
// ======================================================

function simulateSystem(){
    const scenario = scenarios[currentSimulationMode];

    // ==============================================
    // TRANSICIÓN GRADUAL ENTRE ESCENARIOS
    // ==============================================
    
    const cpuTransitionSpeed = 0.07;
    const latencyTransitionSpeed = 0.15;
    const errorTransitionSpeed = 0.13;
    
    simulation.cpuOffset +=
        (scenario.cpuOffset - simulation.cpuOffset) *
        cpuTransitionSpeed;
    
    simulation.latencyOffset +=
        (scenario.latencyOffset - simulation.latencyOffset) *
        latencyTransitionSpeed;
    
    simulation.errorOffset +=
        (scenario.errorOffset - simulation.errorOffset) *
        errorTransitionSpeed;

    // 1. Evolución progresiva de usuarios hacia el objetivo del escenario
const difference = simulation.targetUsers - system.users;

// El sistema avanza aproximadamente un 5 % hacia el objetivo
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
    simulation.cpuOffset;
    
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
    simulation.latencyOffset;

    // 6. Error Rate (Comienza a crecer solo con alta saturación)
system.errorRate =
    0.02 +                                  // Error base del sistema
    Math.max(0, (system.cpu - 80)) * 0.008 + // Solo aumenta a partir del 80 % de CPU
    (Math.random() * 0.01) +                 // Pequeña variación natural
    simulation.errorOffset;

// Evitamos valores negativos
system.errorRate = Math.max(0, system.errorRate);


}
// Nueva función 
function updateServiceHealth(service){

    let delta = 0;

    // Penalización por CPU
    if(service.cpu >= thresholds.services.critical.cpu){

        delta -= 6;

    }else if(service.cpu >= thresholds.services.warning.cpu){

        delta -= 2;

    }

    // Penalización por latencia
    if(service.latency >= thresholds.services.critical.latency){

        delta -= 6;

    }else if(service.latency >= thresholds.services.warning.latency){

        delta -= 2;

    }

    // Penalización por dependencias
    service.dependsOn.forEach(dep => {

        const parent = services[dep];

        delta -= (100 - parent.healthScore) * 0.05;

    });

    // Recuperación natural
    if(delta === 0){

        delta = 3;

    }

    service.healthScore += delta;

    service.healthScore =
        Math.max(0, Math.min(100, service.healthScore));

}

// ======================================================
// SERVICE STATUS ENGINE
// ======================================================

function updateServiceStatus(service){

    // Guardamos el estado anterior
    const previousStatus = service.status;

    // ==================================================
    // CALCULAR NUEVO ESTADO
    // ==================================================

    if(service.healthScore <= 10){

        service.status = "DOWN";

    }else if(service.healthScore <= 30){

        service.status = "CRITICAL";

    }else if(service.healthScore <= 70){

        service.status = "WARNING";

    }else{

        service.status = "HEALTHY";

    }

    // ==================================================
    // REGISTRAR CAMBIO DE ESTADO
    // ==================================================

    if(previousStatus !== service.status){

        const statusIcons = {

            HEALTHY:"🟢",
            WARNING:"🟡",
            CRITICAL:"🔴",
            DOWN:"⚫"

        };

        // ==================================================
        // TIMELINE
        // ==================================================

        addTimelineEvent(

            statusIcons[service.status],

            `${service.name}: ${previousStatus} → ${service.status}`,

            "service"

        );

        // ==================================================
        // LOGS
        // ==================================================

        let logLevel = "INFO";

        if(
            service.status === "CRITICAL" ||
            service.status === "DOWN"
        ){

            logLevel = "CRITICAL";

        }else if(service.status === "WARNING"){

            logLevel = "WARNING";

        }

        addLog(

            logLevel,

            "SERVICE",

            `${service.name} su estado ha cambiado: ${previousStatus} → ${service.status}`

        );

    }

}

// ======================================================
// SERVICES ENGINE
// ======================================================
function simulateServices(){

    simulateBaseServices();

    propagateDependencies();

    Object.values(services).forEach(service => {

        updateServiceHealth(service);
        updateServiceStatus(service);

    });

    system.services =
    Object.values(services)
        .filter(service =>
            service.status !== "CRITICAL" &&
            service.status !== "DOWN"
        )
        .length;

}
// ======================================================
// BASE SERVICES SIMULATION ENGINE
// ======================================================

function simulateBaseServices(){

    const serviceScenario =
        scenarios[currentSimulationMode].services;

    Object.entries(services).forEach(([key, service]) => {

        const config = serviceScenario[key];

        if(!config){
            return;
        }

        const cpuBase = config.cpu;
        const latencyBase = config.latency;

        // Aproximación progresiva al objetivo
        service.cpu += (cpuBase - service.cpu) * 0.15;
        service.latency += (latencyBase - service.latency) * 0.15;

        // Variación natural
service.cpu += Math.random() * 4 - 2;
service.latency += Math.random() * 8 - 4;

// --------------------------------------------------
// Memoria (depende principalmente de la CPU)
// --------------------------------------------------
const targetMemory =
    18 +
    (service.cpu * 0.60);

service.memory +=
    (targetMemory - service.memory) * 0.12;

service.memory +=
    Math.random() * 2 - 1;

service.memory =
    Math.max(10, Math.min(95, service.memory));

// --------------------------------------------------
// Peticiones procesadas por el servicio
// --------------------------------------------------
service.requests =
    Math.round(
        system.users *
        (service.cpu / 100) *
        1.8
    );

});

}
// ======================================================
// DEPENDENCY PROPAGATION ENGINE
// ======================================================
function propagateDependencies(){

    for(let iteration = 0; iteration < 2; iteration++){
        
    Object.values(services).forEach(service => {

    service.dependsOn.forEach(dependency => {

        const parent = services[dependency];

        if(parent.status !== "HEALTHY"){

            const cpuImpact =
                (parent.cpu - 60) * 0.08;

            const latencyImpact =
                (parent.latency - 100) * 0.06;

            service.cpu += Math.max(0, cpuImpact);
            service.latency += Math.max(0, latencyImpact);

        }

    });

});

}

}

// ======================================================
// RENDERIZADO DE KPIs
// ======================================================
function renderKPIs(){

    // ==================================================
    // SERVICIOS ACTIVOS
    // ==================================================

    const activeServices =
        Object.values(services)
            .filter(service =>
                service.status !== "DOWN"
            )
            .length;

    // Valores reales procedentes del motor
    const values = [

        system.latency,
        system.throughput,
        system.errorRate,
        system.cpu,
        system.memory,
        activeServices

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

                if(system.latency < thresholds.recovery.latency){

                    trend.innerHTML =
                    "<span class='text-green-400'><i class='fa-solid fa-check'></i> Excelente</span>";

                }else if(system.latency < thresholds.system.latency){

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

                if(system.errorRate < thresholds.recovery.errorRate){

                    trend.innerHTML =
                    "<span class='text-green-400'>Sin incidencias</span>";

                }else if(system.errorRate < thresholds.system.errorRate){

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

        const totalServices =
        Object.keys(services).length;
        
        const healthyServices =
            Object.values(services)
                .filter(service =>
                    service.status === "HEALTHY"
                )
                .length;
        
        const warningServices =
            Object.values(services)
                .filter(service =>
                    service.status === "WARNING"
                )
                .length;
        
        const unavailableServices =
            Object.values(services)
                .filter(service =>
                    service.status === "CRITICAL" ||
                    service.status === "DOWN"
                )
                .length;
        
        const activeServices =
            totalServices - unavailableServices;
            
                if(unavailableServices > 0){
            
                    trend.innerHTML =
                    `<span class='text-red-400'>
                        🔴 ${activeServices} / ${totalServices} activos ·
                        ${unavailableServices} caído${unavailableServices > 1 ? "s" : ""}
                    </span>`;
            
                }else if(warningServices > 0){
            
                    trend.innerHTML =
                    `<span class='text-yellow-400'>
                        🟡 ${activeServices} / ${totalServices} activos ·
                        ${warningServices} degradado${warningServices > 1 ? "s" : ""}
                    </span>`;
            
                }else{
            
                    trend.innerHTML =
                    `<span class='text-green-400'>
                        🟢 ${healthyServices} / ${totalServices} Servicios saludables
                    </span>`;
            
                }
            
            break;

        }

    });

}


// ======================================================
// DASHBOARD OVERVIEW
// ======================================================

function renderDashboardOverview(){

    // ==================================================
    // SYSTEM STATUS
    // ==================================================

    const status =
        document.getElementById("dashboardSystemStatus");

    const message =
        document.getElementById("dashboardSystemMessage");

    if(status){

        status.textContent =
            system.status;

        status.className =
            "text-xs font-semibold " +
            (
                system.status === "HEALTHY"
                    ? "text-green-400"
                    : system.status === "DEGRADED"
                        ? "text-yellow-400"
                        : "text-red-400"
            );

    }

    if(message){

        if(system.status === "HEALTHY"){

            message.textContent =
                "El sistema funciona con normalidad.";

        }else if(system.status === "DEGRADED"){

            message.textContent =
                "El sistema funciona en condiciones degradadas.";

        }else{

            message.textContent =
                "Se han detectado condiciones críticas en el sistema.";

        }

    }



    // ==================================================
    // GLOBAL METRICS
    // ==================================================

    const users =
        document.getElementById("overviewUsers");

    const throughput =
        document.getElementById("overviewThroughput");

    const cpu =
        document.getElementById("overviewCPU");

    const memory =
        document.getElementById("overviewMemory");

    const latency =
        document.getElementById("overviewLatency");

    const errorRate =
        document.getElementById("overviewErrorRate");


    if(users){

        users.textContent =
            Math.round(system.users);

    }

    if(throughput){

        throughput.textContent =
            Math.round(system.throughput) + " req/min";

    }

    if(cpu){

        cpu.textContent =
            Math.round(system.cpu) + " %";

    }

    if(memory){

        memory.textContent =
            Math.round(system.memory) + " %";

    }

    if(latency){

        latency.textContent =
            Math.round(system.latency) + " ms";

    }

    if(errorRate){

        errorRate.textContent =
            (system.errorRate * 100).toFixed(2) + " %";

    }


    // ==================================================
    // SERVICES HEALTH
    // ==================================================

    const totalServices =
        Object.keys(services).length;

    const healthyServices =
        Object.values(services)
            .filter(service =>
                service.status === "HEALTHY"
            )
            .length;

    const servicesLabel =
        document.getElementById("overviewServices");

    const servicesBar =
        document.getElementById("overviewServicesBar");


    const healthPercentage =
        totalServices > 0
            ? (healthyServices / totalServices) * 100
            : 0;


    if(servicesLabel){

        servicesLabel.textContent =
            `${healthyServices} / ${totalServices} OPERATIVOS`;

    }

    if(servicesBar){

        servicesBar.style.width =
            `${healthPercentage}%`;
    
        servicesBar.style.backgroundColor =
            healthPercentage === 100
                ? "#22c55e"
                : healthPercentage >= 70
                    ? "#eab308"
                    : "#ef4444";
    
    }

    // ==================================================
    // ACTIVE ALERTS
    // ==================================================

    const activeAlerts =
        alerts.filter(alert =>
            alert.status === "ACTIVE"
        );

    const criticalAlerts =
        activeAlerts.filter(alert =>
            alert.level === "CRITICAL"
        ).length;

    const warningAlerts =
        activeAlerts.filter(alert =>
            alert.level === "WARNING"
        ).length;

    const resolvedAlerts =
        alerts.filter(alert =>
            alert.status === "RESOLVED"
        ).length;


    const criticalElement =
        document.getElementById(
            "summaryCriticalAlerts"
        );

    const warningElement =
        document.getElementById(
            "summaryWarningAlerts"
        );

    const resolvedElement =
        document.getElementById(
            "summaryResolvedAlerts"
        );


    if(criticalElement){

        criticalElement.textContent =
            criticalAlerts;

    }

    if(warningElement){

        warningElement.textContent =
            warningAlerts;

    }

    if(resolvedElement){

        resolvedElement.textContent =
            resolvedAlerts;

    }


    // ==================================================
    // CURRENT CONDITIONS
    // ==================================================

    const conditionCPU =
        document.getElementById("conditionCPU");

    const conditionLatency =
        document.getElementById("conditionLatency");

    const conditionErrors =
        document.getElementById("conditionErrors");

    const conditionServices =
        document.getElementById("conditionServices");


    if(conditionCPU){

        conditionCPU.textContent =
            systemState.cpuHigh
                ? "ALTO"
                : "NORMAL";

        conditionCPU.className =
            systemState.cpuHigh
                ? "text-yellow-400"
                : "text-green-400";

    }


    if(conditionLatency){

        conditionLatency.textContent =
            systemState.latencyHigh
                ? "ALTO"
                : "NORMAL";

        conditionLatency.className =
            systemState.latencyHigh
                ? "text-red-400"
                : "text-green-400";

    }


    if(conditionErrors){

        conditionErrors.textContent =
            systemState.errorHigh
                ? "ALTO"
                : "NORMAL";

        conditionErrors.className =
            systemState.errorHigh
                ? "text-red-400"
                : "text-green-400";

    }


    if(conditionServices){

        conditionServices.textContent =
            `${healthyServices} / ${totalServices} OPERATIVOS`;

        conditionServices.className =
            healthyServices === totalServices
                ? "text-green-400"
                : healthyServices > 0
                    ? "text-yellow-400"
                    : "text-red-400";

    }


    // ==================================================
    // RECENT ACTIVITY
    // ==================================================

    const recentEvents =
        document.getElementById(
            "dashboardRecentEvents"
        );

    if(recentEvents){

        if(timeline.length === 0){

            recentEvents.innerHTML =
                `<div class="text-gray-500">
                    No hay eventos recientes.
                </div>`;

        }else{

            const events =
                timeline.slice(-4).reverse();

            recentEvents.innerHTML =
                events.map(event => `

                    <div
                        class="flex items-start gap-2">

                        <span>
                            ${event.icon}
                        </span>

                        <div class="min-w-0">

                            <div class="text-gray-300 truncate">
                                ${event.message}
                            </div>

                            <div class="text-gray-600 mt-1">
                                ${event.time}
                            </div>

                        </div>

                    </div>

                `).join("");

        }

    }

}

let assessmentPreviousStatus = null;
let assessmentRecoveryUntil = 0;



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
// ======================================================
// LOGS ENGINE
// ======================================================

function addLog(level, source, message){

    const now = new Date();

    const time =
        now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    logs.unshift({

        time,
        level,
        source,
        message

    });

    // Conservamos un número razonable de logs
    if(logs.length > 100){

        logs.pop();

    }

}


// ======================================================
// RENDER LOGS
// ======================================================

function renderLogs(){

    const container =
        document.getElementById("logsContainer");

    if(!container) return;


    // ==================================================
    // CONTROLES
    // ==================================================

    const search =
        document.getElementById("logsSearch") ||
        document.getElementById("logSearch");

    const source =
        document.getElementById("logSourceFilter");


    const searchValue =
        search
            ? search.value.trim().toLowerCase()
            : "";


    const selectedSource =
        source
            ? source.value
            : "ALL";


    // ==================================================
    // FILTRADO
    // ==================================================

    const filteredLogs = logs.filter(log => {


        // ----------------------------------------------
        // NIVEL
        // ----------------------------------------------

        if(
            activeLogLevel !== "ALL" &&
            log.level !== activeLogLevel
        ){

            return false;

        }


        // ----------------------------------------------
        // ORIGEN
        // ----------------------------------------------

        if(
            selectedSource !== "ALL" &&
            log.source !== selectedSource
        ){

            return false;

        }


        // ----------------------------------------------
        // BUSCADOR
        // ----------------------------------------------

        if(searchValue){

            const text =

                `${log.time} ${log.level} ${log.source} ${log.message}`
                .toLowerCase();


            if(!text.includes(searchValue)){

                return false;

            }

        }


        return true;

    });


    // ==================================================
    // LIMPIAR CONTENEDOR
    // ==================================================

    container.innerHTML = "";


    // ==================================================
    // SIN RESULTADOS
    // ==================================================

    if(filteredLogs.length === 0){

        container.innerHTML = `

            <div class="p-8 text-center text-gray-500">

                No hay eventos que coincidan con los filtros actuales.

            </div>

        `;

        return;

    }


    // ==================================================
    // RENDERIZADO
    // ==================================================

    filteredLogs.forEach(log => {


        let levelColor =
            "text-gray-300";


        let levelIcon =
            "ℹ️";


        if(log.level === "INFO"){

            levelColor =
                "text-blue-400";

            levelIcon =
                "ℹ️";

        }

        else if(log.level === "WARNING"){

            levelColor =
                "text-yellow-400";

            levelIcon =
                "⚠️";

        }

        else if(log.level === "ERROR"){

            levelColor =
                "text-red-400";

            levelIcon =
                "❌";

        }

        else if(log.level === "CRITICAL"){

            levelColor =
                "text-red-500";

            levelIcon =
                "🔴";

        }


        container.innerHTML += `

            <div
                class="grid grid-cols-[110px_110px_150px_1fr]
                       gap-4 px-6 py-4
                       items-center
                       hover:bg-[#252b3d]
                       transition">


                <div
                    class="text-xs text-gray-500 font-mono">

                    ${log.time}

                </div>


                <div
                    class="text-xs font-bold ${levelColor}">

                    ${levelIcon}
                    ${log.level}

                </div>


                <div
                    class="text-xs text-purple-400">

                    ${log.source}

                </div>


                <div
                    class="text-sm text-gray-300">

                    ${log.message}

                </div>


            </div>

        `;

    });


    // ==================================================
    // CONTADOR
    // ==================================================

    const resultCount =
        document.getElementById("logsResultCount");


    if(resultCount){

        resultCount.textContent =
            `${filteredLogs.length} eventos`;

    }

}

    // ==================================================
    // LIMPIAR CONTENEDOR
    // ==================================================

    container.innerHTML = "";

    // ==================================================
    // SIN RESULTADOS
    // ==================================================

    if(filteredLogs.length === 0){

        container.innerHTML = `

            <div class="p-8 text-center text-gray-500">

                No hay eventos que coincidan con el filtro.

            </div>

        `;

        return;

    }

    // ==================================================
    // RENDERIZAR
    // ==================================================

    filteredLogs.forEach(log => {

        let levelColor = "text-gray-300";

        if(log.level === "INFO"){

            levelColor = "text-blue-400";

        }

        else if(log.level === "WARNING"){

            levelColor = "text-yellow-400";

        }

        else if(log.level === "ERROR"){

            levelColor = "text-red-400";

        }

        else if(log.level === "CRITICAL"){

            levelColor = "text-red-500";

        }

        container.innerHTML += `

            <div class="border-b border-slate-700 py-3">

                <div class="flex items-center gap-3">

                    <span class="text-xs text-gray-500 font-mono">

                        ${log.time}

                    </span>

                    <span class="text-xs font-bold ${levelColor}">

                        ${log.level}

                    </span>

                    <span class="text-xs text-purple-400">

                        ${log.source}

                    </span>

                </div>

                <div class="text-sm text-gray-300 mt-1">

                    ${log.message}

                </div>

            </div>

        `;

    });

}

// ======================================================
// LOG FILTERS
// ======================================================

function initializeLogFilters(){

    const buttons =
        document.querySelectorAll(".log-filter");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            activeLogLevel =
                button.dataset.level;

            buttons.forEach(btn => {

                btn.classList.remove("active-log-filter");

            });

            button.classList.add("active-log-filter");

            renderLogs();

        });

    });

    const searchInput =
        document.getElementById("logsSearch") ||
        document.getElementById("logSearch");

    if(searchInput){

        searchInput.addEventListener("input", event => {

            logSearchTerm =
                event.target.value
                    .trim()
                    .toLowerCase();

            renderLogs();

        });

    }

}


// ======================================================
// LOGS RENDER ENGINE
// ======================================================

function renderLogs(){

    const container =
        document.getElementById("logsContainer");

    if(!container) return;

    const searchInput =
        document.getElementById("logsSearch");

    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const activeFilter =
        document.querySelector(".active-log-filter");

    const selectedLevel =
        activeFilter
            ? activeFilter.dataset.level
            : "ALL";

    container.innerHTML = "";

    const filteredLogs =
        logs.filter(log => {

            const matchesLevel =
                selectedLevel === "ALL" ||
                log.level === selectedLevel;

            const searchableText =
                `${log.source} ${log.message}`
                    .toLowerCase();

            const matchesSearch =
                search === "" ||
                searchableText.includes(search);

            return matchesLevel && matchesSearch;

        });

    if(filteredLogs.length === 0){

        container.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                No hay registros disponibles
            </div>
        `;

        return;

    }

    filteredLogs.forEach(log => {

        let levelClass =
            "text-blue-400";

        if(log.level === "WARNING"){
            levelClass = "text-yellow-400";
        }

        if(log.level === "ERROR"){
            levelClass = "text-red-400";
        }

        if(log.level === "CRITICAL"){
            levelClass = "text-red-500 font-bold";
        }

        container.innerHTML += `

            <div
                class="grid grid-cols-[110px_110px_150px_1fr]
                gap-4 px-6 py-3
                hover:bg-[#202536]
                transition">

                <div class="text-xs text-gray-500 font-mono">
                    ${log.time}
                </div>

                <div class="text-xs font-semibold ${levelClass}">
                    ${log.level}
                </div>

                <div class="text-xs text-gray-400 font-mono">
                    ${log.source}
                </div>

                <div class="text-sm text-gray-300">
                    ${log.message}
                </div>

            </div>

        `;

    });

}

*/
function addTimelineEvent(icon, message, type = "system"){

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
        message,
        type

    });

    if(timeline.length > 12){

        timeline.pop();

    }

}
// ======================================================
// ALERTS ENGINE
// ======================================================

const alerts = [];


// ======================================================
// CREATE ALERT
// ======================================================

function createAlert(level, source, message){

    const now = new Date();

    const time =
        now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    const alert = {
        id: Date.now(),
        level,
        source,
        message,
        time,
        status: "ACTIVE",
        resolvedTime: null
    };

    alerts.unshift(alert);

}


// ======================================================
// RESOLVE ALERT
// ======================================================

function resolveAlert(source){

    const activeAlert =
        alerts.find(alert =>
            alert.source === source &&
            alert.status === "ACTIVE"
        );

    if(!activeAlert) return;

    activeAlert.status = "RESOLVED";

    const now = new Date();

    activeAlert.resolvedTime =
        now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

}


// ======================================================
// EVALUATE ALERTS
// ======================================================

function evaluateAlerts(){

    if(systemState.cpuHigh){

        const exists =
            alerts.some(alert =>
                alert.source === "CPU" &&
                alert.status === "ACTIVE"
            );

        if(!exists){

            createAlert(
                "WARNING",
                "CPU",
                "Uso elevado de CPU detectado"
            );

        }

    } else {

        resolveAlert("CPU");

    }


    if(systemState.latencyHigh){

        const exists =
            alerts.some(alert =>
                alert.source === "LATENCY" &&
                alert.status === "ACTIVE"
            );

        if(!exists){

            createAlert(
                "CRITICAL",
                "LATENCY",
                "Latencia elevada detectada"
            );

        }

    } else {

        resolveAlert("LATENCY");

    }


    if(systemState.errorHigh){

        const exists =
            alerts.some(alert =>
                alert.source === "ERRORS" &&
                alert.status === "ACTIVE"
            );

        if(!exists){

            createAlert(
                "CRITICAL",
                "ERRORS",
                "Tasa de errores elevada detectada"
            );

        }

    } else {

        resolveAlert("ERRORS");

    }

}


// ======================================================
// RENDER ALERTS
// ======================================================

function renderAlerts(){

    const activeContainer =
        document.getElementById(
            "activeAlertsContainer"
        );

    const historyContainer =
        document.getElementById(
            "alertsHistoryContainer"
        );

    if(!activeContainer || !historyContainer){
        return;
    }


    const activeAlerts =
        alerts.filter(alert =>
            alert.status === "ACTIVE"
        );

    const resolvedAlerts =
        alerts.filter(alert =>
            alert.status === "RESOLVED"
        );


    // ==============================================
    // ACTIVE ALERTS
    // ==============================================

    if(activeAlerts.length === 0){

        activeContainer.innerHTML = `

            <div class="p-10 text-center">

                <div class="text-3xl mb-3">
                    ✅
                </div>

                <div class="text-gray-400">
                    No se han detectado alertas activas.
                </div>

            </div>

        `;

    } else {

        activeContainer.innerHTML =
            activeAlerts.map(alert => `

                <div class="px-6 py-4">

                    <div
                        class="flex justify-between
                               items-start gap-4">

                        <div>

                            <div class="font-semibold">

                                ${alert.level}

                                <span
                                    class="text-xs
                                           text-gray-500
                                           ml-2">

                                    ${alert.source}

                                </span>

                            </div>

                            <div
                                class="text-sm
                                       text-gray-400
                                       mt-1">

                                ${alert.message}

                            </div>

                        </div>

                        <div
                            class="text-xs
                                   text-gray-500
                                   font-mono">

                            ${alert.time}

                        </div>

                    </div>

                </div>

            `).join("");

    }


    // ==============================================
    // ALERT HISTORY
    // ==============================================

    if(resolvedAlerts.length === 0){

        historyContainer.innerHTML = `

            <div class="p-10 text-center
                        text-gray-500">

                Todavía no hay alertas resueltas.

            </div>

        `;

    } else {

        historyContainer.innerHTML =
            resolvedAlerts.map(alert => `

                <div class="px-6 py-4">

                    <div
                        class="flex justify-between
                               items-start gap-4">

                        <div>

                            <div class="font-semibold
                                        text-gray-400">

                                ✓ RESOLVED

                                <span
                                    class="text-xs
                                           text-gray-500
                                           ml-2">

                                    ${alert.source}

                                </span>

                            </div>

                            <div
                                class="text-sm
                                       text-gray-500
                                       mt-1">

                                ${alert.message}

                            </div>

                        </div>

                        <div
                            class="text-xs
                                   text-gray-500
                                   font-mono">

                            ${alert.resolvedTime}

                        </div>

                    </div>

                </div>

            `).join("");

    }


    // ==============================================
    // ACTIVE COUNT
    // ==============================================

    const activeCount =
        document.getElementById(
            "activeAlertsCount"
        );

    if(activeCount){

        activeCount.textContent =
            `${activeAlerts.length}  ${
                activeAlerts.length === 1
                    ? "alerta activa"
                    : "alertas activas"
            }`;

    }

}
// ======================================================
// Operational Assessment
// ======================================================
function renderOperationalAssessment(){

    const statusElement =
        document.getElementById("assessmentStatus");

    const situationElement =
        document.getElementById("assessmentSituation");

    const detailsElement =
        document.getElementById("assessmentDetails");

    const impactElement =
        document.getElementById("assessmentImpact");

    const conclusionElement =
        document.getElementById("assessmentConclusion");

    const servicesElement =
        document.getElementById("assessmentServices");

    const alertsElement =
        document.getElementById("assessmentAlerts");

    const scenarioElement =
        document.getElementById("assessmentScenario");

    const updatedElement =
        document.getElementById("assessmentUpdated");


    if(
        !statusElement ||
        !situationElement ||
        !detailsElement ||
        !impactElement ||
        !conclusionElement ||
        !servicesElement ||
        !alertsElement ||
        !scenarioElement ||
        !updatedElement
    ){
        return;
    }


    // ==================================================
    // SERVICES
    // ==================================================

    const serviceList =
        Object.values(services);

    const totalServices =
        serviceList.length;

    const healthyServices =
        serviceList.filter(
            service => service.status === "HEALTHY"
        ).length;

    const warningServices =
        serviceList.filter(
            service => service.status === "WARNING"
        ).length;

    const criticalServices =
        serviceList.filter(
            service =>
                service.status === "CRITICAL" ||
                service.status === "DOWN"
        ).length;


    // ==================================================
    // ACTIVE ALERTS
    // ==================================================

    const activeAlerts =
        alerts.filter(
            alert => alert.status === "ACTIVE"
        ).length;


    // ==================================================
    // REAL SYSTEM STATUS
    // ==================================================

    const currentStatus =
        system.status;


    // ==================================================
    // SCENARIO
    // ==================================================

    const scenario =
        typeof currentSimulationMode !== "undefined"
            ? currentSimulationMode
            : "NORMAL";


    // ==================================================
    // RECOVERY DETECTION
    // ==================================================

    const recoveryStarted =
        (
            assessmentPreviousStatus === "CRITICAL" &&
            (
                currentStatus === "DEGRADED" ||
                currentStatus === "HEALTHY"
            )
        ) ||
        (
            assessmentPreviousStatus === "DEGRADED" &&
            currentStatus === "HEALTHY"
        );


    if(recoveryStarted){

        // Mantener el estado visual RECOVERING
        // durante unos segundos.

        assessmentRecoveryUntil =
            Date.now() + 6000;

    }


    const isRecovering =
        Date.now() < assessmentRecoveryUntil;


    // ==================================================
    // ESTADO VISUAL DEL ASSESSMENT
    // ==================================================

    let displayStatus =
        isRecovering
            ? "RECOVERING"
            : currentStatus;


    // ==================================================
    // CONTENIDO
    // ==================================================

    let statusIcon = "";
    let situation = "";
    let details = "";
    let impact = "";
    let conclusion = "";


    // ==================================================
    // HEALTHY
    // ==================================================

    if(displayStatus === "HEALTHY"){

        statusIcon = "🟢";

        situation =
            "El sistema funciona dentro de condiciones normales.";

        details =
            "Todos los indicadores monitorizados están dentro de los umbrales configurados.";

        impact =
            "No se ha detectado una degradación significativa de los servicios.";

        conclusion =
            "🟢 No se requiere intervención.";

    }


    // ==================================================
    // DEGRADED
    // ==================================================

    else if(displayStatus === "DEGRADED"){

        statusIcon = "🟡";

        situation =
            "El sistema funciona en condiciones degradadas.";

        const conditions = [];

        if(system.cpu > 70){

            conditions.push(
                "El uso de CPU está por encima de su umbral configurado."
            );

        }

        if(system.latency > 170){

            conditions.push(
                "La latencia está por encima de su umbral configurado."
            );

        }

        if(warningServices > 0){

            conditions.push(
                `${warningServices} ${
                    warningServices === 1
                        ? "servicio está"
                        : "servicios están"
                } reportando advertencias`
            );

        }


        if(conditions.length === 0){

            details =
                "Algunas condiciones monitorizadas requieren seguimiento continuo.";

        }
        else if(conditions.length === 1){

            details =
                `${conditions[0]}.`;

        }
        else if(
            conditions.includes(
                "El uso de CPU está por encima de sus umbrales configurados."
            ) &&
            conditions.includes(
                "y la latencia está por encima de sus umbrales configurados."
            )
        ){

            const remaining =
                conditions.filter(condition =>
                    condition !==
                        "El uso de CPU está por encima de sus umbrales configurados." &&
                    condition !==
                        "y la latencia está por encima de sus umbrales configurados."
                );

            details =
                "El uso de CPU y la latencia están por encima de sus umbrales configurados.";

            if(remaining.length > 0){

                details +=
                    ` ${remaining.join(". ")}.`;

            }

        }
        else{

            details =
                `${conditions.slice(0, -1).join(", ")} and ${conditions.at(-1)}.`;

        }


        impact =
            "Existe una degradación del rendimiento, pero los servicios principales de la plataforma permanecen operativos.";

        conclusion =
            "🟡 Se recomienda continuar con la monitorización.";

    }


    // ==================================================
    // CRITICAL
    // ==================================================

    else if(displayStatus === "CRITICAL"){

        statusIcon = "🔴";

        situation =
            "El sistema funciona en condiciones críticas.";

        const conditions = [];

        if(criticalServices > 0){

            conditions.push(
                `${criticalServices} ${
                    criticalServices === 1
                        ? "servicio está"
                        : "servicios están"
                } en estado crítico o no disponible/s`
            );

        }

        if(system.errorRate > 0.30){

            conditions.push(
                "la tasa de errores está por encima de su umbral crítico configurado."
            );

        }


        if(conditions.length === 0){

            details =
                "Se han detectado condiciones críticas en la plataforma.";

        }
        else if(conditions.length === 1){

            details =
                `${conditions[0]}.`;

        }
        else{

            details =
                `${conditions[0]}. ${conditions[1]}.`;

        }


        impact =
            "La disponibilidad de los servicios o la fiabilidad de la plataforma están actualmente afectadas.";

        conclusion =
            "🔴 Se recomienda una investigación inmediata.";

    }


    // ==================================================
    // RECOVERING
    // ==================================================

    else if(displayStatus === "RECOVERING"){

        statusIcon = "🔵";

        situation =
            "El sistema se está recuperando de una condición degradada anterior.";

        const recoveryDetails = [];

        if(healthyServices > 0){

            recoveryDetails.push(
                `${healthyServices} ${
                    healthyServices === 1
                        ? "servicio ha"
                        : "servicios han"
                } vuelto a un estado saludable`
            );

        }

        if(warningServices > 0){

            recoveryDetails.push(
                `${warningServices} ${
                    warningServices === 1
                        ? "servicio permanece"
                        : "servicios permanecen"
                } en estado de advertencia`
            );

        }

        if(criticalServices > 0){

            recoveryDetails.push(
                `${criticalServices} ${
                    criticalServices === 1
                        ? "servicio permanece"
                        : "servicios permanecen"
                } en estado crítico`
            );

        }


        details =
            recoveryDetails.length > 0
                ? `${recoveryDetails.join(". ")}.`
                : "Las condiciones monitorizadas están volviendo a la normalidad.";


        impact =
            currentStatus === "HEALTHY"
                ? "La degradación anterior se ha resuelto y las operaciones de la plataforma se están estabilizando."
                : "Las condiciones de la plataforma están mejorando, pero persiste cierta degradación.";


        conclusion =
            "🔵 Recuperación en curso — continuar con la monitorización.";

    }


    // ==================================================
    // RENDER
    // ==================================================

    statusElement.textContent =
        `${statusIcon} ${displayStatus}`;


    situationElement.textContent =
        situation;


    detailsElement.textContent =
        details;


    impactElement.textContent =
        impact;


    conclusionElement.textContent =
        conclusion;


    // ==================================================
    // OPERATIONAL SNAPSHOT
    // ==================================================

    let serviceSummary =
        `${healthyServices} / ${totalServices} OPERATIVOS`;


    if(warningServices > 0){

        serviceSummary +=
            ` · ${warningServices} WARNING`;

    }


    if(criticalServices > 0){

        serviceSummary +=
            ` · ${criticalServices} CRITICAL`;

    }


    servicesElement.textContent =
        serviceSummary;


    alertsElement.textContent =
        activeAlerts;


    scenarioElement.textContent =
        scenario;


    updatedElement.textContent =
        new Date().toLocaleTimeString(
            "es-ES",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    // ==================================================
    // GUARDAMOS EL ESTADO REAL
    // ==================================================

    assessmentPreviousStatus =
        currentStatus;

}

// ======================================================
// ALERTS SUMMARY
// ======================================================

function renderAlertsSummary(){

    const container =
        document.getElementById("alertsSummary");

    if(!container) return;


    // ==================================================
    // CALCULATE VALUES
    // ==================================================

    const criticalAlerts =
        alerts.filter(alert =>
            alert.status === "ACTIVE" &&
            alert.level === "CRITICAL"
        ).length;


    const warningAlerts =
        alerts.filter(alert =>
            alert.status === "ACTIVE" &&
            alert.level === "WARNING"
        ).length;


    const activeAlerts =
        alerts.filter(alert =>
            alert.status === "ACTIVE"
        ).length;


    const resolvedAlerts =
        alerts.filter(alert =>
            alert.status === "RESOLVED"
        ).length;


    // ==================================================
    // CARDS
    // ==================================================

    const cards = [

        {
            title: "Críticas",
            value: criticalAlerts,
            icon: "fa-circle-exclamation",
            color: "#ef4444"
        },

        {
            title: "Advertencias",
            value: warningAlerts,
            icon: "fa-triangle-exclamation",
            color: "#f59e0b"
        },

        {
            title: "Alertas activas",
            value: activeAlerts,
            icon: "fa-bell",
            color: "#3b82f6"
        },

        {
            title: "Resueltas",
            value: resolvedAlerts,
            icon: "fa-circle-check",
            color: "#22c55e"
        }

    ];


    // ==================================================
    // RENDER
    // ==================================================

    container.innerHTML =
        cards.map(card => `

            <div class="card p-5">

                <div
                    class="flex justify-between
                           items-center">

                    <div>

                        <div
                            class="text-xs uppercase
                                   tracking-widest
                                   text-gray-400">

                            ${card.title}

                        </div>

                        <div
                            class="text-3xl font-bold mt-2">

                            ${card.value}

                        </div>

                    </div>


                    <div
                        class="w-11 h-11 rounded-lg
                               flex items-center
                               justify-center text-lg"
                        style="
                            background:${card.color}22;
                            color:${card.color};
                        ">

                        <i
                            class="fa-solid ${card.icon}">
                        </i>

                    </div>

                </div>

            </div>

        `).join("");

}

// ======================================================
// DASHBOARD OVERVIEW
// ======================================================

function renderDashboardOverview(){

    // ==================================================
    // SYSTEM STATUS
    // ==================================================

    const statusElement =
        document.getElementById(
            "dashboardSystemStatus"
        );

    const messageElement =
        document.getElementById(
            "dashboardSystemMessage"
        );

    if(statusElement){

        statusElement.textContent =
            system.status;

    }


    // ==================================================
    // SYSTEM MESSAGE
    // ==================================================

    if(messageElement){

        if(system.status === "HEALTHY"){

            messageElement.textContent =
                "El sistema funciona con normalidad.";

        }else if(system.status === "DEGRADED"){

            messageElement.textContent =
                "El sistema está experimentando un rendimiento degradado.";

        }else{

            messageElement.textContent =
                "El sistema está experimentando condiciones críticas.";

        }

    }


    // ==================================================
    // GLOBAL METRICS
    // ==================================================

    const users =
        document.getElementById(
            "overviewUsers"
        );

    const throughput =
        document.getElementById(
            "overviewThroughput"
        );

    const cpu =
        document.getElementById(
            "overviewCPU"
        );

    const memory =
        document.getElementById(
            "overviewMemory"
        );

    const latency =
        document.getElementById(
            "overviewLatency"
        );

    const errorRate =
        document.getElementById(
            "overviewErrorRate"
        );


    if(users){

        users.textContent =
            Math.round(system.users);

    }

    if(throughput){

        throughput.textContent =
            Math.round(system.throughput)
            + " req/min";

    }

    if(cpu){

        cpu.textContent =
            Math.round(system.cpu) + "%";

    }

    if(memory){

        memory.textContent =
            Math.round(system.memory) + "%";

    }

    if(latency){

        latency.textContent =
            Math.round(system.latency) + " ms";

    }

    if(errorRate){

        errorRate.textContent =
            system.errorRate.toFixed(2) + "%";

    }


    // ==================================================
    // SERVICES HEALTH
    // ==================================================

    const totalServices =
        Object.keys(services).length;

    const healthyServices =
        Object.values(services)
            .filter(service =>
                service.status === "HEALTHY"
            )
            .length;


    const servicesElement =
        document.getElementById(
            "overviewServices"
        );

    const servicesBar =
        document.getElementById(
            "overviewServicesBar"
        );


    if(servicesElement){

        servicesElement.textContent =
            `${healthyServices} / ${totalServices} OPERATIVOS`;

    }


    if(servicesBar){

        const percentage =
            totalServices > 0
                ? (healthyServices / totalServices) * 100
                : 0;
    
        servicesBar.style.width =
            `${percentage}%`;
    
        servicesBar.style.backgroundColor =
            percentage === 100
                ? "#22c55e"
                : percentage >= 70
                    ? "#eab308"
                    : "#ef4444";
    
    }


    // ==================================================
    // ACTIVE ALERTS
    // ==================================================

    const activeAlerts =
        alerts.filter(
            alert =>
                alert.status === "ACTIVE"
        );


    const criticalAlerts =
        activeAlerts.filter(
            alert =>
                alert.level === "CRITICAL" ||
                alert.level === "ERROR"
        ).length;


    const warningAlerts =
        activeAlerts.filter(
            alert =>
                alert.level === "WARNING"
        ).length;


    const resolvedAlerts =
        alerts.filter(
            alert =>
                alert.status === "RESOLVED"
        ).length;


    const criticalElement =
        document.getElementById(
            "summaryCriticalAlerts"
        );

    const warningElement =
        document.getElementById(
            "summaryWarningAlerts"
        );

    const resolvedElement =
        document.getElementById(
            "summaryResolvedAlerts"
        );


    if(criticalElement){

        criticalElement.textContent =
            criticalAlerts;

    }

    if(warningElement){

        warningElement.textContent =
            warningAlerts;

    }

    if(resolvedElement){

        resolvedElement.textContent =
            resolvedAlerts;

    }


    // ==================================================
    // CURRENT CONDITIONS
    // ==================================================

    const conditionCPU =
        document.getElementById(
            "conditionCPU"
        );

    const conditionLatency =
        document.getElementById(
            "conditionLatency"
        );

    const conditionErrors =
        document.getElementById(
            "conditionErrors"
        );

    const conditionServices =
        document.getElementById(
            "conditionServices"
        );


    if(conditionCPU){

        conditionCPU.textContent =
            systemState.cpuHigh
                ? "WARNING"
                : "NORMAL";

    }


    if(conditionLatency){

        conditionLatency.textContent =
            systemState.latencyHigh
                ? "CRITICAL"
                : "NORMAL";

    }


    if(conditionErrors){

        conditionErrors.textContent =
            systemState.errorHigh
                ? "CRITICAL"
                : "NORMAL";

    }


    if(conditionServices){

        conditionServices.textContent =
            `${healthyServices} / ${totalServices} OPERATIVOS`;

    }


    // ==================================================
    // RECENT ACTIVITY
    // ==================================================

    const recentEvents =
        document.getElementById(
            "dashboardRecentEvents"
        );


    if(recentEvents){

        const latestEvents =
            timeline.slice(0, 4);


        if(latestEvents.length === 0){

            recentEvents.innerHTML = `
                <div class="text-gray-500">
                    No recent events.
                </div>
            `;

        }else{

            recentEvents.innerHTML =
                latestEvents.map(event => `

                    <div class="flex gap-2">

                        <span class="opacity-60">
                            ${event.time}
                        </span>

                        <span>
                            ${event.icon}
                            ${event.message}
                        </span>

                    </div>

                `).join("");

        }

    }

}

// ======================================================
// RENDER SETTINGS
// ======================================================

function renderSettings(){

    // ==================================================
    // ENGINE STATUS
    // ==================================================
    
    const engineStatus =
        document.getElementById(
            "settingsEngineStatus"
        );
    
    const toggleButton =
        document.getElementById(
            "toggleSimulationButton"
        );
    
    if(engineStatus){
    
        if(simulationPaused){
    
            engineStatus.innerHTML =
                "● Pausado";
    
            engineStatus.className =
                "mt-2 text-yellow-400 font-semibold";
    
        } else {
    
            engineStatus.innerHTML =
                "● En ejecución";
    
            engineStatus.className =
                "mt-2 text-green-400 font-semibold";
    
        }
    
    }
    
    
    if(toggleButton){
    
        if(simulationPaused){
    
            toggleButton.innerHTML = `
    
                <i class="fa-solid fa-play mr-2"></i>
                Reanudar simulación
    
            `;
    
        } else {
    
            toggleButton.innerHTML = `
    
                <i class="fa-solid fa-pause mr-2"></i>
                Pausar simulación
    
            `;
    
        }
    
    }


    // ==================================================
    // CURRENT SCENARIO
    // ==================================================

    const currentScenario =
        document.getElementById(
            "settingsCurrentScenario"
        );

    if(currentScenario){

        currentScenario.textContent =
            currentSimulationMode;

    }


    // ==================================================
    // SIMULATION MODE
    // ==================================================

    const simulationMode =
        document.getElementById(
            "settingsSimulationMode"
        );

    if(simulationMode){

        simulationMode.textContent =
            currentSimulationMode;

    }


    // ==================================================
    // SERVICES COUNT
    // ==================================================

    const servicesCount =
        document.getElementById(
            "settingsServicesCount"
        );

    if(servicesCount){

        const activeServices =
            Object.values(services)
                .filter(service =>
                    service.status !== "DOWN"
                )
                .length;

        servicesCount.textContent =
            activeServices;

    }

}

// ======================================================
// SIMULATION CONTROLS
// ======================================================

function initializeSimulationControls(){

    const toggleButton =
        document.getElementById(
            "toggleSimulationButton"
        );

    const resetButton =
        document.getElementById(
            "resetSimulationButton"
        );


    // ==================================================
    // PAUSE / RESUME
    // ==================================================

    if(toggleButton){

        toggleButton.addEventListener("click", () => {

            simulationPaused =
                !simulationPaused;

            renderSettings();

        });

    }


    // ==================================================
    // RESET
    // ==================================================

    if(resetButton){

        resetButton.addEventListener("click", () => {

            resetSimulation();            

        });

    }

}

function renderTimeline(){

    const container = document.getElementById("timelineContainer");

    if(!container) return;

    container.innerHTML = "";

    const typeLabels = {

        engine: "MOTOR",
        scenario: "ESCENARIO",
        system: "SISTEMA",
        service: "SERVICIO"

    };

    timeline.forEach(event=>{

        const type = event.type || "system";

        const label = typeLabels[type] || "SISTEMA";

        container.innerHTML += `

            <div class="timeline-item">

                <div class="timeline-time">

                    ${event.time}

                </div>

                <div class="timeline-message">

                    <span class="text-xs opacity-60 mr-2">
                        ${label}
                    </span>

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

if(service.healthScore <= 20){

    statusColor = "🔴";

}
else if(service.healthScore <= 40){

    statusColor = "🟠";

}
else if(service.healthScore <= 70){

    statusColor = "🟡";

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

    RAM:
    <strong>${service.memory.toFixed(0)}%</strong>

</div>

<div class="text-sm text-gray-300">

    Latencia:
    <strong>${service.latency.toFixed(0)} ms</strong>

</div>

<div class="text-sm text-gray-300">

    Solicitudes:
    <strong>${service.requests}</strong>

</div>
<div class="mt-3">

    <div class="flex justify-between text-xs text-gray-400 mb-1">
        <span>Nivel Operativo</span>
        <span>${Math.round(service.healthScore)}%</span>
    </div>

    <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">

        <div
            class="h-2 rounded-full"
            style="
                width:${service.healthScore}%;
                background:${
                    service.healthScore > 70
                        ? '#22c55e'
                        : service.healthScore > 30
                            ? '#f59e0b'
                            : '#ef4444'
                };
                transition:width .5s ease;
            ">
        </div>

    </div>

</div>

            </div>

        `;

    });

}

// ======================================================
// RESET SIMULATION
// ======================================================

function resetSimulation(){

    // ==================================================
    // SIMULATION CONTROL
    // ==================================================

    simulationPaused = true;

    simulation.currentScenario = "NORMAL";

    simulation.targetUsers = 500;

    simulation.currentUsers = 500;

    simulation.engineState = "Paused";

    simulation.tick = 0;

    simulation.cpuOffset = 0;

    simulation.latencyOffset = 0;

    simulation.errorOffset = 0;

    currentSimulationMode = "NORMAL";


    // ==================================================
    // SYSTEM STATE
    // ==================================================

    system.users = 340;

    system.throughput = 1450;

    system.cpu = 38;

    system.memory = 54;

    system.latency = 118;

    system.errorRate = 0.05;

    system.services = Object.keys(services).length;

    system.status = "HEALTHY";


    // ==================================================
    // SYSTEM FLAGS
    // ==================================================

    systemState.cpuHigh = false;

    systemState.latencyHigh = false;

    systemState.errorHigh = false;


    // ==================================================
    // SERVICES
    // ==================================================
    
    Object.keys(services).forEach(key => {
    
        const initial =
            initialServiceState[key];
    
        if(!initial) return;
    
        services[key].status =
            initial.status;
    
        services[key].cpu =
            initial.cpu;
    
        services[key].memory =
            initial.memory;
    
        services[key].latency =
            initial.latency;
    
        services[key].requests =
            initial.requests;
    
        services[key].healthScore =
            initial.healthScore;
    
    });


    // ==================================================
    // SERVICE STATE MEMORY
    // ==================================================

    Object.keys(serviceState).forEach(key => {

        serviceState[key] = "HEALTHY";

    });


    // ==================================================
    // ALERTS
    // ==================================================

    alerts.length = 0;


    // ==================================================
    // LATENCY HISTORY
    // ==================================================

    latencyChart.data.datasets[0].data =
        new Array(60).fill(0);

    latencyChart.update();


    // ==================================================
    // RESET EVENT
    // ==================================================

    addTimelineEvent(
        "🔄",
        "Simulation reset to NORMAL scenario",
        "system"
    );

    addLog(
        "INFO",
        "SYSTEM",
        "Simulation reset. System restored to initial state."
    );


    // ==================================================
    // UPDATE SCENARIO SELECT
    // ==================================================

    const scenarioSelect =
        document.getElementById("scenarioSelect");

    if(scenarioSelect){

        scenarioSelect.value = "NORMAL";

    }


    // ==================================================
    // UPDATE INTERFACE
    // ==================================================

    renderSettings();

    renderKPIs();

    renderDashboardOverview();

    renderSimulationPanel();
    
    renderTimeline();
    
    renderServicesMap();

    renderServicesView();

    renderServiceDependencyMap();

    renderAPMView();

    renderInfrastructureView();

    renderAlerts();

    renderAlertsSummary();

    renderLogs();

    renderLogsSummary();

    updateLatencyChartVisuals();

}

// ======================================================
// SERVICES VIEW
// ======================================================

function renderServicesView(){

    const summary =
        document.getElementById("servicesSummary");

    const detail =
        document.getElementById("servicesDetail");

    if(!summary || !detail) return;


    // ==================================================
    // CONTADORES
    // ==================================================

    const serviceList =
        Object.values(services);

    const total =
        serviceList.length;

    const healthy =
        serviceList.filter(
            service => service.status === "HEALTHY"
        ).length;

    const warning =
        serviceList.filter(
            service => service.status === "WARNING"
        ).length;

    const critical =
        serviceList.filter(
            service =>
                service.status === "CRITICAL" ||
                service.status === "DOWN"
        ).length;


    // ==================================================
    // RESUMEN
    // ==================================================

    summary.innerHTML = `

        <div class="card p-5">

            <div class="text-xs uppercase tracking-widest text-gray-400">
                Servicios Totales
            </div>

            <div class="text-3xl font-bold mt-2">
                ${total}
            </div>

        </div>


        <div class="card p-5">

            <div class="text-xs uppercase tracking-widest text-gray-400">
                Operativos
            </div>

            <div class="text-3xl font-bold mt-2 text-green-400">
                ${healthy}
            </div>

        </div>


        <div class="card p-5">

            <div class="text-xs uppercase tracking-widest text-gray-400">
                Advertencia
            </div>

            <div class="text-3xl font-bold mt-2 text-yellow-400">
                ${warning}
            </div>

        </div>


        <div class="card p-5">

            <div class="text-xs uppercase tracking-widest text-gray-400">
                Crítico / Caido
            </div>

            <div class="text-3xl font-bold mt-2 text-red-400">
                ${critical}
            </div>

        </div>

    `;


    // ==================================================
    // DETALLE DE SERVICIOS
    // ==================================================

    detail.innerHTML = "";


    serviceList.forEach(service => {

        let statusIcon = "🟢";
        let statusClass = "text-green-400";


        if(service.status === "WARNING"){

            statusIcon = "🟡";
            statusClass = "text-yellow-400";

        }


        if(service.status === "CRITICAL"){

            statusIcon = "🔴";
            statusClass = "text-red-400";

        }


        if(service.status === "DOWN"){

            statusIcon = "⚫";
            statusClass = "text-red-500";

        }


        // ==============================================
        // DEPENDENCIAS
        // ==============================================

        const dependencies =
            service.dependsOn.length > 0
                ? service.dependsOn
                    .map(dep =>
                        services[dep]?.name || dep
                    )
                    .join(", ")
                : "Sin dependencias";


        // ==============================================
        // HEALTH SCORE
        // ==============================================

        let healthColor = "#22c55e";

        if(service.healthScore <= 70){

            healthColor = "#f59e0b";

        }

        if(service.healthScore <= 30){

            healthColor = "#ef4444";

        }


        // ==============================================
        // CARD
        // ==============================================

        detail.innerHTML += `

            <div class="card p-6">

                <div class="flex justify-between items-start mb-5">

                    <div>

                        <h3 class="text-lg font-semibold">

                            ${statusIcon}
                            ${service.name}

                        </h3>

                        <div class="text-xs text-gray-400 mt-1">

                            Dependencias:
                            ${dependencies}

                        </div>

                    </div>


                    <span
                        class="text-xs font-semibold ${statusClass}">

                        ${service.status}

                    </span>

                </div>


                <!-- METRICS -->

                <div
                    class="grid grid-cols-2 gap-4 text-sm mb-5">

                    <div class="bg-[#252b3d] rounded-lg p-3">

                        <div class="text-xs text-gray-400">
                            CPU
                        </div>

                        <strong>
                            ${service.cpu.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="bg-[#252b3d] rounded-lg p-3">

                        <div class="text-xs text-gray-400">
                            Memoria
                        </div>

                        <strong>
                            ${service.memory.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="bg-[#252b3d] rounded-lg p-3">

                        <div class="text-xs text-gray-400">
                            Latencia
                        </div>

                        <strong>
                            ${service.latency.toFixed(0)} ms
                        </strong>

                    </div>


                    <div class="bg-[#252b3d] rounded-lg p-3">

                        <div class="text-xs text-gray-400">
                            Solicitudes
                        </div>

                        <strong>
                            ${service.requests}
                        </strong>

                    </div>

                </div>


                <!-- HEALTH SCORE -->

                <div>

                    <div
                        class="flex justify-between text-xs text-gray-400 mb-2">

                        <span>
                            Nivel Operativo
                        </span>

                        <span>
                            ${Math.round(service.healthScore)}%
                        </span>

                    </div>


                    <div
                        class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">

                        <div
                            class="h-2 rounded-full"
                            style="
                                width:${service.healthScore}%;
                                background:${healthColor};
                                transition:width .5s ease;
                            ">

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// SERVICE DEPENDENCY MAP
// ======================================================

function renderServiceDependencyMap(){

    const container =
        document.getElementById(
            "serviceDependencyMap"
        );

    if(!container) return;


    // ==================================================
    // CONFIGURACIÓN VISUAL DE LOS ESTADOS
    // ==================================================

    const statusConfig = {

        HEALTHY: {
            icon: "🟢",
            border: "#22c55e",
            background: "#22c55e15"
        },

        WARNING: {
            icon: "🟡",
            border: "#f59e0b",
            background: "#f59e0b15"
        },

        CRITICAL: {
            icon: "🔴",
            border: "#ef4444",
            background: "#ef444415"
        },

        DOWN: {
            icon: "⚫",
            border: "#64748b",
            background: "#64748b15"
        }

    };


    // ==================================================
    // AGRUPAR SERVICIOS POR NIVEL
    // ==================================================

    const gateway =
        services.gateway;

    const api =
        services.api;

    const dependencies = [

        services.database,
        services.redis,
        services.identity

    ];

    const notifications =
        services.notifications;


    // ==================================================
    // FUNCIÓN PARA CREAR UN NODO
    // ==================================================

    function createNode(service){

        const config =
            statusConfig[service.status] ||
            statusConfig.HEALTHY;

        return `

            <div
                class="min-w-[170px] rounded-xl border p-4"
                style="
                    border-color:${config.border};
                    background:${config.background};
                ">

                <div class="flex justify-between items-center">

                    <div class="font-semibold text-sm">

                        ${config.icon}
                        ${service.name}

                    </div>

                </div>


                <div class="text-xs text-gray-400 mt-3">

                    CPU

                </div>

                <div class="text-sm font-semibold">

                    ${service.cpu.toFixed(0)}%

                </div>


                <div class="text-xs text-gray-400 mt-2">

                    Latencia

                </div>

                <div class="text-sm font-semibold">

                    ${service.latency.toFixed(0)} ms

                </div>


                <div class="text-xs text-gray-400 mt-2">

                    Operatividad

                </div>

                <div class="text-sm font-semibold">

                    ${Math.round(service.healthScore)}%

                </div>

            </div>

        `;

    }


    // ==================================================
    // RENDERIZAR TOPOLOGÍA
    // ==================================================

    container.innerHTML = `

        <div
            class="flex flex-col items-center gap-5 py-4">


            <!-- GATEWAY -->

            ${createNode(gateway)}


            <div class="text-gray-500 text-2xl">

                ↓

            </div>


            <!-- API -->

            ${createNode(api)}


            <div class="text-gray-500 text-2xl">

                ↓

            </div>


            <!-- DEPENDENCIAS -->

            <div
                class="grid grid-cols-1 md:grid-cols-3 gap-4">

                ${dependencies
                    .map(service =>
                        createNode(service)
                    )
                    .join("")
                }

            </div>


            <!-- NOTIFICATIONS -->

            <div
                class="flex items-center gap-4 text-gray-500">

                <span class="text-sm">
                    Notification Service
                </span>

                ←

            </div>


            ${createNode(notifications)}

        </div>

    `;

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
// GLOBAL SYSTEM STATUS ENGINE
// ======================================================

function updateGlobalSystemStatus(){

    // Guardamos el estado anterior
    const previousStatus = system.status;

    const criticalServices =
        Object.values(services)
            .filter(service =>
                service.status === "CRITICAL" ||
                service.status === "DOWN"
            )
            .length;

    const warningServices =
        Object.values(services)
            .filter(service =>
                service.status === "WARNING"
            )
            .length;

    // ==================================================
    // ESTADO CRÍTICO
    // ==================================================
    
    if(
        criticalServices > 0 ||
        system.errorRate > thresholds.system.errorRate
    ){
    
        system.status = "CRITICAL";
    
    }
    
    // ==================================================
    // ESTADO DEGRADADO
    // ==================================================
    
    else if(
        warningServices > 0 ||
        system.cpu > thresholds.system.cpu ||
        system.latency > thresholds.system.latency
    ){
    
        system.status = "DEGRADED";
    
    }
    
    // ==================================================
    // ESTADO SALUDABLE
    // ==================================================
    
    else{
    
        system.status = "HEALTHY";
    
    }

    // ==================================================
    // EVENTO DE CAMBIO DE ESTADO GLOBAL
    // ==================================================

    if(previousStatus !== system.status){

        const statusIcons = {
    
            HEALTHY: "🟢",
            DEGRADED: "🟡",
            CRITICAL: "🔴"
    
        };
    
        const logLevels = {
    
            HEALTHY: "INFO",
            DEGRADED: "WARNING",
            CRITICAL: "CRITICAL"
    
        };
    
        // ----------------------------------------------
        // TIMELINE
        // ----------------------------------------------
    
        addTimelineEvent(
    
            statusIcons[system.status],
    
            `Estado del Sistema: ${previousStatus} → ${system.status}`,
    
            "system"
    
        );
    
        // ----------------------------------------------
        // LOG
        // ----------------------------------------------
    
        addLog(
    
            logLevels[system.status],
    
            "SYSTEM",
    
            `El estado del sistema ha cambiado: ${previousStatus} → ${system.status}`
    
        );
    
    }

}

// ======================================================
// SYSTEM STATUS
// ======================================================
function renderSystemStatus(){

    const status =
        document.getElementById("systemStatus");

    if(!status) return;

    const totalServices =
        Object.keys(services).length;

    const criticalServices =
        Object.values(services)
            .filter(service =>
                service.status === "CRITICAL" ||
                service.status === "DOWN"
            )
            .length;

    const warningServices =
        Object.values(services)
            .filter(service =>
                service.status === "WARNING"
            )
            .length;

    // ==================================================
    // ESTADO CRÍTICO
    // ==================================================

    if(
        criticalServices > 0 ||
        system.errorRate > 0.30
    ){

        status.innerHTML =
            "🔴 SYSTEM STATUS: CRITICAL";

        status.className =
            "mt-2 text-sm font-semibold text-red-400";

    }

    // ==================================================
    // ESTADO DEGRADADO
    // ==================================================

    else if(
        warningServices > 0 ||
        system.cpu > 70 ||
        system.latency > 170
    ){

        status.innerHTML =
            "🟡 SYSTEM STATUS: DEGRADED";

        status.className =
            "mt-2 text-sm font-semibold text-yellow-400";

    }

    // ==================================================
    // ESTADO SALUDABLE
    // ==================================================

    else{

        status.innerHTML =
            "🟢 SYSTEM STATUS: HEALTHY";

        status.className =
            "mt-2 text-sm font-semibold text-green-400";

    }

}

// ======================================================
// ACTUALIZACIÓN DE LA GRÁFICA
// ======================================================

function updateLatencyChartVisuals(){

    const dataset =
        latencyChart.data.datasets[0];

    // ==================================================
    // ACTUALIZAR HISTÓRICO
    // ==================================================

    dataset.data.push(system.latency);

    dataset.data.shift();

    // ==================================================
    // ESTADO DE LOS SERVICIOS
    // ==================================================

    const criticalServices =
        Object.values(services)
            .filter(service =>
                service.status === "CRITICAL" ||
                service.status === "DOWN"
            )
            .length;

    const warningServices =
        Object.values(services)
            .filter(service =>
                service.status === "WARNING"
            )
            .length;

    // ==================================================
    // ESTADO CRÍTICO
    // ==================================================

    if(
        criticalServices > 0 ||
        system.errorRate > 0.30
    ){

        dataset.borderColor = "#ef4444";

        dataset.backgroundColor =
            "rgba(239, 68, 68, 0.15)";

    }

    // ==================================================
    // ESTADO DEGRADADO
    // ==================================================

    else if(
        warningServices > 0 ||
        system.cpu > 70 ||
        system.latency > 170
    ){

        dataset.borderColor = "#f59e0b";

        dataset.backgroundColor =
            "rgba(245, 158, 11, 0.15)";

    }

    // ==================================================
    // ESTADO SALUDABLE
    // ==================================================

    else{

        dataset.borderColor = "#3b82f6";

        dataset.backgroundColor =
            "rgba(59, 130, 246, 0.15)";

    }

    // ==================================================
    // ACTUALIZAR GRÁFICA
    // ==================================================

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


    const engineStatus =
        document.getElementById("engineStatus");

    if(engineStatus){

        if(simulationPaused){

            engineStatus.textContent =
                "⏸ Pausado";

            engineStatus.className =
                "engine-paused";

        }else{

            engineStatus.textContent =
                "● En ejecución";

            engineStatus.className =
                "engine-running";

        }

    }


    const toggleButton =
        document.getElementById(
            "toggleSimulationButton"
        );

    if(toggleButton){

        toggleButton.textContent =
            simulationPaused
                ? "▶ Reanudar simulación"
                : "⏸ Pausar simulación";

    }

}

    // =====================================================
    // INICIO MOTOR SIMULACIÓN
    // =====================================================
addTimelineEvent(
    "🚀",
    "Inicio del Motor de Simulación",
    "engine"

);

addLog(
    "INFO",
    "ENGINE",
    "El motor de simulación se ha iniciado correctamente"
);

// Ejecución inicial y temporizador unificado cada 2 segundos
tick();

setInterval(tick, 2000);

function evaluateSystemState(){

    // =====================================================
    // INICIALIZACIÓN DEL ESTADO
    // =====================================================

    if(!systemInitialized){

        systemState.cpuHigh =
            system.cpu > thresholds.system.cpu;

        systemState.latencyHigh =
            system.latency > thresholds.system.latency;

        systemState.errorHigh =
            system.errorRate > thresholds.system.errorRate;

        systemInitialized = true;

        return;

    }


    // =====================================================
    // CPU
    // =====================================================

    if(system.cpu > thresholds.system.cpu){

        if(!systemState.cpuHigh){

            systemState.cpuHigh = true;

            addTimelineEvent(
                "🟡",
                `CPU supera el ${thresholds.system.cpu} %`,
                "system"
            );

        }

    }else if(
        system.cpu < thresholds.recovery.cpu
    ){

        if(systemState.cpuHigh){

            systemState.cpuHigh = false;

            addTimelineEvent(
                "🟢",
                "CPU vuelve a valores normales",
                "system"
            );

        }

    }


    // =====================================================
    // LATENCIA
    // =====================================================

    if(
        system.latency >
        thresholds.system.latency
    ){

        if(!systemState.latencyHigh){

            systemState.latencyHigh = true;

            addTimelineEvent(
                "🔴",
                `Latencia supera los ${thresholds.system.latency} ms`,
                "system"
            );

        }

    }else if(
        system.latency <
        thresholds.recovery.latency
    ){

        if(systemState.latencyHigh){

            systemState.latencyHigh = false;

            addTimelineEvent(
                "🟢",
                "Latencia vuelve a valores normales",
                "system"
            );

        }

    }


    // =====================================================
    // ERROR RATE
    // =====================================================

    if(
        system.errorRate >
        thresholds.system.errorRate
    ){

        if(!systemState.errorHigh){

            systemState.errorHigh = true;

            addTimelineEvent(
                "🔴",
                `La tasa de errores supera el ${thresholds.system.errorRate * 100} %`,
                "system"
            );

        }

    }else if(
        system.errorRate <
        thresholds.recovery.errorRate
    ){

        if(systemState.errorHigh){

            systemState.errorHigh = false;

            addTimelineEvent(
                "🟢",
                "La tasa de errores vuelve a la normalidad",
                "system"
            );

        }

    }

}

// ======================================================
// APM VIEW
// ======================================================

function renderAPMView(){

    renderAPMSummary();

    renderAPMPerformance();

    renderAPMHealth();

    renderAPMInsights();

}

// ======================================================
// APM SUMMARY
// ======================================================

function renderAPMSummary(){

    const container =
        document.getElementById("apmSummary");

    if(!container) return;


    const metrics = [

        {
            title: "Latencia",
            value: `${system.latency.toFixed(0)} ms`,
            icon: "⚡"
        },

        {
            title: "Throughput",
            value: `${system.throughput} req/min`,
            icon: "📈"
        },

        {
            title: "Tasa de Error",
            value: `${system.errorRate.toFixed(2)} %`,
            icon: "⚠️"
        },

        {
            title: "Usuarios Activos",
            value: system.users,
            icon: "👥"
        }

    ];


    container.innerHTML = "";


    metrics.forEach(metric => {

        container.innerHTML += `

            <div class="card p-6">

                <div class="flex justify-between items-start">

                    <div>

                        <div
                            class="text-xs uppercase tracking-widest text-gray-400">

                            ${metric.title}

                        </div>

                        <div
                            class="text-3xl font-bold mt-3">

                            ${metric.value}

                        </div>

                    </div>

                    <div class="text-2xl">

                        ${metric.icon}

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// APM PERFORMANCE METRICS
// ======================================================

function renderAPMPerformance(){

    const container =
        document.getElementById("apmPerformanceMetrics");

    if(!container) return;


    const metrics = [

        {
            name: "Uso de la CPU",
            value: system.cpu,
            unit: "%",
            warning: 70,
            critical: 85
        },

        {
            name: "Uso de la Memoria",
            value: system.memory,
            unit: "%",
            warning: 75,
            critical: 90
        },

        {
            name: "Latencia de respuesta",
            value: system.latency,
            unit: " ms",
            warning: 170,
            critical: 220
        }

    ];


    container.innerHTML = "";


    metrics.forEach(metric => {

        let color = "#22c55e";

        if(metric.value >= metric.warning){

            color = "#f59e0b";

        }

        if(metric.value >= metric.critical){

            color = "#ef4444";

        }


        const percentage =

            Math.min(
                100,
                metric.unit === " ms"
                    ? (metric.value / 250) * 100
                    : metric.value
            );


        container.innerHTML += `

            <div>

                <div class="flex justify-between mb-2">

                    <span class="text-sm">

                        ${metric.name}

                    </span>

                    <span
                        class="font-semibold"
                        style="color:${color}">

                        ${metric.value.toFixed(
                            metric.unit === " ms" ? 0 : 1
                        )}${metric.unit}

                    </span>

                </div>


                <div
                    class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">

                    <div
                        class="h-2 rounded-full"
                        style="
                            width:${percentage}%;
                            background:${color};
                            transition:width .5s ease;
                        ">

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// APM HEALTH
// ======================================================

function renderAPMHealth(){

    const container =
        document.getElementById("apmHealth");

    const statusElement =
        document.getElementById("apmStatus");

    if(!container) return;


    let icon = "🟢";
    let color = "#22c55e";
    let title = "Operativo";
    let description =
        "La aplicación funciona dentro de los parámetros esperados.";


    if(system.status === "DEGRADED"){

        icon = "🟡";
        color = "#f59e0b";
        title = "Degradado";

        description =
            "Se han detectado métricas por encima de los niveles recomendados.";

    }


    if(system.status === "CRITICAL"){

        icon = "🔴";
        color = "#ef4444";
        title = "Crítico";

        description =
            "La aplicación presenta condiciones que requieren atención inmediata.";

    }


    if(statusElement){

        statusElement.innerHTML =
            `${icon} ${title}`;

        statusElement.style.color = color;

    }


    container.innerHTML = `

        <div class="flex flex-col items-center text-center py-8">

            <div
                class="text-6xl mb-5">

                ${icon}

            </div>


            <div
                class="text-3xl font-bold"
                style="color:${color}">

                ${title}

            </div>


            <p
                class="text-sm text-gray-400 mt-4 max-w-md">

                ${description}

            </p>


            <div
                class="mt-8 grid grid-cols-3 gap-6 w-full">

                <div>

                    <div class="text-xs text-gray-400">

                        Servicios

                    </div>

                    <div class="text-xl font-bold mt-1">

                        ${system.services}

                    </div>

                </div>


                <div>

                    <div class="text-xs text-gray-400">

                        CPU

                    </div>

                    <div class="text-xl font-bold mt-1">

                        ${system.cpu.toFixed(0)}%

                    </div>

                </div>


                <div>

                    <div class="text-xs text-gray-400">

                        Porcentaje de errores

                    </div>

                    <div class="text-xl font-bold mt-1">

                        ${system.errorRate.toFixed(2)}%

                    </div>

                </div>

            </div>

        </div>

    `;

}

// ======================================================
// APM INSIGHTS
// ======================================================

function renderAPMInsights(){

    const container =
        document.getElementById("apmInsights");

    if(!container) return;


    const insights = [];


    // CPU

    if(system.cpu > 85){

        insights.push({
            icon: "🔴",
            text: "CPU en nivel crítico. La aplicación puede experimentar degradación de rendimiento."
        });

    }else if(system.cpu > 70){

        insights.push({
            icon: "🟡",
            text: "CPU elevada. Se recomienda monitorizar la evolución de la carga."
        });

    }


    // LATENCIA

    if(system.latency > 220){

        insights.push({
            icon: "🔴",
            text: "Latencia crítica detectada. Las respuestas de la aplicación están degradadas."
        });

    }else if(system.latency > 170){

        insights.push({
            icon: "🟡",
            text: "Latencia superior al nivel recomendado."
        });

    }


    // ERROR RATE

    if(system.errorRate > 0.30){

        insights.push({
            icon: "🔴",
            text: "Tasa de errores crítica. Se recomienda revisar los servicios afectados."
        });

    }else if(system.errorRate > 0.10){

        insights.push({
            icon: "🟡",
            text: "La tasa de errores está aumentando."
        });

    }


    // ESTADO SALUDABLE

    if(insights.length === 0){

        insights.push({
            icon: "🟢",
            text: "La aplicación opera dentro de los parámetros normales."
        });

    }


    container.innerHTML = "";


    insights.forEach(insight => {

        container.innerHTML += `

            <div
                class="bg-[#252b3d] rounded-lg p-4 flex items-center gap-4">

                <div class="text-xl">

                    ${insight.icon}

                </div>

                <div class="text-sm">

                    ${insight.text}

                </div>

            </div>

        `;

    });

}

// ======================================================
// INFRASTRUCTURE VIEW
// ======================================================

function renderInfrastructureView(){

    renderInfrastructureSummary();

    renderInfrastructureResources();

    renderInfrastructureCapacity();

    renderInfrastructureNodes();

}

// ======================================================
// INFRASTRUCTURE SUMMARY
// ======================================================

function renderInfrastructureSummary(){

    const container =
        document.getElementById("infrastructureSummary");

    if(!container) return;


    const activeServices =
        Object.values(services)
            .filter(service =>
                service.status !== "DOWN"
            )
            .length;


    const metrics = [

        {
            title: "Uso de CPU",
            value: `${system.cpu.toFixed(0)}%`,
            icon: "🖥️"
        },

        {
            title: "Uso de memoria",
            value: `${system.memory.toFixed(0)}%`,
            icon: "💾"
        },

        {
            title: "Servicios activos",
            value: activeServices,
            icon: "⚙️"
        },

        {
            title: "Usuarios conectados",
            value: system.users,
            icon: "👥"
        }

    ];


    container.innerHTML = "";


    metrics.forEach(metric => {

        container.innerHTML += `

            <div class="card p-6">

                <div class="flex justify-between items-start">

                    <div>

                        <div
                            class="text-xs uppercase tracking-widest text-gray-400">

                            ${metric.title}

                        </div>

                        <div
                            class="text-3xl font-bold mt-3">

                            ${metric.value}

                        </div>

                    </div>

                    <div class="text-2xl">

                        ${metric.icon}

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// INFRASTRUCTURE RESOURCES
// ======================================================

function renderInfrastructureResources(){

    const container =
        document.getElementById("infrastructureResources");

    if(!container) return;


    const networkLoad =
        Math.min(
            100,
            (system.throughput / 3500) * 100
        );


    const resources = [

        {
            name: "CPU",
            value: system.cpu,
            unit: "%",
            warning: 70,
            critical: 85
        },

        {
            name: "Memoria",
            value: system.memory,
            unit: "%",
            warning: 75,
            critical: 90
        },

        {
            name: "Carga de red",
            value: networkLoad,
            unit: "%",
            warning: 75,
            critical: 90
        }

    ];


    container.innerHTML = "";


    resources.forEach(resource => {

        let color = "#22c55e";

        if(resource.value >= resource.warning){

            color = "#f59e0b";

        }

        if(resource.value >= resource.critical){

            color = "#ef4444";

        }


        container.innerHTML += `

            <div>

                <div class="flex justify-between mb-2">

                    <span class="text-sm">

                        ${resource.name}

                    </span>

                    <span
                        class="font-semibold"
                        style="color:${color}">

                        ${resource.value.toFixed(1)}${resource.unit}

                    </span>

                </div>

                <div
                    class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">

                    <div
                        class="h-2 rounded-full"
                        style="
                            width:${Math.min(100, resource.value)}%;
                            background:${color};
                            transition:width .5s ease;
                        ">

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// INFRASTRUCTURE CAPACITY
// ======================================================

function renderInfrastructureCapacity(){

    const container =
        document.getElementById("infrastructureCapacity");

    if(!container) return;


    const cpuCapacity =
        Math.max(0, 100 - system.cpu);

    const memoryCapacity =
        Math.max(0, 100 - system.memory);

    const serviceCapacity =
        Math.max(
            0,
            100 -
            (
                Object.values(services)
                    .filter(service =>
                        service.status !== "HEALTHY"
                    )
                    .length /
                Object.keys(services).length
            ) * 100
        );


    const capacity =
        Math.round(
            (
                cpuCapacity +
                memoryCapacity +
                serviceCapacity
            ) / 3
        );


    let icon = "🟢";
    let color = "#22c55e";
    let title = "Capacidad operativa";


    if(capacity < 70){

        icon = "🟡";
        color = "#f59e0b";
        title = "Capacidad reducida";

    }


    if(capacity < 40){

        icon = "🔴";
        color = "#ef4444";
        title = "Capacidad crítica";

    }


    const statusElement =
        document.getElementById(
            "infrastructureStatus"
        );


    if(statusElement){

        statusElement.innerHTML =
            `${icon} ${title}`;

        statusElement.style.color =
            color;

    }


    container.innerHTML = `

        <div class="flex flex-col items-center text-center py-6">

            <div class="text-6xl mb-5">

                ${icon}

            </div>

            <div
                class="text-4xl font-bold"
                style="color:${color}">

                ${capacity}%

            </div>

            <div class="text-sm text-gray-400 mt-2">

                ${title}

            </div>

        </div>


        <div
            class="grid grid-cols-3 gap-4 mt-6 text-center">

            <div>

                <div class="text-xs text-gray-400">

                    CPU

                </div>

                <div class="font-semibold mt-1">

                    ${cpuCapacity.toFixed(0)}%

                </div>

            </div>


            <div>

                <div class="text-xs text-gray-400">

                    Memoria

                </div>

                <div class="font-semibold mt-1">

                    ${memoryCapacity.toFixed(0)}%

                </div>

            </div>


            <div>

                <div class="text-xs text-gray-400">

                    Servicios

                </div>

                <div class="font-semibold mt-1">

                    ${serviceCapacity.toFixed(0)}%

                </div>

            </div>

        </div>

    `;

}

// ======================================================
// INFRASTRUCTURE NODES
// ======================================================

function renderInfrastructureNodes(){

    const container =
        document.getElementById("infrastructureNodes");

    if(!container) return;


    const nodes = [

        {
            name: "Nodo de cómputo",
            services: [
                "gateway",
                "api"
            ]
        },

        {
            name: "Nodo de aplicación",
            services: [
                "identity",
                "notifications"
            ]
        },

        {
            name: "Nodo de datos",
            services: [
                "database",
                "redis"
            ]
        }

    ];


    container.innerHTML = "";


    nodes.forEach(node => {

        const nodeServices =
            node.services.map(
                key => services[key]
            );


        const averageCPU =
            nodeServices.reduce(
                (total, service) =>
                    total + service.cpu,
                0
            ) /
            nodeServices.length;


        const averageMemory =
            nodeServices.reduce(
                (total, service) =>
                    total + service.memory,
                0
            ) /
            nodeServices.length;


        const averageHealth =
            nodeServices.reduce(
                (total, service) =>
                    total + service.healthScore,
                0
            ) /
            nodeServices.length;


        let statusIcon = "🟢";
        let statusColor = "#22c55e";
        let status = "HEALTHY";


        if(averageHealth <= 70){

            statusIcon = "🟡";
            statusColor = "#f59e0b";
            status = "DEGRADED";

        }


        if(averageHealth <= 30){

            statusIcon = "🔴";
            statusColor = "#ef4444";
            status = "CRITICAL";

        }


        container.innerHTML += `

            <div class="bg-[#252b3d] rounded-lg p-5 border border-[#394056]">


                <div
                    class="flex justify-between items-center mb-5">

                    <div>

                        <div class="font-semibold text-lg">

                            ${node.name}

                        </div>

                        <div class="text-xs text-gray-400 mt-1">

                            ${node.services.length} servicios

                        </div>

                    </div>


                    <div
                        class="text-xs font-semibold"
                        style="color:${statusColor}">

                        ${statusIcon} ${status}

                    </div>

                </div>


                <div class="space-y-3 text-sm">


                    <div class="flex justify-between">

                        <span class="text-gray-400">
                            CPU
                        </span>

                        <strong>
                            ${averageCPU.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="flex justify-between">

                        <span class="text-gray-400">
                            Memoria
                        </span>

                        <strong>
                            ${averageMemory.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="flex justify-between">

                        <span class="text-gray-400">
                            Puntuación operativa
                        </span>

                        <strong
                            style="color:${statusColor}">

                            ${averageHealth.toFixed(0)}%

                        </strong>

                    </div>


                </div>


                <div
                    class="border-t border-[#394056] mt-4 pt-4">

                    <div class="text-xs text-gray-400 mb-2">

                        Servicios alojados

                    </div>

                    <div class="text-sm">

                        ${nodeServices
                            .map(service => service.name)
                            .join(", ")}

                    </div>

                </div>

            </div>

        `;

    });

}

// ======================================================
// BUCLE PRINCIPAL DE INICIALIZACIÓN
// ======================================================
function tick(){

    if(simulationPaused){

        renderSettings();

        return;

    }

    // ==============================================
    // Calcula el nuevo estado del sistema
    // SIMULACIÓN
    // ==============================================

    simulateSystem();

    simulateServices();


    // ==============================================
    // ESTADO GLOBAL
    // ==============================================

    updateGlobalSystemStatus();

    evaluateSystemState();


    // ==============================================
    // ALERTAS
    // ==============================================

    evaluateAlerts();


    // ==============================================
    // RENDERIZADO GENERAL
    // ==============================================

    renderKPIs();
    renderDashboardOverview();
    renderSimulationPanel();
    renderTimeline();

    renderServicesMap();
    renderServicesView();
    renderServiceDependencyMap();

    renderAPMView();

    renderInfrastructureView();

    renderSystemStatus();

    renderOperationalAssessment();


    // ==============================================
    // LOGS
    // ==============================================

    renderLogs();
    renderLogsSummary();


    // ==============================================
    // ALERTS
    // ==============================================

    renderAlerts();
    renderAlertsSummary();


    // ==============================================
    // SETTINGS
    // ==============================================

    renderSettings();


    // ==============================================
    // CHARTS
    // ==============================================

    updateLatencyChartVisuals();

}

// ======================================================
// CONTROLES DE SIMULACIÓN
// ======================================================

function initializeSimulationControls(){

    const toggleButton =
        document.getElementById(
            "toggleSimulationButton"
        );

    if(!toggleButton) return;

    toggleButton.addEventListener("click", () => {

        simulationPaused =
            !simulationPaused;
    
        simulation.engineState =
            simulationPaused
                ? "Paused"
                : "Running";
    
        renderSettings();
    
        renderSimulationPanel();
    
    });

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
        `Situación: ${selectedScenario} | Target: ${simulation.targetUsers}`
    );
    
    addTimelineEvent(
        "🎯",
        `Situación ${selectedScenario} activado (Objetivo: ${simulation.targetUsers} usuarios)`,
        "scenario"
    );

    addLog(
        "INFO",
        "SCENARIO",
        `La situación ha cambiado a ${selectedScenario}. Target users: ${simulation.targetUsers}`
    );


});

// ======================================================
// INICIALIZACIÓN DE FILTROS DE LOGS
// ======================================================

initializeLogFilters();


const resetButton =
    document.getElementById(
        "resetSimulationButton"
    );

if(resetButton){

    resetButton.addEventListener(
        "click",
        resetSimulation
    );

}

// ======================================================
// INICIALIZACIÓN DE CONTROLES DE SIMULACIÓN
// ======================================================

initializeSimulationControls();

// ======================================================
// INICIALIZACIÓN DE ALERT CONFIGURATION
// ======================================================

initializeAlertConfiguration();

// ======================================================
// ALERT CONFIGURATION
// ======================================================

function initializeAlertConfiguration(){

    const cpuInput =
        document.getElementById(
            "cpuThresholdInput"
        );

    const latencyInput =
        document.getElementById(
            "latencyThresholdInput"
        );

    const errorInput =
        document.getElementById(
            "errorThresholdInput"
        );


    // ==================================================
    // CARGAR VALORES ACTUALES
    // ==================================================

    if(cpuInput){

        cpuInput.value =
            thresholds.system.cpu;

    }

    if(latencyInput){

        latencyInput.value =
            thresholds.system.latency;

    }

    if(errorInput){

        errorInput.value =
            thresholds.system.errorRate * 100;

    }


    // ==================================================
    // CPU
    // ==================================================

    if(cpuInput){

        cpuInput.addEventListener("change", () => {

            const value =
                Number(cpuInput.value);

            if(!Number.isNaN(value)){

            thresholds.system.cpu =
                Math.max(1, Math.min(100, value));
            
            thresholds.recovery.cpu =
                Math.max(
                    0,
                    thresholds.system.cpu - 10
                );

            }

        });

    }


    // ==================================================
    // LATENCY
    // ==================================================

    if(latencyInput){

        latencyInput.addEventListener("change", () => {

            const value =
                Number(latencyInput.value);

            if(!Number.isNaN(value)){

            thresholds.system.latency =
                Math.max(1, value);
            
            thresholds.recovery.latency =
                Math.max(
                    0,
                    thresholds.system.latency - 20
                );

            }

        });

    }


    // ==================================================
    // ERROR RATE
    // ==================================================

    if(errorInput){

    errorInput.addEventListener("change", () => {

        const value =
            Number(errorInput.value);

        if(!Number.isNaN(value)){

            thresholds.system.errorRate =
                Math.max(
                    0,
                    value / 100
                );

            thresholds.recovery.errorRate =
                Math.max(
                    0,
                    thresholds.system.errorRate - 0.20
                );

        }

    });

    }

}

// ======================================================
// NAVEGACIÓN ENTRE VISTAS
// ======================================================

const menuItems =
    document.querySelectorAll(".menu-item");

const appViews =
    document.querySelectorAll(
        "#view-dashboard, " +
        "#view-apm, " +
        "#view-infrastructure, " +
        "#view-services, " +
        "#view-logs, " +
        "#view-alerts, " +
        "#view-settings"
    );

function showView(viewName){

    // ==================================================
    // OCULTAR TODAS LAS VISTAS
    // ==================================================

    appViews.forEach(view => {

        view.classList.add("hidden");

    });

    // ==================================================
    // MOSTRAR VISTA SELECCIONADA
    // ==================================================

    const selectedView =
        document.getElementById(
            "view-" + viewName
        );

    if(selectedView){

        selectedView.classList.remove("hidden");

    }

    // ==================================================
    // ACTUALIZAR MENÚ ACTIVO
    // ==================================================

    menuItems.forEach(item => {

        item.classList.remove("active-menu");

    });

    const activeItem =
        document.querySelector(
            `.menu-item[data-view="${viewName}"]`
        );

    if(activeItem){

        activeItem.classList.add("active-menu");

    }

}

// ======================================================
// EVENTOS DEL MENÚ
// ======================================================

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const viewName =
            item.dataset.view;

        showView(viewName);

    });

});
