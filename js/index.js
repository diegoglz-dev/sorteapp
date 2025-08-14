const names = [];

// Objeto global para goles
const goals = {};

let teamPlayers = { team1: [], team2: [] }; // Para saber a qué equipo pertenece cada jugador
let teamScores = { team1: 0, team2: 0 };   // Puntaje por equipo

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

// Mostrar equipos con botones +/-
function displayTeam(elementId, team) {
    const list = document.getElementById(elementId);
    list.innerHTML = "";
    teamPlayers[elementId] = []; // Reiniciar lista de jugadores de ese equipo

    team.forEach(name => {
        teamPlayers[elementId].push(name); // Guardar jugador en su equipo

        if (!(name in goals)) {
            goals[name] = 0;
        }

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = name;

        const btnGroup = document.createElement("div");

        const minusBtn = document.createElement("button");
        minusBtn.className = "btn btn-sm btn-outline-danger me-1";
        minusBtn.innerHTML = "−";
        minusBtn.onclick = () => {
            if (goals[name] > 0) {
                goals[name]--;
                updateAll();
            }
        };

        const plusBtn = document.createElement("button");
        plusBtn.className = "btn btn-sm btn-outline-success";
        plusBtn.innerHTML = "+";
        plusBtn.onclick = () => {
            goals[name]++;
            updateAll();
        };

        btnGroup.appendChild(minusBtn);
        btnGroup.appendChild(plusBtn);

        li.appendChild(nameSpan);
        li.appendChild(btnGroup);

        list.appendChild(li);
    });
}

// Actualiza marcador de equipos
function updateScores() {
    teamScores.team1 = 0;
    teamScores.team2 = 0;

    for (const [player, score] of Object.entries(goals)) {
        if (teamPlayers.team1.includes(player)) {
            teamScores.team1 += score;
        } else if (teamPlayers.team2.includes(player)) {
            teamScores.team2 += score;
        }
    }

    const title1 = document.querySelector('h4[for-team="1"]');
    const title2 = document.querySelector('h4[for-team="2"]');

    if (teamScores.team1 > teamScores.team2) {
        title1.innerHTML = `<i class="fa-solid fa-flag"></i> Equipo 1 (${teamScores.team1}) 🏆`;
        title2.innerHTML = `<i class="fa-regular fa-flag"></i> Equipo 2 (${teamScores.team2})`;
    } else if (teamScores.team2 > teamScores.team1) {
        title1.innerHTML = `<i class="fa-solid fa-flag"></i> Equipo 1 (${teamScores.team1})`;
        title2.innerHTML = `<i class="fa-regular fa-flag"></i> Equipo 2 (${teamScores.team2}) 🏆`;
    } else {
        title1.innerHTML = `<i class="fa-solid fa-flag"></i> Equipo 1 (${teamScores.team1})`;
        title2.innerHTML = `<i class="fa-regular fa-flag"></i> Equipo 2 (${teamScores.team2})`;
    }
}

// Actualiza tabla de goleadores
function updateScorers() {
    const list = document.getElementById("scorersList");
    list.innerHTML = "";

    const sortedScorers = Object.entries(goals)
        .sort((a, b) => b[1] - a[1])
        .filter(([name, score]) => score > 0);

    sortedScorers.forEach(([name, score]) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = name;

        const badge = document.createElement("span");
        badge.className = "badge bg-primary rounded-pill";
        badge.textContent = score;

        li.appendChild(badge);
        list.appendChild(li);
    });
}

// Llama a todas las actualizaciones
function updateAll() {
    updateScores();
    updateScorers();
}

function resetAll() {
    // Vaciar listas y contadores
    names.length = 0;
    for (const key in goals) delete goals[key];
    teamPlayers = { team1: [], team2: [] };
    teamScores = { team1: 0, team2: 0 };

    // Limpiar UI
    updateNameList();
    document.getElementById("team1").innerHTML = "";
    document.getElementById("team2").innerHTML = "";
    document.getElementById("scorersList").innerHTML = "";

    // Restaurar títulos de equipos
    document.querySelector('h4[for-team="1"]').innerHTML = `<i class="fa-solid fa-flag"></i> Equipo 1`;
    document.querySelector('h4[for-team="2"]').innerHTML = `<i class="fa-regular fa-flag"></i> Equipo 2`;

    // Restaurar botón de sorteo
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