const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.refreshTokenValue = localStorage.getItem('refreshToken');
        this.isMockMode = localStorage.getItem('isMockMode') === 'true'; // Сохраняем в localStorage
    }

    showNotification(message) {
        alert(message);
    }
    
    saveUserData(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        this.token = userData.access || this.token;
        if (userData.access) {
            localStorage.setItem('token', userData.access);
        }
        if (userData.refresh) {
            localStorage.setItem('refreshToken', userData.refresh);
        }
        localStorage.setItem('isAuthenticated', 'true');
    }

    // Устанавливаем локальный режим
    setMockMode(enabled) {
        this.isMockMode = enabled;
        localStorage.setItem('isMockMode', enabled ? 'true' : 'false');
    }

    // 1. Регистрация
    async register(username, email, password, password2) {
        try {
            console.log('Попытка реальной регистрации...');
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, password2 })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));

                this.token = data.access;
                this.refreshTokenValue = data.refresh;
                this.setMockMode(false); // Режим не локальный

                this.showNotification('Регистрация успешна!');
                return { success: true, data };
            } else {
                let errorMsg = 'Ошибка регистрации';
                if (data.email) errorMsg = `Email: ${data.email[0]}`;
                else if (data.password) errorMsg = `Пароль: ${data.password[0]}`;
                else if (data.username) errorMsg = `Имя: ${data.username[0]}`;
                else if (data.detail) errorMsg = data.detail;

                this.showNotification(errorMsg);
                return { success: false, error: data };
            }
        } catch (error) {
            console.log('Реальная регистрация не удалась, используем локальную...');
            return this.performLocalRegistration(username, email);
        }
    }

    // Локальная регистрация
    async performLocalRegistration(username, email) {
        this.setMockMode(true); // Включаем локальный режим
        
        const mockUser = {
            id: Date.now(),
            username: username,
            email: email,
            access: 'local_token_' + Date.now(),
            refresh: 'local_refresh_' + Date.now(),
            date_joined: new Date().toISOString()
        };
        
        this.saveUserData(mockUser);
        
        this.showNotification('Регистрация успешна!');
        
        return { 
            success: true, 
            data: { 
                user: mockUser,
                access: mockUser.access,
                refresh: mockUser.refresh
            } 
        };
    }

    // 2. Логин
    async login(email, password) {
        try {
            console.log('Попытка реального входа...');
            const response = await fetch(`${API_BASE_URL}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));

                this.token = data.access;
                this.refreshTokenValue = data.refresh;
                this.setMockMode(false); // Режим не локальный

                this.showNotification('Вход выполнен успешно!');
                return { success: true, data };
            } else {
                this.showNotification(data.error || 'Ошибка входа');
                return { success: false, error: data };
            }
        } catch (error) {
            console.log('Реальный вход не удался, используем локальный...');
            return this.performLocalLogin(email);
        }
    }

    // Локальный вход
    async performLocalLogin(email) {
        this.setMockMode(true); // Включаем локальный режим
        
        const existingUserStr = localStorage.getItem('user');
        let mockUser;
        
        if (existingUserStr) {
            mockUser = JSON.parse(existingUserStr);
        } else {
            mockUser = {
                id: Date.now(),
                username: email.split('@')[0],
                email: email,
                access: 'local_token_' + Date.now(),
                refresh: 'local_refresh_' + Date.now(),
                date_joined: new Date().toISOString()
            };
        }
        
        this.saveUserData(mockUser);
        
        this.showNotification('Вход выполнен успешно!');
        
        return { 
            success: true, 
            data: { 
                user: mockUser,
                access: mockUser.access,
                refresh: mockUser.refresh
            } 
        };
    }

    // 3. Получить профиль
    async getProfile() {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Нет токена' };
        }

        if (this.isMockMode) {
            const user = this.getUser();
            if (user) {
                return { 
                    success: true, 
                    data: user 
                };
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/profile/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 401) {
                const refreshed = await this.refreshTokenFunc();
                if (refreshed) {
                    return this.getProfile();
                }
                return { success: false, error: 'Требуется авторизация' };
            }

            const data = await response.json();
            return response.ok
                ? { success: true, data }
                : { success: false, error: data };
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error);
            const user = this.getUser();
            return user 
                ? { success: true, data: user }
                : { success: false, error: 'Пользователь не найден' };
        }
    }

    // 4. Обновить токен
    async refreshTokenFunc() {
        if (!this.refreshTokenValue) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: this.refreshTokenValue })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.access);
                this.token = data.access;
                return true;
            } else {
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Ошибка обновления токена:', error);
            this.logout();
            return false;
        }
    }

    // 5. Выход
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isMockMode');
        this.token = null;
        this.refreshTokenValue = null;
        this.isMockMode = false;
        this.showNotification('Вы вышли из системы');
    }

    // 6. Проверить авторизацию
    isAuthenticated() {
        return !!localStorage.getItem('isAuthenticated') || !!this.token;
    }

    // 7. Получить данные пользователя
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // 8. Получить корзину с сервера
    async getCart() {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Нет токена' };
        }

        if (this.isMockMode) {
            const localCart = localStorage.getItem('localCart');
            return { 
                success: true, 
                data: localCart ? JSON.parse(localCart) : [] 
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 401) {
                const refreshed = await this.refreshTokenFunc();
                if (refreshed) {
                    return this.getCart();
                }
                return { success: false, error: 'Требуется авторизация' };
            }

            const data = await response.json();
            return response.ok
                ? { success: true, data }
                : { success: false, error: data };
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            const localCart = localStorage.getItem('localCart');
            return { 
                success: true, 
                data: localCart ? JSON.parse(localCart) : [] 
            };
        }
    }

    // 9. Добавить товар в корзину 
    async addToCart(product) {
        // Проверяем авторизацию
        if (!this.isAuthenticated()) {
            this.showNotification('Для добавления в корзину войдите в систему');
            return { success: false, error: 'Требуется авторизация' };
        }

        console.log('Добавляем товар в корзину:', product, 'Режим:', this.isMockMode ? 'локальный' : 'реальный');

        // В локальном режиме
        if (this.isMockMode) {
            try {
                const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
                const existingItem = localCart.find(item => item.product_id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    localCart.push({
                        id: Date.now(),
                        product_id: product.id,
                        title: product.title,
                        price: product.price,
                        quantity: 1,
                        image_url: product.image || '/images/product-placeholder.jpg',
                    });
                }
                
                localStorage.setItem('localCart', JSON.stringify(localCart));
                this.showNotification('Товар добавлен в корзину!');
                
                // Обновляем счетчик корзины если есть
                if (window.updateCartCount) {
                    window.updateCartCount(localCart.length);
                }
                
                return { success: true, data: localCart };
            } catch (error) {
                console.error('Ошибка добавления в локальную корзину:', error);
                return { success: false, error };
            }
        }

        // В реальном режиме
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image || '/images/product-placeholder.jpg',
                })
            });

            if (response.status === 401) {
                const refreshed = await this.refreshTokenFunc();
                if (refreshed) {
                    return this.addToCart(product);
                }
                return { success: false, error: 'Требуется авторизация' };
            }

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Товар добавлен в корзину!');
                return { success: true, data };
            } else {
                this.showNotification(data.error || 'Ошибка добавления в корзину');
                return { success: false, error: data };
            }
        } catch (error) {
            this.showNotification('Ошибка сети: ' + error.message);
            return { success: false, error };
        }
    }

    // 10. Обновить количество товара
    async updateCartItem(itemId, quantity) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Нет токена' };
        }

        if (this.isMockMode) {
            try {
                const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
                const item = localCart.find(item => item.id == itemId);
                
                if (item) {
                    item.quantity = quantity;
                    localStorage.setItem('localCart', JSON.stringify(localCart));
                    return { success: true, data: localCart };
                }
                return { success: false, error: 'Товар не найден' };
            } catch (error) {
                console.error('Ошибка обновления локальной корзины:', error);
                return { success: false, error };
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, data };
            } else {
                this.showNotification(data.error || 'Ошибка обновления');
                return { success: false, error: data };
            }
        } catch (error) {
            console.error('Ошибка обновления товара:', error);
            return { success: false, error };
        }
    }

    // 11. Удалить товар из корзины
    async removeCartItem(itemId) {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Нет токена' };
        }

        if (this.isMockMode) {
            try {
                let localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
                localCart = localCart.filter(item => item.id != itemId);
                localStorage.setItem('localCart', JSON.stringify(localCart));
                this.showNotification('Товар удалён из корзины');
                return { success: true, data: localCart };
            } catch (error) {
                console.error('Ошибка удаления из локальной корзины:', error);
                return { success: false, error };
            }
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}/remove/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Товар удалён из корзины');
                return { success: true, data };
            } else {
                this.showNotification(data.error || 'Ошибка удаления');
                return { success: false, error: data };
            }
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            return { success: false, error };
        }
    }

    // 12. Очистить корзину
    async clearCart() {
        if (!this.isAuthenticated()) {
            return { success: false, error: 'Нет токена' };
        }

        if (this.isMockMode) {
            localStorage.removeItem('localCart');
            this.showNotification('Корзина очищена');
            return { success: true, data: [] };
        }

        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.showNotification('Корзина очищена');
                return { success: true, data };
            } else {
                this.showNotification(data.error || 'Ошибка очистки');
                return { success: false, error: data };
            }
        } catch (error) {
            console.error('Ошибка очистки корзины:', error);
            return { success: false, error };
        }
    }
}

// Создаём глобальный экземпляр
window.apiService = new ApiService();
