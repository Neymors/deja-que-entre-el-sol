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
