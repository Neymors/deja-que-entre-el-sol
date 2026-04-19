<<<<<<< HEAD
// ===============================
//      HELPER FUNCTIONS
// ===============================

/**
 * Actualiza el contenido de un elemento HTML con un nuevo valor,
 * aplicando una animación 'flip' solo si el valor cambia.
 */
function actualizarValor(elemento, nuevoValor) {
  if (!elemento) return;
  const valorActual = elemento.textContent;
  const valorString = nuevoValor.toString();

  if (valorActual !== valorString) {
    elemento.textContent = valorString;
    elemento.classList.remove('flip');
    void elemento.offsetWidth; // Forzar reflow
    elemento.classList.add('flip');
  }
}

// ===============================
//      YOUTUBE VIDEOS (CORREGIDO)
// ===============================

async function cargarVideos() {
  try {
    // Usa esta línea (recomendada):
    const response = await fetch("/api/youtube-proxy");
    
    // Alternativa si prefieres la ruta directa:
    // const response = await fetch("/.netlify/functions/youtube-proxy");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    const videoContainer = document.querySelector(".video-gallery");
    if (!videoContainer) return;

    videoContainer.innerHTML = "";

    // Filtrar y ordenar por fecha dentro del título (DD/MM)
    const videosOrdenados = data.items
      .map(video => {
        const titulo = video.snippet.title;
        const fechaMatch = titulo.match(/(\d{2})\/(\d{2})/);
        if (fechaMatch) {
          return {
            ...video,
            fecha: new Date(2025, parseInt(fechaMatch[2]) - 1, parseInt(fechaMatch[1]))
          };
        }
        return null;
      })
      .filter(video => video && video.fecha)
      .sort((a, b) => b.fecha - a.fecha);

    videosOrdenados.forEach(video => {
      const videoElement = document.createElement("div");
      videoElement.classList.add("video-item");
      videoElement.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
          <p>${video.snippet.title}</p>
        </a>
      `;
      videoContainer.appendChild(videoElement);
    });

  } catch (error) {
    console.error("Error cargando videos:", error);
    
    const videoContainer = document.querySelector(".video-gallery");
    if (videoContainer) {
      videoContainer.innerHTML = `
        <p style="color: #ff6b6b; grid-column: 1 / -1; text-align: center;">
          Error al cargar los videos. Intenta más tarde.
        </p>`;
    }
  }
}

// ===============================
//      COUNTDOWN TIMER
// ===============================

function iniciarCuentaRegresiva() {
  const horasEl = document.getElementById('horas');
  const minutosEl = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  const countdownContainer = document.getElementById('countdown-container');

  if (!horasEl || !minutosEl || !segundosEl || !countdownContainer) return;

  function actualizar() {
    const ahora = new Date();
    let objetivo = new Date();
    objetivo.setHours(10, 0, 0, 0); // 10:00 AM

    // Avanzar hasta el próximo día hábil (Lun-Vie)
    while (objetivo <= ahora || objetivo.getDay() === 0 || objetivo.getDay() === 6) {
      objetivo.setDate(objetivo.getDate() + 1);
      objetivo.setHours(10, 0, 0, 0);
    }

    const diferencia = objetivo - ahora;

    if (diferencia <= 0) {
      actualizarValor(horasEl, 0);
      actualizarValor(minutosEl, 0);
      actualizarValor(segundosEl, 0);
      const titulo = countdownContainer.querySelector('h2');
      if (titulo) titulo.textContent = "¡Programa al aire!";
    } else {
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      actualizarValor(horasEl, horas < 10 ? '0' + horas : horas);
      actualizarValor(minutosEl, minutos < 10 ? '0' + minutos : minutos);
      actualizarValor(segundosEl, segundos < 10 ? '0' + segundos : segundos);

      const titulo = countdownContainer.querySelector('h2');
      if (titulo && titulo.textContent !== "Próximo Programa") {
        titulo.textContent = "Próximo Programa";
      }
    }
  }

  actualizar();
  setInterval(actualizar, 1000);
}

// ===============================
//      CARRUSEL AUTO-SCROLL
// ===============================

function iniciarCarrusel() {
  const carrusel = document.querySelector(".carrusel");
  if (!carrusel) return;

  const imagenes = carrusel.querySelectorAll("img");
  if (imagenes.length <= 1) return;

  let index = 0;
  let intervalo = null;

  const cambiarImagen = () => {
    index = (index + 1) % imagenes.length;
    carrusel.scrollTo({
      left: imagenes[index].offsetLeft - carrusel.offsetLeft,
      behavior: "smooth"
    });
  };

  carrusel.addEventListener("mouseenter", () => {
    if (intervalo) clearInterval(intervalo);
    intervalo = setInterval(cambiarImagen, 5000);
  });

  carrusel.addEventListener("mouseleave", () => {
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
  });
}

// ===============================
//      TABLA NECROPRODE (ordenar)
// ===============================

function ordenarTablaNecroprode() {
  const tbody = document.querySelector("#NecroProde table tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const puntosA = parseInt(a.children[2]?.textContent || "0", 10);
    const puntosB = parseInt(b.children[2]?.textContent || "0", 10);
    return puntosB - puntosA;
  });

  rows.forEach((row, index) => {
    if (row.children[0]) row.children[0].textContent = index + 1;
    tbody.appendChild(row);
  });
}

// ===============================
//      DARK MODE, MENU, NAVBAR SCROLL
// ===============================

function initUI() {
  // Dark mode
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  if (darkModeToggle) {
    if (localStorage.getItem("dark-mode") === "enabled") {
      body.classList.add("dark-mode");
    }
    darkModeToggle.addEventListener("click", () => {
      body.classList.add("dark-mode-animating");
      body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
      setTimeout(() => body.classList.remove("dark-mode-animating"), 700);
    });
  }

  // Menú toggle con el logo
  const logoToggle = document.getElementById("logoMenuToggle");
  const menu = document.getElementById("menu");
  const navbar = document.querySelector(".navbar");

  if (logoToggle && menu && navbar) {
    logoToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
      navbar.classList.toggle("menu-is-open");
    });

    document.addEventListener("click", (e) => {
      if (menu.classList.contains("active") && !menu.contains(e.target) && !logoToggle.contains(e.target)) {
        menu.classList.remove("active");
        navbar.classList.remove("menu-is-open");
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove("active");
        navbar.classList.remove("menu-is-open");
      });
    });
  }

  // Ocultar navbar al hacer scroll hacia abajo
  if (navbar) {
    let lastScroll = window.pageYOffset;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        navbar.classList.remove("hidden");
      } else if (currentScroll > lastScroll) {
        navbar.classList.add("hidden");
        if (menu && menu.classList.contains("active")) {
          menu.classList.remove("active");
          navbar.classList.remove("menu-is-open");
        }
      } else {
        navbar.classList.remove("hidden");
      }
      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }
}

// ===============================
//      DOM CONTENT LOADED
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  iniciarCuentaRegresiva();
  iniciarCarrusel();
  cargarVideos();         // Carga inicial de YouTube
  ordenarTablaNecroprode();

  // Consulta automática cada hora después de la 1:10 PM
  function consultarSiEsHora() {
    const ahora = new Date();
    if (ahora.getHours() >= 13 && ahora.getMinutes() >= 10) {
      cargarVideos();
    }
  }
  setInterval(consultarSiEsHora, 3600000); // cada hora
=======
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
  if (!elemento) return;
  const valorActual = elemento.textContent;
  const valorString = nuevoValor.toString();

  if (valorActual !== valorString) {
    elemento.textContent = valorString;
    elemento.classList.remove('flip');
    void elemento.offsetWidth; // Forzar reflow
    elemento.classList.add('flip');
  }
}

// ===============================
//      YOUTUBE VIDEOS
// ===============================

async function cargarVideos() {
  try {
    //const response = await fetch("/.netlify/functions/youtube-proxy");
    const response = await fetch("/api/youtube-proxy");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const videoContainer = document.querySelector(".video-gallery");
    if (!videoContainer) return;

    videoContainer.innerHTML = "";

    // Filtrar y ordenar por fecha dentro del título (DD/MM)
    const videosOrdenados = data.items
      .map(video => {
        const titulo = video.snippet.title;
        const fechaMatch = titulo.match(/(\d{2})\/(\d{2})/);
        if (fechaMatch) {
          return {
            ...video,
            fecha: new Date(2025, parseInt(fechaMatch[2]) - 1, parseInt(fechaMatch[1]))
          };
        }
        return null;
      })
      .filter(video => video && video.fecha)
      .sort((a, b) => b.fecha - a.fecha);

    videosOrdenados.forEach(video => {
      const videoElement = document.createElement("div");
      videoElement.classList.add("video-item");
      videoElement.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
          <img src="${video.snippet.thumbnails.high.url}" alt="${video.snippet.title}">
          <p>${video.snippet.title}</p>
        </a>
      `;
      videoContainer.appendChild(videoElement);
    });
  } catch (error) {
    console.error("Error cargando videos:", error);
    const videoContainer = document.querySelector(".video-gallery");
    if (videoContainer) {
      videoContainer.innerHTML = "<p>Error al cargar los videos. Intenta más tarde.</p>";
    }
  }
}

