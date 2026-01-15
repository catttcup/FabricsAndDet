document.addEventListener('DOMContentLoaded', function() {
    const shopId = localStorage.getItem('selectedShop');
    const isDefaultShop = localStorage.getItem('isDefaultShop') === 'true';
    
    if (!shopId) {
        showError('Магазин не найден');
        return;
    }
    
    if (isDefaultShop) {
        loadDefaultShop(shopId);
    } else {
        loadCustomShop(shopId);
    }
});

function loadDefaultShop(shopId) {
    const shop = window.defaultShops[shopId];
    if (!shop) {
        showError('Магазин не найден');
        return;
    }
    
    // Получаем товары этого магазина
    const shopProducts = window.productsData.filter(product => 
        shop.products.includes(product.id)
    );
    
    // Используем шаблон как в my-site.js
    renderShopWithTemplate(shop, shopProducts);
}

function loadCustomShop(shopId) {
    showError('Кастомные магазины пока не поддерживаются');
}

function renderShopWithTemplate(shop, products) {
    // Очищаем body
    document.body.innerHTML = '';
    
    // Создаем шапку как в my-site.html
    const header = document.createElement('header');
    header.className = 'site-header'; 
    header.style.backgroundColor = shop.design.header.bgColor;

    header.innerHTML = `
        <div class="site-logo" style="background: ${shop.design.logo.bgColor}">
            ${shop.design.logo.url ? `<img src="${shop.design.logo.url}" alt="Лого">` : '<i class="fas fa-store"></i>'}
        </div>
        <h1 class="site-name" style="color: ${shop.design.name.color}">
            ${shop.design.name.text}
        </h1>
        <button onclick="window.location.href='index.html'" class="admin-btn" style="
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        ">
            <i class="fas fa-home"></i> На главную
        </button>
    `;
    
    // Секция с описанием магазина (по желанию, можно убрать)
    const descriptionSection = document.createElement('section');
    descriptionSection.style.cssText = `
        padding: 20px 30px;
        background: white;
        margin: 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        border-bottom: 1px solid #eee;
    `;
    
    descriptionSection.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
            <p style="color: #666; font-size: 15px; line-height: 1.6; text-align: center;">
                ${shop.description}
            </p>
        </div>
    `;
    
    // Товары - используем стили из my-site.css
    const productsSection = document.createElement('section');
    productsSection.className = 'site-products';
    productsSection.style.cssText = `
        padding: 30px;
        max-width: 1400px;
        margin: 0 auto;
    `;
    
    let productsHTML = '<h2 style="color: #333; margin-bottom: 20px; font-size: 24px;">Товары магазина</h2>';
    
    if (products.length > 0) {
        productsHTML += '<div class="products-grid">';
        
        products.forEach((product) => {
            productsHTML += `
                <div class="product-item" style="background: ${shop.design.product.cardBgColor};">
                    <div class="product-image-container">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.title}" class="product-image">` : 
                            `<div style="width:100%;height:100%;background:#FDB0B0;display:flex;align-items:center;justify-content:center;">
                                <i class="fas fa-image" style="font-size:48px;color:#999;"></i>
                            </div>`
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="product-title" style="
                            font-family: ${shop.design.product.font};
                            font-size: ${shop.design.product.fontSize}px;
                        ">
                            ${product.title || 'Товар без названия'}
                        </h3>
                        <div class="product-price" style="color: ${shop.design.product.priceColor}">
                            ${product.price || 0} руб
                        </div>
                        <button class="add-to-cart" style="
                            background: ${shop.design.product.buttonColor};
                            color: ${shop.design.product.buttonTextColor};
                        ">
                            <i class="fas fa-shopping-cart"></i> В корзину
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsHTML += '</div>';
    } else {
        productsHTML += `
            <div class="no-products-message">
                <i class="fas fa-box-open"></i>
                <h2>Товаров пока нет</h2>
                <p>В этом магазине пока нет доступных товаров</p>
                <button onclick="window.location.href='index.html'" class="action-button">
                    <i class="fas fa-home"></i> Вернуться на главную
                </button>
            </div>
        `;
    }
    
    productsSection.innerHTML = productsHTML;
    
    // Собираем страницу
    document.body.appendChild(header);
    document.body.appendChild(descriptionSection);
    document.body.appendChild(productsSection);
    
    // Добавляем обработчики для кнопок "В корзину"
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-item');
                const productName = productCard.querySelector('.product-title').textContent;
                alert(`Товар "${productName}" добавлен в корзину!`);
            });
        });
    }, 100);
}

function showError(message) {
    document.body.innerHTML = `
        <div style="text-align: center; padding: 100px 20px; background: #f5f5f5; min-height: 100vh;">
            <div style="font-size: 72px; color: #ddd; margin-bottom: 20px;">🏪</div>
            <h1 style="color: #666; margin-bottom: 20px;">${message}</h1>
            <p style="color: #888; max-width: 500px; margin: 0 auto 30px;">
                Вернитесь на главную страницу и выберите другой магазин
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.location.href='index.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-home"></i> На главную
                </button>
            </div>
        </div>
    `;
}