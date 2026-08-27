\# 🧭 Observability Labs: SRE \& FinOps Simulation Environment



\[!\[Monitorización](https://img.shields.io/badge/github-repo-blue?logo=github)](https://lmgch.github.io/simulador/)

\[!\ [1.1.0--dev](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/LMGCH/simulador)

\[!\ [simulación](https://img.shields.io/badge/just%20the%20message-8A2BE2)](https://lmgch.github.io/simulador/)



Un entorno interactivo de simulación "GameDay" diseñado para poner a prueba las habilidades de monitorización, respuesta ante incidentes y optimización de costes (FinOps) en una infraestructura web moderna.



👉 \*\*\[Probar el simulador en vivo aquí]\*\* (https://lmgch.github.io/simulador/)



\---



\## 📋 Descripción del Proyecto



Este laboratorio simula el comportamiento de una plataforma empresarial compuesta por \*\*6 microservicios interdependientes\*\*. El objetivo es proporcionar un entorno pedagógico donde ingenieros DevOps, SRE y administradores de sistemas puedan experimentar cómo las decisiones técnicas impactan directamente en las métricas operativas (SLAs/SLOs) y en los costes financieros de la organización.



\### El Reto SRE + FinOps:

No basta con estabilizar el sistema lanzando recursos infinitos. Cada acción de mitigación tiene un \*\*coste operativo estimado (€ a €€€)\*\*. El éxito se mide en tu capacidad para resolver crisis manteniendo la infraestructura bajo el presupuesto óptimo.



\---



\## 🖥️ Arquitectura y Componentes Simulados



El panel replica las herramientas líderes del mercado (Datadog, Dynatrace, New Relic) y está dividido en cinco secciones clave:



\*   \*\*APM (Application Performance Monitoring):\*\* Análisis de latencia en tiempo real, tasas de error y rendimiento de transacciones.

\*   \*\*Infrastructure:\*\* Estado de salud del clúster virtual, CPU, memoria y distribución de carga en los nodos.

\*   \*\*Service Map:\*\* Topología interactiva que muestra las dependencias críticas entre los 6 microservicios.

\*   \*\*Logs:\*\* Emisión de trazas técnicas en vivo con códigos de estado (formateados según la gravedad del escenario).

\*   \*\*Alerting Engine:\*\* Disparador automático de alertas basado en umbrales personalizables de CPU y latencia.



\---



\## 🕹️ Escenarios Disponibles



El motor de simulación cuenta con tres modos operativos que puedes activar para evaluar el comportamiento del sistema:



1\.  \*\*🟢 NORMAL:\*\* El sistema funciona de manera óptima. Todos los indicadores se encuentran dentro de los límites y el coste base está controlado.

2\.  \*\*🟡 HIGH LOAD (Sobrecarga):\*\* Tráfico estival o picos de uso. La CPU se satura y la latencia aumenta, poniendo en riesgo la experiencia de usuario si no se redistribuye la carga.

3\.  \*\*🔴 INCIDENT (Incidente Crítico):\*\* Caída o degradación de una dependencia crítica. Errores 5xx en los logs y pérdida de disponibilidad de servicios. Requiere aislamiento y recuperación inmediata.



\---



\## 🛠️ Matriz de Intervenciones Operativas



Dispones de \*\*10 acciones estratégicas\*\* para mitigar las anomalías de los escenarios. Elige con sabiduría:



| Intervención | Tipo de Acción | Impacto Estimado | Coste |

| :--- | :--- | :--- | :--- |

| \*\*Limitar solicitudes\*\* | Mitigación | Reduce la carga sacrificando capacidad (Rate Limiting). | `€` |

| \*\*Reducir procesos no prioritarios\*\* | Optimización | Libera recursos de fondo para el core del negocio. | `€` |

| \*\*Redistribuir carga\*\* | Escalado | Alivia la presión en los microservicios saturados. | `€€` |

| \*\*Reiniciar servicio afectado\*\* | Recuperación | Intenta levantar un componente degradado. | `€€` |

| \*\*Aislar dependencia crítica\*\* | Contención | Evita que el fallo se propague en cascada por el mapa. | `€€` |

| \*\*Priorizar servicios esenciales\*\* | Resiliencia | Protege los flujos críticos (p. ej., pasarela de pago). | `€€€` |



\---



\## 📊 Mecánica de Evaluación (Post-Mortem)



Al finalizar un incidente, el simulador evalúa tu desempeño basándose en:

\*   \*\*Tiempo de resolución:\*\* Rapidez en devolver los indicadores al estado `HEALTHY`.

\*   \*\*Eficiencia de Costes (FinOps):\*\* El sumatorio de los euros (`€`) consumidos por las intervenciones activadas.

\*   \*\*Disponibilidad del Servicio:\*\* Porcentaje de usuarios que sufrieron cortes durante tu guardia.



\---



\## 🚀 Tecnologías y Desarrollo



\*   \*\*Frontend:\*\* HTML5, CSS3 (Diseño UI Dark Mode de alta fidelidad), JavaScript (ES6+) para el motor de simulación reactivo.

\*   \*\*Despliegue:\*\* GitHub Pages para la integración continua.



\### Instalación Local



Si deseas ejecutar este laboratorio en tu entorno local o realizar modificaciones:



```bash

\# Clonar el repositorio

git clone https://github.com



\# Acceder al directorio

cd TU\_REPOSITORIO



\# Abrir en tu navegador (no requiere backend ni bases de datos relacionales externas)

open index.html

```



\---



\## 🤝 Contribuciones y Feedback



¡Las sugerencias son bienvenidas! Si encuentras un bug, quieres proponer un nuevo escenario de caos (como un ataque DDoS simulado) o una nueva intervención operativa, siéntete libre de abrir un \*Issue\* o enviar un \*Pull Request\*.



Desarrollado con 💻 por \*\*\[Luis Miguel GCH \*\* / www.linkedin.com/in/luis-miguel-galacho].



