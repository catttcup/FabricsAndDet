document.addEventListener('DOMContentLoaded', function() {
    let isSitePublished = localStorage.getItem('sitePublished') === 'true';
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const addProductBtn = document.getElementById('addProductBtn');
    const publishTab = document.getElementById('publishTab');
    const mySiteTab = document.getElementById('mySiteTab');
    const deleteTab = document.getElementById('deleteTab');
    const myShopTab = document.getElementById('myShopTab');
    const editorBtn = document.querySelector('.editor-btn');
    const settingsBtn = document.querySelector('.settings-btn');
    const addProductModal = document.getElementById('addProductModal');
    const productForm = document.getElementById('productForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const productImageInput = document.getElementById('productImage');
    const fileName = document.getElementById('fileName');
        
    // Обновление UI при загрузке
    function updateUIForPublishing() {
        // Кнопка "Добавить товар" активна, если сайт опубликован
        if (isSitePublished) {
            addProductBtn.style.opacity = '1';
            addProductBtn.style.cursor = 'pointer';
            addProductBtn.style.pointerEvents = 'auto';
        } else {
            addProductBtn.style.opacity = '0.5';
            addProductBtn.style.cursor = 'not-allowed';
            addProductBtn.style.pointerEvents = 'none';
        }
    }
    
    // Функция проверки, есть ли сохраненный дизайн сайта
    function checkSiteDesign() {
        return localStorage.getItem('siteDesign') !== null || 
               localStorage.getItem('shopSettings') !== null;
    }
    
    // Функция открытия сайта 
    function openSite() {
        const hasSiteDesign = checkSiteDesign();
        const isPublished = localStorage.getItem('sitePublished') === 'true';
        
        // ВАЖНО: Если сайт не опубликован, но есть дизайн - все равно показываем
        if (hasSiteDesign) {
            // Есть сохраненный дизайн - открываем его
            console.log('Открываем сохраненный дизайн');
            window.open('my-site.html', '_blank');
        } else {
            // Нет дизайна - открываем шаблон по умолчанию
            console.log('Открываем шаблон по умолчанию');
            createAndOpenTemplate();
        }
    }
    
    // 4. Создание и открытие шаблона по умолчанию
    function createAndOpenTemplate() {
        const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        let defaultTemplate = {
            headerColor: '#892828',
            siteName: 'Мой магазин F&D',
            backgroundColor: '#FFF2F2',
            logo: null,
            logoBgColor: 'rgba(255, 255, 255, 0.1)',
            ads: [],
            products: [],
            productStyles: {
                name: 'Товар',
                price: 0,
                cardBgColor: '#FFFFFF',
                buttonColor: '#B73131',
                buttonTextColor: '#FFFFFF',
                priceColor: '#B73131'
            },
            savedAt: new Date().toISOString()
        };
        
        // Добавляем реальные товары если есть
        if (allProducts.length > 0) {
            defaultTemplate.products = allProducts.map((product, index) => ({
                id: product.id || index + 1,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image || ''
            }));
        }
        
        // Сохраняем шаблон (но НЕ помечаем как опубликованный!)
        localStorage.setItem('siteDesign', JSON.stringify(defaultTemplate));
        
        // Открываем сайт
        window.open('my-site.html', '_blank');
    }
    
    // Публикация сайта
    function publishSite() {
        if (confirm('Вы уверены, что хотите опубликовать сайт?')) {
            const hasSiteDesign = checkSiteDesign();
            
            if (!hasSiteDesign) {
                // Если нет дизайна - создаем шаблон
                createAndOpenTemplate();
            }
            
            // Помечаем как опубликованный
            isSitePublished = true;
            localStorage.setItem('sitePublished', 'true');
            
            // Если есть сохраненный дизайн, обновляем его статус
            const siteDesign = localStorage.getItem('siteDesign');
            if (siteDesign) {
                const design = JSON.parse(siteDesign);
                design.isPublished = true;
                localStorage.setItem('siteDesign', JSON.stringify(design));
            }
            
            alert('Поздравляем с созданием магазина! Теперь вы можете добавлять товары.');
            updateUIForPublishing();
        }
    }
    
    // Удаление сайта
    function deleteSite() {
        const hasSiteDesign = checkSiteDesign();
        
        if (hasSiteDesign) {
            if (confirm('Вы уверены, что хотите удалить сайт? Все настройки и товары будут удалены.')) {
                localStorage.removeItem('sitePublished');
                localStorage.removeItem('siteDesign');
                localStorage.removeItem('shopSettings');
                localStorage.removeItem('products');
                isSitePublished = false;
                products = [];
                alert('Сайт удален. Все настройки сброшены.');
            }
        } else {
            if (confirm('Сайт еще не создан. Очистить все данные?')) {
                localStorage.removeItem('sitePublished');
                localStorage.removeItem('siteDesign');
                localStorage.removeItem('products');
                isSitePublished = false;
                products = [];
                alert('Данные очищены.');
            }
        }
        
        updateUIForPublishing();
    }
    
    function openAddProductModal() {
        if (!isSitePublished) {
            alert('Сначала опубликуйте сайт! Нажмите "Опубликовать сайт"');
            return;
        }
        
        addProductModal.style.display = 'flex';
    }
    
    function closeAddProductModal() {
        addProductModal.style.display = 'none';
        productForm.reset();
        fileName.textContent = 'Файл не выбран';
        productImageInput.value = '';
    }
    
function addProduct(productData) {
    productData.id = Date.now();
    productData.createdAt = new Date().toISOString();
    
    if (!productData.image) {
        productData.image = '';
    }
    
    //Добавляем товар в общий список
    let currentProducts = JSON.parse(localStorage.getItem('products') || '[]');
    currentProducts.push(productData);
    localStorage.setItem('products', JSON.stringify(currentProducts));
    
    //Обновляем дизайн сайта с новыми товарами
    updateSiteWithProducts();
    
    alert('Товар добавлен! Он появится на вашем сайте.');
    closeAddProductModal();
}

function updateSiteWithProducts() {
    // Получаем текущий дизайн или создаем новый
    let siteDesign = JSON.parse(localStorage.getItem('siteDesign') || 'null');
    
    if (!siteDesign) {
        // Если нет дизайна, создаем базовый
        siteDesign = {
            headerColor: '#892828',
            siteName: 'Мой магазин F&D',
            backgroundColor: '#FFF2F2',
            logo: null,
            logoBgColor: 'rgba(255, 255, 255, 0.1)',
            ads: [],
            products: [],
            productStyles: {
                name: 'Товар',
                price: 0,
                cardBgColor: '#FFFFFF',
                buttonColor: '#B73131',
                buttonTextColor: '#FFFFFF',
                priceColor: '#B73131'
            },
            savedAt: new Date().toISOString()
        };
    }
    
    // Получаем ВСЕ добавленные товары
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Преобразуем товары в формат для сайта
    siteDesign.products = allProducts.map((product, index) => ({
        id: product.id || index + 1,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image || ''
    }));
    
    // Сохраняем обновленный дизайн
    localStorage.setItem('siteDesign', JSON.stringify(siteDesign));
    
    console.log('Сайт обновлен с товарами:', siteDesign.products.length);
}
    
    function updateSiteWithProducts() {
        let siteDesign = JSON.parse(localStorage.getItem('siteDesign') || 'null');
        
        if (!siteDesign) {
            siteDesign = {
                headerColor: '#892828',
                siteName: 'Мой магазин F&D',
                backgroundColor: '#FFF2F2',
                logo: null,
                logoBgColor: 'rgba(255, 255, 255, 0.1)',
                ads: [],
                products: [],
                productStyles: {
                    name: 'Товар',
                    price: 0,
                    cardBgColor: '#FFFFFF',
                    buttonColor: '#B73131'
                },
                savedAt: new Date().toISOString()
            };
        }
        
        const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
        siteDesign.products = allProducts.map((product, index) => ({
            id: product.id || index + 1,
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image || ''
        }));
        
        localStorage.setItem('siteDesign', JSON.stringify(siteDesign));
    }
    
    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    
    mySiteTab.addEventListener('click', function() {
        const siteDesign = localStorage.getItem('siteDesign');
        const isSiteReady = localStorage.getItem('siteReady') === 'true';
        
        if (siteDesign && isSiteReady) {
            window.open('my-site.html', '_blank');
        } else {
            if (confirm('Сайт еще не настроен. Хотите перейти в редактор?')) {
                window.location.href = 'editor.html';
            }
        }
        
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // "Опубликовать магазин" - публикует и делает кнопку активной
    publishTab.addEventListener('click', function() {
        publishSite();
        
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // "Удалить сайт"
    deleteTab.addEventListener('click', function() {
        deleteSite();
        
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // "Редактор сайта" - просто переходит на страницу редактора
    if (editorBtn) {
        editorBtn.addEventListener('click', function() {
            const siteDesign = localStorage.getItem('siteDesign');
            
            if (siteDesign) {
                window.location.href = 'editor.html';
            } else {
                window.location.href = 'editor.html';
            }
        });
    }
    
    // 5. Кнопка "Добавить товар"
    addProductBtn.addEventListener('click', openAddProductModal);
    
    // 6. Форма товара
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            image: ''
        };
        
        if (!productData.name || !productData.description || !productData.price) {
            alert('Пожалуйста, заполните все обязательные поля!');
            return;
        }
        
        if (productImageInput.files.length > 0) {
            const file = productImageInput.files[0];
            
            if (!file.type.startsWith('image/')) {
                alert('Пожалуйста, выберите изображение!');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                productData.image = e.target.result;
                addProduct(productData);
            };
            reader.readAsDataURL(file);
        } else {
            addProduct(productData);
        }
    });
    
    // 7. Кнопка "Отмена"
    cancelBtn.addEventListener('click', closeAddProductModal);
    
    // 8. Загрузка файла
    fileUploadArea.addEventListener('click', function() {
        productImageInput.click();
    });
    
    productImageInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'Файл не выбран';
        }
    });
    
    // 9. Закрытие модального окна
    addProductModal.addEventListener('click', function(e) {
        if (e.target === addProductModal) {
            closeAddProductModal();
        }
    });
    
    // 10. Кнопка "Настроить сайт"
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            alert('Функция "Настроить сайт" находится в разработке');
        });
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    
    // Обновляем UI при загрузке
    updateUIForPublishing();
    
    // Загружаем товары
    products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log('Загружено товаров:', products.length);
    
    // Карточки заказов
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', function() {
            const orderType = this.querySelector('.order-title').textContent;
            alert(`Просмотр: ${orderType}`);
        });
    });
    
    // Иконки в верхней панели
    document.querySelector('.chat-btn').addEventListener('click', function() {
        alert('Открыть чат поддержки');
    });
    
    document.querySelector('.notifications-btn').addEventListener('click', function() {
        alert('Показать уведомления (3 новых)');
        const badge = this.querySelector('.notification-badge');
        badge.textContent = '0';
        badge.style.backgroundColor = '#999';
    });
});