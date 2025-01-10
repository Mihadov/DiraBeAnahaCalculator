/**
        * Функция для расчёта ежемесячного платежа:
        * каждый блок 10,000 шек. в ипотеке добавляет 55 шек. к месячной выплате.
        * Например: 250,000 шек. → 25 блоков → 25 × 55 = 1,375 шек./мес
        */
function calcMonthlyPay(mortgageSum) {
    // Делим ипотеку на 10,000, чтобы узнать количество «блоков»
    const blocks = Math.floor(mortgageSum / 10000);
    return blocks * 55;
}

/**
 * Основная функция расчёта (пример):
 * 1) Берём из полей ввода стоимость квартиры (totalPrice) и первый взнос (firstPay).
 * 2) Считаем, сколько остаётся покрывать ипотекой (leftover).
 * 3) Генерируем таблицу по месяцам, где каждые полгода добавляем 10% и т.д.
 * 4) После каждого добавления ипотеки пересчитываем ежемесячный платёж через calcMonthlyPay().
 */
function calculate() {
    clearError(); // Убираем прошлую ошибку (если была)

    // Очищаем таблицу (если она уже была)
    const tableBody = document.getElementById('resultTableBody');
    tableBody.innerHTML = '';
    document.getElementById('summaryInfo').innerHTML = '';


    const totalPrice = parseFloat(document.getElementById('totalPrice').value);
    const firstPayPercent = parseFloat(document.getElementById('firstPaymentRange').value);

    if (isNaN(totalPrice) || totalPrice <= 100000) {
        showError('Укажите корректную цену квартиры. Сумма должна быть больше 100000.');
        return;
    }

    // Считаем первый платёж как % от стоимости квартиры
    const firstPay = totalPrice * (firstPayPercent / 100);


    // Сколько нужно покрыть ипотекой:
    let leftover = totalPrice - firstPay;
    let mortgageSum = 0; // текущая сумма ипотеки

    // Примерный набор месяцев (1, 6, 12, 18, 24, 30, 36)
    const monthsArray = [1, 6, 12, 18, 24, 30, 36];
    const blockAmount = totalPrice * 0.10; // каждые полгода добавляем 10% от цены

    // Показываем блок с таблицей
    document.getElementById('tableContainer').style.display = 'block';

    // Функция для добавления строки в таблицу
    function addRow(month, paymentType, paymentAmount, mortgageAfter) {
        const monthlyPay = calcMonthlyPay(mortgageAfter);
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${month}</td>
          <td>${paymentType}</td>
          <td>${paymentAmount.toLocaleString()}</td>
          <td>${mortgageAfter.toLocaleString()}</td>
          <td>${monthlyPay.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    }

    // 0-й месяц: собственный взнос
    addRow(0, 'Собственные средства', firstPay, 0);

    // По ключевым месяцам
    for (let i = 0; i < monthsArray.length; i++) {
        const m = monthsArray[i];
        if (leftover <= 0) break;

        // Добавляем 10% или остаток
        let addAmount = (m === 36)
            ? leftover
            : Math.min(blockAmount, leftover);

        mortgageSum += addAmount;
        leftover -= addAmount;

        let mToPrint = (m === 1) ? `${m}-${m + 5}` :
            (m === 36) ? `${m+1}+` :
                `${m+1}-${m + 6}`;

        addRow(mToPrint, 'Ипотека', addAmount, mortgageSum);
    }

    // Итог внизу
    document.getElementById('summaryInfo').innerHTML = `
        Ипотека набрана: ${mortgageSum.toLocaleString()} шек.
        <br>
        Ежемесячная выплата (к последнему шагу):
        ${calcMonthlyPay(mortgageSum).toLocaleString()} шек./мес
      `;
}

// Обновление значения % для ползунка
function updateFirstPaymentLabel(value) {
    const label = document.getElementById('firstPaymentLabel');
    label.textContent = value;
}

// Функция для отображения ошибок
function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = message;
    errorContainer.classList.remove('d-none'); // Показываем ошибку
}

// Функция для скрытия ошибок
function clearError() {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.classList.add('d-none'); // Скрываем ошибку
    errorContainer.textContent = ''; // Очищаем текст
}

window.onload = function () {
    // Перехват события отправки формы
    document.getElementById('calculatorForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение (перезагрузку)
        calculate(); // Вызываем функцию расчёта
    });

    // Перехват нажатия Enter внутри формы
    document.getElementById('calculatorForm').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Отменяем стандартное поведение
            calculate(); // Вызываем функцию расчёта
        }
    });

    // Отслеживаем клик по кнопке "Рассчитать"
    document.getElementById('calculateButton').addEventListener('click', function () {
        // Отправляем событие в Simple Analytics
        sa_event('Calculate Button Click');
        //console.log('Событие отправлено в Simple Analytics');
    });
};