document.addEventListener("DOMContentLoaded", function () {
  const burgerBtn = document.getElementById("burger-btn");
  const headerMenu = document.getElementById("header-menu");

  if (burgerBtn && headerMenu) {
    burgerBtn.addEventListener("click", function () {
      headerMenu.classList.toggle("is-open");
    });

    document.addEventListener("click", function (event) {
      const isClickInsideMenu = headerMenu.contains(event.target);
      const isClickOnBurger = burgerBtn.contains(event.target);

      if (
        !isClickInsideMenu &&
        !isClickOnBurger &&
        headerMenu.classList.contains("is-open")
      ) {
        headerMenu.classList.remove("is-open");
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && headerMenu.classList.contains("is-open")) {
        headerMenu.classList.remove("is-open");
      }
    });
  }
});
