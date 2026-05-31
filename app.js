/* 
 * Tratado de Ciencia e Ingeniería de Polímeros - Lógica Interactiva (Vanilla JS)
 * Desarrollado por: Karyme ZR
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNetworkCanvas();
    initChapterBrowser();
    initSimulators();
    initPolymerGallery();
});

/* ==========================================
   1. GESTIÓN DE TEMA (DARK / LIGHT MODE)
   ========================================== */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        // Redraw canvas colors if active
        initCanvasColors();
    });
}

/* ==========================================
   2. CANVAS DE RED MACROMOLECULAR ANIMADA
   ========================================== */
let canvasColorNode = 'rgba(0, 242, 254, 0.4)';
let canvasColorLine = 'rgba(0, 242, 254, 0.08)';

function initCanvasColors() {
    const isLight = document.body.classList.contains('light-theme');
    canvasColorNode = isLight ? 'rgba(59, 130, 246, 0.25)' : 'rgba(0, 242, 254, 0.35)';
    canvasColorLine = isLight ? 'rgba(59, 130, 246, 0.05)' : 'rgba(0, 242, 254, 0.06)';
}

function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    initCanvasColors();
    
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2.5 + 1.5
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections (macromolecular entanglement mesh)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = canvasColorLine;
                    ctx.lineWidth = (1 - dist / maxDistance) * 1.2;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw particles (monomer nodes)
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.fillStyle = canvasColorNode;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce on boundaries
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================
   3. NAVEGADOR DE CAPÍTULOS DE LIBRO
   ========================================== */