// ===============================
//      COUNTDOWN TIMER
// ===============================

function iniciarCuentaRegresiva() {
  const horasEl = document.getElementById('horas');
  const minutosEl = document.getElementById('minutos');
  const segundosEl = document.getElementById('segundos');
  const countdownContainer = document.getElementById('countdown-container');

  if (!horasEl || !minutosEl || !segundosEl || !countdownContainer) return;

  function actualizar() {
    const ahora = new Date();
    let objetivo = new Date();
    objetivo.setHours(10, 0, 0, 0); // 10:00 AM

    // Avanzar hasta el próximo día hábil (Lun-Vie)
    while (objetivo <= ahora || objetivo.getDay() === 0 || objetivo.getDay() === 6) {
      objetivo.setDate(objetivo.getDate() + 1);
      objetivo.setHours(10, 0, 0, 0);
    }

    const diferencia = objetivo - ahora;

    if (diferencia <= 0) {
      actualizarValor(horasEl, 0);
      actualizarValor(minutosEl, 0);
      actualizarValor(segundosEl, 0);
      const titulo = countdownContainer.querySelector('h2');
      if (titulo) titulo.textContent = "¡Programa al aire!";
    } else {
      const horas = Math.floor(diferencia / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      actualizarValor(horasEl, horas < 10 ? '0' + horas : horas);
      actualizarValor(minutosEl, minutos < 10 ? '0' + minutos : minutos);
      actualizarValor(segundosEl, segundos < 10 ? '0' + segundos : segundos);

      const titulo = countdownContainer.querySelector('h2');
      if (titulo && titulo.textContent !== "Próximo Programa") {
        titulo.textContent = "Próximo Programa";
      }
    }
  }

  actualizar();
  setInterval(actualizar, 1000);
}

// ===============================
//      CARRUSEL AUTO-SCROLL
// ===============================

function iniciarCarrusel() {
  const carrusel = document.querySelector(".carrusel");
  if (!carrusel) return;

  const imagenes = carrusel.querySelectorAll("img");
  if (imagenes.length <= 1) return;

  let index = 0;
  let intervalo = null;

  const cambiarImagen = () => {
    index = (index + 1) % imagenes.length;
    carrusel.scrollTo({
      left: imagenes[index].offsetLeft - carrusel.offsetLeft,
      behavior: "smooth"
    });
  };

  carrusel.addEventListener("mouseenter", () => {
    if (intervalo) clearInterval(intervalo);
    intervalo = setInterval(cambiarImagen, 5000);
  });

  carrusel.addEventListener("mouseleave", () => {
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
  });
}

// ===============================
//      TABLA NECROPRODE (ordenar)
// ===============================

function ordenarTablaNecroprode() {
  const tbody = document.querySelector("#NecroProde table tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr"));
  rows.sort((a, b) => {
    const puntosA = parseInt(a.children[2]?.textContent || "0", 10);
    const puntosB = parseInt(b.children[2]?.textContent || "0", 10);
    return puntosB - puntosA;
  });

  rows.forEach((row, index) => {
    if (row.children[0]) row.children[0].textContent = index + 1;
    tbody.appendChild(row);
  });
}

