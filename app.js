const dealsTable = document.getElementById("deals-body");
let openCardId = null;

// Функция для получения сделок через API (максимум 3 за раз)
async function fetchDeals() {
  console.log(1);

  const res = await fetch(
    "https://maxmoodoff13.amocrm.ru/api/v4/leads?limit=3",
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYyYmQ1MGMzNmMxMmI4YjFlMTU4M2UyZmQyZTg0NzQwZGQ5MGUzYTljNjkxY2QyNTExZmRiOThiMzk2NWI5Y2JiM2YwZmNhMzUzNDMxMjE4In0.eyJhdWQiOiJkNDFkZWVmNS1kYzBmLTQ4NDItYTJmMC1kZGZiMWEzOTJiYjkiLCJqdGkiOiJmMmJkNTBjMzZjMTJiOGIxZTE1ODNlMmZkMmU4NDc0MGRkOTBlM2E5YzY5MWNkMjUxMWZkYjk4YjM5NjViOWNiYjNmMGZjYTM1MzQzMTIxOCIsImlhdCI6MTcyNTc5NDc2NSwibmJmIjoxNzI1Nzk0NzY1LCJleHAiOjE3MjU4ODExNjUsInN1YiI6IjExNDkwNjA2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTM4NjEwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZmY0YjZlYjQtNWQ4NS00OThlLWFmYWEtNDM5YzY4NDA3NzUyIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.Fq1AmJ1HHeauYDJ4mhRFcHRxzF_tU7GQfSvuXyp7VxYAfTalS1jchmGghXbH5IpdyH2d-IPiNnr3X0u-XkX63_bQNpaZwfV1_xOzFNX9JeLr8DgOf0EjYeKBEySqYdUu9fXTRA9TPIyYoYPARqCNC3O71N7kkNxYe7u-Bpiay1u7rE6uSxfznGvY2pWyYj7eEd4MdsydP0HPZftV9bSGOKACtJ71WbEG7Jfgim65PqyqmLYVTnFjtL3jRMnnSZbBya8sQtHa-XG_wiYEF2bCBOXI3QnheCj10Ho4sG2Zil-HVZiDO1Jkp7TSTtXj4cHYFvZTAvoJpCd8AVcof2pDuA"}`,
      },
    }
  );
  console.log(res);
  const {
    _embedded: { leads: deals },
  } = await res.json();

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

  await new Promise((resolve) => setTimeout(resolve, 1000)); // ждем 1 секунду перед следующим запросом
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
