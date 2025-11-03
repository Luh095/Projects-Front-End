// Efeito Parallax no scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll(".section");
  const scrollTop = window.pageYOffset;

  sections.forEach((section) => {
    const speed = section.getAttribute("data-speed");
    section.style.transform = `translateY(${scrollTop * speed}px)`;
  });
});

// Navegação com transição suave
function navigateTo(url) {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}

// Aparecer com fade-in ao carregar
window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});
