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

// Функция выхода из профиля
function handleLogout(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (confirm('Вы точно хотите выйти?')) {
        // Устанавливаем флаг, что идет процесс выхода
        if (window.setLoggingOut) {
            window.setLoggingOut(true);
        }
        
        // Очищаем данные пользователя - ВСЕ ключи!
        if (window.userSimple && userSimple.logout) {
            userSimple.logout();
        } else {
            // Если userSimple не доступен, очищаем localStorage вручную
            // ВАЖНО: Очищаем ВСЕ ключи, которые могут хранить данные пользователя
            localStorage.removeItem('username');        // ДЛЯ user-simple.js
            localStorage.removeItem('currentUser');     // ДЛЯ apiService
            localStorage.removeItem('userToken');       // ДЛЯ apiService  
            localStorage.removeItem('userLoggedIn');    // ДЛЯ apiService
            localStorage.removeItem('cartItems');       // Для корзины
            
            console.log('Все данные пользователя очищены');
            
            // Перенаправляем на главную страницу
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 100);
        }
    }
    
    return false;
}

// Проверка авторизации - с учётом ВСЕХ возможных ключей
function isUserAuthenticated() {
    // Проверяем все возможные способы хранения авторизации
    const hasUsername = localStorage.getItem('username') !== null;
    const hasCurrentUser = localStorage.getItem('currentUser') !== null;
    const hasUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const hasUserToken = localStorage.getItem('userToken') !== null;
    
    return hasUsername || hasCurrentUser || hasUserLoggedIn || hasUserToken;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('LK.js загружен');
    
    // Используем userSimple для проверки авторизации
    if (!window.userSimple || !userSimple.isAuthenticated()) {
        console.log('Пользователь не авторизован, перенаправляем...');
        alert('Для доступа к личному кабинету необходимо войти в систему');
        window.location.href = '/index.html';
        return;
    }
    
    console.log('Пользователь авторизован');
    
    // Загружаем покупки
    if (window.purchasesManager && purchasesManager.updatePurchasesDisplay) {
        purchasesManager.updatePurchasesDisplay();
    }
    
    // Обновляем данные пользователя
    if (window.userSimple.updateUI) {
        userSimple.updateUI();
    }
    
    // Настраиваем кнопку выхода
    setupLogoutButton();
});

// Настройка кнопки выхода
function setupLogoutButton() {
    const logoutBtn = document.querySelector('.orange-btn-exit');
    if (!logoutBtn) {
        console.error('Кнопка выхода не найдена!');
        return;
    }
    
    logoutBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Вы точно хотите выйти?')) {
            // Используем userSimple для выхода
            if (window.userSimple && userSimple.logout) {
                userSimple.logout();
            } else {
                // Если userSimple не доступен, очищаем вручную
                localStorage.removeItem('username');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');  
                
                alert('Вы вышли из аккаунта');
                window.location.href = '/index.html';
            }
        }
    };
    
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.title = 'Выйти из аккаунта';
    console.log('Кнопка выхода настроена');
}

// Функции для работы с вкладками
function showContent(tabName) {
    let title = '';
    
    if (tabName === 'payment') {
        title = 'Способы оплаты';
    } else if (tabName === 'requisites') {
        title = 'Реквизиты';
    } else if (tabName === 'devices') {
        title = 'Ваши устройства';
    }
    
    alert(`Функция "${title}" находится в разработке`);
}