// ===============================
//      DARK MODE, MENU, NAVBAR SCROLL
// ===============================

function initUI() {
  // Dark mode
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  if (darkModeToggle) {
    if (localStorage.getItem("dark-mode") === "enabled") {
      body.classList.add("dark-mode");
    }
    darkModeToggle.addEventListener("click", () => {
      body.classList.add("dark-mode-animating");
      body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
      setTimeout(() => body.classList.remove("dark-mode-animating"), 700);
    });
  }

  // Menú toggle con el logo
  const logoToggle = document.getElementById("logoMenuToggle");
  const menu = document.getElementById("menu");
  const navbar = document.querySelector(".navbar");

  if (logoToggle && menu && navbar) {
    logoToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("active");
      navbar.classList.toggle("menu-is-open");
    });

    document.addEventListener("click", (e) => {
      if (menu.classList.contains("active") && !menu.contains(e.target) && !logoToggle.contains(e.target)) {
        menu.classList.remove("active");
        navbar.classList.remove("menu-is-open");
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove("active");
        navbar.classList.remove("menu-is-open");
      });
    });
  }

  // Ocultar navbar al hacer scroll hacia abajo
  if (navbar) {
    let lastScroll = window.pageYOffset;
    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        navbar.classList.remove("hidden");
      } else if (currentScroll > lastScroll) {
        navbar.classList.add("hidden");
        if (menu && menu.classList.contains("active")) {
          menu.classList.remove("active");
          navbar.classList.remove("menu-is-open");
        }
      } else {
        navbar.classList.remove("hidden");
      }
      lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
  }
}

// ===============================
//      DOM CONTENT LOADED
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  iniciarCuentaRegresiva();
  iniciarCarrusel();
  cargarVideos();         // Carga inicial de YouTube
  ordenarTablaNecroprode();

  // Consulta automática cada hora después de la 1:10 PM (opcional)
  function consultarSiEsHora() {
    const ahora = new Date();
    if (ahora.getHours() >= 13 && ahora.getMinutes() >= 10) {
      cargarVideos();
    }
  }
  setInterval(consultarSiEsHora, 3600000);
>>>>>>> 95c397d (Fix: carpeta netlify y proxy de youtube)
});