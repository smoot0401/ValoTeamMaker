// 팀 생성 버튼
document.getElementById("generate-teams").addEventListener("click", generateTeams);

// 맵 선택 버튼
document.getElementById("generate-map").addEventListener("click", generateMap);

// 결과 복사 버튼
document.getElementById("copy-teams").addEventListener("click", copyTeams);

// 초기화 버튼
document.getElementById("reset-teams").addEventListener("click", resetTeams);

// 언어 버튼
document.getElementById("btn-kr").addEventListener("click", () => changeLanguage('ko'));
document.getElementById("btn-jp").addEventListener("click", () => changeLanguage('jp'));
document.getElementById("btn-en").addEventListener("click", () => changeLanguage('en'));

// 페이지 로드 시 저장된 언어 설정 적용
window.addEventListener("load", () => {
    const savedLanguage = localStorage.getItem("language") || 'ko';
    changeLanguage(savedLanguage);
});

const maps = {
    ko: ["어비스", "로터스", "바인드", "브리즈", "스플릿", "아이스박스", "어센트", "선셋", "펄", "프랙처", "헤이븐"],
    jp: ["アビス", "ロータス", "バインド", "ブリーズ", "スプリット", "アイスボックス", "アセント", "サンセット", "パール", "フラクチャー", "ヘイヴン"],
    en: ["Abyss", "Lotus", "Bind", "Breeze", "Split", "Icebox", "Ascent", "Sunset", "Pearl", "Fracture", "Haven"]
};
let lastSelectedMap = ""; // 마지막 선택된 맵 저장 변수
let currentLanguage = "ko"; // 초기 언어 설정

const translations = {
    ko: {
        title: '발로란트 팀 생성기',
        heading: '발로란트 팀 생성기',
        team1Label: '팀 1 후보',
        team2Label: '팀 2 후보',
        generateTeamsButton: '팀 생성',
        resetTeamsButton: '모든 결과 초기화',
        attackTeamLabel: '공격팀',
        defenseTeamLabel: '수비팀',
        copyTeamsButton: '결과 복사',
        generateMapButton: '맵 선택',
        recruitSectionLabel: '모집',
        recruitTextarea: '멤버 이름을 한 줄씩 입력하세요',
        currentMembersLabel: '현재 멤버',
        copyMembersButton: '현재 멤버 복사',
        selectedMapLabel: '선택된 맵:',
        mapSelectionTitle: '랜덤 맵 선택',
        copyAlert: '결과가 클립보드에 복사되었습니다.',
        noMembersAlert: '멤버 목록이 비어 있습니다.'
    },
    jp: {
        title: 'VALORANTチームジェネレータ',
        heading: 'VALORANTチームジェネレータ',
        team1Label: 'TEAM 1',
        team2Label: 'TEAM 2',
        generateTeamsButton: 'チーム生成',
        resetTeamsButton: 'すべての結果をリセット',
        attackTeamLabel: '攻撃チーム',
        defenseTeamLabel: '防衛チーム',
        copyTeamsButton: '結果をコピー',
        generateMapButton: 'マップ選択',
        recruitSectionLabel: 'メンバー募集',
        recruitTextarea: 'メンバー名を1行ずつ入力してください',
        currentMembersLabel: '現在のメンバー ',
        copyMembersButton: '現在のメンバーをコピー',
        selectedMapLabel: '選択されたマップ:',
        mapSelectionTitle: 'ランダムマップ選択',
        copyAlert: '結果がクリップボードにコピーされました。',
        noMembersAlert: 'メンバーリストが空です。'
    },
    en: {
        title: 'Valorant Custom Match Team Generator',
        heading: 'Valorant Custom Match Team Generator',
        team1Label: 'TEAM 1',
        team2Label: 'TEAM 2',
        generateTeamsButton: 'Generate Teams',
        resetTeamsButton: 'Reset All Results',
        attackTeamLabel: 'Attack Team',
        defenseTeamLabel: 'Defense Team',
        copyTeamsButton: 'Copy Results',
        generateMapButton: 'Select Map',
        recruitSectionLabel: 'Recruit Members',
        recruitTextarea: 'Enter member names, one per line',
        currentMembersLabel: 'Current Members:',
        copyMembersButton: 'Copy Current Members',
        selectedMapLabel: 'Selected Map:',
        mapSelectionTitle: 'Random Map Selection',
        copyAlert: 'Results copied to clipboard.',
        noMembersAlert: 'Member list is empty.'
    }
};

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
            alert(translations[currentLanguage].noMembersAlert);
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

    textareas.forEach((textarea, index) => {
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
        // 팀 플레이어 입력 텍스트박스의 플레이스홀더 설정
        const placeholderPrefix = currentLanguage === 'ko' ? '플레이어' : 'P';
        textarea.placeholder = `${placeholderPrefix} ${index + 1}`;
    });

    document.getElementById("copy-teams").style.display = "inline-block";
    document.getElementById("reset-teams").style.display = "inline-block";
}

