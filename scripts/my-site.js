// my-site.js - Логика для отображения сайта
// Отображает сохраненный дизайн с реальными товарами

document.addEventListener('DOMContentLoaded', function() {
    loadSiteContent();
});

function loadSiteContent() {
    // Получаем сохраненный дизайн
    const savedSite = JSON.parse(localStorage.getItem('siteDesign') || 'null');
    const isSitePublished = localStorage.getItem('sitePublished') === 'true';
    const realProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Если сайт опубликован, отображаем его
    if (isSitePublished && savedSite) {
        console.log('Загружаем сохраненный дизайн с', savedSite.products.length, 'товарами');
        applySavedDesign(savedSite, realProducts);
    } else {
        // Иначе показываем сообщение
        console.log('Сайт не опубликован или не настроен');
        showSiteNotConfigured();
    }
}

// Применяем сохраненный дизайн с товарами
function applySavedDesign(siteData, realProducts) {
    // Применяем общие настройки
    const siteHeader = document.querySelector('.site-header');
    const siteName = document.querySelector('.site-name');
    const body = document.body;
    const adsContainer = document.querySelector('.ads-container');
    const productsGrid = document.querySelector('.products-grid');
    
    if (siteHeader && siteData.headerColor) {
        siteHeader.style.backgroundColor = siteData.headerColor;
    }
    
    if (siteName && siteData.siteName) {
        siteName.textContent = siteData.siteName;
    }
    
    if (body && siteData.backgroundColor) {
        body.style.backgroundColor = siteData.backgroundColor;
    }
    
    // Логотип
    if (siteData.logo) {
        const siteLogo = document.querySelector('.site-logo');
        if (siteLogo) {
            siteLogo.innerHTML = siteData.logo 
                ? `<img src="${siteData.logo}" alt="Логотип" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`
                : `<i class="fas fa-store"></i>`;
            
            if (siteData.logoBgColor) {
                siteLogo.style.backgroundColor = siteData.logoBgColor;
            }
        }
    }
    
    // Рекламные баннеры
    if (adsContainer) {
        renderAds(adsContainer, siteData.ads);
    }
    
    // Товары - используем РЕАЛЬНЫЕ товары из localStorage
    if (productsGrid) {
        renderProducts(productsGrid, realProducts, siteData.productStyles);
    }
}

// Рендерим рекламные баннеры
function renderAds(container, adsData) {
    container.innerHTML = '';
    
    if (adsData && adsData.length > 0) {
        adsData.forEach((ad, index) => {
            const banner = document.createElement('div');
            banner.className = 'ad-banner';
            banner.innerHTML = `<img src="${ad}" alt="Баннер ${index + 1}">`;
            container.appendChild(banner);
        });
    } else {
        // Градиенты по умолчанию
        container.innerHTML = `
            <div class="ad-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 600;">
                Акция -50%
            </div>
            <div class="ad-banner" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 600;">
                Новая коллекция
            </div>
        `;
    }
}

// Рендерим товары
function renderProducts(container, products, styles) {
    container.innerHTML = '';
    
    if (!products || products.length === 0) {
        // Если нет товаров, показываем сообщение
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <i class="fas fa-box-open" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <h2 style="color: #666; margin-bottom: 15px;">Товаров пока нет</h2>
                <p style="color: #888; margin-bottom: 25px;">Добавьте товары в админ-панели.</p>
                <button onclick="window.location.href='admin.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin: 0 auto;">
                    <i class="fas fa-plus-circle"></i> Добавить товар
                </button>
            </div>
        `;
        return;
    }
    
    // Отображаем реальные товары
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        // Формируем изображение товара
        const imageHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}" class="product-image">`
            : `<div style="width:100%;height:100%;background:#FDB0B0;display:flex;align-items:center;justify-content:center;border-radius:8px;color:#999;font-size:14px;">
                  <i class="fas fa-image" style="font-size: 36px;"></i>
               </div>`;
        
        productItem.innerHTML = `
            <div class="product-image-container">
                ${imageHTML}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name || 'Товар без названия'}</h3>
                <p class="product-description">${product.description || 'Описание отсутствует'}</p>
                <div class="product-price">${product.price ? product.price + ' руб' : 'Цена не указана'}</div>
                <button class="add-to-cart" data-product-id="${product.id || index}">
                    <i class="fas fa-shopping-cart"></i> В корзину
                </button>
            </div>
        `;
        
        // Применяем стили
        if (styles) {
            const buttonEl = productItem.querySelector('.add-to-cart');
            const cardEl = productItem;
            
            if (buttonEl && styles.buttonColor) {
                buttonEl.style.backgroundColor = styles.buttonColor;
            }
            if (cardEl && styles.cardBgColor) {
                cardEl.style.backgroundColor = styles.cardBgColor;
            }
        }
        
        container.appendChild(productItem);
    });
    
    // Обработчики для кнопок "В корзину"
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                alert(`Товар "${this.closest('.product-item').querySelector('.product-title').textContent}" добавлен в корзину!`);
            });
        });
    }, 100);
}

// Показываем сообщение, если сайт не настроен
function showSiteNotConfigured() {
    const productsGrid = document.querySelector('.products-grid');
    const siteHeader = document.querySelector('.site-header');
    const siteName = document.querySelector('.site-name');
    const body = document.body;
    const adsContainer = document.querySelector('.ads-container');
    
    // Базовый внешний вид
    if (siteHeader) siteHeader.style.backgroundColor = '#892828';
    if (siteName) siteName.textContent = 'Мой магазин F&D';
    if (body) body.style.backgroundColor = '#FFF2F2';
    
    // Реклама
    if (adsContainer) {
        adsContainer.innerHTML = `
            <div class="ad-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 600;">
                Акция -50%
            </div>
            <div class="ad-banner" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 600;">
                Новая коллекция
            </div>
        `;
    }
    
    // Сообщение о необходимости настройки
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <i class="fas fa-store" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <h2 style="color: #666; margin-bottom: 15px;">Сайт не настроен</h2>
                <p style="color: #888; margin-bottom: 25px;">Перейдите в админ-панель для настройки сайта.</p>
                <button onclick="window.location.href='admin.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin: 0 auto;">
                    <i class="fas fa-cog"></i> Перейти в админ-панель
                </button>
            </div>
        `;
    }
}

// Функция для обновления страницы при изменении товаров
window.updateSitePage = function() {
    loadSiteContent();
};