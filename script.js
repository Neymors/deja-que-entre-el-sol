// ===============================
//      HELPER FUNCTIONS
// ===============================

/**
 * Actualiza el contenido de un elemento HTML con un nuevo valor,
 * aplicando una animación 'flip' solo si el valor cambia.
 * @param {HTMLElement} elemento - El elemento HTML a actualizar.
 * @param {string|number} nuevoValor - El nuevo valor para el elemento.
 */
function actualizarValor(elemento, nuevoValor) {
    if (!elemento) return; // Salir si el elemento no existe
    const valorActual = elemento.textContent;
    const valorString = nuevoValor.toString();

    // Solo actualizar y animar si el valor es diferente
    if (valorActual !== valorString) {
        elemento.textContent = valorString;
        // Reiniciar la animación eliminando y volviendo a añadir la clase
        elemento.classList.remove('flip');
        // Forzar reflow para reiniciar la animación (truco común)
        void elemento.offsetWidth;
        elemento.classList.add('flip');
    }
}


const API_KEY = "AIzaSyDYXm_dC7iYFf6qjnhGO9GQrtgLuFSREAU"; // Reemplaza con tu clave de API
const CHANNEL_ID = "UCvCTWHCbBC0b9UIeLeNs8ug"; // ID del canal de Vorterix
const QUERY = "Dejaqueentreelsol"; // Palabra clave para filtrar videos

