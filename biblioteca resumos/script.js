document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const resumos = document.querySelectorAll(".resumo");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = button.getAttribute("data-category");

            resumos.forEach(resumo => {
                if (resumo.getAttribute("data-category") === category) {
                    resumo.style.display = "block";
                } else {
                    resumo.style.display = "none";
                }
            });
        });
    });

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        resumos.forEach(resumo => {
            const title = resumo.querySelector("h3").textContent.toLowerCase();
            const content = resumo.querySelector("p").textContent.toLowerCase();

            if (title.includes(searchText) || content.includes(searchText)) {
                resumo.style.display = "block";
            } else {
                resumo.style.display = "none";
            }
        });
    });
});
