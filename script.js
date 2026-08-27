/* =========================================================

   DINAR APP

   Complete Frontend

   ========================================================= */

/* =========================================================

   DEFAULT DATA

   ========================================================= */

const DEFAULT_STATE = {

  balance: 250000,

  price: 10000,

  transactions: [

    {

      type: "buy",

      amount: 100000,

      usd: 100,

      date: "23/08/2026 - 10:30"

    },

    {

      type: "buy",

      amount: 50000,

      usd: 50,

      date: "22/08/2026 - 14:20"

    },

    {

      type: "system",

      amount: 10000,

      usd: 10,

      date: "21/08/2026 - 11:10"

    }

  ]

};

/* =========================================================

   STATE

   ========================================================= */

let state = loadState();

let selectedPayment = "Visa";

let balanceHidden = false;

/* =========================================================

   LOAD STATE

   ========================================================= */

function loadState() {

  try {

    const saved =

      localStorage.getItem(

        "DINAR_APP_STATE"

      );

    if (!saved) {

      return JSON.parse(

        JSON.stringify(DEFAULT_STATE)

      );

    }

    const parsed =

      JSON.parse(saved);

    return {

      ...JSON.parse(

        JSON.stringify(DEFAULT_STATE)

      ),

      ...parsed

    };

  } catch (error) {

    console.error(

      "State loading error:",

      error

    );

    return JSON.parse(

      JSON.stringify(DEFAULT_STATE)

    );

  }

}

/* =========================================================

   SAVE STATE

   ========================================================= */

function saveState() {

  localStorage.setItem(

    "DINAR_APP_STATE",

    JSON.stringify(state)

  );

}

/* =========================================================

   NUMBER FORMAT

   ========================================================= */

function formatNumber(value) {

  return Number(value || 0)

    .toLocaleString("en-US");

}

/* =========================================================

   USD FORMAT

   ========================================================= */

function formatUsd(value) {

  return "$" +

    Number(value || 0)

      .toFixed(2);

}

/* =========================================================

   DINAR TO USD

   10,000 DINAR = $10

   ========================================================= */

function dinarToUsd(dinar) {

  return (

    Number(dinar || 0) /

    Number(state.price || 10000)

  ) * 10;

}

/* =========================================================

   TOAST

   ========================================================= */

function showToast(message) {

  const toast =

    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(

    window.dinarToastTimer

  );

  window.dinarToastTimer =

    setTimeout(() => {

      toast.classList.remove(

        "show"

      );

    }, 2600);

}

/* =========================================================

   PAGE SYSTEM

   ========================================================= */

function openPage(pageId) {

  document

    .querySelectorAll(".page")

    .forEach(page => {

      page.classList.remove(

        "active"

      );

    });

  const page =

    document.getElementById(

      pageId

    );

  if (!page) {

    return;

  }

  page.classList.add(

    "active"

  );

  document

    .querySelectorAll(".nav-item")

    .forEach(item => {

      item.classList.remove(

        "active"

      );

    });

  const nav =

    document.querySelector(

      `.nav-item[data-page="${pageId}"]`

    );

  if (nav) {

    nav.classList.add(

      "active"

    );

  }

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

  setTimeout(() => {

    if (pageId === "homePage") {

      drawChart(

        document.getElementById(

          "homeChart"

        ),

        155

      );

    }

    if (pageId === "marketPage") {

      drawChart(

        document.getElementById(

          "marketChart"

        ),

        245

      );

    }

  }, 100);

}

/* =========================================================

   NAV ITEMS

   ========================================================= */

document

  .querySelectorAll(".nav-item")

  .forEach(item => {

    item.addEventListener(

      "click",

      () => {

        const page =

          item.dataset.page;

        if (page) {

          openPage(page);

        }

      }

    );

  });

/* =========================================================

   UPDATE UI

   ========================================================= */

