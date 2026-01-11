// Функция для переключения вкладок
function switchTab(tabId) {
    console.log('Переключаем на:', tabId);
    
    // 1. Скрываем ВСЕ вкладки в центральной части
    const allTabs = document.querySelectorAll('.main-content .content-tab');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // 2. Показываем нужную вкладку
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // 3. Обновляем активные кнопки в меню
    const allButtons = document.querySelectorAll('.user-links li.orange-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 4. Активируем нажатую кнопку
    const activeButton = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена');
    makeLKButtonInactive();
    updateLKHeader();
    
    // Находим все кликабельные кнопки (orange-btn с data-tab)
    const menuButtons = document.querySelectorAll('.user-links li.orange-btn[data-tab]');
    
    // Добавляем обработчики клика
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // По умолчанию показываем "Покупки"
    switchTab('purchases');
    
    // Для отладки
    console.log('Найдено кликабельных кнопок:', menuButtons.length);
});

function makeLKButtonInactive() {
    const loginBtn = document.querySelector('.menu__btn-login');
    if (loginBtn) {
        // Меняем текст если нужно
        const textSpan = loginBtn.querySelector('.menu__btn-text');
        if (textSpan) {
            textSpan.textContent = 'Личный кабинет';
        }
        
        // Делаем не кликабельным
        loginBtn.onclick = function(e) {
            e.preventDefault();
            return false;
        };
        
        // Курсор по умолчанию
        loginBtn.style.cursor = 'default';
        
        // НЕ меняем цвет! Оставляем как у других кнопок
        loginBtn.style.opacity = '1';
        loginBtn.style.filter = 'none';
        
        console.log('Кнопка в ЛК отключена');
    }
}
function updateLKHeader() {
    // Меняем текст кнопки "Войти" на "Личный кабинет"
    const loginBtn = document.querySelector('.menu__btn-login');
    if (loginBtn) {
        // Просто меняем текст, оставляя иконку
        const textSpan = loginBtn.querySelector('.menu__btn-text');
        if (textSpan) {
            textSpan.textContent = 'Личный кабинет';
        }
        
        // Делаем ее неактивной (ведь мы уже в ЛК)
        loginBtn.style.opacity = '0.7';
        loginBtn.style.cursor = 'default';
        loginBtn.onclick = function(e) {
            e.preventDefault(); // Предотвращаем переход
        };
    }
}

window.logoutUser = function() {
    if (confirm('Вы действительно хотите выйти?')) {
        // Очищаем localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        
        // Используем apiService если он есть
        if (window.apiService && apiService.logout) {
            apiService.logout();
        }
        
        console.log('✅ Пользователь вышел из системы');
        
        // Перенаправляем на главную
        window.location.href = '/index.html';
    }
};
