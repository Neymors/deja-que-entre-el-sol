// DARK MODE//
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Comprobar si el usuario tiene un modo guardado
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Alternar modo oscuro/claro al hacer clic en el botón
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Guardar la preferencia en localStorage
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const menu = document.querySelector(".navbar ul"); // Selecciona el <ul> del menú

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", function () {
            menu.classList.toggle("active"); // Alterna la visibilidad del menú
        });

        // Cierra el menú si se hace clic fuera de él
        document.addEventListener("click", function (event) {
            if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
                menu.classList.remove("active");
            }
        });
    }

    // Navbar que desaparece al desplazarse
    const navbar = document.querySelector(".navbar");
    let lastScrollPosition = 0;

    window.addEventListener("scroll", function () {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition > lastScrollPosition) {
            // Usuario se desplaza hacia abajo: ocultar navbar
            navbar.classList.add("hidden");
        } else {
            // Usuario se desplaza hacia arriba: mostrar navbar
            navbar.classList.remove("hidden");
        }

        lastScrollPosition = currentScrollPosition;
    });
});

const API_KEY = "AIzaSyDvoYWafx20UE1B0q3Y0ZK7VjEnu-xsZ5k"; // Reemplaza con tu clave de API
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

            videoElement.innerHTML = `
                <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                  <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
                  <p>${video.snippet.title}</p>
                </a>
            `;

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

document.addEventListener("DOMContentLoaded", () => {
    const perfiles = document.querySelectorAll("[data-animation]"); // Selecciona elementos con el atributo data-animation
    perfiles.forEach(perfil => {
        const animacionDefinida = perfil.getAttribute("data-animation");
        if (animacionDefinida) {
            perfil.classList.add(animacionDefinida);
        }
    });
});

//Reloj
function actualizarValor(elemento, nuevoValor) {
    // Solo actualizar y animar si el valor es diferente
    if (elemento.textContent !== nuevoValor.toString()) {
        elemento.textContent = nuevoValor;
        // Reiniciar la animación eliminando y volviendo a añadir la clase
        elemento.classList.remove('flip');
        // Forzar reflow para reiniciar la animación
        void elemento.offsetWidth;
        elemento.classList.add('flip');
    }
}

function actualizarCuentaRegresiva() {
    const ahora = new Date();
    let objetivo = new Date(ahora);
    // Establece la hora objetivo: 10 AM Buenos Aires (UTC-3 → 13:00 UTC)
    objetivo.setUTCHours(13, 0, 0, 0);

    // Si la cuenta regresiva ya pasó o el día es sábado (6) o domingo (0),
    // se avanza al siguiente día laborable
    while (objetivo - ahora <= 0 || objetivo.getDay() === 0 || objetivo.getDay() === 6) {
        objetivo.setUTCDate(objetivo.getUTCDate() + 1);
        objetivo.setUTCHours(13, 0, 0, 0);
    }

    const diferencia = objetivo - ahora;
    const horasRestantes = Math.floor(diferencia / (1000 * 60 * 60));
    const minutosRestantes = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundosRestantes = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Actualizar cada elemento solo si cambia
    actualizarValor(document.getElementById('horas'), horasRestantes);
    actualizarValor(document.getElementById('minutos'), minutosRestantes);
    actualizarValor(document.getElementById('segundos'), segundosRestantes);
}

// Ejecutar la función cada segundo
setInterval(actualizarCuentaRegresiva, 1000);

//Mini animacion 
