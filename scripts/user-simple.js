class UserSimple {
    constructor() {
        this.currentUser = null;
    }
    
    // Получить данные пользователя
    getUser() {
        // 1. Проверяем реальный API
        const token = localStorage.getItem('token');
        if (token) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    return user.username || user.email || 'Пользователь';
                } catch {}
            }
        }
        
        // 2. Проверяем mock API
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                return user.username || user.email || 'Пользователь';
            } catch {
                return userStr || 'Гость';
            }
        }
        
        // 3. Проверяем текущего пользователя
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                return JSON.parse(currentUser).username || 'Гость';
            } catch {
                return currentUser || 'Гость';
            }
        }
        
        // 4. Старый способ
        const username = localStorage.getItem('username');
        return username || 'Гость';
    }
    
    // Сохранить логин (для регистрации и входа)
    saveUser(username) {
        // Сохраняем во ВСЕХ форматах для полной совместимости
        localStorage.setItem('username', username);
        localStorage.setItem('currentUser', JSON.stringify({ username: username }));
        localStorage.setItem('userLoggedIn', 'true');
        
        // Для mock-api-service
        let user = JSON.parse(localStorage.getItem('user') || '{}');
        user.username = username;
        if (!user.email) user.email = username + '@example.com';
        if (!user.id) user.id = Date.now();
        if (!user.balance) user.balance = 1000;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        this.updateUI();
        window.dispatchEvent(new CustomEvent('userLoggedIn', { 
        detail: { username: username } 
        }));
    
        this.updateUI();
    }
    
    // Проверить, авторизован ли пользователь ПО ЛЮБОЙ СИСТЕМЕ
    isAuthenticated() {
        // Проверяем ВСЕ возможные способы
        return (
            // Реальный API
            localStorage.getItem('token') !== null ||
            // Mock API
            localStorage.getItem('isAuthenticated') === 'true' ||
            localStorage.getItem('user') !== null ||
            // Простая система
            localStorage.getItem('userLoggedIn') === 'true' ||
            localStorage.getItem('currentUser') !== null ||
            localStorage.getItem('username') !== null
        );
    }
    
    // Проверить, авторизован ли пользователь через РЕАЛЬНЫЙ API
    isApiAuthenticated() {
        return localStorage.getItem('token') !== null;
    }
    
    // Проверить, авторизован ли пользователь через MOCK API
    isMockAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true' || 
               localStorage.getItem('user') !== null;
    }
    
    // Обновить интерфейс
    updateUI() {
        const username = this.getUser();
        
        // Обновляем кнопку входа везде
        this.updateLoginButton(username);
        
        // Если на странице ЛК - обновляем логин
        if (window.location.pathname.includes('lk.html')) {
            this.updateLKPage(username);
        }
    }
    
    // Обновить кнопку входа
    updateLoginButton(username) {
        const loginBtn = document.querySelector('.menu__btn-login');
        if (!loginBtn) return;
        
        const textSpan = loginBtn.querySelector('.menu__btn-text');
        if (!textSpan) return;
        
        if (this.isAuthenticated()) {
            // Показываем логин или "Личный кабинет"
            const isLkPage = window.location.pathname.includes('lk.html');
            textSpan.textContent = isLkPage ? 'Личный кабинет' : (username || 'Личный кабинет');
            
            // Настройка клика
            if (isLkPage) {
                loginBtn.onclick = function(e) {
                    e.preventDefault();
                    return false;
                };
                loginBtn.style.cursor = 'default';
                loginBtn.style.opacity = '0.7';
            } else {
                loginBtn.onclick = function() {
                    window.location.href = '/lk.html';
                };
                loginBtn.style.cursor = 'pointer';
                loginBtn.style.opacity = '1';
            }
        } else {
            // Гость
            textSpan.textContent = 'Войти';
            loginBtn.style.cursor = 'pointer';
            loginBtn.style.opacity = '1';
            
            // На главной - открываем модалку, на других - переходим на главную
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                loginBtn.onclick = function() {
                    const loginModal = document.querySelector('.section__login');
                    if (loginModal) {
                        loginModal.style.display = 'block';
                    }
                };
            } else {
                loginBtn.onclick = function() {
                    window.location.href = '/index.html';
                };
            }
        }
    }
    
    // Обновить страницу ЛК
    updateLKPage(username) {
        // Обновляем заголовок "Пользователь" в карточке
        const userTitleElement = document.querySelector('.user-menu h2');
        if (userTitleElement) {
            userTitleElement.textContent = username;
        }
        
        // Обновляем баланс из mock-api-service
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const balanceElement = document.querySelector('.balance');
                if (balanceElement && user.balance) {
                    balanceElement.textContent = `${user.balance} ₽`;
                }
            } catch {}
        }
    }
    
    // Выйти - очищаем ТОЛЬКО данные авторизации, НЕ корзину!
    logout() {
        console.log('Выполняется выход из системы...');
        
        // СОХРАНЯЕМ корзину перед выходом!
        const cartData = localStorage.getItem('cartItems') || localStorage.getItem('cart');
        
        // Очищаем ВСЕ данные авторизации из ВСЕХ систем
        // Реальный API
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Mock API
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        
        // Простая система
        localStorage.removeItem('username');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userLoggedIn');
        
        // Сессионные данные
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        
        // ВОССТАНАВЛИВАЕМ корзину
        if (cartData) {
            localStorage.setItem('cartItems', cartData);
            console.log('Корзина восстановлена');
        } else {
            // Если корзина в другом ключе
            const altCart = localStorage.getItem('cart');
            if (altCart) {
                localStorage.setItem('cartItems', altCart);
            }
        }
        
        console.log('Данные авторизации очищены');
        
       

        // Обновляем UI перед редиректом
        this.updateUI();
        
        // Перенаправляем на главную страницу
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 100);

        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
        this.updateUI();
    }
    
    // Получить токен для API
    getToken() {
        return localStorage.getItem('token');
    }
}

window.userSimple = new UserSimple();

// Автоматически обновляем UI при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.userSimple && window.userSimple.updateUI) {
        setTimeout(() => {
            window.userSimple.updateUI();
        }, 100);
    }
});


// Проверяем, создан ли магазин (сайт опубликован)
function isShopCreated() {
    return localStorage.getItem('sitePublished') === 'true' || 
           localStorage.getItem('siteDesign') !== null;
}

// Обновляем кнопку в зависимости от состояния
function updateShopButton() {
    const createShopBtn = document.getElementById('createShopBtn');
    if (!createShopBtn) return;
    
    const shopBtnText = createShopBtn.querySelector('.menu__btn-text');
    const shopBtnImg = createShopBtn.querySelector('.menu__btn-img');
    
    if (isShopCreated()) {
        // Магазин уже создан - меняем на "Мой магазин"
        shopBtnText.textContent = 'Мой магазин';
        shopBtnImg.alt = 'Мой магазин';
        // Можно поменять и иконку, если есть другая
        // shopBtnImg.src = 'images/icon-my-shop.svg';
        
        // Меняем поведение кнопки - ведем в админку
        createShopBtn.onclick = function() {
            window.location.href = 'admin.html';
        };
    } else {
        // Магазин не создан - оставляем "Создать магазин"
        shopBtnText.textContent = 'Создать магазин';
        shopBtnImg.alt = 'Создать магазин';
        
        // Ведущий в админку (или editor.html, если хочешь сразу в редактор)
        createShopBtn.onclick = function() {
            window.location.href = 'admin.html';
        };
    }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateShopButton();
});