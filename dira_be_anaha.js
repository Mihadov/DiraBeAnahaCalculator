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
    const totalPrice = parseFloat(document.getElementById('totalPrice').value);
    const firstPay = parseFloat(document.getElementById('firstPayment').value);

    // Простейшая проверка
    if (isNaN(totalPrice) || totalPrice <= 0) {
        alert('Укажите корректную цену квартиры.');
        return;
    }
    if (isNaN(firstPay) || firstPay < 0) {
        alert('Укажите корректный первый взнос.');
        return;
    }

    // Сколько нужно покрыть ипотекой:
    let leftover = totalPrice - firstPay;
    let mortgageSum = 0; // текущая сумма ипотеки

    // Примерный набор месяцев (1, 6, 12, 18, 24, 30, 36)
    const monthsArray = [1, 6, 12, 18, 24, 30, 36];
    const blockAmount = totalPrice * 0.10; // каждые полгода добавляем 10% от цены

    // Очищаем таблицу (если она уже была)
    const tableBody = document.getElementById('resultTableBody');
    tableBody.innerHTML = '';

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

        addRow(m, 'Ипотека', addAmount, mortgageSum);
    }

    // Итог внизу
    document.getElementById('summaryInfo').innerHTML = `
        Ипотека набрана: ${mortgageSum.toLocaleString()} шек.
        <br>
        Ежемесячная выплата (к последнему шагу):
        ${calcMonthlyPay(mortgageSum).toLocaleString()} шек./мес
      `;
}