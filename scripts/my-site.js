document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 my-site.js ЗАГРУЖЕН');
    
    // Показываем что в localStorage
    console.log('📦 siteDesign exists:', !!localStorage.getItem('siteDesign'));
    console.log('✅ siteReady:', localStorage.getItem('siteReady'));
    
    createSiteFromScratch();
});

function createSiteFromScratch() {
    // ОЧИСТКА
    document.body.innerHTML = '';
    
    // Сразу ставим фон
    document.body.style.backgroundColor = '#FFF2F2';
    document.body.style.minHeight = '100vh';
    document.body.style.margin = '0';
    document.body.style.fontFamily = 'Arial, sans-serif';
    
    const siteDesignJSON = localStorage.getItem('siteDesign');
    const isSiteReady = localStorage.getItem('siteReady') === 'true';
    
    console.log('🔍 Проверка:', {
        hasDesign: !!siteDesignJSON,
        isReady: isSiteReady,
        designLength: siteDesignJSON ? siteDesignJSON.length : 0
    });
    
    if (!siteDesignJSON || !isSiteReady) {
        showNoDesignMessage();
        return;
    }
    
    try {
        const design = JSON.parse(siteDesignJSON);
        console.log('🎨 Дизайн загружен:', design.siteName);
        createCompleteSite(design);
    } catch (error) {
        console.error('❌ Ошибка парсинга:', error);
        document.body.innerHTML = `
            <div style="padding: 50px; text-align: center;">
                <h1 style="color: red;">Ошибка загрузки дизайна</h1>
                <p>${error.message}</p>
                <button onclick="window.location.href='editor.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 20px;">
                    В редактор
                </button>
            </div>
        `;
    }
}

function showNoDesignMessage() {
    document.body.innerHTML = `
        <div style="text-align: center; padding: 100px 20px;">
            <div style="font-size: 72px; color: #ddd; margin-bottom: 20px;">🏪</div>
            <h1 style="color: #666; margin-bottom: 20px;">Магазин еще не настроен</h1>
            <p style="color: #888; max-width: 500px; margin: 0 auto 30px;">
                Зайдите в редактор, настройте дизайн магазина и нажмите "Сохранить"
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.location.href='editor.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <span>📝 Редактор</span>
                </button>
                <button onclick="window.location.href='admin.html'" style="background: #333; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <span>⚙️ Админка</span>
                </button>
            </div>
        </div>
    `;
}

