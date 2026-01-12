document.addEventListener('DOMContentLoaded', function () {
    console.log('Cart page loaded');

    // Используем cartManager для получения данных
    let cartData = window.cartManager ? window.cartManager.cart : [];
    console.log('Cart data from manager:', cartData);

    // Получаем элементы
    const cartContainer = document.querySelector('.cart-container');
    const cartBox = document.getElementById('cartBox');
    const cartItemsList = document.getElementById('cartItemsList');
    const totalPriceElement = document.getElementById('totalPrice');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtnContainer = document.getElementById('checkoutBtnContainer');

    // Инициализация корзины
    function initCart() {
        console.log('Initializing cart with', cartData.length, 'items');

        if (cartData.length > 0) {
            showCartContent();
            renderCartItems();
        } else {
            showEmptyCart();
        }

        // Слушаем события обновления корзины
        window.addEventListener('cartUpdated', function() {
            cartData = window.cartManager.cart;
            renderCartItems();
            updateCartVisibility();
        });
    }

    // Показать содержимое корзины
    function showCartContent() {
        if (cartContainer) cartContainer.classList.remove('empty');
        if (cartBox) cartBox.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';
        if (checkoutBtnContainer) checkoutBtnContainer.style.display = 'flex';
    }

    // Показать пустую корзину
    function showEmptyCart() {
        if (cartContainer) cartContainer.classList.add('empty');
        if (cartBox) cartBox.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'flex';
        if (checkoutBtnContainer) checkoutBtnContainer.style.display = 'none';
    }

    // Обновить видимость
    function updateCartVisibility() {
        if (cartData.length > 0) {
            showCartContent();
        } else {
            showEmptyCart();
        }
    }

    // Отрисовка товаров
    function renderCartItems() {
        if (!cartItemsList) return;

        cartItemsList.innerHTML = '';

        cartData.forEach((item) => {
            const cartItem = createCartItemElement(item);
            cartItemsList.appendChild(cartItem);
        });

        // Обновляем итоговую сумму
        updateTotalPrice();
    }

    // Создание элемента товара (новая структура)
    function createCartItemElement(item) {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.dataset.id = item.id;

        const imageUrl = item.image || '/images/product-placeholder.jpg';
        
        row.innerHTML = `
            <div class="cart-item-img">
                <img src="${imageUrl}" alt="${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxMCIgZmlsbD0iI0ZEQjBCMCIvPjwvc3ZnPg=='">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.title || 'Товар'}</div>
                <div class="cart-item-price-single">${formatPrice(item.price)} ₽/шт</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity-value">${item.quantity} шт</span>
                    <button class="quantity-btn plus">+</button>
                    <button class="remove-btn">Удалить</button>
                </div>
            </div>
            <div class="cart-item-price-total">
                ${formatPrice(item.price * item.quantity)} ₽
            </div>
        `;

        // Добавляем обработчики
        const minusBtn = row.querySelector('.minus');
        const plusBtn = row.querySelector('.plus');
        const removeBtn = row.querySelector('.remove-btn');

        minusBtn.addEventListener('click', () => {
            const newQuantity = item.quantity - 1;
            if (newQuantity > 0) {
                window.cartManager.updateQuantity(item.id, newQuantity);
            } else {
                if (confirm('Удалить товар из корзины?')) {
                    window.cartManager.removeItem(item.id);
                }
            }
        });

        plusBtn.addEventListener('click', () => {
            window.cartManager.updateQuantity(item.id, item.quantity + 1);
        });

        removeBtn.addEventListener('click', () => {
            if (confirm('Удалить товар из корзины?')) {
                window.cartManager.removeItem(item.id);
            }
        });

        return row;
    }

    // Обновить итоговую сумму
    function updateTotalPrice() {
        if (!totalPriceElement) return;
        
        let totalPrice = 0;
        if (window.cartManager) {
            totalPrice = window.cartManager.getTotalPrice();
        } else {
            cartData.forEach(item => {
                totalPrice += item.price * item.quantity;
            });
        }
        
        totalPriceElement.textContent = formatPrice(totalPrice) + ' ₽';
    }

    // Форматирование цены
    function formatPrice(price) {
        return price.toLocaleString('ru-RU');
    }

    // Оформление заказа
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (cartData.length === 0) {
                alert('Добавьте товары в корзину перед оформлением заказа');
                return;
            }

            if (!window.apiService || !window.apiService.isAuthenticated()) {
                alert('Для оформления заказа необходимо войти в систему');
                return;
            }

            alert('Оформление заказа находится в разработке');
        });
    }

    // Перейти на главную (пустая корзина)
    const emptyCartBtn = document.querySelector('.empty-cart-btn');
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    // Инициализация
    initCart();

    // Добавляем стиль для анимации
    if (!document.querySelector('#cart-animations')) {
        const style = document.createElement('style');
        style.id = 'cart-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
            
            .cart-box {
                animation: fadeIn 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
});