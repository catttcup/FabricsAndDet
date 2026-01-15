document.addEventListener('DOMContentLoaded', function () {
    console.log('✅ products.js загружен');
    console.log('📦 Товары:', window.productsData);
    console.log('🏪 Магазины:', window.defaultShops);
    
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.error('❌ Не найден .products-grid');
        return;
    }

    if (!window.productsData) {
        console.error('❌ Нет данных о товарах');
        return;
    }

    // Очищаем старые карточки
    productsGrid.innerHTML = '';

    // Создаем карточки
    window.productsData.forEach(product => {
        console.log('Создаем карточку для товара:', product.id, 'shop:', product.shop);
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    // Добавляем обработчики
    addProductCardEventListeners();
    
    // Инициализируем поиск
    setTimeout(initSearch, 100);
});

function createProductCard(product) {
    console.log('🛠️ Создание карточки товара:', product.id);
    
    // Определяем имя магазина
    let shopName = 'Магазин';
    if (window.defaultShops && product.shop) {
        const shop = window.defaultShops[product.shop];
        if (shop) shopName = shop.name;
    }

    const article = document.createElement('article');
    article.className = 'product-card';
    article.dataset.id = product.id;

    // ВАЖНО: Вставляем ссылку на магазин прямо в HTML
    article.innerHTML = `
        <div class="product-card__image">
            <img src="${product.image}" 
                 alt="${product.title}" 
                 class="product-image"
                 onerror="this.onerror=null; this.style.display='none'; this.parentElement.style.backgroundColor='#FFA9A9';">
        </div>
        <div class="product-card__info">
            <div class="product-card__price">
                <span class="product-card__current-price">${formatPrice(product.price)} ₽</span>
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title">${product.title}</h3>
                <div class="product-card__meta">
                    <span class="product-card__category"></span>
                    <span class="product-card__stock"></span>
                </div>
                <!-- ССЫЛКА НА МАГАЗИН ДОБАВЛЕНА ЗДЕСЬ -->
                <a href="#" class="product-shop-link" data-shop="${product.shop || ''}">
                    <i class="fas fa-store"></i> ${shopName}
                </a>
            </div>
        </div>
        <button class="product-card__cart-btn" data-product-id="${product.id}">В корзину</button>
    `;

    console.log('✅ Карточка создана со ссылкой на магазин');
    return article;
}

function addProductCardEventListeners() {
    console.log('🔄 Добавление обработчиков...');
    
    // 1. Обработчик кнопок "Добавить в корзину"
    document.querySelectorAll('.product-card__cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            const product = window.productsData.find(p => p.id === productId);

            if (product) {
                addToCart(product);
            }
        });
    });

    // 2. Обработчик ссылок на магазин
    document.querySelectorAll('.product-shop-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const shopId = this.dataset.shop;
            console.log('🎯 Клик по магазину:', shopId);
            
            if (shopId) {
                localStorage.setItem('selectedShop', shopId);
                localStorage.setItem('isDefaultShop', 'true');
                window.open('shop-page.html', '_blank');
            } else {
                console.warn('⚠️ У ссылки нет data-shop атрибута');
            }
        });
    });

    // 3. Обработчик клика по карточке
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.closest('.product-card__cart-btn') && 
                !e.target.closest('.product-shop-link')) {
                const productId = parseInt(this.dataset.id);
                console.log('Клик по карточке товара:', productId);
            }
        });
    });
    
    console.log('✅ Обработчики добавлены');
}
async function addToCart(product) {
    // Если пользователь авторизован - добавляем через API
    if (window.apiService && window.apiService.isAuthenticated()) {
        const result = await window.apiService.addToCart(product);

        if (result.success) {
            showNotification(`Товар "${product.title}" добавлен в корзину!`, 'success');

            // Обновляем локальную корзину для синхронизации
            if (window.cartManager) {
                window.cartManager.addItem({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image
                });
            }
        }
    } else {
        // Если не авторизован - используем localStorage
        if (window.cartManager) {
            window.cartManager.addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image
            });
        } else {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        }

        showNotification(`Товар "${product.title}" добавлен в корзину!`, 'success');

        // Показываем предложение войти
        setTimeout(() => {
            if (!window.apiService?.isAuthenticated()) {
                if (confirm('Хотите войти, чтобы сохранить корзину на сервере?')) {
                    openLoginModal();
                }
            }
        }, 1000);
    }
}

