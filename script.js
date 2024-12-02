// 팀 생성 버튼
document.getElementById("generate-teams").addEventListener("click", generateTeams);

// 맵 선택 버튼
document.getElementById("generate-map").addEventListener("click", generateMap);

// 결과 복사 버튼
document.getElementById("copy-teams").addEventListener("click", copyTeams);

// 초기화 버튼
document.getElementById("reset-teams").addEventListener("click", resetTeams);

const maps = ["어비스", "로터스", "바인드", "브리즈", "스플릿", "아이스박스", "어센트", "선셋", "펄", "프랙처", "헤이븐"];
let lastSelectedMap = ""; // 마지막 선택된 맵 저장 변수

// 팀 생성 기능
function generateTeams() {
    const team1Inputs = [
        document.getElementById("team1-player-1"),
        document.getElementById("team1-player-2"),
        document.getElementById("team1-player-3"),
        document.getElementById("team1-player-4"),
        document.getElementById("team1-player-5")
    ];

    const team2Inputs = [
        document.getElementById("team2-player-1"),
        document.getElementById("team2-player-2"),
        document.getElementById("team2-player-3"),
        document.getElementById("team2-player-4"),
        document.getElementById("team2-player-5")
    ];

    const attackTeam = [];
    const defenseTeam = [];

    for (let i = 0; i < 5; i++) {
        const player1 = team1Inputs[i].value.trim();
        const player2 = team2Inputs[i].value.trim();

        if (!player1 || !player2) {
            alert("각 줄에 두 명의 플레이어 이름을 입력하세요.");
            return;
        }

        // 무작위로 공격팀과 수비팀에 배치
        if (Math.random() < 0.5) {
            attackTeam.push(player1);
            defenseTeam.push(player2);
        } else {
            attackTeam.push(player2);
            defenseTeam.push(player1);
        }
    }

    document.getElementById("team-a").innerHTML = attackTeam.map(player => `<li><textarea readonly>${player}</textarea></li>`).join("");
    document.getElementById("team-b").innerHTML = defenseTeam.map(player => `<li><textarea readonly>${player}</textarea></li>`).join("");

    // 추가: 텍스트 박스 클릭 시 강조 표시 및 트레이드 기능
    const textareas = document.querySelectorAll(".team-output textarea");
    let firstSelected = null;

    textareas.forEach(textarea => {
        textarea.addEventListener("click", () => {
            if (!firstSelected) {
                firstSelected = textarea;
                textarea.style.borderColor = 'yellow';
            } else {
                const tempValue = firstSelected.value;
                firstSelected.value = textarea.value;
                textarea.value = tempValue;
                firstSelected.style.borderColor = '';
                firstSelected = null;
            }
        });
    });

    document.getElementById("copy-teams").style.display = "inline-block";
    document.getElementById("reset-teams").style.display = "inline-block";
}

// 결과 복사 기능
function copyTeams() {
    const teamA = Array.from(document.querySelectorAll("#team-a textarea")).map(textarea => textarea.value).join("\n");
    const teamB = Array.from(document.querySelectorAll("#team-b textarea")).map(textarea => textarea.value).join("\n");

    const result = `공격팀:\n${teamA}\n\n수비팀:\n${teamB}`;
    navigator.clipboard.writeText(result).then(() => {
        alert("결과가 클립보드에 복사되었습니다.");
    });
}

// 초기화 기능
function resetTeams() {
    document.querySelectorAll("textarea").forEach(textarea => textarea.value = "");
    document.getElementById("team-a").innerHTML = "";
    document.getElementById("team-b").innerHTML = "";
    document.getElementById("selected-map").textContent = "";
    document.getElementById("copy-teams").style.display = "none";
    // 초기화 버튼을 계속 보이도록 설정
    document.getElementById("reset-teams").style.display = "inline-block";
}


// 랜덤 맵 선택
function generateMap() {
    const availableMaps = maps.filter(map => map !== lastSelectedMap);
    if (availableMaps.length === 0) {
        alert("모든 맵이 선택되었습니다. 초기화하세요.");
        return;
    }

    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    lastSelectedMap = randomMap; // 마지막 선택 맵 저장
    document.getElementById("selected-map").textContent = `선택된 맵: ${randomMap}`;
}

// 내전 모집 섹션
const recruitTextarea = document.getElementById("recruit-textarea");
const currentMembersText = document.getElementById("current-members");
const copyMembersButton = document.getElementById("copy-members");

recruitTextarea.addEventListener("input", () => {
    const members = recruitTextarea.value.trim().split("\n").filter(name => name.trim() !== "");
    currentMembersText.textContent = `현재 멤버 ${members.length}명`;
});

copyMembersButton.addEventListener("click", () => {
    const members = recruitTextarea.value.trim().split("\n").filter(name => name.trim() !== "");
    if (members.length === 0) {
        alert("멤버 목록이 비어 있습니다.");
        return;
    }

    const result = `현재 멤버:\n${members.join("\n")}\n\n총 멤버 수: ${members.length}명`;
    navigator.clipboard.writeText(result).then(() => {
        alert("현재 멤버 목록이 클립보드에 복사되었습니다.");
    });
});

// 탭키 순서 제어
const allTextareas = [
    "team1-player-1", "team2-player-1", 
    "team1-player-2", "team2-player-2", 
    "team1-player-3", "team2-player-3", 
    "team1-player-4", "team2-player-4", 
    "team1-player-5", "team2-player-5"
].map(id => document.getElementById(id));

allTextareas.forEach((textarea, index) => {
    textarea.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            allTextareas[(index + 1) % allTextareas.length].focus();
        }
    });
});
