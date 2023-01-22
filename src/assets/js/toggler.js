const sidebar = document.querySelector("div.dashboard-left-pannel");
const toggler = document.querySelector("button.toggler");
const dashboard = document.querySelector(".dashboard-main");
const spans = document.querySelectorAll(".list-name");
const btnSvg = document.querySelector("li button svg");

toggler.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  dashboard.classList.toggle("active");
  btnSvg.classList.toggle("active");

  Array.from(spans).forEach((text) => {
    text.classList.toggle("active");
  });
});
