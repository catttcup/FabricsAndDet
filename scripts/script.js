document.addEventListener('DOMContentLoaded', function () {
    console.log('Скрипт загружен');
    
    // Элементы
    const loginModal = document.querySelector('.section__login');
    const registerModal = document.querySelector('.section__authorization');
    const closeButtons = document.querySelectorAll('.close__btn');
    const returnButton = document.querySelector('.return__btn');
    const registrationBtn = document.querySelector('.registration__btn');
    
    // Проверяем загрузку apiService
    if (!window.apiService) {
        console.error('API service не загружен!');
        return;
    }
    
    // === ФУНКЦИИ ===
    
    // 1. Функция для регистрации
    window.handleRegister = async function () {
        console.log('handleRegister вызван');
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const password2 = document.getElementById('register-password2').value;
        
        if (!username || !email || !password || !password2) {
            alert('Заполните все поля');
            return;
        }
        
        if (password !== password2) {
            alert('Пароли не совпадают');
            return;
        }
        
        const checkbox = document.querySelector('#register-form input[type="checkbox"]');
        if (!checkbox?.checked) {
            alert('Необходимо согласие с условиями');
            return;
        }
        
        const result = await apiService.register(username, email, password, password2);
        
        if (result.success) {
            closeModal();
            updateLoginButton(result.data.user);
            alert('Регистрация успешна!');
        } else {
            alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
        }
    };
    
    // 2. Функция для входа
    window.handleLogin = async function () {
        console.log('handleLogin вызван');
        
        const email = document.getElementById('text__to__log__in__to_current_account').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Заполните все поля');
            return;
        }
        
        const result = await apiService.login(email, password);
        
        if (result.success) {
            closeModal();
            updateLoginButton(result.data.user);
            alert('Вход выполнен успешно!');
        } else {
            alert('Ошибка входа: ' + (result.error || 'Неверные данные'));
        }
    };
    
    // 3. Функция обновления кнопки входа (ПРОСТАЯ ВЕРСИЯ)
    function updateLoginButton(user) {
    updateAuthButton(); 
    if (window.updateAuthButtonOnAllPages) {
        updateAuthButtonOnAllPages();
    }
    const loginBtn = document.querySelector('.menu__btn-login');
    if (loginBtn) {
        // НЕ меняем всю структуру кнопки! Меняем только текст
        const textSpan = loginBtn.querySelector('.menu__btn-text');
        if (textSpan) {
            // Меняем ТОЛЬКО текст, оставляя все остальное
            textSpan.textContent = 'Личный кабинет'; // Коротко, чтобы не ломать верстку
        }
        
        // Оставляем иконку как есть
        
        // Делаем кликабельной
        loginBtn.onclick = function() {
            window.location.href = '/lk.html';
        };
        
        // Нормальный курсор
        loginBtn.style.cursor = 'pointer';
        
        console.log('Кнопка обновлена (только текст)');
    }
    }
    // Функция для ЛК - сделать кнопку не кликабельной
    function makeLKButtonInactive() {
    const loginBtn = document.querySelector('.menu__btn-login');
    if (loginBtn) {
        // Убираем переход
        loginBtn.onclick = function(e) {
            e.preventDefault();
            return false;
        };
        
        // Курсор по умолчанию (не pointer)
        loginBtn.style.cursor = 'default';
        
        console.log('Кнопка в ЛК сделана неактивной');
    }
    }
    
    // 4. Функция выхода (только очистка, БЕЗ перезагрузки)
    window.logoutUser = function () {
        if (confirm('Выйти из аккаунта?')) {
            if (apiService && apiService.logout) {
                apiService.logout();
            }
            
            // Очищаем localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            // Просто переходим на главную
            window.location.href = '/index.html';
        }
    };
    
    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    function openModal(modal) {
        document.querySelectorAll('.modal').forEach(m => {
            m.style.display = 'none';
        });
        
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    function closeModal() {
        document.querySelectorAll('.modal').forEach(m => {
            m.style.display = 'none';
        });
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    
    // Открытие модалки входа
    const loginButton = document.querySelector('.menu__btn-login');
    if (loginButton) {
        // Сохраняем оригинальный обработчик
        loginButton.addEventListener('click', function (e) {
            // Если это уже ссылка (после входа), не открываем модалку
            if (this.querySelector('a')) {
                return; // Это уже ссылка на ЛК, пропускаем
            }
            openModal(loginModal);
        });
    }
    
    // Переход к регистрации
    registrationBtn?.addEventListener('click', function () {
        openModal(registerModal);
    });
    
    // Возврат ко входу
    returnButton?.addEventListener('click', function () {
        openModal(loginModal);
    });
    
    // Закрытие модалок
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Проверка авторизации при загрузке (БЕЗ ПЕРЕЗАГРУЗКИ)
    function checkAuthOnLoad() {
        if (apiService.isAuthenticated && apiService.isAuthenticated()) {
            const user = apiService.getUser();
            if (user) {
                updateLoginButton(user);
            }
        }
    }
    
    // Вызываем проверку
    setTimeout(checkAuthOnLoad, 100);
    
    // Обработчики форм
    document.getElementById('register-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        handleRegister();
    });
    
    document.getElementById('login-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});