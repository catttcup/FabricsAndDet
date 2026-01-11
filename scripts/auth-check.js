document.addEventListener('DOMContentLoaded', function() {
    console.log('Проверка авторизации для ЛК...');
    setTimeout(() => {
        checkAuthAndUpdateButton();
    }, 100);

    // Проверяем, загружен ли apiService
    if (!window.apiService) {
        console.error('API service not loaded!');
        alert('Ошибка загрузки сервиса авторизации');
        window.location.href = '/index.html';
        return;
    }
    
    // Проверяем авторизацию
    if (!apiService.isAuthenticated()) {
        console.log('Пользователь не авторизован, перенаправляем...');
        alert('Для доступа к личному кабинету необходимо войти в систему');
        window.location.href = '/index.html';
        return;
    }
    
    console.log('Пользователь авторизован, загружаем ЛК...');
    
    // Загружаем данные пользователя
    const user = apiService.getUser();
    if (user) {
        // Обновляем интерфейс ЛК данными пользователя
        updateLKUserInfo(user);
    }
    
    // Загружаем покупки пользователя (мок-данные)
    loadUserPurchases();
});
function checkAuthAndUpdateButton() {
    // Проверяем, загружен ли apiService
    if (!window.apiService) {
        console.warn('API service not loaded, trying to initialize...');
        // Пытаемся инициализировать, если не загружен
        if (typeof MockApiService !== 'undefined') {
            window.apiService = new MockApiService();
            console.log('API service initialized manually');
        } else {
            console.error('API service not available!');
            return;
        }
    }
}
 // ДЛЯ ЛК проверяем авторизацию строго
if (window.location.pathname.includes('lk.html')) {
        if (!apiService.isAuthenticated()) {
            console.log('Пользователь не авторизован, перенаправляем...');
            alert('Для доступа к личному кабинету необходимо войти в систему');
            window.location.href = '/index.html';
            return;
        }
        
        console.log('Пользователь авторизован, загружаем ЛК...');
        
        // Загружаем данные пользователя
        const user = apiService.getUser();
        if (user) {
            updateLKUserInfo(user);
        }
        
        loadUserPurchases();
    }
    
    // ДЛЯ КОРЗИНЫ И ДРУГИХ СТРАНИЦ - не проверяем авторизацию!
    // Корзина доступна без авторизации
    
    // Для ВСЕХ страниц обновляем кнопку авторизации
    updateAuthButtonOnAllPages();

    
function updateLKUserInfo(user) {
    console.log('Обновление информации ЛК для:', user);
    
    // Обновляем баланс
    const balanceElement = document.querySelector('.balance');
    if (balanceElement) {
        balanceElement.textContent = `${user.balance || 0} ₽`;
    }
    
    // Обновляем имя пользователя (если есть элементы с классом user-name)
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = user.username || user.email || 'Пользователь';
    });
}

function loadUserPurchases() {
    // Мок-данные покупок
    const mockPurchases = [
        { id: 1, name: 'Товар 1', description: 'Короткое описание товара', price: 999 },
        { id: 2, name: 'Товар 2', description: 'Короткое описание товара', price: 1499 },
        { id: 3, name: 'Товар 3', description: 'Короткое описание товара', price: 799 }
    ];
    
    // Можно динамически заполнить сетку товаров
    console.log('Загружены покупки:', mockPurchases);
}

// Обновляем кнопку авторизации на всех страницах
function updateAuthButtonOnAllPages() {
    const authButton = document.querySelector('.menu__btn-login');
    if (!authButton || !window.apiService) return;
    
    const textSpan = authButton.querySelector('.menu__btn-text');
    if (!textSpan) return;
    
    const isAuthenticated = apiService.isAuthenticated();
    const isLkPage = window.location.pathname.includes('lk.html');
    
    if (isAuthenticated) {
        // Авторизован
        textSpan.textContent = 'Личный кабинет';
        
        if (isLkPage) {
            // В ЛК - неактивная кнопка
            authButton.style.cursor = 'default';
            authButton.style.opacity = '0.7';
            authButton.onclick = function(e) {
                e.preventDefault();
                return false;
            };
        } else {
            // На других страницах - ссылка на ЛК
            authButton.onclick = function() {
                window.location.href = '/lk.html';
            };
            authButton.style.cursor = 'pointer';
            authButton.style.opacity = '1';
        }
    } else {
        // Не авторизован
        textSpan.textContent = 'Войти';
        authButton.style.cursor = 'pointer';
        authButton.style.opacity = '1';
        
        // Для корзины и других страниц - переход на главную для входа
        if (!window.location.pathname.includes('index.html')) {
            authButton.onclick = function() {
                window.location.href = '/index.html';
            };
        }
    }
}

// Запускаем при загрузке ЛК
updateAuthButtonOnAllPages();
updateAuthButton();