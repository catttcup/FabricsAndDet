// Упрощенный единый скрипт для рендера корзины
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    
    // Слушаем события обновления корзины
    window.addEventListener('cartUpdated', renderCart);
    
    // Кнопка оформления
    document.querySelector('.checkout-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Оформление заказа находится в разработке');
    });
});

function renderCart() {
    const cart = window.cartManager ? window.cartManager.cart : [];
    const totalCount = cartManager.getTotalCount();
    const totalPrice = cartManager.getTotalPrice();
    
    const cartItemsList = document.getElementById('cartItemsList');
    const totalPriceElement = document.getElementById('totalPrice');
    const cartBox = document.getElementById('cartBox');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsList) return;
    
    // Управление видимостью
    if (totalCount === 0) {
        cartBox.style.display = 'none';
        emptyCart.style.display = 'flex';
        return;
    } else {
        cartBox.style.display = 'block';
        emptyCart.style.display = 'none';
    }
    
    // Очищаем список
    cartItemsList.innerHTML = '';
    
    // Рендерим товары
    cart.forEach(item => {
        const itemElement = createCartItemElement(item);
        cartItemsList.appendChild(itemElement);
    });
    
    // Обновляем итоговую сумму
    if (totalPriceElement) {
        totalPriceElement.textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
    }
}

function createCartItemElement(item) {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.dataset.id = item.id;
    
    row.innerHTML = `
        <div class="cart-item-img pink-bg"></div>
        <div class="cart-item-info">
            <div class="cart-item-name">${item.title || 'Товар'}</div>
            <div class="cart-item-price-single">${item.price.toLocaleString('ru-RU')} ₽/шт</div>
            <div class="cart-item-controls">
                <button class="quantity-btn minus">-</button>
                <span class="quantity-value">${item.quantity} шт</span>
                <button class="quantity-btn plus">+</button>
                <button class="remove-btn">Удалить</button>
            </div>
        </div>
        <div class="cart-item-price-total">
            ${(item.price * item.quantity).toLocaleString('ru-RU')} ₽
        </div>
    `;
    
    // Добавляем обработчики
    const minusBtn = row.querySelector('.minus');
    const plusBtn = row.querySelector('.plus');
    const removeBtn = row.querySelector('.remove-btn');
    
    minusBtn.addEventListener('click', () => {
        const newQuantity = item.quantity - 1;
        if (newQuantity > 0) {
            cartManager.updateQuantity(item.id, newQuantity);
        }
    });
    
    plusBtn.addEventListener('click', () => {
        cartManager.updateQuantity(item.id, item.quantity + 1);
    });
    
    removeBtn.addEventListener('click', () => {
        if (confirm('Удалить товар из корзины?')) {
            cartManager.removeItem(item.id);
        }
    });
    
    return row;
}