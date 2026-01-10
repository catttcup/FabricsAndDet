class MockApiService {
    constructor() {
        console.log('MockApiService инициализирован');
    }

    // Регистрация
    async register(username, email, password, password2) {
        console.log('Регистрация:', { username, email });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (password !== password2) {
            alert('Пароли не совпадают');
            return { success: false, error: 'Пароли не совпадают' };
        }
        
        if (!username || !email || !password) {
            alert('Заполните все поля');
            return { success: false, error: 'Заполните все поля' };
        }
        
        const user = {
            id: Date.now(),
            username: username,
            email: email,
            balance: 1000
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return {
            success: true,
            data: { user }
        };
    }

    // Логин
    async login(email, password) {
        console.log('Вход:', { email });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!email || !password) {
            alert('Заполните все поля');
            return { success: false, error: 'Заполните все поля' };
        }
        
        // Создаем или используем существующего пользователя
        let user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!user) {
            user = {
                id: 1,
                username: email.split('@')[0] || 'Пользователь',
                email: email,
                balance: 1500
            };
        }
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return {
            success: true,
            data: { user }
        };
    }

    // Остальные методы
    async getProfile() {
        const user = this.getUser();
        return user ? { success: true, data: user } : { success: false, error: 'Не авторизован' };
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    saveUserData(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    }
}

// Создаём глобальный экземпляр
window.apiService = new MockApiService();