// ======================================================
// OBSERVABILITY LABS
// Dashboard de Observabilidad (Demo)
// Versión: 0.2
// Autor: Luis Miguel Galacho + ChatGPT
// ======================================================
// ======================================================
// CONFIGURACIÓN
// ======================================================
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

// ======================================================
// MOTOR DE SIMULACIÓN
// ======================================================

function simulateSystem(){

    // Variación de usuarios

    system.users += Math.floor(Math.random()*41)-20;
    system.users = Math.max(100, Math.min(1200, system.users));

    // Throughput

    system.throughput = Math.round(
        800 + system.users * 2.2
    );

    // CPU

    system.cpu =
        18 +
        system.throughput / 55 +
        (Math.random()*5-2);

    system.cpu = Math.min(100, system.cpu);

    // Memoria

    system.memory =
        30 +
        system.cpu * 0.65 +
        (Math.random()*4-2);

    system.memory = Math.min(95, system.memory);

    // Latencia

    system.latency =
        70 +
        system.cpu * 1.25 +
        Math.random()*10;

    // Error Rate

    system.errorRate =
        0.02 +
        Math.max(0,(system.cpu-65))*0.015;

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

        document.getElementById("metric"+index).innerHTML =

            value +
            " <span class='text-lg text-gray-400'>" +
            m.unit +
            "</span>";

        const trend = document.getElementById("trend"+index);

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
// CHART.JS
// ======================================================

const ctx = document
.getElementById("latencyChart");

const latencyChart = new Chart(ctx,{

    type:"line",

    data:{

        labels:Array.from({length:60},(_,i)=>i-59),

        datasets:[{

            label:"Latencia",

            data:new Array(60).fill(120),

            borderColor:"#3b82f6",

            borderWidth:3,

            tension:.35,

            pointRadius:0,

            fill:true,

            backgroundColor:"rgba(59,130,246,.15)"

        }]

    },

    options:{

        responsive:true,

        maintainAspectRatio:false,

        animation:false,

        plugins:{

            legend:{

                display:false

            }

        },

        scales:{

            x:{

    ticks:{
        display:false
    },

    border:{
        display:false
    },

    grid:{
        color:"#2f3445"
    }

},

            y:{

    suggestedMin:80,

    suggestedMax:220,

    ticks:{

        color:"#94a3b8",

        stepSize:20

    },

    border:{
        display:false
    },

    grid:{
                color:"#2f3445"
            }

        }   // y

    }       // scales

}           // options

});         // new Chart
// ======================================================
// INICIALIZACIÓN
// ======================================================
function tick(){

    simulateSystem();

    renderKPIs();

}

tick();

setInterval(tick,2000);
