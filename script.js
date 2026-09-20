let routines = JSON.parse(localStorage.getItem("danceRoutines")) || [];

let editingIndex = -1;


// ADD / SAVE ROUTINE
function addRoutine() {

    const songName = document.getElementById("songName").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const status = document.getElementById("status").value;
    const progress = Number(document.getElementById("progress").value);
    const notes = document.getElementById("notes").value.trim();
    const practiceDate = document.getElementById("practiceDate").value;
    const practiceGoal = document.getElementById("practiceGoal").value.trim();
    const youtubeLink = document.getElementById("youtubeLink").value.trim();

    if (songName === "" || difficulty === "") {
        alert("Please enter song name and difficulty!");
        return;
    }

    const routine = {
        songName,
        difficulty,
        status,
        progress,
        notes,
        practiceDate,
        practiceGoal,
        youtubeLink
    };

    if (editingIndex !== -1) {
        routines[editingIndex] = routine;
        editingIndex = -1;
    } else {
        routines.push(routine);
    }

    saveRoutines();
    clearForm();
    displayRoutines();
}


// SAVE
function saveRoutines() {
    localStorage.setItem(
        "danceRoutines",
        JSON.stringify(routines)
    );
}


// CLEAR FORM
function clearForm() {

    document.getElementById("songName").value = "";
    document.getElementById("difficulty").value = "";
    document.getElementById("status").value = "Not Started";
    document.getElementById("progress").value = 0;
    document.getElementById("progressValue").textContent = "0%";
    document.getElementById("notes").value = "";
    document.getElementById("practiceDate").value = "";
    document.getElementById("practiceGoal").value = "";
    document.getElementById("youtubeLink").value = "";

    editingIndex = -1;

    document.getElementById("addButton").textContent =
        "💃 Add Routine";
}


// DISPLAY ROUTINES
function displayRoutines() {

    const routineList =
        document.getElementById("routineList");

    routineList.innerHTML = "";

    if (routines.length === 0) {

        routineList.innerHTML =
            '<p class="empty">No routines added yet.</p>';

        updateDashboard();
        updateAchievements();
        updateChart();
        return;
    }

    routines.forEach((routine, index) => {

        const card = document.createElement("div");

        let statusClass = "not-started";

        if (routine.status === "Completed") {
            statusClass = "completed";
        }
        else if (routine.status === "Practicing") {
            statusClass = "practicing";
        }

        card.innerHTML = `

            <h3>💃 ${escapeHTML(routine.songName)}</h3>

            <p>
                🎯 <strong>Difficulty:</strong>
                ${escapeHTML(routine.difficulty)}
            </p>

            <p>
                📌 <strong>Status:</strong>
                <span class="status ${statusClass}">
                    ${escapeHTML(routine.status)}
                </span>
            </p>

            <p>
                🎯 <strong>Goal:</strong>
                ${escapeHTML(routine.practiceGoal || "No goal added")}
            </p>

            <p>
                📅 <strong>Practice Date:</strong>
                ${routine.practiceDate || "Not selected"}
            </p>

            <p>
                📝 <strong>Notes:</strong>
                ${escapeHTML(routine.notes || "No notes added")}
            </p>

            ${
                routine.youtubeLink
                ? `
                    <p>
                        🎬 <strong>Tutorial:</strong>
                        <a
                            href="${escapeHTML(routine.youtubeLink)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ▶️ Watch Tutorial
                        </a>
                    </p>
                `
                : ""
            }

            <div class="progress-info">
                <strong>Progress</strong>
                <span>${routine.progress}%</span>
            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width: ${routine.progress}%"
                ></div>

            </div>

            <div class="card-buttons">

                <button
                    class="edit-button"
                    onclick="editRoutine(${index})"
                >
                    ✏️ Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteRoutine(${index})"
                >
                    🗑️ Delete
                </button>

            </div>
        `;

        routineList.appendChild(card);
    });

    updateDashboard();
    updateAchievements();
    updateChart();
}