// 결과 복사 기능
function copyTeams() {
    const teamA = Array.from(document.querySelectorAll("#team-a textarea")).map(textarea => textarea.value).join("\n");
    const teamB = Array.from(document.querySelectorAll("#team-b textarea")).map(textarea => textarea.value).join("\n");

    const result = `${translations[currentLanguage].attackTeamLabel}\n${teamA}\n\n${translations[currentLanguage].defenseTeamLabel}\n${teamB}`;
    navigator.clipboard.writeText(result).then(() => {
        alert(translations[currentLanguage].copyAlert);
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
    const availableMaps = maps[currentLanguage].filter(map => map !== lastSelectedMap);
    if (availableMaps.length === 0) {
        alert(translations[currentLanguage].noMembersAlert);
        return;
    }

    const randomMap = availableMaps[Math.floor(Math.random() * availableMaps.length)];
    lastSelectedMap = randomMap; // 마지막 선택 맵 저장
    document.getElementById("selected-map").textContent = `${translations[currentLanguage].selectedMapLabel} ${randomMap}`;
}

// 팀 모집 섹션
const recruitTextarea = document.getElementById("recruit-textarea");
const currentMembersText = document.getElementById("current-members");
const copyMembersButton = document.getElementById("copy-members");

recruitTextarea.addEventListener("input", () => {
    const members = recruitTextarea.value.trim().split("\n").filter(name => name.trim() !== "");
    const memberCountText = currentLanguage === 'ko' ? `${members.length}명` : `${members.length}`;
    currentMembersText.textContent = `${translations[currentLanguage].currentMembersLabel.split(':')[0]}: ${memberCountText}`;
});

copyMembersButton.addEventListener("click", () => {
    const members = recruitTextarea.value.trim().split("\n").filter(name => name.trim() !== "");
    if (members.length === 0) {
        alert(translations[currentLanguage].noMembersAlert);
        return;
    }

    const memberCountText = currentLanguage === 'ko' ? `${members.length}명` : `${members.length}`;
    const totalMembersLabel = currentLanguage === 'jp' ? '総メンバー数' : translations[currentLanguage].currentMembersLabel.split(' ')[0];

    const result = `${translations[currentLanguage].currentMembersLabel.split(':')[0]}:\n${members.join("\n")}\n\n${totalMembersLabel}: ${memberCountText}`;
    navigator.clipboard.writeText(result).then(() => {
        alert(translations[currentLanguage].copyAlert);
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

// 언어 변경 기능
function changeLanguage(language) {
    currentLanguage = language;

    const elements = {
        title: document.querySelector('title'),
        heading: document.querySelector('h1'),
        team1Label: document.querySelector('div.team-inputs > div:nth-child(1) > h2'),
        team2Label: document.querySelector('div.team-inputs > div:nth-child(2) > h2'),
        generateTeamsButton: document.getElementById('generate-teams'),
        resetTeamsButton: document.getElementById('reset-teams'),
        attackTeamLabel: document.querySelector('div.team-output:nth-child(1) > h3'),
        defenseTeamLabel: document.querySelector('div.team-output:nth-child(2) > h3'),
        copyTeamsButton: document.getElementById('copy-teams'),
        generateMapButton: document.getElementById('generate-map'),
        recruitSectionLabel: document.querySelector('div.recruit-section > h2'),
        recruitTextarea: document.getElementById('recruit-textarea'),
        currentMembersLabel: document.getElementById('current-members'),
        copyMembersButton: document.getElementById('copy-members'),
        selectedMapLabel: document.getElementById('selected-map'),
        mapSelectionTitle: document.getElementById('map-selection-title')
    };

    const selectedTranslation = translations[language];

    elements.title.textContent = selectedTranslation.title;
    elements.heading.textContent = selectedTranslation.heading;
    elements.team1Label.textContent = selectedTranslation.team1Label;
    elements.team2Label.textContent = selectedTranslation.team2Label;
    elements.generateTeamsButton.textContent = selectedTranslation.generateTeamsButton;
    elements.resetTeamsButton.textContent = selectedTranslation.resetTeamsButton;
    elements.attackTeamLabel.textContent = selectedTranslation.attackTeamLabel;
    elements.defenseTeamLabel.textContent = selectedTranslation.defenseTeamLabel;
    elements.copyTeamsButton.textContent = selectedTranslation.copyTeamsButton;
    elements.generateMapButton.textContent = selectedTranslation.generateMapButton;
    elements.recruitSectionLabel.textContent = selectedTranslation.recruitSectionLabel;
    elements.recruitTextarea.placeholder = translations[language].recruitTextarea;
    elements.currentMembersLabel.textContent = selectedTranslation.currentMembersLabel;
    elements.copyMembersButton.textContent = selectedTranslation.copyMembersButton;
    elements.selectedMapLabel.textContent = selectedTranslation.selectedMapLabel;
    elements.mapSelectionTitle.textContent = selectedTranslation.mapSelectionTitle;

    // 텍스트박스 플레이스홀더 설정
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

    team1Inputs.forEach((textarea, index) => {
        textarea.placeholder = `P${index + 1}`;
    });

    team2Inputs.forEach((textarea, index) => {
        textarea.placeholder = `P${index + 1}`;
    });

    // 언어 설정을 로컬 스토리지에 저장
    localStorage.setItem('language', language);

    // 선택된 언어 버튼 스타일 업데이트
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`btn-${language}`).classList.add('selected');

    // 폰트 변경
    if (language === 'jp') {
        document.body.style.fontFamily = 'LineSeedSansJP, Arial, sans-serif';
    } else {
        document.body.style.fontFamily = 'LineSeedSansKR, Arial, sans-serif';
    }
}
