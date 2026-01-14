class PurchasesManager {
    constructor() {
        this.purchases = this.loadPurchases();
    }

    // Загрузить покупки
    loadPurchases() {
        try {
            const purchasesJson = localStorage.getItem('purchases');
            return purchasesJson ? JSON.parse(purchasesJson) : [];
        } catch (e) {
            console.error('Error loading purchases:', e);
            return [];
        }
    }

    // Сохранить покупки
    savePurchases() {
        localStorage.setItem('purchases', JSON.stringify(this.purchases));
        this.updatePurchasesDisplay();
    }

    // Добавить покупку (оформить заказ)
    addPurchase(cartItems) {
        const purchase = {
            id: Date.now(),
            date: new Date().toLocaleDateString('ru-RU'),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            items: cartItems.map(item => ({
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                total: item.price * item.quantity
            })),
            total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'completed'
        };

        this.purchases.unshift(purchase); // Добавляем в начало
        this.savePurchases();

        return purchase;
    }

    // Получить все покупки
    getAllPurchases() {
        return this.purchases;
    }

    // Получить последние покупки (для отображения в ЛК)
    getRecentPurchases(limit = 3) {
        return this.purchases.slice(0, limit);
    }

    // Получить общее количество покупок
    getTotalPurchasesCount() {
        return this.purchases.length;
    }

    // Получить общую сумму покупок
    getTotalSpent() {
        return this.purchases.reduce((total, purchase) => total + purchase.total, 0);
    }

    // Обновить отображение покупок в ЛК
    updatePurchasesDisplay() {
        if (!window.location.pathname.includes('lk.html')) return;

        const purchasesContainer = document.querySelector('#purchases-container') || 
                                   document.querySelector('.orders-content .product-grid');

        if (purchasesContainer) {
            this.renderPurchases(purchasesContainer);
        }
    }

    // Отрисовать покупки
    renderPurchases(container) {
        const recentPurchases = this.getRecentPurchases(3);
        
        if (recentPurchases.length === 0) {
            container.innerHTML = `
                <div class="no-purchases">
                    <p>У вас пока нет покупок</p>
                </div>
            `;
            return;
        }

        // Получаем все товары из последних покупок
        let allItems = [];
        recentPurchases.forEach(purchase => {
            allItems = allItems.concat(purchase.items);
        });

        // Берем только первые 3 товара для отображения
        const itemsToShow = allItems.slice(0, 3);
        
        container.innerHTML = itemsToShow.map(item => `
            <div class="product-card" data-purchase-id="${item.id}">
                <div class="product-image">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI0MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIHJ4PSIxMCIgZmlsbD0iI0ZEQjBCMCIvPjwvc3ZnPg=='">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${item.title}</h3>
                    <p class="product-description">Куплено: ${item.quantity} шт</p>
                    <p class="product-price">${item.total.toLocaleString('ru-RU')} ₽</p>
                </div>
            </div>
        `).join('');
    }
}

// Создаём глобальный экземпляр
window.purchasesManager = new PurchasesManager();

// Инициализация при загрузке ЛК
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('lk.html')) {
        window.purchasesManager.updatePurchasesDisplay();
    }
});