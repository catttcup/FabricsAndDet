document.addEventListener('DOMContentLoaded', function() {
    // ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
    let isSitePublished = localStorage.getItem('sitePublished') === 'true';
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // ========== ЭЛЕМЕНТЫ ==========
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
    
    // ========== ИНИЦИАЛИЗАЦИЯ ==========
    updateUIForPublishing();
    
    // ========== ФУНКЦИИ ==========
    function updateUIForPublishing() {
        // Кнопка "Добавить товар" активна, если сайт опубликован
        if (isSitePublished) {
            addProductBtn.style.opacity = '1';
            addProductBtn.style.cursor = 'pointer';
        } else {
            addProductBtn.style.opacity = '0.5';
            addProductBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Функция проверки, есть ли сохраненный дизайн сайта
    function checkSiteDesign() {
        const hasSiteDesign = localStorage.getItem('siteDesign') !== null;
        return hasSiteDesign;
    }
    
    // Функция обновления сайта при добавлении товара
    function updateSiteWithProducts() {
        // Получаем текущий дизайн сайта или создаем новый
        let siteDesign = JSON.parse(localStorage.getItem('siteDesign') || 'null');
        
        if (!siteDesign) {
            // Создаем базовый шаблон, если его нет
            siteDesign = {
                headerColor: '#892828',
                siteName: 'Мой магазин F&D',
                backgroundColor: '#FFF2F2',
                logo: null,
                logoBgColor: 'rgba(255, 255, 255, 0.1)',
                ads: [],
                products: [], // Пустой массив - будем добавлять реальные товары
                productStyles: {
                    name: 'Товар',
                    price: 0,
                    cardBgColor: '#FFFFFF',
                    buttonColor: '#B73131'
                },
                savedAt: new Date().toISOString()
            };
        }
        
        // Получаем все добавленные товары
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
    
    // Функция открытия сайта с шаблоном по умолчанию
    function openSiteWithTemplate() {
        // Создаем базовый шаблон сайта с товарами из localStorage
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
                buttonColor: '#B73131'
            },
            savedAt: new Date().toISOString()
        };
        
        // Если есть реальные товары, используем их
        if (allProducts.length > 0) {
            defaultTemplate.products = allProducts.map((product, index) => ({
                id: product.id || index + 1,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image || ''
            }));
        } else {
            // Иначе создаем примеры
            defaultTemplate.products = [
                {
                    id: 1,
                    name: 'Пример товара 1',
                    price: 1500,
                    description: 'Описание товара 1',
                    image: ''
                },
                {
                    id: 2,
                    name: 'Пример товара 2',
                    price: 2500,
                    description: 'Описание товара 2',
                    image: ''
                },
                {
                    id: 3,
                    name: 'Пример товара 3',
                    price: 3500,
                    description: 'Описание товара 3',
                    image: ''
                },
                {
                    id: 4,
                    name: 'Пример товара 4',
                    price: 4500,
                    description: 'Описание товара 4',
                    image: ''
                }
            ];
        }
        
        // Сохраняем шаблон
        localStorage.setItem('siteDesign', JSON.stringify(defaultTemplate));
        localStorage.setItem('sitePublished', 'true');
        isSitePublished = true;
        
        // Открываем сайт в новой вкладке
        window.open('my-site.html', '_blank');
        updateUIForPublishing();
    }
    
    // Функция обработки клика на "Ваш сайт"
    function handleMySiteClick() {
        const hasSiteDesign = checkSiteDesign();
        
        if (hasSiteDesign) {
            // Есть сохраненный дизайн - открываем сайт
            window.open('my-site.html', '_blank');
        } else {
            // Нет сохраненного дизайна - предлагаем использовать шаблон
            if (confirm('Сайт еще не настроен. Использовать шаблон по умолчанию?')) {
                openSiteWithTemplate();
            } else {
                // Пользователь отказался - ничего не делаем
                console.log('Пользователь отказался использовать шаблон');
            }
        }
    }
    
    function publishSite() {
        if (confirm('Вы уверены, что хотите опубликовать сайт?')) {
            // Проверяем, есть ли сохраненный дизайн
            if (!checkSiteDesign()) {
                // Если нет дизайна, используем шаблон по умолчанию
                openSiteWithTemplate();
            } else {
                // Если есть дизайн, просто публикуем
                isSitePublished = true;
                localStorage.setItem('sitePublished', 'true');
                alert('Сайт опубликован!');
            }
            updateUIForPublishing();
        }
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
        // Генерируем уникальный ID для товара
        productData.id = Date.now();
        productData.createdAt = new Date().toISOString();
        
        // Если нет фото, оставляем пустую строку
        if (!productData.image) {
            productData.image = '';
        }
        
        // Получаем текущие товары
        let currentProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Добавляем новый товар
        currentProducts.push(productData);
        
        // Сохраняем в localStorage
        localStorage.setItem('products', JSON.stringify(currentProducts));
        
        // Обновляем сайт с новыми товарами
        updateSiteWithProducts();
        
        alert('Товар добавлен! Он появится на вашем сайте.');
        closeAddProductModal();
    }
    
    function deleteSite() {
        if (confirm('Вы уверены, что хотите удалить сайт? Все настройки и товары будут удалены.')) {
            localStorage.removeItem('sitePublished');
            localStorage.removeItem('siteDesign');
            localStorage.removeItem('products');
            isSitePublished = false;
            products = [];
            updateUIForPublishing();
            alert('Сайт удален. Все настройки сброшены.');
        }
    }
    
    // ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========
    
    // 1. Кнопка "Опубликовать сайт"
    publishTab.addEventListener('click', function() {
        publishSite();
        
        // Обновляем активный таб
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // 2. Кнопка "Удалить сайт"
    deleteTab.addEventListener('click', function() {
        deleteSite();
        
        // Обновляем активный таб
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // 3. Кнопка "Мой магазин"
    myShopTab.addEventListener('click', function() {
        document.querySelectorAll('.top-tab').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
    
    // 4. Кнопка "Ваш сайт"
    mySiteTab.addEventListener('click', handleMySiteClick);
    
    // 5. Кнопка "Добавить товар"
    addProductBtn.addEventListener('click', openAddProductModal);
    
    // 6. Форма добавления товара
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные из формы
        const productData = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            image: '' // Будет добавлено после обработки файла
        };
        
        // Проверяем обязательные поля
        if (!productData.name || !productData.description || !productData.price) {
            alert('Пожалуйста, заполните все обязательные поля!');
            return;
        }
        
        // Обработка загрузки файла
        if (productImageInput.files.length > 0) {
            const file = productImageInput.files[0];
            
            // Проверяем тип файла
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
            // Если файл не выбран, добавляем товар без изображения
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
    
    // 9. Закрытие модального окна при клике вне его
    addProductModal.addEventListener('click', function(e) {
        if (e.target === addProductModal) {
            closeAddProductModal();
        }
    });
    
    // 10. Кнопка "Редактор сайта"
    editorBtn.addEventListener('click', function() {
        window.location.href = 'editor.html';
    });
    
    // 11. Кнопка "Настроить сайт"
    settingsBtn.addEventListener('click', function() {
        alert('Функция "Настроить сайт" находится в разработке');
    });
    
    // ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
    
    // Загружаем сохраненные товары при загрузке страницы
    products = JSON.parse(localStorage.getItem('products') || '[]');
    console.log('Загружено товаров:', products.length);
    
    // ========== СТАРЫЙ КОД ==========
    
    // Управление меню (если есть сайдбар)
    const menuToggleBtn = document.getElementById('menuToggle');
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const body = document.body;
    
    if (menuToggleBtn) {
        const isMenuCollapsed = localStorage.getItem('menuCollapsed') === 'true';
        
        if (isMenuCollapsed) {
            collapseMenu();
        } else {
            expandMenu();
        }
        
        menuToggleBtn.addEventListener('click', function() {
            if (body.classList.contains('menu-collapsed')) {
                expandMenu();
                localStorage.setItem('menuCollapsed', 'false');
            } else {
                collapseMenu();
                localStorage.setItem('menuCollapsed', 'true');
            }
        });
        
        function collapseMenu() {
            body.classList.add('menu-collapsed');
            menuIcon.classList.remove('fa-chevron-left');
            menuIcon.classList.add('fa-bars');
            sidebar.classList.add('collapsed');
        }

        function expandMenu() {
            body.classList.remove('menu-collapsed');
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-chevron-left');
            sidebar.classList.remove('collapsed');
        }
    }
    
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
    
    document.querySelector('.user-btn').addEventListener('click', function() {
        alert('Открыть профиль пользователя');
    });
});