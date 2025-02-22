async function wapper() {
  let domparser = new DOMParser();

  const VERSION = "v0.2 by kimsm";
  console.log("Running popn class script", VERSION, "\nPLZ wait a minute...");

  const MEDAL_BONUS = {
    a: 5000,
    b: 5000,
    c: 5000,
    d: 5000,
    e: 3000,
    f: 3000,
    g: 3000,
    h: 0,
    i: 0,
    j: 0,
    k: 3000,
    none: 0,
  };

  const PLAY_DATA_URL = "https://p.eagate.573.jp/game/popn/unilab/playdata";
  const MEDAL_IMAGE_URL =
    "https://eacache.s.konaminet.jp/game/popn/unilab/images/p/common/medal";

  function resToText(res) {
    return res.arrayBuffer().then((buffer) => {
      if (res.headers.get("Content-Type").includes("UTF-8")) {
        return new TextDecoder().decode(buffer);
      } else {
        return new TextDecoder("Shift_JIS").decode(buffer)
      }
    })
  }

  function whatever(url, level) {
    return fetch(url)
      .then(resToText)
      .then((text) => domparser.parseFromString(text, "text/html"))
      .then((doc) => doc.querySelectorAll("ul.mu_list_table > li"))
      .then((lis) => {
        return Array.from(lis)
          .filter((li) => li.firstElementChild.className.startsWith("col"))
          .map((li) => [
            li.children[3].textContent,
            li.children[3].firstChild.src
              .replace(`${MEDAL_IMAGE_URL}/meda_`, "")
              .replace(".png", ""),
            li.firstElementChild.lastElementChild.textContent,
            li.firstElementChild.firstElementChild.textContent,
          ])
          .map(([score, medal, genre, song]) => {
            return {
              song,
              genre,
              score,
              medal,
              level,
              point:
                score < 50000
                  ? 0
                  : Math.floor(
                    (100 *
                      (10000 * level +
                        parseInt(score) -
                        50000 +
                        MEDAL_BONUS[medal])) /
                    5440
                  ) / 100,
            };
          });
      });
  }

  let arr = new Array();
  let levels = Array.from({length: 50}, (_, i) => i + 1);
  for(let i = 0; i < 15; i++){
    arr.push(...(levels.map(level => [i, level])));
  }

  const promises = arr.map(([page, level]) =>
    whatever(`${PLAY_DATA_URL}/mu_lv.html?page=${page}&level=${level}`, level)
  );

  const player = await fetch(`${PLAY_DATA_URL}/index.html`)
    .then(resToText)
    .then((text) => domparser.parseFromString(text, "text/html"))
    .then(
      (doc) =>
        doc.querySelector("#status_table > div.st_box > div:nth-child(2)")
          .textContent
    );

  const s = (await Promise.all(promises))
    .flat()
    .sort((a, b) => b.point - a.point)
    .slice(0, 50);
  console.log({ s })
  const avg = s.reduce((acc, cur) => acc + cur.point, 0) / 50;

  const divEl = document.createElement("div");
  divEl.id = "pokkura";
  divEl.innerHTML = `
  <style scoped>
  .pokura {
    display: flex;
    justify-content: center;
  }
  .pokuraTable {
    background-color: #feffb7;
    border-collapse: collapse;
  }
  .pokuraTable:first-child {
    margin-right: 10px;
  }
  .pokuraTable tr {
    border-bottom: 2px solid #d82f66;
  }
  .pokuraTable th {
    padding: 4px;
  }
  .pokuraTable td {
    padding: 0 4px;
  }
  .pokuraTable td img {
    vertical-align: middle;
  }
  .profileTable {
    margin: 10px auto;
    font-size: 14px;
  }
  .profileTable td {
    padding: 5px;
  }
  .profileTable td:first-child {
    font-weight: bold;
  }
  .footnote {
    font-size: 10px;
    margin: 8px auto;
    color: gray;
    text-align: center;
  }
  @media (max-width: 768px) {
    .pokura {
      flex-direction: column;
    }
    .pokuraTable {
      width: 100%;
      margin-bottom: 20px;
    }
    .profileTable {
      width: auto;
    }
    .pokuraTable th:first-child,td:first-child {
      min-width: 20px;
    }
    .pokuraTable th:nth-child(4),td:nth-child(4) {
      min-width: 40px;
    }
    .pokuraTable th:nth-child(5),td:nth-child(5) {
      min-width: 40px;
    }
    .pokuraTable th:nth-child(6),td:nth-child(6) {
      min-width: 50px;
    }
  }
  </style>
  <table class="pokuraTable profileTable"><tr><td>플레이어 명</td><td>${player}</td></tr><tr><td>팝 클래스</td><td>${(
      Math.floor(avg * 100) / 100
    ).toFixed(2)}</td></tr><tr><td>+0.01까지 앞으로</td><td>${Math.ceil(
      ((1 - ((avg * 100) % 1)) * 5440 * 50) / 100
    )}</td></tr></table>
  <div class="pokura">
  <table class="pokuraTable">
    <tr><th>LV</th><th>장르</th><th>곡명</th><th>점수</th><th>메달</th><th>팝 클래스</th></tr>
    ${s
      .slice(0, 25)
      .map(
        (x) =>
          `<tr><td>${x.level}</td><td>${x.genre}</td><td>${x.song}</td><td>${x.score
          }</td><td><img src="${MEDAL_IMAGE_URL}/meda_${x.medal
          }.png"></td><td>${x.point.toFixed(2)}</td></tr>`
      )
      .join("")}
  </table>
  <table class="pokuraTable">
    <tr><th>LV</th><th>장르</th><th>곡명</th><th>점수</th><th>메달</th><th>팝 클래스</th></tr>
    ${s
      .slice(25)
      .map(
        (x) =>
          `<tr><td>${x.level}</td><td>${x.genre}</td><td>${x.song}</td><td>${x.score
          }</td><td><img src="${MEDAL_IMAGE_URL}/meda_${x.medal
          }.png"></td><td>${x.point.toFixed(2)}</td></tr>`
      )
      .join("")}
  </table>
  </div>
  <div class="footnote">팝 클래스 스크립트${VERSION}</div>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(divEl);
}

wapper();
