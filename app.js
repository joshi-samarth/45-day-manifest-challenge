document.addEventListener("DOMContentLoaded", () => {
  let sideMenu = document.querySelectorAll(".nav-link");
  sideMenu.forEach((item) => {
    let li = item.parentElement;

    item.addEventListener("click", () => {
      sideMenu.forEach((link) => {
        link.parentElement.classList.remove("active");
      });
      li.classList.add("active");
    });
  });

  let menuBar = document.querySelector(".menu-btn");
  let sideBar = document.querySelector(".sidebar");
  menuBar.addEventListener("click", () => {
    sideBar.classList.toggle("hide");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      sideBar.classList.add("hide");
    }
  });

  if (window.innerWidth < 768) {
    sideBar.classList.add("hide");
  }
});
