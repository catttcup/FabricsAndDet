document.addEventListener('DOMContentLoaded', function () {
    console.log('Скрипт загружен и DOM готов');
    
    // Проверяем наличие API Service
    if (!window.apiService) {
        console.error('⚠️ API Service не загружен!');
        // Создаем временный мок-сервис для работы
        window.apiService = {
            isAuthenticated: function() {
                return !!localStorage.getItem('isAuthenticated');
            },
            login: function(email, password) {
                return Promise.resolve({
                    success: true,
                    data: {
                        user: {
                            username: email.split('@')[0],
                            email: email
                        }
                    }
                });
            },
            register: function(username, email, password, password2) {
                return Promise.resolve({
                    success: true,
                    data: {
                        user: {
                            username: username,
                            email: email
                        }
                    }
                });
            }
        };
        console.log('Создан временный API Service');
    } else {
        console.log('✅ API Service загружен, методы:', Object.keys(apiService));
    }
    
    // Элементы
    const loginModal = document.querySelector('.section__login');
    const registerModal = document.querySelector('.section__authorization');
    const closeButtons = document.querySelectorAll('.close__btn');
    const returnButton = document.querySelector('.return__btn');
    const registrationBtn = document.querySelector('.registration__btn');
    const loginButton = document.querySelector('.menu__btn-login');
    
    console.log('Найдены элементы:', {
        loginModal: !!loginModal,
        registerModal: !!registerModal,
        closeButtons: closeButtons.length,
        returnButton: !!returnButton,
        registrationBtn: !!registrationBtn,
        loginButton: !!loginButton
    });
    
    // === ПРОСТЫЕ ФУНКЦИИ ДЛЯ МОДАЛОК ===
    
    // Открыть модалку
    function openModal(modal) {
        console.log('Открываем модалку:', modal?.className);
        
        if (!modal) {
            console.error('Модалка не найдена');
            return;
        }
        
        // Скрыть все модалки
        document.querySelectorAll('.modal').forEach(m => {
            m.style.display = 'none';
        });
        
        // Показать нужную
        modal.style.display = 'block';
        document.body.classList.add('body--blurred');
    }
    
    // Закрыть модалку
    function closeModal() {
        console.log('Закрываем модалку');
        document.querySelectorAll('.modal').forEach(m => {
            m.style.display = 'none';
        });
        document.body.classList.remove('body--blurred');
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    
    // 1. Кнопка "Войти" в хедере
    if (loginButton) {
        loginButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Клик по кнопке Войти');
            
            // Проверяем авторизацию
            if (window.apiService && apiService.isAuthenticated && apiService.isAuthenticated()) {
                console.log('Пользователь уже авторизован, идем в ЛК');
                window.location.href = '/lk.html';
                return;
            }
            
            openModal(loginModal);
        });
    }
    
    // 2. Кнопка "Зарегистрироваться" (ссылка в модалке входа)
    if (registrationBtn) {
        registrationBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Переход к регистрации');
            openModal(registerModal);
        });
    }
    
    // 3. Кнопка "Назад" в модалке регистрации
    if (returnButton) {
        returnButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Возврат ко входу');
            openModal(loginModal);
        });
    }
    
    // 4. Кнопки закрытия (крестики)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Закрытие модалки');
            closeModal();
        });
    });
    
    // 5. Закрытие по Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // 6. Закрытие по клику на размытый фон
    document.addEventListener('click', function (e) {
        if (e.target === document.body && document.body.classList.contains('body--blurred')) {
            closeModal();
        }
    });
    
    // 7. Предотвращаем закрытие при клике внутри модалки
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });
    
    // === ФУНКЦИИ ДЛЯ ФОРМ ===
    
    // Флаг для предотвращения двойного вызова
    let isProcessing = false;
    
    // Функция для входа
    window.handleLogin = function() {
        // Защита от двойного вызова
        if (isProcessing) {
            console.log('handleLogin уже выполняется, пропускаем');
            return;
        }
        
        isProcessing = true;
        console.log('handleLogin вызван');
        
        const email = document.getElementById('text__to__log__in__to_current_account')?.value;
        const password = document.getElementById('login-password')?.value;
        
        if (!email || !password) {
            alert('Заполните все поля');
            isProcessing = false;
            return;
        }
        
        console.log('Попытка входа:', { email, passwordLength: password.length });
        
        // Используем API сервис
        if (apiService.login) {
            console.log('Используем apiService.login');
            apiService.login(email, password)
                .then(result => {
                    console.log('Результат входа:', result);
                    
                    if (result.success) {
                        closeModal();
                        
                        // Сохраняем пользователя
                        if (window.userSimple && userSimple.saveUser) {
                            const username = result.data?.user?.username || email.split('@')[0];
                            userSimple.saveUser(username);
                            userSimple.updateUI();
                        }
                        
                        // Перенаправляем или обновляем страницу
                        setTimeout(() => {
                            if (window.location.pathname.includes('lk.html')) {
                                window.location.reload();
                            }
                        }, 500);
                    }
                    
                    isProcessing = false;
                })
                .catch(error => {
                    console.error('Ошибка входа:', error);
                    alert('Произошла ошибка при входе');
                    isProcessing = false;
                });
        } else {
            console.error('Метод login не доступен в apiService');
            alert('Ошибка: функция входа не доступна');
            isProcessing = false;
        }
    };
    
    // Функция для регистрации
    window.handleRegister = function() {
        // Защита от двойного вызова
        if (isProcessing) {
            console.log('handleRegister уже выполняется, пропускаем');
            return;
        }
        
        isProcessing = true;
        console.log('handleRegister вызван');
        
        const username = document.getElementById('register-username')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const password2 = document.getElementById('register-password2')?.value;
        const checkbox = document.querySelector('#register-form input[type="checkbox"]');
        
        if (!username || !email || !password || !password2) {
            alert('Заполните все поля');
            isProcessing = false;
            return;
        }
        
        if (password !== password2) {
            alert('Пароли не совпадают');
            isProcessing = false;
            return;
        }
        
        if (!checkbox?.checked) {
            alert('Необходимо согласие с условиями');
            isProcessing = false;
            return;
        }
        
        console.log('Попытка регистрации:', { username, email, passwordLength: password.length });
        
        // Используем API сервис
        if (apiService.register) {
            console.log('Используем apiService.register');
            apiService.register(username, email, password, password2)
                .then(result => {
                    console.log('Результат регистрации:', result);
                    
                    if (result.success) {
                        closeModal();
                        
                        // Сохраняем пользователя
                        if (window.userSimple && userSimple.saveUser) {
                            userSimple.saveUser(username);
                            userSimple.updateUI();
                        }
                    }
                    
                    isProcessing = false;
                })
                .catch(error => {
                    console.error('Ошибка регистрации:', error);
                    alert('Произошла ошибка при регистрации');
                    isProcessing = false;
                });
        } else {
            console.error('Метод register не доступен в apiService');
            alert('Ошибка: функция регистрации не доступна');
            isProcessing = false;
        }
    };
    
    // === ПРИВЯЗКА ФОРМ ===
    
    // Форма входа - ТОЛЬКО ОДИН ОБРАБОТЧИК
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Убираем обработчик submit и оставляем только на кнопке
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // НЕ вызываем handleLogin здесь
        });
        
        // ТОЛЬКО обработчик на кнопке
        const loginButtonInForm = loginForm.querySelector('.button__login_in_fieldset');
        if (loginButtonInForm) {
            loginButtonInForm.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Кнопка "Войти" в форме нажата');
                window.handleLogin();
            });
        }
    }
    
    // Форма регистрации - ТОЛЬКО ОДИН ОБРАБОТЧИК
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Убираем обработчик submit и оставляем только на кнопке
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // НЕ вызываем handleRegister здесь
        });
        
        // ТОЛЬКО обработчик на кнопке
        const registerButton = registerForm.querySelector('.button__authorization__fieldset');
        if (registerButton) {
            registerButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Кнопка "Зарегистрироваться" нажата');
                window.handleRegister();
            });
        }
    }
    
    // Альтернативно: можно оставить ТОЛЬКО обработчики submit, а click убрать
    
    console.log('✅ Скрипт инициализирован');

    const createShopButton = document.getElementById('createShopBtn');
    if (createShopButton) {
        createShopButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Клик по кнопке "Создать магазин"');
            
            // Проверяем авторизацию
            if (window.apiService && apiService.isAuthenticated && apiService.isAuthenticated()) {
                console.log('Пользователь авторизован, переходим на страницу магазина');
                // ПЕРЕХОДИМ НА СТРАНИЦУ МАГАЗИНА
                window.location.href = '/admin.html'; // или какой у тебя там URL
            } else {
                console.log('Пользователь не авторизован, открываем вход');
                
                // Показываем сообщение
                alert('Для создания магазина необходимо войти в систему');
                
                // Открываем модалку входа если она есть
                const loginModal = document.querySelector('.section__login');
                if (loginModal) {
                    openModal(loginModal);
                }
                
                // БЛОКИРУЕМ дальнейшие действия
                return false;
            }
        });
        
        // Также отменяем любые другие возможные обработчики
        createShopButton.onclick = function(e) {
            if (!window.apiService || !apiService.isAuthenticated || !apiService.isAuthenticated()) {
                e.preventDefault();
                return false;
            }
        };
    }
    
    console.log('✅ Скрипт инициализирован');
});