// EDIT
function editRoutine(index) {

    const routine = routines[index];

    document.getElementById("songName").value =
        routine.songName;

    document.getElementById("difficulty").value =
        routine.difficulty;

    document.getElementById("status").value =
        routine.status;

    document.getElementById("progress").value =
        routine.progress;

    document.getElementById("progressValue").textContent =
        routine.progress + "%";

    document.getElementById("notes").value =
        routine.notes || "";

    document.getElementById("practiceDate").value =
        routine.practiceDate || "";

    document.getElementById("practiceGoal").value =
        routine.practiceGoal || "";

    document.getElementById("youtubeLink").value =
        routine.youtubeLink || "";

    editingIndex = index;

    document.getElementById("addButton").textContent =
        "💾 Save Changes";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// DELETE
function deleteRoutine(index) {

    if (!confirm("Delete this dance routine?")) {
        return;
    }

    routines.splice(index, 1);

    saveRoutines();
    displayRoutines();
}


// DASHBOARD
function updateDashboard() {

    const total = routines.length;

    let completed = 0;
    let totalProgress = 0;

    routines.forEach(routine => {

        if (routine.status === "Completed") {
            completed++;
        }

        totalProgress +=
            Number(routine.progress) || 0;
    });

    const average =
        total > 0
        ? Math.round(totalProgress / total)
        : 0;

    document.getElementById("totalRoutines").textContent =
        total;

    document.getElementById("completedRoutines").textContent =
        completed;

    document.getElementById("averageProgress").textContent =
        average + "%";

    calculateStreak();
}


// PRACTICE STREAK
function calculateStreak() {

    const dates = routines
        .map(routine => routine.practiceDate)
        .filter(date => date !== "")
        .sort()
        .reverse();

    const uniqueDates =
        [...new Set(dates)];

    if (uniqueDates.length === 0) {

        document.getElementById("practiceStreak").textContent =
            "0 days";

        return;
    }

    let streak = 1;

    for (
        let i = 0;
        i < uniqueDates.length - 1;
        i++
    ) {

        const current =
            new Date(uniqueDates[i]);

        const previous =
            new Date(uniqueDates[i + 1]);

        const difference =
            Math.round(
                (current - previous) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {
            streak++;
        }
        else {
            break;
        }
    }

    document.getElementById("practiceStreak").textContent =
        streak + " days";
}


// ACHIEVEMENTS
function updateAchievements() {

    const achievements =
        document.querySelectorAll(".achievement");

    const total = routines.length;

    const completed =
        routines.filter(
            routine => routine.status === "Completed"
        ).length;

    const has100 =
        routines.some(
            routine => Number(routine.progress) === 100
        );

    const streakText =
        document.getElementById("practiceStreak").textContent;

    const streak =
        parseInt(streakText) || 0;


    achievements[0].classList.toggle(
        "unlocked",
        total >= 1
    );

    achievements[0].classList.toggle(
        "locked",
        total < 1
    );


    achievements[1].classList.toggle(
        "unlocked",
        streak >= 3
    );

    achievements[1].classList.toggle(
        "locked",
        streak < 3
    );


    achievements[2].classList.toggle(
        "unlocked",
        completed >= 5
    );

    achievements[2].classList.toggle(
        "locked",
        completed < 5
    );


    achievements[3].classList.toggle(
        "unlocked",
        has100
    );

    achievements[3].classList.toggle(
        "locked",
        !has100
    );
}


// PROGRESS CHART
function updateChart() {

    const easy =
        routines.filter(
            routine => routine.difficulty === "Easy"
        ).length;

    const medium =
        routines.filter(
            routine => routine.difficulty === "Medium"
        ).length;

    const hard =
        routines.filter(
            routine => routine.difficulty === "Hard"
        ).length;

    const max =
        Math.max(easy, medium, hard, 1);

    document.getElementById("easyBar").style.height =
        (easy / max * 160) + "px";

    document.getElementById("mediumBar").style.height =
        (medium / max * 160) + "px";

    document.getElementById("hardBar").style.height =
        (hard / max * 160) + "px";
}


// PROGRESS SLIDER
const progress =
    document.getElementById("progress");

const progressValue =
    document.getElementById("progressValue");

progress.addEventListener("input", function () {

    progressValue.textContent =
        this.value + "%";

});


// SEARCH + FILTER
const searchRoutine =
    document.getElementById("searchRoutine");

const filterDifficulty =
    document.getElementById("filterDifficulty");


function filterRoutines() {

    const searchText =
        searchRoutine.value.toLowerCase();

    const selectedDifficulty =
        filterDifficulty.value;

    const cards =
        document.querySelectorAll(
            "#routineList > div"
        );

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        const matchesSearch =
            text.includes(searchText);

        const matchesDifficulty =
            selectedDifficulty === "All" ||
            text.includes(
                "difficulty: " +
                selectedDifficulty.toLowerCase()
            );

        card.style.display =
            matchesSearch && matchesDifficulty
            ? "block"
            : "none";
    });
}


searchRoutine.addEventListener(
    "input",
    filterRoutines
);

filterDifficulty.addEventListener(
    "change",
    filterRoutines
);


// DARK MODE
const themeButton =
    document.getElementById("themeButton");

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        themeButton.textContent =
            isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

        localStorage.setItem(
            "danceTheme",
            isDark ? "dark" : "light"
        );
    }
);


// LOAD SAVED THEME
if (
    localStorage.getItem("danceTheme") === "dark"
) {

    document.body.classList.add("dark");

    themeButton.textContent =
        "☀️ Light Mode";
}


// SECURITY HELPER
function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// START APP
displayRoutines();