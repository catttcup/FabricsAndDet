// update-auth-button.js
function updateAuthButton() {
    if (!window.apiService) {
        console.warn('API service not available');
        return;
    }
    
    const authButton = document.querySelector('.menu__btn-login');
    if (!authButton) return;
    
    // Находим элемент с текстом
    const textSpan = authButton.querySelector('.menu__btn-text');
    if (!textSpan) return;
    
    // Проверяем авторизацию
    const isAuthenticated = apiService.isAuthenticated();
    
    if (isAuthenticated) {
        // Пользователь авторизован - меняем на "Личный кабинет"
        textSpan.textContent = 'Личный кабинет';
        
        // Делаем кликабельным с переходом в ЛК
        authButton.onclick = function() {
            window.location.href = '/lk.html';
        };
        
        // Курсор указатель
        authButton.style.cursor = 'pointer';
    } else {
        // Не авторизован - "Войти" и открытие модалки
        textSpan.textContent = 'Войти';
        
        // Если мы не на главной странице (где есть модалки)
        if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
            // На главной - открываем модалку
            authButton.onclick = function() {
                const loginModal = document.querySelector('.section__login');
                if (loginModal) {
                    loginModal.style.display = 'block';
                }
            };
        } else {
            // На других страницах - идем на главную для входа
            authButton.onclick = function() {
                window.location.href = '/index.html';
            };
        }
        
        authButton.style.cursor = 'pointer';
    }
}

// Обновляем кнопку при загрузке
document.addEventListener('DOMContentLoaded', updateAuthButton);

// Экспортируем функцию для использования в других скриптах
window.updateAuthButton = updateAuthButton;