const chaptersData = [
    {
        num: "Capítulo 01",
        title: "Introducción a la Ciencia de los Polímeros",
        snippet: "Definiciones de monómero, polímero y grados de polimerización. Pesos moleculares estadísticos (Mn, Mw) e índice de polidispersidad.",
        eqTitle: "ÍNDICE DE POLIDISPERSIDAD (PDI)",
        eqMath: "\\text{\\DJ} = \\frac{M_w}{M_n}",
        content: `
            <h3>Fundamentos Conceptuales</h3>
            <p>La ciencia de polímeros comenzó formalmente en la década de 1920 cuando Hermann Staudinger demostró la existencia de macromoléculas de cadena larga unidas por enlaces covalentes, desafiando la teoría imperante de agregados coloidales.</p>
            
            <h3>Estadística del Peso Molecular</h3>
            <p>A diferencia de las moléculas discretas simples, las muestras de polímeros sintéticos poseen una distribución estadística de longitudes de cadena (polidispersidad):</p>
            <ul class="modal-bullet-list">
                <li><strong>M_n (Número Promedio):</strong> Determinado por propiedades coligativas (osmometría). Muy sensible a fracciones oligoméricas pequeñas.</li>
                <li><strong>M_w (Peso Promedio):</strong> Determinado por dispersión de luz. Sensible a cadenas largas y masivas, influyendo críticamente en la viscosidad de fundido.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 02",
        title: "Clasificación de Materiales Poliméricos",
        snippet: "Clasificación de polímeros según su origen, comportamiento térmico (termoplásticos y termoestables) y microestructura lineal o reticulada.",
        eqTitle: "FRACCIÓN DE ENLACES CRUZADOS",
        eqMath: "\\rho = \\frac{\\text{Nodos}}{\\text{UCR Totales}}",
        content: `
            <h3>Criterios de Clasificación</h3>
            <p>Los polímeros se estructuran bajo tres clasificaciones críticas:</p>
            <ul class="modal-bullet-list">
                <li><strong>Comportamiento Térmico:</strong>
                    <br>- <em>Termoplásticos:</em> Estructuras lineales o ramificadas que se pueden fundir y moldear reversiblemente.
                    <br>- <em>Termoestables:</em> Redes reticuladas covalentemente mediante enlaces permanentes (curado). Sufren carbonización en lugar de fundirse.
                </li>
                <li><strong>Topología Molecular:</strong> Estructuras lineales, ramificadas de baja y alta densidad, en estrella, dendrímeros y redes tridimensionales reticuladas.</li>
                <li><strong>Configuración del Copolímero:</strong> Copolímeros al azar, alternantes, en bloque (ej. SBS) y de injerto.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 03",
        title: "Estructura Molecular y Conformación de Cadenas",
        snippet: "Tacticidad e isomería en cadenas de polímeros. Modelado matemático de la flexibilidad: modelo de cadena libremente unida y factor de Flory.",
        eqTitle: "FACTOR DE FLORY (C_inf)",
        eqMath: "C_{\\infty} = \\frac{\\langle r^2 \\rangle_0}{n l^2}",
        content: `
            <h3>Tacticidad (Estereoquímica)</h3>
            <p>Describe el ordenamiento espacial de los sustituyentes en carbonos quirales alternos de la cadena principal:</p>
            <ul class="modal-bullet-list">
                <li><strong>Isotáctico:</strong> Todos los grupos en el mismo plano lateral. Facilita la cristalización rápida.</li>
                <li><strong>Sindiotáctico:</strong> Grupos ordenados alternadamente a cada lado.</li>
                <li><strong>Atáctico:</strong> Disposición aleatoria. Impide por completo el empaquetamiento cristalino, dando sólidos amorfos transparentes.</li>
            </ul>
            
            <h3>Estadística Conformacional</h3>
            <p>Debido al libre giro en enlaces sencillos C-C (ángulos de torsión &theta;), las cadenas se describen estadísticamente por su distancia extremo a extremo ($r$):</p>
            <ul class="modal-bullet-list">
                <li><strong>Cadena Libremente Unida (Freely Jointed Chain):</strong> Modelo ideal donde no hay restricción de giro ni exclusión espacial.</li>
                <li><strong>C_inf (Relación de Rigidez):</strong> Relación entre la distancia extremo-extremo cuadrática real vs. el modelo ideal. Los polímeros flexibles como el PE tienen $C_inf \\approx 6.7$, mientras que cadenas rígidas como la celulosa superan 40.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 04",
        title: "Métodos de Síntesis y Mecanismos de Polimerización",
        snippet: "Síntesis por pasos (condensación) y en cadena (adición por radicales). Cinética analítica y deducción teórica de la ecuación de Carothers.",
        eqTitle: "ECUACIÓN DE CAROTHERS",
        eqMath: "X_n = \\frac{1}{1 - p}",
        content: `
            <h3>Mecanismo de Polimerización por Pasos</h3>
            <p>Ocurre mediante reacciones bifuncionales independientes entre grupos terminales (ej. formación de poliésteres o poliamidas). Se caracteriza por el crecimiento lento de peso molecular en etapas iniciales. Se requiere una conversión del 99.9% ($p \\to 1$) para obtener altos pesos moleculares comerciales.</p>
            
            <h3>Mecanismo de Polimerización en Cadena</h3>
            <p>Requiere un centro activo (radicales libres, cationes, aniones o complejos de coordinación Z-N). El crecimiento es casi instantáneo para cada cadena. Sus etapas de propagación son:</p>
            <ul class="modal-bullet-list">
                <li><strong>Iniciación:</strong> Generación de radicales por termólisis (AIBN, BPO).</li>
                <li><strong>Propagación:</strong> Adición en cascada del monómero sobre el extremo reactivo.</li>
                <li><strong>Terminación:</strong> Por recombinación (acoplamiento) o desproporción.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 05",
        title: "Propiedades Físicas y Termodinámica de Soluciones",
        snippet: "Termodinámica de mezclas poliméricas a través del modelo de red de Flory-Huggins. Técnicas experimentales de medición molecular.",
        eqTitle: "ENERGÍA DE MEZCLA DE FLORY-HUGGINS",
        eqMath: "\\Delta G_m = R T [ \\phi_1 \\ln \\phi_1 + \\frac{\\phi_2}{x} \\ln \\phi_2 + \\chi_1 \\phi_1 \\phi_2 ]",
        content: `
            <h3>Termodinámica de Macromoléculas en Disolución</h3>
            <p>La entropía de mezcla en polímeros es extremadamente baja comparada con moléculas pequeñas, debido a que los monómeros se hallan unidos covalentemente perdiendo grados de libertad conformacionales.</p>
            
            <h3>Parámetro de Interacción de Flory-Huggins (\\chi_1)</h3>
            <p>Cuantifica la entalpía o carácter energético de las interacciones polímero-disolvente. Si $\\chi_1 < 0.5$, el solvente es termodinámicamente favorable (buen solvente); si $\\chi_1 > 0.5$, el polímero precipita o colapsa.</p>
            
            <h3>Determinación experimental: Ecuación de Mark-Houwink</h3>
            <p>Relaciona la viscosidad intrínseca $[\\eta]$ obtenida en viscosimetría capilar con el peso molecular promedio viscoso:</p>
            <div class="modal-eq-container">
                <div class="modal-eq-title">Ecuación de Mark-Houwink</div>
                <div class="modal-eq-math">[\\eta] = K \\cdot M_v^a</div>
            </div>
            <p>Donde el exponente $a$ mide el hinchamiento conformacional de la cadena, oscilando entre 0.5 (ovillo colapsado, estado Theta) y 0.8-1.0 (cadenas extendidas rígidas).</p>
        `
    },
    {
        num: "Capítulo 06",
        title: "Propiedades Mecánicas y Comportamiento Viscoelástico",
        snippet: "Comportamiento viscoelástico lineal en polímeros. Modelado constitutivo con Maxwell y Kelvin-Voigt. Análisis Mecánico Dinámico (DMA).",
        eqTitle: "TIEMPO DE RELAJACIÓN REOLÓGICO",
        eqMath: "\\tau = \\frac{\\eta}{E}",
        content: `
            <h3>Viscoelasticidad</h3>
            <p>Los polímeros exhiben simultáneamente características elásticas (sólidos ideales que obedecen la ley de Hooke) y viscosas (líquidos newtonianos que fluyen disipando energía según la ley de Newton).</p>
            
            <h3>Modelos Mecánicos Elementales</h3>
            <ul class="modal-bullet-list">
                <li><strong>Modelo de Maxwell:</strong> Resorte y amortiguador en serie. Modela con precisión la relajación de esfuerzos a deformación constante en fluidos poliméricos.</li>
                <li><strong>Modelo de Kelvin-Voigt:</strong> Resorte y amortiguador en paralelo. Modela la respuesta de deformación retardada (fluencia lenta o creep) típica de sólidos estructurales.</li>
            </ul>

            <h3>Análisis Mecánico Dinámico (DMA)</h3>
            <p>Aplica esfuerzos sinusoidales cíclicos para medir el módulo de almacenamiento ($E'$, elasticidad) y el módulo de pérdidas ($E''$, disipación viscosa). El cociente se define como la pérdida tangente:</p>
            <div class="modal-eq-container">
                <div class="modal-eq-title">Pérdida Tangente (Amortiguamiento)</div>
                <div class="modal-eq-math">\\tan \\delta = \\frac{E''}{E'}</div>
            </div>
        `
    },
    {
        num: "Capítulo 07",
        title: "Propiedades Térmicas y Transiciones de Fase",
        snippet: "Temperatura de transición vítrea (Tg) y fusión cristalina (Tm). Cinética de cristalización según la formulación de Avrami.",
        eqTitle: "CINÉTICA DE AVRAMI",
        eqMath: "1 - X_c = e^{-k t^n}",
        content: `
            <h3>Transiciones Térmicas Clave</h3>
            <ul class="modal-bullet-list">
                <li><strong>Temperatura de Transición Vítrea (T_g):</strong> Transición de segundo orden asociada con la congelación/activación cooperativa de los movimientos de segmentos en la fase amorfa (50 carbonos principales). Por debajo de $T_g$, el polímero es un vidrio frágil y duro; por encima, es flexible y gomoso.</li>
                <li><strong>Temperatura de Fusión Cristalina (T_m):</strong> Transición termodinámica de primer orden en la que los cristalitos tridimensionales se funden en fase líquida desordenada.</li>
            </ul>

            <h3>Copolimerización y T_g: Ecuación de Fox</h3>
            <p>La ecuación de Fox predice la transición vítrea de una mezcla homogénea de polímeros o copolímeros en base a las fracciones en peso de cada especie. Se puede modelar interactivamente en la pestaña <strong>Laboratorio</strong>.</p>
        `
    },
    {
        num: "Capítulo 08",
        title: "Procesamiento Industrial de Polímeros",
        snippet: "Reología de fundidos no newtonianos pseudoplásticos. Parámetros operativos y maquinaria industrial en extrusión e inyección.",
        eqTitle: "LEY DE POTENCIA PSEUDOPLÁSTICA",
        eqMath: "\\tau = K \\cdot \\dot{\\gamma}^n",
        content: `
            <h3>Reología de Fundidos</h3>
            <p>Los polímeros fundidos industriales son no newtonianos y altamente <strong>pseudoplásticos</strong> (shear-thinning), lo que significa que su viscosidad aparente cae drásticamente (varios órdenes de magnitud) a medida que aumenta la velocidad de deformación por cizalla ($\\dot{\\gamma}$). Esto se debe al desenredo conformacional y la alineación de cadenas en canales de flujo.</p>
            
            <h3>Técnicas de Manufactura</h3>
            <ul class="modal-bullet-list">
                <li><strong>Extrusión:</strong> Proceso continuo donde un husillo helicoidal empuja el material fundido a través de una boquilla perfilada para fabricar tubos, perfiles, láminas y filamentos.</li>
                <li><strong>Inyección:</strong> Proceso cíclico de alta presión donde el polímero fundido se inyecta en un molde cerrado y refrigerado, ideal para formas de alta complejidad geométrica.</li>
                <li><strong>Soplado:</strong> Utilizado para producir envases huecos (botellas) a partir de una preforma fundida estirada con aire comprimido.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 09",
        title: "Polímeros Termoplásticos",
        snippet: "Detalles químicos, propiedades estructurales y aplicaciones de los plásticos de gran consumo (commodities) y de ingeniería avanzados.",
        eqTitle: "UNIDAD DE REPETICIÓN DEL PP",
        eqMath: "[-CH_2-CH(CH_3)-]_n",
        content: `
            <h3>Polímeros Commodities (Consumo Masivo)</h3>
            <ul class="modal-bullet-list">
                <li><strong>Polietileno (PE):</strong> Alta flexibilidad y tenacidad. Presentado como HDPE (altamente lineal, alta cristalinidad) y LDPE (altamente ramificado, amorfo y flexible).</li>
                <li><strong>Polipropileno (PP):</strong> Excelente resistencia a la fatiga mecánica (bisagras integradas) y alta rigidez química.</li>
                <li><strong>Policloruro de Vinilo (PVC):</strong> Rigidez sobresaliente e ignífugo por su contenido de cloro elemental. Requiere plastificantes (ftalatos) para volverse flexible.</li>
            </ul>

            <h3>Plásticos de Ingeniería y Alta Temperatura</h3>
            <ul class="modal-bullet-list">
                <li><strong>Poliamidas (Nailon 6,6):</strong> Enlaces puente de hidrógeno que otorgan alta resistencia al desgaste y fricción.</li>
                <li><strong>Polieteretercetona (PEEK):</strong> Polímero semicristalino aromático de ultra-alto rendimiento térmico ($T_m > 340^\\circ\\text{C}$), ideal para sustitución metálica en implantes biomédicos y sector aeroespacial.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 10",
        title: "Polímeros Termoestables",
        snippet: "Resinas termoestables complejas. Mecanismos de reticulación (curado) y la teoría estadística de gelificación de Flory-Stockmayer.",
        eqTitle: "GELIFICACIÓN DE FLORY-STOCKMAYER",
        eqMath: "p_c = \\frac{1}{f - 1}",
        content: `
            <h3>Morfología y Reacción Termoestable</h3>
            <p>Los termoestables son sistemas líquidos de baja viscosidad reactivos que mediante calor o catalizadores forman una red espacial tridimensional insoluble e infusible mediante el proceso de curado químico.</p>
            
            <h3>Mecanismo y Punto de Gel ($p_c$)</h3>
            <p>A medida que progresa la reacción covalente, se llega a una conversión crítica ($p_c$) conocida como el <strong>punto de gel</strong>. En este instante geométrico exacto, se forma una única molécula de dimensión gigante que abarca todo el recipiente (red infinita).</p>
            <p>La viscosidad tiende a infinito y la solubilidad se desploma a cero. La teoría de Flory-Stockmayer predice con precisión este umbral a partir de la funcionalidad molecular ($f$) de los monómeros implicados.</p>
        `
    },
    {
        num: "Capítulo 11",
        title: "Elastómeros y Elasticidad del Caucho",
        snippet: "Elastómeros estructurados, la vulcanización del caucho natural y la fundamentación entrópica de la ecuación de estado elástica.",
        eqTitle: "FUERZA ELÁSTICA ENTRÓPICA",
        eqMath: "f = n R T ( \\lambda - \\frac{1}{\\lambda^2} )",
        content: `
            <h3>Naturaleza del Comportamiento Elastómero</h3>
            <p>Los elastómeros son sólidos macromoleculares que pueden sufrir deformaciones mecánicas reversibles masivas (mayores al 500-1000%) sin deformación plástica permanente.</p>
            
            <h3>Termodinámica de la Elasticidad del Caucho</h3>
            <p>A diferencia de los metales, que almacenan energía elástica mediante aumento de energía interna por distorsión de enlaces cristalinos (elasticidad energética), el caucho ideal funciona exclusivamente por **elasticidad entrópica**:</p>
            <ul class="modal-bullet-list">
                <li>Al estirar un elastómero, las cadenas orientadas reducen drásticamente sus conformaciones posibles (disminuye la entropía, $\\Delta S < 0$).</li>
                <li>La fuerza restauradora que hace volver al caucho a su estado inicial es el impulso termodinámico natural de recuperar la máxima entropía y el desorden conformacional.</li>
                <li><strong>Efecto térmico singular:</strong> Un elastómero bajo tensión constante se contrae al calentarse, en lugar de dilatarse.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 12",
        title: "Materiales Compuestos Reforzados",
        snippet: "Fibras de refuerzo estructuradas (carbono, aramida, vidrio). Ecuaciones mecánicas del modelo de Voigt e isodeformaciones.",
        eqTitle: "MÓDULO COMPUESTO (MODELO DE VOIGT)",
        eqMath: "E_c = E_f V_f + E_m V_m",
        content: `
            <h3>Diseño de Materiales Compuestos</h3>
            <p>Constituidos por dos componentes distinguibles a escala microscópica:</p>
            <ul class="modal-bullet-list">
                <li><strong>Fase Dispersa (Refuerzo):</strong> Fibras de alta rigidez y resistencia mecánica específica (ej. carbono, vidrio, Kevlar).</li>
                <li><strong>Fase Continua (Matriz):</strong> Polímeros termoplásticos o termoestables encargados de transmitir los esfuerzos a las fibras y protegerlas del entorno.</li>
            </ul>

            <h3>Ecuaciones de Predicción Mecánica (Micromecánica)</h3>
            <ul class="modal-bullet-list">
                <li><strong>Modelo de Voigt (Isodeformación):</strong> Supone una configuración longitudinal paralela donde las fibras y la matriz se deforman la misma cantidad. Predice la rigidez longitudinal óptima de tracción.</li>
                <li><strong>Modelo de Reuss (Isoesfuerzo):</strong> Configuración transversal en serie donde las fases experimentan el mismo esfuerzo.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 13",
        title: "Aplicaciones Industriales Avanzadas y de Ingeniería",
        snippet: "Materiales avanzados en sectores aeroespacial, biomédico y automotriz. Polímeros conductores y membranas barrera funcionales.",
        eqTitle: "CONDUCTIVIDAD EN POLIACETILENO DOPADO",
        eqMath: "\\sigma \\propto [A^-] \\cdot e^{-\\frac{E_a}{k_B T}}",
        content: `
            <h3>Sectores Tecnológicos Críticos</h3>
            <ul class="modal-bullet-list">
                <li><strong>Sustitución de Metales en Automoción:</strong> Uso de poliamidas reforzadas en colectores de admisión y carcasas para aligerar peso y reducir emisiones de combustible.</li>
                <li><strong>Barrera Funcional en Empaques:</strong> Películas multicapa coextruidas con alcohol etilenvinílico (EVOH) que bloquean la difusión de gases de oxígeno, preservando alimentos por periodos prolongados.</li>
                <li><strong>Aplicaciones Eléctricas / Electrónicas:</strong> Polímeros conjugados conductores intrínsecos (ej. polianilina, poliacetileno dopado químicamente) para blindaje electromagnético y pantallas OLED de tecnología flexible.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 14",
        title: "Impacto Ambiental de los Polímeros",
        snippet: "Análisis ecológico de la persistencia de enlaces C-C. Definición científica e industrial de bioplásticos biodegradables y bio-basados.",
        eqTitle: "TIEMPO DE DEGRADACIÓN ESTIMADO",
        eqMath: "t_{deg} \\propto \\frac{1}{R_{hidrólisis}}",
        content: `
            <h3>El Desafío Ambiental</h3>
            <p>La inercia química que hace extraordinarios a los plásticos convencionales (PE, PP, PET) dificulta su asimilación biológica en el medio ambiente, donde los enlaces carbono-carbono lineales requieren cientos de años para degradarse por radiación UV y oxidación.</p>
            
            <h3>Clasificación de Bioplásticos</h3>
            <ul class="modal-bullet-list">
                <li><strong>Bio-basados (Origen renovable):</strong> Derivados de biomasa natural como caña de azúcar (Bio-PE). No son necesariamente biodegradables.</li>
                <li><strong>Biodegradables (Estructura asimilable):</strong> Estructuras susceptibles a hidrólisis química o ataque enzimático en compostaje industrial (ej. Ácido Poliláctico PLA, Polihidroxialcanoatos PHA).</li>
            </ul>
        `
    },
    {
        num: "Capítulo 15",
        title: "Tecnologías de Reciclaje y Gestión de Residuos",
        snippet: "Física y química detrás del reciclaje mecánico de plásticos mezclados. Procesos de reciclaje químico por solvólisis y pirólisis.",
        eqTitle: "ENTROPÍA DE MEZCLA DE PLÁSTICOS",
        eqMath: "\\Delta S_m \\approx 0",
        content: `
            <h3>Reciclaje Mecánico: Desafíos Termodinámicos</h3>
            <p>La mayor limitación del reciclaje mecánico es la **inmiscibilidad termodinámica** de la mayoría de plásticos debido a su bajísima entropía de mezcla. Mezclar PE y PP en un reciclaje convencional genera fases separadas débiles con propiedades mecánicas degradadas.</p>
            
            <h3>Reciclaje Químico (Despolimerización)</h3>
            <p>Procesos selectivos avanzados que revierten la reacción original para recuperar materias primas útiles:</p>
            <ul class="modal-bullet-list">
                <li><strong>Solvólisis (Hidrólisis, Glicólisis):</strong> Despolimeriza condesados moleculares (como PET, poliuretanos, nailon) para obtener monómeros de pureza idéntica a la virgen.</li>
                <li><strong>Pirólisis / Craqueo Térmico:</strong> Descompone térmicamente en atmósfera inerte poliolefinas (PE, PP) en gas sintético y aceites hidrocarburos combustibles.</li>
            </ul>
        `
    },
    {
        num: "Capítulo 16",
        title: "Tendencias Actuales de Investigación",
        snippet: "Redes covalentes dinámicas autorreparables mediante Diels-Alder y vitrímeros asociativos. Polímeros inteligentes e impresión 3D/4D.",
        eqTitle: "EQUILIBRIO DIELS-ALDER DINÁMICO",
        eqMath: "\\text{Furano} + \\text{Maleimida} \\rightleftharpoons \\text{Aducto}",
        content: `
            <h3>Materiales Covalentes Dinámicos</h3>
            <p>La nueva generación de polímeros busca romper la distinción clásica entre termoplásticos (moldeables pero mecánicamente más débiles) y termoestables (resistentes pero no reciclables):</p>
            <ul class="modal-bullet-list">
                <li><strong>Vitrímeros:</strong> Redes poliméricas que modifican su topología interna mediante reacciones de transesterificación dinámica con conservación del número de enlaces cruzados permanentes. Fluyen por viscosidad al calentarse sin perder resistencia estructural estructural.</li>
                <li><strong>Redes Autorreparables Diels-Alder:</strong> Aprovechan el equilibrio térmico reversible entre furanos y maleimidas para reparar grietas mecánicas aplicando calor local controlado.</li>
            </ul>
        `
    }
];

function initChapterBrowser() {
    const chaptersGrid = document.getElementById('chaptersGrid');
    const searchInput = document.getElementById('chapterSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const modal = document.getElementById('chapterModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!chaptersGrid) return;
    
    // Render Chapters Grid
    function renderChapters(filterText = "") {
        chaptersGrid.innerHTML = "";
        const query = filterText.toLowerCase().trim();
        
        const filtered = chaptersData.filter(ch => {
            return ch.title.toLowerCase().includes(query) || 
                   ch.num.toLowerCase().includes(query) ||
                   ch.snippet.toLowerCase().includes(query) ||
                   ch.content.toLowerCase().includes(query);
        });
        
        if (filtered.length === 0) {
            chaptersGrid.innerHTML = `
                <div class="no-results glass-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary);">
                    <i class="fa-solid fa-face-frown" style="font-size: 3rem; color: var(--accent-primary); margin-bottom: 16px; display: block;"></i>
                    <p style="font-family: var(--font-heading); font-weight:600; font-size:1.2rem;">No se encontraron capítulos</p>
                    <p style="font-size:0.9rem; margin-top:8px;">Prueba con otros términos de búsqueda como "viscoelástico", "Fox", "Carothers", "reología", etc.</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(ch => {
            const card = document.createElement('div');
            card.className = "chapter-card glass-card";
            card.innerHTML = `
                <div class="chapter-num">${ch.num}</div>
                <h3>${ch.title}</h3>
                <p class="chapter-snippet">${ch.snippet}</p>
                <div class="chapter-readmore">Leer más <i class="fa-solid fa-arrow-right-long"></i></div>
            `;
            
            card.addEventListener('click', () => openChapterModal(ch));
            chaptersGrid.appendChild(card);
        });
    }
    
    function openChapterModal(ch) {
        modalBody.innerHTML = `
            <div class="modal-header-area">
                <div class="modal-chapter-tag">${ch.num}</div>
                <h2>${ch.title}</h2>
            </div>
            ${ch.content}
            <div class="modal-eq-container">
                <div class="modal-eq-title">${ch.eqTitle}</div>
                <div class="modal-eq-math">${ch.eqMath}</div>
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = "hidden"; // Prevent scrolling behind
    }
    
    function closeChapterModal() {
        modal.classList.remove('active');
        document.body.style.overflow = "";
    }
    
    // Listeners
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        renderChapters(val);
        
        if (val.length > 0) {
            clearSearchBtn.style.display = "block";
        } else {
            clearSearchBtn.style.display = "none";
        }
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        renderChapters("");
        searchInput.focus();
    });
    
    closeModalBtn.addEventListener('click', closeChapterModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeChapterModal();
    });
    
    // Initial Render
    renderChapters();
}

/* ==========================================
   4. SIMULADORES CIENTÍFICOS (LAB VIRTUAL)
   ========================================== */
function initSimulators() {
    // Tabs switcher
    const tabBtns = document.querySelectorAll('.lab-tab-btn');
    const panels = document.querySelectorAll('.lab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Trigger recalculations on open to avoid SVG redraw issues
            if (targetId === 'sim-viscoelasticidad') updateViscoelasticity();
            if (targetId === 'sim-carothers') updateCarothers();
            if (targetId === 'sim-fox') updateFox();
        });
    });
    
    /* ------------------------------------------
       4.1 SIMULADOR DE VISCOELASTICIDAD
       ------------------------------------------ */
    const rheoModelRadios = document.getElementsByName('rheoModel');
    const paramE = document.getElementById('paramE');
    const paramEta = document.getElementById('paramEta');
    const paramInit = document.getElementById('paramInit');
    
    const valE = document.getElementById('valE');
    const valEta = document.getElementById('valEta');
    const valInit = document.getElementById('valInit');
    
    const viscoEq = document.getElementById('viscoEq');
    const viscoPlot = document.getElementById('viscoPlot');
    const schematicDisplay = document.getElementById('schematicDisplay');
    
    // SVG Schematics definitions
    const maxwellSvg = `
        <svg viewBox="0 0 400 100" width="100%" height="100%">
            <!-- Spring (Resorte) -->
            <path d="M 20,50 L 80,50 L 90,30 L 100,70 L 110,30 L 120,70 L 130,30 L 140,70 L 150,50 L 200,50" fill="none" stroke="var(--accent-primary)" stroke-width="3" />
            <text x="110" y="20" fill="var(--accent-primary)" font-family="var(--font-heading)" font-weight="600" font-size="14">Resorte (E)</text>
            <!-- Connector -->
            <line x1="200" y1="50" x2="230" y2="50" stroke="var(--text-secondary)" stroke-width="3" />
            <!-- Dashpot (Amortiguador) -->
            <path d="M 230,25 L 230,75 L 290,75 M 230,25 L 290,25 M 270,30 L 270,70 M 270,50 L 330,50" fill="none" stroke="var(--accent-secondary)" stroke-width="3" />
            <text x="260" y="20" fill="var(--accent-secondary)" font-family="var(--font-heading)" font-weight="600" font-size="14">Amortiguador (&eta;)</text>
            <!-- Outer Force -->
            <line x1="330" y1="50" x2="380" y2="50" stroke="var(--text-primary)" stroke-width="3" />
            <polygon points="380,50 370,45 370,55" fill="var(--text-primary)" />
        </svg>
    `;
    
    const kelvinSvg = `
        <svg viewBox="0 0 400 110" width="100%" height="100%">
            <!-- Left bar -->
            <line x1="20" y1="55" x2="60" y2="55" stroke="var(--text-primary)" stroke-width="3" />
            <line x1="60" y1="20" x2="60" y2="90" stroke="var(--text-secondary)" stroke-width="3" />
            <!-- Top Branch (Spring) -->
            <line x1="60" y1="20" x2="100" y2="20" stroke="var(--text-secondary)" stroke-width="3" />
            <path d="M 100,20 L 120,20 L 130,10 L 140,30 L 150,10 L 160,30 L 170,10 L 180,30 L 190,20 L 250,20" fill="none" stroke="var(--accent-primary)" stroke-width="3" />
            <text x="145" y="45" fill="var(--accent-primary)" font-family="var(--font-heading)" font-weight="600" font-size="14">Resorte (E)</text>
            <!-- Bottom Branch (Dashpot) -->
            <line x1="60" y1="90" x2="100" y2="90" stroke="var(--text-secondary)" stroke-width="3" />
            <path d="M 100,90 L 140,90 M 140,75 L 140,105 L 190,105 M 140,75 L 190,75 M 175,80 L 175,100 M 175,90 L 250,90" fill="none" stroke="var(--accent-secondary)" stroke-width="3" />
            <text x="145" y="70" fill="var(--accent-secondary)" font-family="var(--font-heading)" font-weight="600" font-size="14">Amortiguador (&eta;)</text>
            <!-- Right bar -->
            <line x1="250" y1="20" x2="250" y2="90" stroke="var(--text-secondary)" stroke-width="3" />
            <line x1="250" y1="55" x2="330" y2="55" stroke="var(--text-primary)" stroke-width="3" />
            <polygon points="330,55 320,50 320,60" fill="var(--text-primary)" />
        </svg>
    `;
    
    function updateViscoelasticity() {
        const isMaxwell = document.querySelector('input[name="rheoModel"]:checked').value === 'maxwell';
        const E = parseFloat(paramE.value);
        const eta = parseFloat(paramEta.value);
        const init = parseFloat(paramInit.value);
        
        // Update Labels
        valE.textContent = `${E} GPa`;
        valEta.textContent = `${eta} GPa·s`;
        valInit.textContent = init.toFixed(1);
        
        // Change schematic and formula text
        if (isMaxwell) {
            schematicDisplay.innerHTML = maxwellSvg;
            viscoEq.textContent = `\\sigma(t) = \\sigma_0 \\cdot e^{-\\frac{E}{\\eta} t} = ${init.toFixed(1)} \\cdot e^{-${(E/eta).toFixed(3)} t}`;
        } else {
            schematicDisplay.innerHTML = kelvinSvg;
            viscoEq.textContent = `\\epsilon(t) = \\frac{\\sigma_0}{E} \\cdot (1 - e^{-\\frac{E}{\\eta} t}) = \\frac{${init.toFixed(1)}}{${E}} \\cdot (1 - e^{-${(E/eta).toFixed(3)} t})`;
        }
        
        // Render Plot SVG
        drawViscoPlot(isMaxwell, E, eta, init);
    }
    
    function drawViscoPlot(isMaxwell, E, eta, init) {
        viscoPlot.innerHTML = "";
        
        const w = 600;
        const h = 350;
        const pad = 50;
        
        // Axis Lines
        const axes = document.createElementNS("http://www.w3.org/2000/svg", "g");
        axes.innerHTML = `
            <!-- Grid Lines -->
            <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <!-- Axis Labels -->
            <text x="${w/2}" y="${h - 10}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle">Tiempo (segundos)</text>
            <text x="15" y="${h/2}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle" transform="rotate(-90 15 ${h/2})">
                ${isMaxwell ? "Esfuerzo \\sigma(t) [MPa]" : "Deformación \\epsilon(t) [\\%]"}
            </text>
        `;
        viscoPlot.appendChild(axes);
        
        // Calculate curve path
        const maxTime = 10;
        let points = [];
        
        for (let i = 0; i <= 100; i++) {
            const t = (maxTime * i) / 100;
            let val = 0;
            if (isMaxwell) {
                // Relaxation: sigma(t) = sigma_0 * exp(-(E/eta)*t)
                val = init * Math.exp(-(E / eta) * t);
            } else {
                // Creep: epsilon(t) = (sigma_0/E) * (1 - exp(-(E/eta)*t))
                val = (init / E) * (1 - Math.exp(-(E / eta) * t));
            }
            
            // Map values to coordinates
            const x = pad + (t / maxTime) * (w - 2 * pad);
            // Height scale
            const maxVal = isMaxwell ? init * 1.1 : (init / 1) * 1.1; // scale height dynamically
            const y = h - pad - (val / (isMaxwell ? init : 1.5)) * (h - 2 * pad); // Normalized scale
            points.push(`${x},${y}`);
        }
        
        // Render Curve Path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${points.join(" L ")}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", isMaxwell ? "url(#cyanBlueGrad)" : "url(#emeraldGrad)");
        path.setAttribute("stroke-width", "4");
        path.setAttribute("class", "plot-curve-animation");
        
        // SVG Gradients
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `
            <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f2fe" />
                <stop offset="100%" stop-color="#4facfe" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="100%" stop-color="#059669" />
            </linearGradient>
        `;
        
        viscoPlot.appendChild(defs);
        viscoPlot.appendChild(path);
        
        // Add curve label
        const curveLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        curveLabel.setAttribute("x", `${w - 180}`);
        curveLabel.setAttribute("y", `${pad + 30}`);
        curveLabel.setAttribute("fill", isMaxwell ? "#00f2fe" : "#10b981");
        curveLabel.setAttribute("font-family", "var(--font-heading)");
        curveLabel.setAttribute("font-weight", "600");
        curveLabel.setAttribute("font-size", "14");
        curveLabel.textContent = isMaxwell ? "Curva de Relajación" : "Curva de Creep/Fluencia";
        viscoPlot.appendChild(curveLabel);
    }
    
    // Attach listeners for Viscoelasticity
    rheoModelRadios.forEach(radio => radio.addEventListener('change', updateViscoelasticity));
    paramE.addEventListener('input', updateViscoelasticity);
    paramEta.addEventListener('input', updateViscoelasticity);
    paramInit.addEventListener('input', updateViscoelasticity);
    
    /* ------------------------------------------
       4.2 CALCULADORA DE CAROTHERS
       ------------------------------------------ */
    const paramP = document.getElementById('paramP');
    const paramR = document.getElementById('paramR');
    const valP = document.getElementById('valP');
    const valR = document.getElementById('valR');
    const resXn = document.getElementById('resXn');
    const resLength = document.getElementById('resLength');
    const carothersPlot = document.getElementById('carothersPlot');
    
    function updateCarothers() {
        const p = parseFloat(paramP.value);
        const r = parseFloat(paramR.value);
        
        // Update labels
        valP.textContent = `${p.toFixed(3)} (${(p * 100).toFixed(1)}%)`;
        valR.textContent = `${r.toFixed(2)} ${r === 1 ? '(Perfecta)' : '(Desbalanceada)'}`;
        
        // Calculate X_n = (1 + r) / (1 + r - 2*r*p)
        const Xn = (1 + r) / (1 + r - 2 * r * p);
        resXn.textContent = Xn.toFixed(1);
        
        // Category description based on chain length
        if (Xn < 10) {
            resLength.textContent = "Oligómero Corto (Bajas prop. mecánicas)";
            resLength.style.color = "var(--text-muted)";
        } else if (Xn < 30) {
            resLength.textContent = "Macromolécula Corta / Resina Cera";
            resLength.style.color = "var(--accent-secondary)";
        } else if (Xn < 100) {
            resLength.textContent = "Polímero Comercial (Apto para manufactura)";
            resLength.style.color = "var(--accent-tertiary)";
        } else {
            resLength.textContent = "Ultra Alto Peso Molecular (Alta resistencia)";
            resLength.style.color = "var(--accent-primary)";
        }
        
        drawCarothersPlot(p, r, Xn);
    }
    
    function drawCarothersPlot(currentP, r, currentXn) {
        carothersPlot.innerHTML = "";
        const w = 600;
        const h = 350;
        const pad = 50;
        
        // Axes
        const axes = document.createElementNS("http://www.w3.org/2000/svg", "g");
        axes.innerHTML = `
            <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <text x="${w/2}" y="${h - 10}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle">Conversión de grupos reactivos (p)</text>
            <text x="15" y="${h/2}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle" transform="rotate(-90 15 ${h/2})">Grado de Polimerización (Xn)</text>
        `;
        carothersPlot.appendChild(axes);
        
        // Draw Curve
        const points = [];
        const startP = 0.80;
        const endP = 0.999;
        const maxScaleXn = 200; // max scale to display
        
        for (let i = 0; i <= 100; i++) {
            const pVal = startP + (i * (endP - startP)) / 100;
            const XnVal = (1 + r) / (1 + r - 2 * r * pVal);
            
            const x = pad + ((pVal - startP) / (endP - startP)) * (w - 2 * pad);
            const cappedVal = Math.min(XnVal, maxScaleXn);
            const y = h - pad - (cappedVal / maxScaleXn) * (h - 2 * pad);
            
            points.push(`${x},${y}`);
        }
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${points.join(" L ")}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "rgba(0, 242, 254, 0.4)");
        path.setAttribute("stroke-width", "3");
        carothersPlot.appendChild(path);
        
        // Highlight Current position dot
        const dotX = pad + ((currentP - startP) / (endP - startP)) * (w - 2 * pad);
        const cappedCurrentXn = Math.min(currentXn, maxScaleXn);
        const dotY = h - pad - (cappedCurrentXn / maxScaleXn) * (h - 2 * pad);
        
        const glowDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        glowDot.setAttribute("cx", dotX);
        glowDot.setAttribute("cy", dotY);
        glowDot.setAttribute("r", "12");
        glowDot.setAttribute("fill", "rgba(0, 242, 254, 0.25)");
        glowDot.innerHTML = `<animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />`;
        carothersPlot.appendChild(glowDot);
        
        const coreDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        coreDot.setAttribute("cx", dotX);
        coreDot.setAttribute("cy", dotY);
        coreDot.setAttribute("r", "6");
        coreDot.setAttribute("fill", "var(--accent-primary)");
        carothersPlot.appendChild(coreDot);
        
        // Coordinates text
        const coordText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        coordText.setAttribute("x", `${dotX + 12}`);
        coordText.setAttribute("y", `${dotY - 12}`);
        coordText.setAttribute("fill", "var(--accent-primary)");
        coordText.setAttribute("font-family", "var(--font-heading)");
        coordText.setAttribute("font-weight", "700");
        coordText.setAttribute("font-size", "13");
        coordText.textContent = `Xn = ${currentXn.toFixed(1)} (p=${currentP.toFixed(3)})`;
        carothersPlot.appendChild(coordText);
    }
    
    // Attach listeners for Carothers
    paramP.addEventListener('input', updateCarothers);
    paramR.addEventListener('input', updateCarothers);
    
    /* ------------------------------------------
       4.3 CALCULADORA DE LA ECUACIÓN DE FOX
       ------------------------------------------ */
    const paramTg1 = document.getElementById('paramTg1');
    const paramTg2 = document.getElementById('paramTg2');
    const paramW1 = document.getElementById('paramW1');
    const valTg1 = document.getElementById('valTg1');
    const valTg2 = document.getElementById('valTg2');
    const valW1 = document.getElementById('valW1');
    const resTg = document.getElementById('resTg');
    const resState = document.getElementById('resState');
    const foxPlot = document.getElementById('foxPlot');
    
    function updateFox() {
        const Tg1_C = parseFloat(paramTg1.value);
        const Tg2_C = parseFloat(paramTg2.value);
        const w1 = parseFloat(paramW1.value);
        const w2 = 1.0 - w1;
        
        // Convert to Kelvin
        const Tg1_K = Tg1_C + 273.15;
        const Tg2_K = Tg2_C + 273.15;
        
        // Update Labels
        valTg1.textContent = `${Tg1_C} °C (${Tg1_K.toFixed(1)} K)`;
        valTg2.textContent = `${Tg2_C} °C (${Tg2_K.toFixed(1)} K)`;
        valW1.textContent = `${w1.toFixed(2)} (${(w1 * 100).toFixed(0)}%)`;
        
        // Calculate copolymer Tg = 1 / (w1/Tg1 + w2/Tg2)
        const inverseTg = (w1 / Tg1_K) + (w2 / Tg2_K);
        const copolymerTg_K = 1 / inverseTg;
        const copolymerTg_C = copolymerTg_K - 273.15;
        
        resTg.textContent = `${copolymerTg_C.toFixed(1)} °C`;
        
        // Phase/State at room temperature (25°C)
        if (copolymerTg_C > 25) {
            resState.textContent = "Vidrio Duro / Plástico Rígido";
            resState.style.color = "var(--accent-secondary)";
        } else {
            resState.textContent = "Gomoso Flexible / Elastómero";
            resState.style.color = "var(--accent-tertiary)";
        }
        
        drawFoxPlot(Tg1_K, Tg2_K, w1, copolymerTg_K);
    }
    
    function drawFoxPlot(Tg1_K, Tg2_K, currentW1, currentTg_K) {
        foxPlot.innerHTML = "";
        const w = 600;
        const h = 350;
        const pad = 50;
        
        // Axes
        const axes = document.createElementNS("http://www.w3.org/2000/svg", "g");
        axes.innerHTML = `
            <line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="var(--border-color)" stroke-width="2" />
            <text x="${w/2}" y="${h - 10}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle">Fracción en peso w₁ (Homopolímero 1)</text>
            <text x="15" y="${h/2}" fill="var(--text-secondary)" font-family="var(--font-heading)" font-size="14" text-anchor="middle" transform="rotate(-90 15 ${h/2})">Temperatura de Transición Tg [°C]</text>
        `;
        foxPlot.appendChild(axes);
        
        // Plot curves
        const points = [];
        const maxTg = Math.max(Tg1_K, Tg2_K);
        const minTg = Math.min(Tg1_K, Tg2_K);
        const margin = Math.abs(maxTg - minTg) * 0.1 || 20;
        
        const scaleMaxK = maxTg + margin;
        const scaleMinK = minTg - margin;
        
        for (let i = 0; i <= 100; i++) {
            const w1Val = i / 100;
            const w2Val = 1.0 - w1Val;
            const tempTg_K = 1 / ((w1Val / Tg1_K) + (w2Val / Tg2_K));
            
            const x = pad + w1Val * (w - 2 * pad);
            const y = h - pad - ((tempTg_K - scaleMinK) / (scaleMaxK - scaleMinK)) * (h - 2 * pad);
            
            points.push(`${x},${y}`);
        }
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${points.join(" L ")}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "var(--border-hover)");
        path.setAttribute("stroke-width", "3");
        foxPlot.appendChild(path);
        
        // Highlight Current position dot
        const dotX = pad + currentW1 * (w - 2 * pad);
        const dotY = h - pad - ((currentTg_K - scaleMinK) / (scaleMaxK - scaleMinK)) * (h - 2 * pad);
        
        const glowDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        glowDot.setAttribute("cx", dotX);
        glowDot.setAttribute("cy", dotY);
        glowDot.setAttribute("r", "12");
        glowDot.setAttribute("fill", "rgba(59, 130, 246, 0.25)");
        glowDot.innerHTML = `<animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />`;
        foxPlot.appendChild(glowDot);
        
        const coreDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        coreDot.setAttribute("cx", dotX);
        coreDot.setAttribute("cy", dotY);
        coreDot.setAttribute("r", "6");
        coreDot.setAttribute("fill", "var(--accent-primary)");
        foxPlot.appendChild(coreDot);
        
        // Coordinates text
        const coordText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        coordText.setAttribute("x", `${dotX + 12}`);
        coordText.setAttribute("y", `${dotY - 12}`);
        coordText.setAttribute("fill", "var(--text-primary)");
        coordText.setAttribute("font-family", "var(--font-heading)");
        coordText.setAttribute("font-weight", "700");
        coordText.setAttribute("font-size", "13");
        coordText.textContent = `Tg = ${(currentTg_K - 273.15).toFixed(1)} °C`;
        foxPlot.appendChild(coordText);
    }
    
    // Attach listeners for Fox
    paramTg1.addEventListener('input', updateFox);
    paramTg2.addEventListener('input', updateFox);
    paramW1.addEventListener('input', updateFox);
    
    // Initialize first recalculation calls
    updateViscoelasticity();
    updateCarothers();
    updateFox();
}

/* ==========================================
   5. GALERÍA DE ESTRUCTURAS QUÍMICAS
   ========================================== */
const polymerGalleryData = [
    {
        id: "pe",
        name: "Polietileno",
        abbr: "PE",
        type: "Termoplástico Commodity",
        desc: "El polímero sintético más consumido del planeta, compuesto por unidades lineales de etileno. Excelente resistencia dieléctrica y tenacidad mecánica excepcional.",
        ucr: "[-CH₂-CH₂-]_n",
        application: "Bolsas plásticas, envases (HDPE), cables aislantes, películas elásticas agrícolas (LDPE).",
        glassTemp: "-120 °C",
        meltTemp: "115 - 135 °C",
        svgMarkup: `
            <svg class="structure-svg" viewBox="0 0 200 100">
                <!-- Polymer Chain Backbone -->
                <line x1="20" y1="50" x2="60" y2="30" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="60" y1="30" x2="100" y2="70" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="100" y1="70" x2="140" y2="30" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
                <line x1="140" y1="30" x2="180" y2="50" stroke="var(--text-primary)" stroke-width="4" stroke-linecap="round"/>
                
                <!-- Atom Label Tags -->
                <circle cx="60" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="60" y="34" fill="var(--text-primary)" font-family="var(--font-heading)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <circle cx="100" cy="70" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="100" y="74" fill="var(--text-primary)" font-family="var(--font-heading)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <circle cx="140" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="140" y="34" fill="var(--text-primary)" font-family="var(--font-heading)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <!-- Repeating bracket indicators -->
                <line x1="45" y1="20" x2="45" y2="80" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <line x1="155" y1="20" x2="155" y2="80" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <text x="160" y="85" fill="var(--accent-secondary)" font-family="var(--font-heading)" font-weight="bold" font-size="14">n</text>
            </svg>
        `
    },
    {
        id: "pp",
        name: "Polipropileno",
        abbr: "PP",
        type: "Termoplástico Commodity",
        desc: "Polímero semicristalino muy rígido con bajísima densidad. Famoso por su insuperable resistencia a la fatiga mecánica por flexión repetida.",
        ucr: "[-CH₂-CH(CH₃)-]_n",
        application: "Bisagras integrales, autopartes, jeringas médicas, envases aptos para microondas, textiles sintéticos.",
        glassTemp: "-10 °C",
        meltTemp: "160 - 170 °C",
        svgMarkup: `
            <svg class="structure-svg" viewBox="0 0 200 100">
                <line x1="20" y1="50" x2="60" y2="30" stroke="var(--text-primary)" stroke-width="4"/>
                <line x1="60" y1="30" x2="100" y2="70" stroke="var(--text-primary)" stroke-width="4"/>
                <!-- Branch to Methyl group -->
                <line x1="100" y1="70" x2="100" y2="10" stroke="var(--accent-secondary)" stroke-width="3"/>
                <line x1="100" y1="70" x2="140" y2="30" stroke="var(--text-primary)" stroke-width="4"/>
                <line x1="140" y1="30" x2="180" y2="50" stroke="var(--text-primary)" stroke-width="4"/>
                
                <circle cx="60" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="60" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <circle cx="100" cy="70" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="100" y="74" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH</text>
                
                <circle cx="100" cy="10" r="12" fill="var(--bg-primary)" stroke="var(--accent-secondary)" stroke-width="2"/>
                <text x="100" y="14" fill="var(--accent-secondary)" font-size="10" font-weight="bold" text-anchor="middle">CH₃</text>
                
                <circle cx="140" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="140" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <line x1="45" y1="15" x2="45" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <line x1="155" y1="15" x2="155" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <text x="160" y="90" fill="var(--accent-secondary)" font-weight="bold" font-size="14">n</text>
            </svg>
        `
    },
    {
        id: "pvc",
        name: "Policloruro de Vinilo",
        abbr: "PVC",
        type: "Termoplástico Commodity",
        desc: "Polímero muy rígido e ignífugo por su alto contenido de cloro intrínseco. Altamente versátil, pudiéndose volver gomoso mediante plastificantes.",
        ucr: "[-CH₂-CH(Cl)-]_n",
        application: "Tuberías sanitarias, aislantes eléctricos, perfiles de ventanas, cuero sintético, bolsas de suero médico.",
        glassTemp: "81 °C",
        meltTemp: "180 - 210 °C (Con descomposición térmica)",
        svgMarkup: `
            <svg class="structure-svg" viewBox="0 0 200 100">
                <line x1="20" y1="50" x2="60" y2="30" stroke="var(--text-primary)" stroke-width="4"/>
                <line x1="60" y1="30" x2="100" y2="70" stroke="var(--text-primary)" stroke-width="4"/>
                <!-- Branch to Chlorine -->
                <line x1="100" y1="70" x2="100" y2="10" stroke="var(--accent-tertiary)" stroke-width="3"/>
                <line x1="100" y1="70" x2="140" y2="30" stroke="var(--text-primary)" stroke-width="4"/>
                <line x1="140" y1="30" x2="180" y2="50" stroke="var(--text-primary)" stroke-width="4"/>
                
                <circle cx="60" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="60" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <circle cx="100" cy="70" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="100" y="74" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH</text>
                
                <circle cx="100" cy="10" r="12" fill="var(--bg-primary)" stroke="var(--accent-tertiary)" stroke-width="2"/>
                <text x="100" y="14" fill="var(--accent-tertiary)" font-size="10" font-weight="bold" text-anchor="middle">Cl</text>
                
                <circle cx="140" cy="30" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="140" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">CH₂</text>
                
                <line x1="45" y1="15" x2="45" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <line x1="155" y1="15" x2="155" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <text x="160" y="90" fill="var(--accent-secondary)" font-weight="bold" font-size="14">n</text>
            </svg>
        `
    },
    {
        id: "nylon",
        name: "Nailon 6,6",
        abbr: "PA 6,6",
        type: "Termoplástico de Ingeniería",
        desc: "Poliamida semicristalina fabricada por policondensación de hexametilendiamina y ácido adípico. Presenta enlaces de hidrógeno fortísimos entre cadenas moleculares.",
        ucr: "[-NH-(CH₂)₆-NH-CO-(CH₂)₄-CO-]_n",
        application: "Engranajes industriales autolubricados, cuerdas de alta resistencia, medias finas, cerdas, partes de motores.",
        glassTemp: "50 °C",
        meltTemp: "265 °C",
        svgMarkup: `
            <svg class="structure-svg" viewBox="0 0 200 100">
                <!-- Amide linkage backbone -->
                <path d="M 10,50 L 35,30 L 70,55 L 90,30 L 125,50 L 145,25 L 180,50" fill="none" stroke="var(--text-primary)" stroke-width="4"/>
                <line x1="145" y1="25" x2="145" y2="70" stroke="var(--accent-secondary)" stroke-width="4"/>
                
                <circle cx="35" cy="30" r="12" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="35" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">NH</text>
                
                <circle cx="70" cy="55" r="13" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="70" y="59" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">(CH₂)₆</text>
                
                <circle cx="90" cy="30" r="12" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="90" y="34" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">NH</text>
                
                <circle cx="125" cy="50" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="125" y="54" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">C</text>
                
                <circle cx="145" cy="70" r="10" fill="var(--bg-primary)" stroke="var(--accent-secondary)" stroke-width="2"/>
                <text x="145" y="74" fill="var(--accent-secondary)" font-size="10" font-weight="bold" text-anchor="middle">O</text>
                
                <line x1="20" y1="15" x2="20" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <line x1="165" y1="15" x2="165" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <text x="170" y="90" fill="var(--accent-secondary)" font-weight="bold" font-size="14">n</text>
            </svg>
        `
    },
    {
        id: "peek",
        name: "Polieteretercetona",
        abbr: "PEEK",
        type: "Polímero de Alto Rendimiento",
        desc: "Termoplástico aromático lineal de alta cristalinidad con excelente rigidez mecánica y química excepcional a temperaturas extremas de más de 250°C.",
        ucr: "[-O-C₆H₄-O-C₆H₄-CO-C₆H₄-]_n",
        application: "Industria aeroespacial, prótesis óseas y espinales, automoción de competición, conectores eléctricos submarinos.",
        glassTemp: "143 °C",
        meltTemp: "343 °C",
        svgMarkup: `
            <svg class="structure-svg" viewBox="0 0 200 100">
                <!-- Rings and oxygen connections -->
                <path d="M 10,50 Q 25,30 40,50 T 70,50 T 100,50 T 130,50 T 160,50 T 190,50" fill="none" stroke="var(--text-primary)" stroke-width="4"/>
                
                <circle cx="40" cy="50" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="40" y="54" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">O</text>
                
                <circle cx="85" cy="50" r="12" fill="var(--bg-primary)" stroke="var(--accent-secondary)" stroke-width="2"/>
                <text x="85" y="54" fill="var(--accent-secondary)" font-size="9" font-weight="bold" text-anchor="middle">C₆H₄</text>
                
                <circle cx="130" cy="50" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" stroke-width="2"/>
                <text x="130" y="54" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">O</text>
                
                <circle cx="165" cy="50" r="12" fill="var(--bg-primary)" stroke="var(--accent-secondary)" stroke-width="2"/>
                <text x="165" y="54" fill="var(--accent-secondary)" font-size="9" font-weight="bold" text-anchor="middle">C₆H₄</text>
                
                <line x1="20" y1="15" x2="20" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <line x1="180" y1="15" x2="180" y2="85" stroke="var(--accent-secondary)" stroke-dasharray="3" stroke-width="2"/>
                <text x="185" y="90" fill="var(--accent-secondary)" font-weight="bold" font-size="14">n</text>
            </svg>
        `
    }
];

function initPolymerGallery() {
    const polymerList = document.getElementById('polymerList');
    const polymerShowcase = document.getElementById('polymerShowcase');
    
    if (!polymerList || !polymerShowcase) return;
    
    function renderSidebar() {
        polymerList.innerHTML = "";
        polymerGalleryData.forEach((poly, index) => {
            const btn = document.createElement('button');
            btn.className = `poly-btn ${index === 0 ? 'active' : ''}`;
            btn.setAttribute('data-id', poly.id);
            btn.innerHTML = `
                <span class="poly-name">${poly.name}</span>
                <span class="poly-type">${poly.type}</span>
            `;
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.poly-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderShowcase(poly);
            });
            
            polymerList.appendChild(btn);
        });
    }
    
    function renderShowcase(poly) {
        polymerShowcase.style.opacity = "0";
        setTimeout(() => {
            polymerShowcase.innerHTML = `
                <div class="showcase-header">
                    <div class="showcase-title-area">
                        <div class="badge"><i class="fa-solid fa-shapes"></i> ESTRUCTURA MOLECULAR</div>
                        <h3>${poly.name}</h3>
                        <p style="color:var(--text-secondary); font-size:0.9rem;">${poly.type}</p>
                    </div>
                    <div class="showcase-abbr">${poly.abbr}</div>
                </div>
                
                <div class="showcase-grid">
                    <div class="structure-box">
                        <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px;">Unidad Constitucional Repetitiva (UCR)</h4>
                        ${poly.svgMarkup}
                        <div style="font-family:var(--font-heading); font-weight:700; color:var(--accent-primary); font-size:1.15rem; margin-top:14px;">${poly.ucr}</div>
                    </div>
                    <div class="details-box">
                        <div class="detail-item">
                            <h4>Descripción Química</h4>
                            <p>${poly.desc}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Propiedades Térmicas Clave</h4>
                            <p><strong>Temp. Transición Vítrea (Tg):</strong> ${poly.glassTemp} | <strong>Temp. Fusión (Tm):</strong> ${poly.meltTemp}</p>
                        </div>
                        <div class="detail-item">
                            <h4>Aplicaciones Comunes</h4>
                            <p>${poly.application}</p>
                        </div>
                    </div>
                </div>
            `;
            polymerShowcase.style.opacity = "1";
        }, 150);
    }
    
    // Initial Render
    renderSidebar();
    renderShowcase(polymerGalleryData[0]);
}