async function cargarVideos() {
    try {
        const maxResults = 50; // Número máximo de resultados por página
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&q=${QUERY}&part=snippet&type=video&maxResults=50`);
        const data = await response.json();
        const videoContainer = document.querySelector(".video-gallery") // CORREGIDO: Sin el punto

        videoContainer.innerHTML = ""; // Limpia el contenido anterior
        // Filtrar manualmente los videos que contengan AMBAS palabras clave
        const videosOrdenados = data.items.map(video => {
            const titulo = video.snippet.title;
            const fechaMatch = titulo.match(/(\d{2})\/(\d{2})/); // Busca la fecha en el formato "DD/MM"
            if (fechaMatch) {
                return {
                    ...video,
                    fecha: new Date(2025, parseInt(fechaMatch[2]) - 1, parseInt(fechaMatch[1])) // Año manual para evitar errores
                };
            }
            return video; // Si no hay fecha, dejarlo sin cambios
        }).filter(video => video.fecha) // Excluir los videos sin fecha
            .sort((a, b) => b.fecha - a.fecha); // Ordenar por fecha más reciente primero
        videosOrdenados.forEach(video => {
            const videoElement = document.createElement("div");
            videoElement.classList.add("video-item"); // Agrega la clase CSS
            videoElement.innerHTML = `<a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank"><img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}"><p>${video.snippet.title}</p></a>`;
            videoContainer.appendChild(videoElement);
        });
        nextPageToken = data.nextPageToken; // Guardar el token de la siguiente página
    } catch (error) {
        console.error("Error:", error);
    }
}

// Cargar los videos cuando la página esté lista
document.addEventListener("DOMContentLoaded", cargarVideos);
// 💡 Verifica cada hora si ya pasó la 1:30 PM ARG para consultar la API automáticamente
function iniciarConsultaDiaria() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();

    console.log(`Revisando... hora actual: ${horaActual}:${minutosActuales}`);

    if (horaActual >= 13 && minutosActuales >= 10) {
        cargarVideos(); // Llama a la API después de la 1:10 PM
    } else {
        console.log("Aún no es hora de consultar la API.");
    }
}

// 🚀 Ejecuta la función cada hora
setInterval(iniciarConsultaDiaria, 3600000);


// ===============================
//      DOM MANIPULATION & EVENT LISTENERS
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // --- Dark Mode ---
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Aplicar modo oscuro si está guardado en localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        body.classList.add("dark-mode");
    }

    // Listener para el botón de modo oscuro
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            body.classList.add("dark-mode-animating"); // Añadir clase para animación
            body.classList.toggle("dark-mode");

            // Guardar preferencia
            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
            } else {
                localStorage.setItem("dark-mode", "disabled");
            }

            // Quitar clase de animación después de que termine
            setTimeout(() => {
                body.classList.remove("dark-mode-animating");
            }, 700); // Duración de la animación CSS
        });
    }

    // --- Menu Toggle (Logo Click) & Navbar Scroll ---
    const logoToggle = document.getElementById("logoMenuToggle");
    const menu = document.getElementById("menu");
    const navbar = document.querySelector(".navbar");
    let lastScrollPosition = window.pageYOffset;

    // Listener para el clic en el logo (botón de menú)
    if (logoToggle && menu) {
        logoToggle.addEventListener("click", function (event) {
            event.stopPropagation(); // Evita que el clic se propague al document
            menu.classList.toggle("active");
            // Opcional: añadir/quitar clase a la navbar para indicar menú abierto
            navbar.classList.toggle('menu-is-open');
        });

        // Cerrar menú si se hace clic fuera de él o del logo
        document.addEventListener("click", function (event) {
            if (menu.classList.contains("active") && !menu.contains(event.target) && !logoToggle.contains(event.target)) {
                menu.classList.remove("active");
                navbar.classList.remove('menu-is-open');
            }
        });

        // Opcional: Cerrar el menú al hacer clic en un enlace del menú
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (menu.classList.contains("active")) {
                    menu.classList.remove("active");
                    navbar.classList.remove('menu-is-open');
                }
            });
        });
    }

    // Listener para el scroll (ocultar/mostrar navbar)
    if (navbar) {
        window.addEventListener("scroll", function () {
            const currentScrollPosition = window.pageYOffset;

            if (currentScrollPosition <= 0) {
                // Si está arriba del todo, siempre mostrar navbar
                navbar.classList.remove("hidden");
            } else if (currentScrollPosition > lastScrollPosition) {
                // Scrolling hacia abajo: ocultar navbar
                navbar.classList.add("hidden");
                // Opcional: Ocultar menú si está abierto al hacer scroll hacia abajo
                if (menu && menu.classList.contains("active")) {
                    menu.classList.remove("active");
                    navbar.classList.remove('menu-is-open');
                }
            } else {
                // Scrolling hacia arriba: mostrar navbar
                navbar.classList.remove("hidden");
            }
            lastScrollPosition = currentScrollPosition <= 0 ? 0 : currentScrollPosition;
        }, { passive: true }); // passive: true para mejor rendimiento
    }

    // --- Profile Animations ---
    // Aplica clases de animación basadas en data-attribute
    const animatedElements = document.querySelectorAll("[data-animation]");
    animatedElements.forEach(element => {
        const animationType = element.getAttribute("data-animation");
        if (animationType) {
            // Podrías añadir la clase directamente o usar Intersection Observer para animar al entrar en vista
            // element.classList.add(animationType); // Ejemplo simple
        }
    });


    // --- Countdown Timer Initialization ---
    const horasEl = document.getElementById('horas');
    const minutosEl = document.getElementById('minutos');
    const segundosEl = document.getElementById('segundos');
    const countdownContainer = document.getElementById('countdown-container');

    function actualizarCuentaRegresiva() {
        if (!horasEl || !minutosEl || !segundosEl || !countdownContainer) return; // Salir si falta algún elemento

        const ahora = new Date();
        let objetivo = new Date(); // Usar la zona horaria local del navegador/servidor

        // Establecer hora objetivo (10:00 AM)
        objetivo.setHours(10, 0, 0, 0);

        // Ajustar al próximo día laborable (Lunes a Viernes)
        while (objetivo <= ahora || objetivo.getDay() === 0 || objetivo.getDay() === 6) {
            // Si ya pasó hoy o es fin de semana, avanzar al día siguiente
            objetivo.setDate(objetivo.getDate() + 1);
            objetivo.setHours(10, 0, 0, 0); // Asegurar la hora correcta
        }

        const diferencia = objetivo - ahora;

        if (diferencia <= 0) {
            // Si por alguna razón la diferencia es negativa, mostrar 0 o mensaje
            actualizarValor(horasEl, 0);
            actualizarValor(minutosEl, 0);
            actualizarValor(segundosEl, 0);
            // Podrías cambiar el H2 aquí a "¡Programa al aire!" o similar
            countdownContainer.querySelector('h2').textContent = "¡Programa al aire!";

        } else {
            const horasRestantes = Math.floor(diferencia / (1000 * 60 * 60));
            const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
            const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

            // Actualizar valores con animación 'flip'
            actualizarValor(horasEl, horasRestantes < 10 ? '0' + horasRestantes : horasRestantes); // Añadir cero inicial
            actualizarValor(minutosEl, minutosRestantes < 10 ? '0' + minutosRestantes : minutosRestantes);
            actualizarValor(segundosEl, segundosRestantes < 10 ? '0' + segundosRestantes : segundosRestantes);

            // Asegurar que el título sea "Próximo Programa" si no está al aire
            const tituloCountdown = countdownContainer.querySelector('h2');
            if (tituloCountdown && tituloCountdown.textContent !== "Proximo Programa") {
                tituloCountdown.textContent = "Proximo Programa";
            }
        }
    }

    // Ejecutar la cuenta regresiva cada segundo
    actualizarCuentaRegresiva(); // Llamada inicial para evitar espera de 1 seg
    setInterval(actualizarCuentaRegresiva, 1000);


    // --- Carrusel Auto-Scroll ---
    const carrusel = document.querySelector(".carrusel");
    if (carrusel) {
        const imagenes = carrusel.querySelectorAll("img");
        let index = 0;
        let cambioImagenInterval = null; // Variable para guardar el intervalo

        carrusel.addEventListener("mouseenter", () => {
            // Limpiar intervalo anterior si existe (por si acaso)
            if (cambioImagenInterval) clearInterval(cambioImagenInterval);

            // Iniciar intervalo solo si hay imágenes
            if (imagenes.length > 1) {
                cambioImagenInterval = setInterval(() => {
                    index = (index + 1) % imagenes.length;
                    carrusel.scrollTo({
                        left: imagenes[index].offsetLeft - carrusel.offsetLeft, // Calcular scroll relativo al carrusel
                        behavior: "smooth"
                    });
                }, 5000); // Cambia cada 5 segundos (ajusta el tiempo)
            }
        });

        carrusel.addEventListener("mouseleave", () => {
            // Detiene el movimiento cuando el usuario sale
            if (cambioImagenInterval) {
                clearInterval(cambioImagenInterval);
                cambioImagenInterval = null; // Limpiar referencia
            }
        });
    }

    // --- Carga Inicial de Videos de YouTube ---
    cargarVideos();

}); // Fin del DOMContentLoaded principal


//Necroprode
// Seleccionamos todas las filas del tbody
const tbody = document.querySelector("#NecroProde table tbody");
const rows = Array.from(tbody.querySelectorAll("tr"));

// Ordenamos las filas por la columna de puntos (columna 3, índice 2)
rows.sort((a, b) => {
  const puntosA = parseInt(a.children[2].textContent, 10);
  const puntosB = parseInt(b.children[2].textContent, 10);
  return puntosB - puntosA; // Orden descendente
});

// Reemplazamos el contenido del tbody con las filas ordenadas
rows.forEach((row, index) => {
  // Actualizamos el número de puesto (columna 1)
  row.children[0].textContent = index + 1;
  tbody.appendChild(row);
});