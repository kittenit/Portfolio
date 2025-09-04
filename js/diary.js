function initDiaryPage() {
  // 1. 날짜 업데이트
  function updateDateTime() {
    const now = new Date();
    const target = document.getElementById("currentDateTime");
    if (target) {
      target.innerText = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    }
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  // 2. 플립 버튼 이벤트 등록
  const flipButtons = document.querySelectorAll(".flip-button");
  const container = document.querySelector(".container");

  if (container && flipButtons.length > 0) {
    flipButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        container.classList.toggle("flipped");
      });
    });
  } else {
    console.warn("플립 요소를 찾지 못했습니다.");
  }

  // 3. 로컬 저장
  ["entry1", "entry2"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const saved = localStorage.getItem(id);
      if (saved) el.innerText = saved;

      el.addEventListener("input", () => {
        localStorage.setItem(id, el.innerText);
      });
    }
  });
}

window.initDiaryPage = initDiaryPage;


