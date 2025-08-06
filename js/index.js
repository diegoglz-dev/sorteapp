const names = [];

function addName() {
    const input = document.getElementById("nameInput");
    const name = input.value.trim();

    if (name === "") {
        alert("Por favor, ingresa un nombre.");
        return;
    }

    // Verificación insensible a mayúsculas/minúsculas
    const nameLower = name.toLowerCase();
    const isDuplicate = names.some(existingName => existingName.toLowerCase() === nameLower);

    if (isDuplicate) {
        alert("Este nombre ya ha sido agregado.");
        return;
    }

    if (names.length >= 10) {
        alert("Ya se han agregado 10 nombres.");
        return;
    }

    names.push(name);
    input.value = "";
    updateNameList();
}

function updateNameList() {
    const list = document.getElementById("nameList");
    list.innerHTML = "";
    names.forEach((name, index) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${index + 1}. ${name}`;
        list.appendChild(li);
    });
    document.getElementById("count").textContent = names.length;
}

function sortTeams() {
    if (names.length !== 10) {
        alert("Debes agregar exactamente 10 nombres para sortear.");
        return;
    }

    // Mostrar loader y deshabilitar botones e input
    document.getElementById("loaderOverlay").classList.remove("d-none");
    toggleUIInteraction(false);

    // Simular tiempo de procesamiento con setTimeout (2 segundos)
    setTimeout(() => {
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        const team1 = shuffled.slice(0, 5);
        const team2 = shuffled.slice(5, 10);

        displayTeam("team1", team1);
        displayTeam("team2", team2);

        // Cambiar el texto del botón
        const sortButton = document.querySelector(".btn-success");
        sortButton.innerHTML = '<i class="fa-solid fa-futbol"></i> Repetir sorteo';

        // Ocultar loader y volver a habilitar la UI
        document.getElementById("loaderOverlay").classList.add("d-none");
        toggleUIInteraction(true);
    }, 2000);
}


function displayTeam(elementId, team) {
    const list = document.getElementById(elementId);
    list.innerHTML = "";
    team.forEach(name => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = name;
        list.appendChild(li);
    });
}

function resetAll() {
    names.length = 0;
    updateNameList();
    document.getElementById("team1").innerHTML = "";
    document.getElementById("team2").innerHTML = "";

    // Cambiar el texto del botón
    const sortButton = document.querySelector(".btn-success");
    sortButton.innerHTML = '<i class="fa-solid fa-futbol"></i> Sortear equipos';
}

function handleKey(event) {
    if (event.key === "Enter") {
        addName();
    }
}

document.addEventListener("keydown", function (event) {
    // Verifica si se presiona Ctrl + S
    if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Evita que el navegador intente guardar la página
        sortTeams(); // Llama a tu función
    }
});

function toggleTheme() {
    const html = document.documentElement;
    const isDark = document.getElementById("themeSwitch").checked;

    html.setAttribute("data-bs-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    document.getElementById("sunIcon").style.opacity = isDark ? "0.3" : "1";
    document.getElementById("moonIcon").style.opacity = isDark ? "1" : "0.3";
}

// Restaurar el tema al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const switchInput = document.getElementById("themeSwitch");

    const isDark = savedTheme === "dark";
    document.documentElement.setAttribute("data-bs-theme", savedTheme);
    switchInput.checked = isDark;
    updateThemeIcons(isDark);
});

function toggleUIInteraction(enabled) {
    document.getElementById("nameInput").disabled = !enabled;
    document.querySelectorAll("button").forEach(btn => btn.disabled = !enabled);
}