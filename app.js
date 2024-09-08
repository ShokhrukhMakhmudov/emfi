const dealsTable = document.getElementById("deals-body");
let openCardId = null;

// Функция для получения сделок через API (максимум 3 за раз)
async function fetchDeals() {
  let page = 1; // предполагаем, что страницы сделок пронумерованы
  const limit = 3;

  while (true) {
    const response = await fetch(
      "https://maxmoodoff13.amocrm.ru/api/v4/leads/",
      {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            btoa("maxmoodoff13:6b2b0b9d-2d7c-4d9c-bb4a-0e5f7d4b0b7d"),
        },
      }
    );
    const deals = await response.json();
    console.log(deals);

    deals.forEach((deal) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", deal.id);

      row.innerHTML = `
          <td>${deal.id}</td>
          <td>${deal.name}</td>
          <td>${deal.budget}</td>
        `;

      row.addEventListener("click", () => loadDealDetails(row, deal.id));

      dealsTable.appendChild(row);
    });

    page++;
    if (deals.length < limit) break; // прерываем цикл, если карточек меньше лимита

    await new Promise((resolve) => setTimeout(resolve, 1000)); // ждем 1 секунду перед следующим запросом
  }
}

// Функция для получения деталей сделки при клике
async function loadDealDetails(row, dealId) {
  if (openCardId === dealId) {
    // Закрываем карточку, если она открыта
    row.innerHTML = `
        <td>${dealId}</td>
        <td>${row.dataset.name}</td>
        <td>${row.dataset.budget}</td>
      `;
    openCardId = null;
    return;
  }

  openCardId = dealId;

  row.innerHTML = '<td colspan="3"><div class="spinner"></div></td>';

  const response = await fetch(`https://api.example.com/deals/${dealId}`);
  const deal = await response.json();

  const taskStatus = getTaskStatus(deal.task_date); // Определяем статус задачи

  row.innerHTML = `
      <td>${deal.id}</td>
      <td>${deal.name}</td>
      <td>${deal.budget}</td>
      <td>${formatDate(deal.task_date)}</td>
      <td><span class="status-circle ${taskStatus}"></span></td>
    `;
}

// Функция для определения статуса задачи
function getTaskStatus(taskDate) {
  const today = new Date();
  const task = new Date(taskDate);

  if (task < today) return "status-red";
  if (task.toDateString() === today.toDateString()) return "status-green";
  return "status-yellow";
}

// Функция для форматирования даты в DD.MM.YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Инициализация получения данных
fetchDeals();
