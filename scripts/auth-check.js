// Файл только для проверки ЛК
document.addEventListener('DOMContentLoaded', function() {
    console.log('Проверка авторизации...');
    
    const currentPage = window.location.pathname;
    
    // Список страниц, требующих авторизации
    const protectedPages = [
        'lk.html',
        '/admin.html'  // если есть
    ];
    
    // Список страниц, где авторизация НЕ требуется
    const publicPages = [
        '/cart.html',
        '/index.html'
    ];
    
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage) {
        if (!window.userSimple || !userSimple.isAuthenticated()) {
            console.log('Доступ запрещен для:', currentPage);
            alert('Для доступа к личному кабинету необходимо войти в систему');
            window.location.href = '/index.html';
            return;
        }
        console.log('Доступ разрешен для:', currentPage);
    }
});