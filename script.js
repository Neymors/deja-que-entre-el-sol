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
});
