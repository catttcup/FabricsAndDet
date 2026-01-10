// admin.js - Скрипты для админ-панели

document.addEventListener('DOMContentLoaded', function() {
    // Элементы для управления меню
    const menuToggleBtn = document.getElementById('menuToggle');
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const body = document.body;
    
    // Проверяем состояние меню в localStorage
    const isMenuCollapsed = localStorage.getItem('menuCollapsed') === 'true';
    
    // Устанавливаем начальное состояние
    if (isMenuCollapsed) {
        collapseMenu();
    } else {
        expandMenu();
    }
    
    // Обработчик для кнопки скрытия/открытия меню
    menuToggleBtn.addEventListener('click', function() {
        if (body.classList.contains('menu-collapsed')) {
            expandMenu();
            localStorage.setItem('menuCollapsed', 'false');
        } else {
            collapseMenu();
            localStorage.setItem('menuCollapsed', 'true');
        }
    });
    
    // Функция скрытия меню
    function collapseMenu() {
        body.classList.add('menu-collapsed');
        menuIcon.classList.remove('fa-chevron-left');  // Убираем стрелку
        menuIcon.classList.add('fa-bars');             // Добавляем три полоски
        sidebar.classList.add('collapsed');
    }

    function expandMenu() {
        body.classList.remove('menu-collapsed');
        menuIcon.classList.remove('fa-bars');          // Убираем три полоски
        menuIcon.classList.add('fa-chevron-left');     // Добавляем стрелку
        sidebar.classList.remove('collapsed');
    }
    
    // Обработчики для навигации в сайдбаре
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех ссылок
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            
            // Добавляем активный класс к текущей ссылке
            this.classList.add('active');
            
            const linkText = this.querySelector('span').textContent;
            console.log(`Переход в раздел: ${linkText}`);
            
            // На мобильных устройствах автоматически скрываем меню после выбора
            if (window.innerWidth <= 768) {
                collapseMenu();
                localStorage.setItem('menuCollapsed', 'true');
            }
        });
    });
    
    // Обработчики для верхних табов
    document.querySelectorAll('.top-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем активный класс у всех табов
            document.querySelectorAll('.top-tab').forEach(item => {
                item.classList.remove('active');
            });
            
            // Добавляем активный класс к текущему табу
            this.classList.add('active');
            
            const tabText = this.textContent;
            console.log(`Выбран таб: ${tabText}`);
        });
    });
    
    // Обработчики для основных кнопок
    document.querySelectorAll('.main-btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.querySelector('span').textContent;
            alert(`Нажата кнопка: ${buttonText}`);
            
            // Анимация нажатия
            this.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
    
    // Обработчик для "Посмотреть все" в заказах
    document.querySelector('.view-all').addEventListener('click', function() {
        alert('Переход к списку всех заказов');
    });
    
    // Обработчики для карточек заказов
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', function() {
            const orderType = this.querySelector('.order-title').textContent;
            alert(`Просмотр: ${orderType}`);
        });
    });
    
    // Обработчики для иконок в верхней панели
    document.querySelector('.chat-btn').addEventListener('click', function() {
        alert('Открыть чат поддержки');
    });
    
    document.querySelector('.questions-btn').addEventListener('click', function() {
        alert('Открыть раздел вопросов и ответов');
    });
    
    document.querySelector('.notifications-btn').addEventListener('click', function() {
        alert('Показать уведомления (3 новых)');
        // Сбрасываем счетчик уведомлений
        const badge = this.querySelector('.notification-badge');
        badge.textContent = '0';
        badge.style.backgroundColor = '#999';
    });
    
    document.querySelector('.user-btn').addEventListener('click', function() {
        alert('Открыть профиль пользователя');
    });
    
    // Обработчик для поиска
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                alert(`Поиск: ${query}`);
                this.value = '';
            }
        }
    });
    
    // Адаптивность: на мобильных меню по умолчанию скрыто
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            if (!localStorage.getItem('menuCollapsed')) {
                collapseMenu();
                localStorage.setItem('menuCollapsed', 'true');
            }
        } else {
            // На десктопе всегда показываем меню
            if (localStorage.getItem('menuCollapsed') === 'true' && !isMenuCollapsed) {
                expandMenu();
                localStorage.setItem('menuCollapsed', 'false');
            }
        }
    }
    
    // Проверяем при загрузке и изменении размера окна
    checkMobileMenu();
    window.addEventListener('resize', checkMobileMenu);
});