function updateUI() {

  const balance =

    Number(state.balance || 0);

  const usd =

    dinarToUsd(balance);

  /* HOME BALANCE */

  const homeBalance =

    document.getElementById(

      "homeBalance"

    );

  const homeUsd =

    document.getElementById(

      "homeUsd"

    );

  if (balanceHidden) {

    homeBalance.textContent =

      "••••••";

    homeUsd.textContent =

      "••••";

  } else {

    homeBalance.textContent =

      formatNumber(balance);

    homeUsd.textContent =

      formatUsd(usd);

  }

  /* WALLET */

  document.getElementById(

    "walletBalance"

  ).textContent =

    formatNumber(balance);

  document.getElementById(

    "availableBalance"

  ).textContent =

    formatNumber(balance);

  document.getElementById(

    "walletUsd"

  ).textContent =

    formatUsd(usd);

  document.getElementById(

    "totalValue"

  ).textContent =

    formatUsd(usd);

  /* PRICE */

  const priceUsd =

    Number(state.price) / 1000;

  document.getElementById(

    "miniPrice"

  ).textContent =

    formatUsd(priceUsd);

  document.getElementById(

    "buyPrice"

  ).textContent =

    formatUsd(priceUsd);

  document.getElementById(

    "marketPrice"

  ).textContent =

    formatNumber(state.price);

  document.getElementById(

    "chartPrice"

  ).textContent =

    formatNumber(state.price) +

    " دینار";

  document.getElementById(

    "adminPrice"

  ).textContent =

    formatNumber(state.price);

  document.getElementById(

    "adminPriceInput"

  ).value =

    state.price;

  updateBuySummary();

  renderTransactions();

}

/* =========================================================

   BUY AMOUNT

   ========================================================= */

const buyAmount =

  document.getElementById(

    "buyAmount"

  );

const amountSlider =

  document.getElementById(

    "amountSlider"

  );

/* =========================================================

   BUY CALCULATOR

   ========================================================= */

function updateBuySummary() {

  let amount =

    Number(

      buyAmount.value

    );

  if (!amount || amount < 1000) {

    amount = 1000;

    buyAmount.value =

      amount;

  }

  const usd =

    dinarToUsd(amount);

  document.getElementById(

    "summaryDinar"

  ).textContent =

    formatNumber(amount);

  document.getElementById(

    "summaryUsd"

  ).textContent =

    formatUsd(usd);

  document.getElementById(

    "buyButtonAmount"

  ).textContent =

    formatNumber(amount);

  amountSlider.value =

    Math.min(

      amount,

      Number(amountSlider.max)

    );

}

/* =========================================================

   BUY INPUT

   ========================================================= */

buyAmount.addEventListener(

  "input",

  updateBuySummary

);

/* =========================================================

   SLIDER

   ========================================================= */

amountSlider.addEventListener(

  "input",

  () => {

    buyAmount.value =

      amountSlider.value;

    updateBuySummary();

  }

);

/* =========================================================

   PAYMENT

   ========================================================= */

document

  .querySelectorAll(".payment")

  .forEach(button => {

    button.addEventListener(

      "click",

      () => {

        document

          .querySelectorAll(".payment")

          .forEach(item => {

            item.classList.remove(

              "active"

            );

          });

        button.classList.add(

          "active"

        );

        selectedPayment =

          button.dataset.payment;

        showToast(

          `شێوازی پارەدان: ${selectedPayment}`

        );

      }

    );

  });

/* =========================================================

   BUY DINAR

   ========================================================= */

document

  .getElementById("buyBtn")

  .addEventListener(

    "click",

    () => {

      const amount =

        Number(

          buyAmount.value

        );

      if (

        !amount ||

        amount < 1000

      ) {

        showToast(

          "تکایە بڕێکی دروست هەڵبژێرە."

        );

        return;

      }

      const usd =

        dinarToUsd(amount);

      /*

        IMPORTANT:

        This is a FRONTEND DEMO.

        Real payment processing must

        happen on a secure backend.

      */

      state.balance +=

        amount;

      state.transactions.unshift({

        type: "buy",

        amount: amount,

        usd: usd,

        payment: selectedPayment,

        date: getDateTime()

      });

      saveState();

      updateUI();

      showToast(

        `${formatNumber(amount)} دینار زیاد کرا.`

      );

      openPage(

        "walletPage"

      );

    }

  );

/* =========================================================

   DATE

   ========================================================= */

function getDateTime() {

  const now =

    new Date();

  const day =

    String(

      now.getDate()

    ).padStart(2, "0");

  const month =

    String(

      now.getMonth() + 1

    ).padStart(2, "0");

  const year =

    now.getFullYear();

  const hours =

    String(

      now.getHours()

    ).padStart(2, "0");

  const minutes =

    String(

      now.getMinutes()

    ).padStart(2, "0");

  return (

    `${day}/${month}/${year} - ${hours}:${minutes}`

  );

}

/* =========================================================

   TRANSACTION HTML

   ========================================================= */

