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

const API_KEY = "AIzaSyDGNMP7KXJ7AhZ9d0UvbEMotcwwGph_ERU"; // Reemplaza con tu clave de API
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
