const trendingData = [
  {
    ticker: "NVDA",
    contract: "540C 07/19",
    type: "Call",
    volume: "128,420",
    openInterest: "39,840",
    ratio: "3.2x",
    last: "$12.40",
  },
  {
    ticker: "TSLA",
    contract: "210P 06/21",
    type: "Put",
    volume: "96,310",
    openInterest: "29,105",
    ratio: "3.3x",
    last: "$8.15",
  },
  {
    ticker: "AAPL",
    contract: "195C 06/28",
    type: "Call",
    volume: "84,902",
    openInterest: "31,552",
    ratio: "2.7x",
    last: "$5.85",
  },
  {
    ticker: "AMD",
    contract: "155C 07/05",
    type: "Call",
    volume: "72,180",
    openInterest: "18,644",
    ratio: "3.9x",
    last: "$4.10",
  },
  {
    ticker: "SPY",
    contract: "525P 06/21",
    type: "Put",
    volume: "65,743",
    openInterest: "34,210",
    ratio: "1.9x",
    last: "$3.42",
  },
  {
    ticker: "META",
    contract: "505C 07/19",
    type: "Call",
    volume: "58,662",
    openInterest: "20,503",
    ratio: "2.9x",
    last: "$9.25",
  },
];

const tickerStats = {
  NVDA: {
    price: "$501.24",
    ivRank: "62%",
    putCall: "0.72",
    maxPain: "$495",
    topStrike: "540",
    expiry: "07/19",
  },
  TSLA: {
    price: "$187.80",
    ivRank: "58%",
    putCall: "1.15",
    maxPain: "$185",
    topStrike: "200",
    expiry: "06/21",
  },
  AAPL: {
    price: "$193.40",
    ivRank: "41%",
    putCall: "0.64",
    maxPain: "$190",
    topStrike: "195",
    expiry: "06/28",
  },
  AMD: {
    price: "$149.28",
    ivRank: "54%",
    putCall: "0.83",
    maxPain: "$150",
    topStrike: "155",
    expiry: "07/05",
  },
  SPY: {
    price: "$527.12",
    ivRank: "37%",
    putCall: "0.94",
    maxPain: "$525",
    topStrike: "530",
    expiry: "06/21",
  },
  META: {
    price: "$476.05",
    ivRank: "46%",
    putCall: "0.69",
    maxPain: "$470",
    topStrike: "480",
    expiry: "07/19",
  },
};

const fallbackExpiries = ["06/14", "06/21", "06/28", "07/05", "07/19", "08/16"];

const trendingBody = document.getElementById("trending-body");
const statsGrid = document.getElementById("stats-grid");
const tickerInput = document.getElementById("ticker-input");
const searchButton = document.getElementById("search-button");
const chips = document.querySelectorAll(".chip");
const statsTicker = document.getElementById("stats-ticker");
const statsSource = document.getElementById("stats-source");

const createRow = (item) => {
  const row = document.createElement("div");
  row.className = "table-row";

  const badgeClass = item.type.toLowerCase();

  row.innerHTML = `
    <span><strong>${item.ticker}</strong></span>
    <span>${item.contract}</span>
    <span><span class="badge ${badgeClass}">${item.type}</span></span>
    <span>${item.volume}</span>
    <span>${item.openInterest}</span>
    <span>${item.ratio}</span>
    <span>${item.last}</span>
  `;

  return row;
};

const renderTrending = (filter = "all") => {
  trendingBody.innerHTML = "";
  const filtered = trendingData.filter((item) =>
    filter === "all" ? true : item.type.toLowerCase() === filter
  );
  filtered.forEach((item) => trendingBody.appendChild(createRow(item)));
};

const buildStatCard = (label, value) => {
  const card = document.createElement("div");
  card.className = "stat-card";
  card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
  return card;
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const generateFallbackStats = (ticker) => {
  const hash = hashString(ticker);
  const basePrice = 40 + (hash % 650);
  const ivRank = 25 + (hash % 55);
  const putCall = (0.6 + ((hash % 90) / 100)).toFixed(2);
  const maxPain = basePrice - (hash % 12) + 2;
  const topStrike = Math.round((basePrice + (hash % 18) - 8) / 5) * 5;
  const expiry = fallbackExpiries[hash % fallbackExpiries.length];

  return {
    price: `$${basePrice.toFixed(2)}`,
    ivRank: `${ivRank}%`,
    putCall,
    maxPain: `$${maxPain.toFixed(0)}`,
    topStrike: `${topStrike}`,
    expiry,
    generated: true,
  };
};

const renderStats = (ticker) => {
  const stats = tickerStats[ticker] ?? generateFallbackStats(ticker);
  statsGrid.innerHTML = "";
  statsTicker.textContent = ticker;
  statsSource.textContent = stats.generated
    ? "Estimated snapshot based on sector averages."
    : "Based on the latest market snapshot.";

  const cards = [
    ["Underlying price", stats.price],
    ["IV rank", stats.ivRank],
    ["Put/Call ratio", stats.putCall],
    ["Max pain", stats.maxPain],
    ["Top strike", stats.topStrike],
    ["Next expiry", stats.expiry],
  ];

  cards.forEach(([label, value]) => statsGrid.appendChild(buildStatCard(label, value)));
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((btn) => btn.classList.remove("active"));
    chip.classList.add("active");
    renderTrending(chip.dataset.filter);
  });
});

searchButton.addEventListener("click", () => {
  const ticker = tickerInput.value.trim().toUpperCase();
  if (ticker.length === 0) {
    return;
  }
  renderStats(ticker);
});

tickerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

renderTrending();
renderStats("NVDA");