function transactionHTML(transaction) {

  const icon =

    transaction.type === "buy"

      ? "🛒"

      : "✦";

  const title =

    transaction.type === "buy"

      ? "کڕینی دینار"

      : "بۆنەسی سیستەم";

  return `

    <div class="transaction">

      <div class="transaction-icon">

        ${icon}

      </div>

      <div class="transaction-info">

        <strong>

          ${title}

        </strong>

        <small>

          ${transaction.date}

        </small>

      </div>

      <div class="transaction-amount">

        <strong>

          +${formatNumber(transaction.amount)}

        </strong>

        <small>

          ${formatUsd(transaction.usd)}

        </small>

      </div>

    </div>

  `;

}

/* =========================================================

   RENDER TRANSACTIONS

   ========================================================= */

function renderTransactions() {

  const home =

    document.getElementById(

      "homeTransactions"

    );

  const all =

    document.getElementById(

      "allTransactions"

    );

  const transactions =

    state.transactions || [];

  home.innerHTML =

    transactions

      .slice(0, 3)

      .map(transactionHTML)

      .join("");

  all.innerHTML =

    transactions

      .map(transactionHTML)

      .join("");

}

/* =========================================================

   CHART

   ========================================================= */

function drawChart(

  canvas,

  height

) {

  if (!canvas) {

    return;

  }

  const rect =

    canvas.getBoundingClientRect();

  const width =

    Math.max(

      rect.width,

      280

    );

  const ratio =

    window.devicePixelRatio || 1;

  canvas.width =

    width * ratio;

  canvas.height =

    height * ratio;

  canvas.style.height =

    height + "px";

  const ctx =

    canvas.getContext(

      "2d"

    );

  ctx.setTransform(

    ratio,

    0,

    0,

    ratio,

    0,

    0

  );

  const w =

    width;

  const h =

    height;

  ctx.clearRect(

    0,

    0,

    w,

    h

  );

  /* GRID */

  ctx.strokeStyle =

    "rgba(255,255,255,.055)";

  ctx.lineWidth = 1;

  for (

    let i = 1;

    i < 5;

    i++

  ) {

    const y =

      (h / 5) * i;

    ctx.beginPath();

    ctx.moveTo(

      0,

      y

    );

    ctx.lineTo(

      w,

      y

    );

    ctx.stroke();

  }

  /* DATA */

  const values = [

    0.35,

    0.30,

    0.42,

    0.37,

    0.48,

    0.55,

    0.50,

    0.62,

    0.58,

    0.70,

    0.67,

    0.74,

    0.66,

    0.80,

    0.76,

    0.88,

    0.83,

    0.94,

    0.86,

    0.98

  ];

  const points =

    values.map(

      (value, index) => {

        const x =

          (

            index /

            (values.length - 1)

          ) * w;

        const y =

          h -

          (

            value *

            (h - 20)

          ) -

          10;

        return {

          x,

          y

        };

      }

    );

  /* AREA */

  const gradient =

    ctx.createLinearGradient(

      0,

      0,

      0,

      h

    );

  gradient.addColorStop(

    0,

    "rgba(245,197,66,.20)"

  );

  gradient.addColorStop(

    1,

    "rgba(245,197,66,0)"

  );

  ctx.beginPath();

  ctx.moveTo(

    points[0].x,

    h

  );

  points.forEach(

    point => {

      ctx.lineTo(

        point.x,

        point.y

      );

    }

  );

  ctx.lineTo(

    points[

      points.length - 1

    ].x,

    h

  );

  ctx.closePath();

  ctx.fillStyle =

    gradient;

  ctx.fill();

  /* LINE */

  ctx.beginPath();

  points.forEach(

    (point, index) => {

      if (index === 0) {

        ctx.moveTo(

          point.x,

          point.y

        );

      } else {

        ctx.lineTo(

          point.x,

          point.y

        );

      }

    }

  );

  ctx.strokeStyle =

    "#f5c542";

  ctx.lineWidth =

    2.5;

  ctx.lineJoin =

    "round";

  ctx.lineCap =

    "round";

  ctx.stroke();

  /* LAST POINT */

  const last =

    points[

      points.length - 1

    ];

  ctx.beginPath();

  ctx.arc(

    last.x,

    last.y,

    4,

    0,

    Math.PI * 2

  );

  ctx.fillStyle =

    "#f5c542";

  ctx.fill();

}