function createCompleteSite(design) {
    console.log('🏗️ Создаем сайт:', design.siteName);
    console.log('Дизайн целиком:', design);
    console.log('Баннеры в дизайне:', design.ads);
    
    // ШАПКА
    const header = document.createElement('header');
    header.className = 'site-header'; 
    header.style.backgroundColor = design.headerColor || '#892828';

    header.innerHTML = `
        <div class="site-logo" style="background: ${design.logoBgColor || 'rgba(255,255,255,0.1)'}">
            ${design.logo ? `<img src="${design.logo}" alt="Лого">` : ''}
        </div>
        <h1 class="site-name" style="color: ${design.name?.color || 'white'}">
            ${design.siteName || design.name?.text || 'Мой магазин'}
        </h1>
        <button onclick="window.location.href='admin.html'" class="admin-btn">
            В админку
        </button>
    `;
    
    // РЕКЛАМА
    const adsSection = document.createElement('section');
    adsSection.style.cssText = `
        padding: 40px 30px 20px;
        max-width: 1200px;
        margin: 0 auto;
    `;

    let adsHTML = '<h2 style="color: #333; margin-bottom: 20px;">Рекламные баннеры</h2>';

    console.log('Дизайн для баннеров:', design);
    console.log('Баннеры в дизайне:', design.ads);
    console.log('Длина баннеров:', design.ads ? design.ads.length : 0);

    if (design.ads && Array.isArray(design.ads) && design.ads.length > 0) {
        console.log('Есть баннеры для отображения!', design.ads);
        
        // Фильтруем только реальные баннеры
        const realAds = design.ads.filter(ad => ad && ad.trim() !== '');
        console.log('Реальные баннеры после фильтрации:', realAds.length);
        
        if (realAds.length > 0) {
            adsHTML += '<div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">';
            
            realAds.forEach((ad, index) => {
                console.log(`Баннер ${index}:`, ad.substring(0, 50) + '...');
                
                adsHTML += `
                    <div style="flex: 1; min-width: 300px; max-width: 400px; height: 200px; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.15);">
                        <img src="${ad}" alt="Баннер ${index + 1}" 
                            style="width: 100%; height: 100%; object-fit: cover;"
                            onerror="this.onerror=null; this.src=''; this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontWeight='bold'; this.innerHTML='Баннер ${index + 1}';">
                    </div>
                `;
            });
            
            adsHTML += '</div>';
        } else {
            adsHTML += `
                <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; border: 2px dashed #ddd;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">🖼️</div>
                    <p style="color: #888;">Баннеры загружены но пустые</p>
                </div>
            `;
        }
    } else {
        adsHTML += `
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; border: 2px dashed #ddd;">
                <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">🖼️</div>
                <p style="color: #888;">Рекламные баннеры не добавлены</p>
            </div>
        `;
    }

    adsSection.innerHTML = adsHTML;

    // ТОВАРЫ
    const productsSection = document.createElement('section');
    productsSection.style.cssText = `
        padding: 20px 30px 40px;
        max-width: 1200px;
        margin: 0 auto;
    `;
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    let productsHTML = '<h2 style="color: #333; margin-bottom: 20px;">Товары</h2>';
    
    if (products.length > 0) {
        productsHTML += '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px;">';
        
        products.forEach((product, index) => {
            productsHTML += `
                <div style="background: ${design.productStyles?.cardBgColor || '#FFFFFF'}; border-radius: 12px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                    <div style="width: 100%; height: 200px; background: #FDB0B0; border-radius: 8px; margin-bottom: 15px;"></div>
                    <h3 style="color: #333; margin: 0 0 10px 0;">${product.name || 'Товар без названия'}</h3>
                    <p style="color: #666; margin: 0 0 15px 0; font-size: 14px;">${product.description || 'Описание отсутствует'}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 22px; font-weight: bold; color: ${design.productStyles?.priceColor || '#B73131'};">${product.price || 0} руб</div>
                        <button style="background: ${design.productStyles?.buttonColor || '#B73131'}; color: ${design.productStyles?.buttonTextColor || '#FFFFFF'}; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;">
                            В корзину
                        </button>
                    </div>
                </div>
            `;
        });
        
        productsHTML += '</div>';
    } else {
        productsHTML += `
            <div style="background: white; padding: 50px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">📦</div>
                <h3 style="color: #666; margin-bottom: 10px;">Товаров пока нет</h3>
                <p style="color: #888; margin-bottom: 25px;">Добавьте товары в админ-панели</p>
                <button onclick="window.location.href='admin.html'" style="background: #B73131; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; margin: 0 auto;">
                    <span>➕ Добавить товар</span>
                </button>
            </div>
        `;
    }
    
    productsSection.innerHTML = productsHTML;
    
    // СБОРКА
    document.body.appendChild(header);
    document.body.appendChild(adsSection);
    document.body.appendChild(productsSection);
    
    // ОБРАБОТЧИК КНОПОК "В КОРЗИНУ"
    setTimeout(() => {
        document.querySelectorAll('button').forEach(button => {
            if (button.textContent === 'В корзину') {
                button.addEventListener('click', function() {
                    const productName = this.closest('div').querySelector('h3').textContent;
                    alert(`Товар "${productName}" добавлен в корзину!`);
                });
            }
        });
    }, 100);
}

// Функция для принудительного обновления
window.updateSitePage = function() {
    console.log('🔄 Принудительное обновление');
    createSiteFromScratch();
};