function showNotification(message, type = 'success') {
    // Создаём уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Добавляем стили для анимации
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
        }`;
        document.head.appendChild(style);
    }
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// === ПОИСК ТОВАРОВ ===

// Инициализация поиска
function initSearch() {
    const searchInput = document.querySelector('.product__search');
    if (!searchInput) {
        console.log('Поле поиска не найдено');
        return;
    }
    
    console.log('Инициализация поиска...');
    
    // Создаем контейнер для результатов поиска
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    searchInput.parentNode.appendChild(resultsContainer);
    
    // Получаем все карточки товаров
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Найдено ${productCards.length} карточек товаров`);
    
    // Функция поиска
    function performSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (term.length === 0) {
            // Показываем все карточки
            productCards.forEach(card => {
                card.style.display = 'block';
            });
            resultsContainer.style.display = 'none';
            return;
        }
        
        // Ищем среди товаров в массиве window.productsData
        const foundProducts = window.productsData.filter(product => 
            product.title.toLowerCase().includes(term)
        );
        
        // Показываем/скрываем карточки
        productCards.forEach(card => {
            const productId = parseInt(card.dataset.id);
            const shouldShow = foundProducts.some(product => product.id === productId);
            card.style.display = shouldShow ? 'block' : 'none';
        });
        
        // Показываем результаты в выпадающем списке
        showSearchResults(foundProducts, term);
    }
    
    // Показ результатов в выпадающем списке
    function showSearchResults(products, searchTerm) {
        if (products.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>По запросу "<strong>${searchTerm}</strong>" ничего не найдено</p>
                    <p class="suggestion">Попробуйте изменить запрос</p>
                </div>
            `;
            resultsContainer.style.display = 'block';
            return;
        }
        
        let html = '<div class="results-list">';
        products.forEach(product => {
            html += `
                <div class="search-result-item" data-id="${product.id}">
                    <div class="result-title">${highlightText(product.title, searchTerm)}</div>
                    <div class="result-price">${formatPrice(product.price)} ₽</div>
                </div>
            `;
        });
        html += '</div>';
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
        
        // Добавляем обработчики кликов на результаты
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                scrollToProduct(productId);
            });
        });
    }
    
    // Подсветка найденного текста
    function highlightText(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // Прокрутка к товару
    function scrollToProduct(productId) {
        const targetCard = document.querySelector(`.product-card[data-id="${productId}"]`);
        if (targetCard) {
            targetCard.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Подсвечиваем карточку
            targetCard.style.transition = 'background-color 0.5s';
            targetCard.style.backgroundColor = '#FFF9C4';
            setTimeout(() => {
                targetCard.style.backgroundColor = '';
            }, 1500);
            
            // Скрываем результаты поиска
            resultsContainer.style.display = 'none';
        }
    }
    
    // Обработчик ввода с задержкой
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    // Закрытие результатов при клике вне
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });
    
    // Обработчик клавиши Escape
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            resultsContainer.style.display = 'none';
        }
    });
    
    console.log('Поиск инициализирован');
}

// Добавьте вызов initSearch в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    const productsGrid = document.querySelector('.products-grid');

    if (!productsGrid || !window.productsData) return;

    // Очищаем старые карточки (если есть)
    productsGrid.innerHTML = '';

    // Генерируем карточки товаров
    window.productsData.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    // Добавляем обработчики событий
    addProductCardEventListeners();
    
    // Инициализируем поиск после создания карточек
    setTimeout(initSearch, 100);
});