/* =========================================================

   ADMIN PRICE

   ========================================================= */

document

  .getElementById(

    "savePriceBtn"

  )

  .addEventListener(

    "click",

    () => {

      const input =

        document.getElementById(

          "adminPriceInput"

        );

      const newPrice =

        Number(

          input.value

        );

      if (

        !newPrice ||

        newPrice < 1

      ) {

        showToast(

          "نرخێکی دروست بنووسە."

        );

        return;

      }

      state.price =

        newPrice;

      saveState();

      updateUI();

      showToast(

        `نرخی دینار کرا بە ${formatNumber(newPrice)}.`

      );

    }

  );

/* =========================================================

   HIDE BALANCE

   ========================================================= */

document

  .getElementById(

    "eyeBtn"

  )

  .addEventListener(

    "click",

    () => {

      balanceHidden =

        !balanceHidden;

      updateUI();

    }

  );

/* =========================================================

   MENU

   ========================================================= */

const sideMenu =

  document.getElementById(

    "sideMenu"

  );

const menuBtn =

  document.getElementById(

    "menuBtn"

  );

const closeMenuButton =

  document.getElementById(

    "closeMenu"

  );

const sideOverlay =

  document.getElementById(

    "sideOverlay"

  );

function openMenu() {

  sideMenu.classList.add(

    "open"

  );

}

function closeMenu() {

  sideMenu.classList.remove(

    "open"

  );

}

menuBtn.addEventListener(

  "click",

  openMenu

);

closeMenuButton.addEventListener(

  "click",

  closeMenu

);

sideOverlay.addEventListener(

  "click",

  closeMenu

);

/* =========================================================

   NOTIFICATION

   ========================================================= */

document

  .getElementById(

    "notificationBtn"

  )

  .addEventListener(

    "click",

    () => {

      showToast(

        "هیچ ئاگادارکردنەوەیەکی نوێ نییە 🔔"

      );

    }

  );

/* =========================================================

   LOGOUT

   ========================================================= */

document

  .getElementById(

    "logoutBtn"

  )

  .addEventListener(

    "click",

    () => {

      showToast(

        "ئەمە وەشانی demo ـی دینارە."

      );

    }

  );

/* =========================================================

   PERIOD BUTTONS

   ========================================================= */

document

  .querySelectorAll(".periods button")

  .forEach(button => {

    button.addEventListener(

      "click",

      () => {

        document

          .querySelectorAll(".periods button")

          .forEach(item => {

            item.classList.remove(

              "active"

            );

          });

        button.classList.add(

          "active"

        );

        showToast(

          `ماوەی گراف: ${button.textContent}`

        );

      }

    );

  });

/* =========================================================

   HISTORY TABS

   ========================================================= */

document

  .querySelectorAll(".history-tabs button")

  .forEach(button => {

    button.addEventListener(

      "click",

      () => {

        document

          .querySelectorAll(".history-tabs button")

          .forEach(item => {

            item.classList.remove(

              "active"

            );

          });

        button.classList.add(

          "active"

        );

        const filter =

          button.textContent.trim();

        const all =

          document.getElementById(

            "allTransactions"

          );

        let transactions =

          state.transactions || [];

        if (filter === "کڕین") {

          transactions =

            transactions.filter(

              item =>

                item.type === "buy"

            );

        }

        if (filter === "سیستەم") {

          transactions =

            transactions.filter(

              item =>

                item.type === "system"

            );

        }

        all.innerHTML =

          transactions

            .map(transactionHTML)

            .join("");

      }

    );

  });

/* =========================================================

   RESIZE

   ========================================================= */

window.addEventListener(

  "resize",

  () => {

    const home =

      document.getElementById(

        "homePage"

      );

    const market =

      document.getElementById(

        "marketPage"

      );

    if (

      home.classList.contains(

        "active"

      )

    ) {

      drawChart(

        document.getElementById(

          "homeChart"

        ),

        155

      );

    }

    if (

      market.classList.contains(

        "active"

      )

    ) {

      drawChart(

        document.getElementById(

          "marketChart"

        ),

        245

      );

    }

  }

);

/* =========================================================

   START APP

   ========================================================= */

document.addEventListener(

  "DOMContentLoaded",

  () => {

    updateUI();

    setTimeout(

      () => {

        drawChart(

          document.getElementById(

            "homeChart"

          ),

          155

        );

      },

      100

    );

  }

);