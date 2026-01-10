// Функция для переключения вкладок
function showTab(tabName) {
    // 1. Скрываем ВСЕ блоки
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('hidden-tab');
        card.classList.remove('active-tab');
    });
    
    // 2. Показываем нужный блок
    const tabToShow = document.getElementById(tabName + '-tab');
    if (tabToShow) {
        tabToShow.classList.remove('hidden-tab');
        tabToShow.classList.add('active-tab');
    }
}

// Функция для возврата к основному виду (Покупки + Популярные)
function showMainTabs() {
    // Скрываем все
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('hidden-tab');
        card.classList.remove('active-tab');
    });
    
    // Показываем только Покупки и Популярные
    document.getElementById('purchases-tab').classList.remove('hidden-tab');
    document.getElementById('purchases-tab').classList.add('active-tab');
    
    document.getElementById('popular-tab').classList.remove('hidden-tab');
    document.getElementById('popular-tab').classList.add('active-tab');
}