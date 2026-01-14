document.addEventListener('DOMContentLoaded', function() {
    let history = [];
    let historyIndex = -1;
    
    let currentSettings = {
        page: {
            bgColor: '#FFF2F2'
        },
        header: {
            bgColor: '#892828'
        },
        logo: {
            url: null,
            bgColor: 'rgba(255, 255, 255, 0.1)'
        },
        name: {
            text: 'Название магазина',
            font: 'Arial, sans-serif',
            size: 24,
            color: '#FFFFFF'
        },
        ads: {
            images: []
        },
        product: {
            name: 'Товар',
            price: 1500,
            font: 'Arial, sans-serif',
            fontSize: 18,
            cardBgColor: '#FFFFFF',
            buttonColor: '#B73131',
            buttonTextColor: '#FFFFFF', 
            priceColor: '#B73131'
        }
    };

    const shopLogo = document.getElementById('shopLogo');
    const shopName = document.getElementById('shopName');
    const adsContainer = document.getElementById('adsContainer');
    const productsContainer = document.getElementById('productsContainer');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsContent = document.getElementById('settingsContent');
    const settingsTitle = document.getElementById('settingsTitle');
    const closeSettingsBtn = document.getElementById('closeSettings');
    
    // Кнопки управления
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const previewBtn = document.getElementById('previewBtn');
    const adminBtn = document.getElementById('adminBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // Текущий редактируемый элемент
    let currentEditingElement = null;
    
    function init() {
        loadSavedSettings();
        saveState();
        renderPreview();
        setupEventListeners();
        createProductCards();
    }
    
    // Создание карточек товара
    function createProductCards() {
        productsContainer.innerHTML = '';
        
        for (let i = 0; i < 4; i++) { // Создаем 4 карточки
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.index = i;
            
            productCard.innerHTML = `
                <div class="product-card-image"></div>
                <div class="product-price">${formatPrice(currentSettings.product.price)} ₽</div>
                <div class="product-name">${currentSettings.product.name}</div>
                <button class="add-to-cart-btn">Добавить в корзину</button>
            `;
            
            updateProductCardStyles(productCard);
            
            productCard.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-cart-btn')) {
                    openProductSettings();
                }
            });
            
            productsContainer.appendChild(productCard);
        }
    }
    
    // Обновление стилей всех карточек
    function updateAllProductCards() {
        document.querySelectorAll('.product-card').forEach(card => {
            updateProductCardStyles(card);
        });
    }
    
    // Обновление стилей одной карточки
    function updateProductCardStyles(card) {
    const nameElement = card.querySelector('.product-name');
    const priceElement = card.querySelector('.product-price');
    const buttonElement = card.querySelector('.add-to-cart-btn');
    
    priceElement.textContent = formatPrice(currentSettings.product.price) + ' ₽';
    priceElement.style.color = currentSettings.product.priceColor || '#B73131';
    nameElement.textContent = currentSettings.product.name;
    nameElement.style.fontFamily = currentSettings.product.font;
    nameElement.style.fontSize = currentSettings.product.fontSize + 'px';
    card.style.backgroundColor = currentSettings.product.cardBgColor;
    buttonElement.style.backgroundColor = currentSettings.product.buttonColor;
    buttonElement.style.color = currentSettings.product.buttonTextColor || '#FFFFFF';
    }
    
    // Сохранение состояния в историю
    function saveState() {
        history = history.slice(0, historyIndex + 1);
        const state = JSON.parse(JSON.stringify(currentSettings));
        history.push(state);
        historyIndex++;
        updateUndoRedoButtons();
    }
    
    // Обновление кнопок отмена/повтор
    function updateUndoRedoButtons() {
        undoBtn.disabled = historyIndex <= 0;
        redoBtn.disabled = historyIndex >= history.length - 1;
    }
    
    // Отрисовка предпросмотра
    function renderPreview() {
        // Фон страницы
        document.body.style.backgroundColor = currentSettings.page.bgColor;
        
        // Цвет шапки
        document.querySelector('.preview-header').style.backgroundColor = currentSettings.header.bgColor;
        
        // Логотип
        if (currentSettings.logo.url) {
            shopLogo.innerHTML = `<img src="${currentSettings.logo.url}" alt="Логотип" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">`;
        } else {
            shopLogo.innerHTML = '<i class="fas fa-store"></i>';
        }
        shopLogo.style.backgroundColor = currentSettings.logo.bgColor;
        
        // Название магазина
        shopName.textContent = currentSettings.name.text;
        shopName.style.fontFamily = currentSettings.name.font;
        shopName.style.fontSize = currentSettings.name.size + 'px';
        shopName.style.color = currentSettings.name.color;
        
        // Рекламные баннеры
        renderAds();
        
        // Товары
        updateAllProductCards();
    }
    
    // Отрисовка рекламы
    function renderAds() {
        adsContainer.innerHTML = '';
        
        if (currentSettings.ads.images.length > 0 && currentSettings.ads.images.some(img => img)) {
            const adsContainerDiv = document.createElement('div');
            adsContainerDiv.className = 'ads-container';
            
            currentSettings.ads.images.forEach((img, index) => {
                if (img) {
                    const adDiv = document.createElement('div');
                    adDiv.className = 'ad-banner';
                    adDiv.innerHTML = `<img src="${img}" alt="Баннер ${index + 1}">`;
                    adsContainerDiv.appendChild(adDiv);
                }
            });
            
            adsContainer.appendChild(adsContainerDiv);
        } else {
            adsContainer.innerHTML = `
                <div class="ads-placeholder">
                    <i class="fas fa-ad"></i>
                    <p>Добавить рекламу</p>
                </div>
            `;
        }
    }
    
    // Форматирование цены
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    
    // Открытие настроек для элемента
    function openSettings(elementType, title) {
        currentEditingElement = elementType;
        settingsTitle.textContent = title;
        settingsPanel.style.display = 'block';
        settingsPanel.classList.add('active');
        loadSettingsForElement(elementType);
    }
    
    // Загрузка настроек для элемента
    function loadSettingsForElement(elementType) {
        settingsContent.innerHTML = '';
        
        switch(elementType) {
            case 'page':
                loadPageSettings();
                break;
            case 'header':
                loadHeaderSettings();
                break;
            case 'logo':
                loadLogoSettings();
                break;
            case 'name':
                loadNameSettings();
                break;
            case 'ads':
                loadAdsSettings();
                break;
            case 'product':
                loadProductSettings();
                break;
        }
    }
    
    // Настройки логотипа
    function loadLogoSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <div class="upload-area" id="logoUploadArea">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Загрузить изображение логотипа</p>
                    <input type="file" id="logoFileInput" class="file-input" accept="image/*">
                </div>
            </div>
            
            <div class="form-group logo-colors">
                <label>Цвет фона логотипа:</label>
                <div class="color-grid">
                <div class="color-option ${currentSettings.logo.bgColor === '#B73131' ? 'active' : ''}" data-color="#B73131" style="background-color: #B73131;"></div>
                <div class="color-option ${currentSettings.logo.bgColor === '#4CAF50' ? 'active' : ''}" data-color="#4CAF50" style="background-color: #4CAF50;"></div>
                <div class="color-option ${currentSettings.logo.bgColor === '#2196F3' ? 'active' : ''}" data-color="#2196F3" style="background-color: #2196F3;"></div>
                <div class="color-option ${currentSettings.logo.bgColor === '#FF9800' ? 'active' : ''}" data-color="#FF9800" style="background-color: #FF9800;"></div>
                <div class="color-option ${currentSettings.logo.bgColor === '#9C27B0' ? 'active' : ''}" data-color="#9C27B0" style="background-color: #9C27B0;"></div>
                <div class="color-option ${currentSettings.logo.bgColor === 'rgba(255, 255, 255, 0.1)' ? 'active' : ''}" data-color="rgba(255, 255, 255, 0.1)" style="background-color: rgba(255, 255, 255, 0.1); border: 1px solid #ddd;"></div>
            </div>
            </div>
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelLogoBtn">Отмена</button>
                <button class="apply-btn" id="applyLogoBtn">Применить</button>
            </div>
        `;
        
        const logoUploadArea = document.getElementById('logoUploadArea');
        const logoFileInput = document.getElementById('logoFileInput');
        const cancelBtn = document.getElementById('cancelLogoBtn');
        const applyBtn = document.getElementById('applyLogoBtn');
        
        logoUploadArea.addEventListener('click', () => logoFileInput.click());
        
        logoFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentSettings.logo.url = event.target.result;
                    saveState();
                    renderPreview();
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', function() {
                document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                currentSettings.logo.bgColor = this.dataset.color;
                saveState();
                renderPreview();
            });
        });
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => closeSettings());  
    }
    
    // Настройки названия
    function loadNameSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <label>Название магазина:</label>
                <input type="text" id="nameInput" value="${currentSettings.name.text}" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Шрифт:</label>
                <select id="fontSelect" class="form-select">
                    <option value="Arial, sans-serif" ${currentSettings.name.font === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                    <option value="'Roboto', sans-serif" ${currentSettings.name.font === "'Roboto', sans-serif" ? 'selected' : ''}>Roboto</option>
                    <option value="'Open Sans', sans-serif" ${currentSettings.name.font === "'Open Sans', sans-serif" ? 'selected' : ''}>Open Sans</option>
                    <option value="'Montserrat', sans-serif" ${currentSettings.name.font === "'Montserrat', sans-serif" ? 'selected' : ''}>Montserrat</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Размер шрифта: <span id="fontSizeValue">${currentSettings.name.size}px</span></label>
                <input type="range" id="fontSizeSlider" min="16" max="48" value="${currentSettings.name.size}" class="form-range">
            </div>
            
            <div class="form-group">
                <label>Цвет текста:</label>
                <input type="color" id="textColorPicker" value="${currentSettings.name.color}" class="form-color">
            </div>
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelNameBtn">Отмена</button>
                <button class="apply-btn" id="applyNameBtn">Применить</button>
            </div>
        `;
        
        const nameInput = document.getElementById('nameInput');
        const fontSelect = document.getElementById('fontSelect');
        const fontSizeSlider = document.getElementById('fontSizeSlider');
        const fontSizeValue = document.getElementById('fontSizeValue');
        const textColorPicker = document.getElementById('textColorPicker');
        const cancelBtn = document.getElementById('cancelNameBtn');
        const applyBtn = document.getElementById('applyNameBtn');
        
        nameInput.addEventListener('input', function() {
            currentSettings.name.text = this.value;
            saveState();
            renderPreview();
        });
        
        fontSelect.addEventListener('change', function() {
            currentSettings.name.font = this.value;
            saveState();
            renderPreview();
        });
        
        fontSizeSlider.addEventListener('input', function() {
            fontSizeValue.textContent = this.value + 'px';
            currentSettings.name.size = parseInt(this.value);
            saveState();
            renderPreview();
        });
        
        textColorPicker.addEventListener('input', function() {
            currentSettings.name.color = this.value;
            saveState();
            renderPreview();
        });
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => closeSettings());
    }
    
    // Настройки рекламы
    function loadAdsSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <div class="upload-area" id="adsUploadArea">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Загрузить рекламные баннеры (до 3 изображений)</p>
                    <input type="file" id="adsFileInput" class="file-input" accept="image/*" multiple>
                </div>
            </div>
            
            <div class="ads-preview-grid" id="adsPreview">
                ${[0, 1, 2].map((_, index) => {
                    const img = currentSettings.ads.images[index];
                    return img ? `
                        <div class="ad-preview-item">
                            <img src="${img}" alt="Баннер ${index + 1}">
                            <button class="remove-ad" data-index="${index}">×</button>
                        </div>
                    ` : `<div class="ad-preview-item" style="background:#f5f5f5;display:flex;align-items:center;justify-content:center;">
                        <span style="color:#888;font-size:14px;">Пусто</span>
                    </div>`;
                }).join('')}
            </div>
            
            ${currentSettings.ads.images.some(img => img) ? 
                '<button class="clear-images" id="clearAdsBtn">Очистить все баннеры</button>' : 
                ''
            }
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelAdsBtn">Отмена</button>
                <button class="apply-btn" id="applyAdsBtn">Применить</button>
            </div>
        `;
        
        const adsUploadArea = document.getElementById('adsUploadArea');
        const adsFileInput = document.getElementById('adsFileInput');
        const cancelBtn = document.getElementById('cancelAdsBtn');
        const applyBtn = document.getElementById('applyAdsBtn');
        
        adsUploadArea.addEventListener('click', () => adsFileInput.click());
        
        adsFileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files).slice(0, 3);

            console.log('Загружаемые файлы:', files.length, 'шт');

            files.forEach((file, index) => {
                if (file && index < 3) {
                    console.log(`Обработка файла ${index}:`, file.name); 
                    compressImage(file, 0.7, 600).then(compressedDataUrl => {
                        console.log(`Файл ${index} сжат успешно, длина:`, compressedDataUrl.length);
                        currentSettings.ads.images[index] = compressedDataUrl;
                        saveState();
                        renderPreview();
                        loadSettingsForElement('ads');
                    }).catch(error => {
                        console.error('Ошибка сжатия:', error);
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            console.log(`Файл ${index} загружен, длина:`, event.target.result.length);
                            currentSettings.ads.images[index] = event.target.result;
                            saveState();
                            renderPreview();
                            loadSettingsForElement('ads');
                        };
                        reader.readAsDataURL(file);
                    });
                }
            });
        });
        
        document.querySelectorAll('.remove-ad').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                currentSettings.ads.images[index] = null;
                saveState();
                renderPreview();
                loadSettingsForElement('ads');
            });
        });
        
        const clearAdsBtn = document.getElementById('clearAdsBtn');
        if (clearAdsBtn) {
            clearAdsBtn.addEventListener('click', function() {
                currentSettings.ads.images = [];
                saveState();
                renderPreview();
                loadSettingsForElement('ads');
            });
        }
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => closeSettings());
    }
    
    // Функция сжатия изображения
    function compressImage(file, quality = 0.7, maxWidth = 600) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = function(event) {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedDataUrl);
                };
                
                img.onerror = reject;
            };
            
            reader.onerror = reject;
        });
    }
    
    // Настройки фона страницы
    function loadPageSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <label>Цвет фона страницы:</label>
                <input type="color" id="pageBgColor" value="${currentSettings.page.bgColor}" class="form-color">
            </div>
            
            <div class="color-grid">
                <div class="color-option ${currentSettings.page.bgColor === '#FFF2F2' ? 'active' : ''}" data-color="#FFF2F2" style="background-color: #FFF2F2; border: 1px solid #ddd;"></div>
                <div class="color-option ${currentSettings.page.bgColor === '#FFFFFF' ? 'active' : ''}" data-color="#FFFFFF" style="background-color: #FFFFFF; border: 1px solid #ddd;"></div>
                <div class="color-option ${currentSettings.page.bgColor === '#F5F5F5' ? 'active' : ''}" data-color="#F5F5F5" style="background-color: #F5F5F5; border: 1px solid #ddd;"></div>
                <div class="color-option ${currentSettings.page.bgColor === '#E8F5E9' ? 'active' : ''}" data-color="#E8F5E9" style="background-color: #E8F5E9; border: 1px solid #ddd;"></div>
                <div class="color-option ${currentSettings.page.bgColor === '#E3F2FD' ? 'active' : ''}" data-color="#E3F2FD" style="background-color: #E3F2FD; border: 1px solid #ddd;"></div>
                <div class="color-option ${currentSettings.page.bgColor === '#FFF8E1' ? 'active' : ''}" data-color="#FFF8E1" style="background-color: #FFF8E1; border: 1px solid #ddd;"></div>
            </div>
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelPageBtn">Отмена</button>
                <button class="apply-btn" id="applyPageBtn">Применить</button>
            </div>
        `;
        
        const colorPicker = document.getElementById('pageBgColor');
        const cancelBtn = document.getElementById('cancelPageBtn');
        const applyBtn = document.getElementById('applyPageBtn');
        
        colorPicker.addEventListener('input', function() {
            document.body.style.backgroundColor = this.value;
            currentSettings.page.bgColor = this.value;
            saveState();
        });
        
        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', function() {
                document.body.style.backgroundColor = this.dataset.color;
                currentSettings.page.bgColor = this.dataset.color;
                colorPicker.value = this.dataset.color;
                saveState();
            });
        });
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => closeSettings());
    }
    
    // Настройки шапки
    function loadHeaderSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <label>Цвет фона шапки:</label>
                <input type="color" id="headerBgColor" value="${currentSettings.header.bgColor}" class="form-color">
            </div>
            
            <div class="color-grid">
                <div class="color-option ${currentSettings.header.bgColor === '#892828' ? 'active' : ''}" data-color="#892828" style="background-color: #892828;"></div>
                <div class="color-option ${currentSettings.header.bgColor === '#B73131' ? 'active' : ''}" data-color="#B73131" style="background-color: #B73131;"></div>
                <div class="color-option ${currentSettings.header.bgColor === '#333333' ? 'active' : ''}" data-color="#333333" style="background-color: #333333;"></div>
                <div class="color-option ${currentSettings.header.bgColor === '#000000' ? 'active' : ''}" data-color="#000000" style="background-color: #000000;"></div>
                <div class="color-option ${currentSettings.header.bgColor === '#4CAF50' ? 'active' : ''}" data-color="#4CAF50" style="background-color: #4CAF50;"></div>
                <div class="color-option ${currentSettings.header.bgColor === '#2196F3' ? 'active' : ''}" data-color="#2196F3" style="background-color: #2196F3;"></div>
            </div>
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelHeaderBtn">Отмена</button>
                <button class="apply-btn" id="applyHeaderBtn">Применить</button>
            </div>
        `;
        
        const colorPicker = document.getElementById('headerBgColor');
        const cancelBtn = document.getElementById('cancelHeaderBtn');
        const applyBtn = document.getElementById('applyHeaderBtn');
        
        colorPicker.addEventListener('input', function() {
            document.querySelector('.preview-header').style.backgroundColor = this.value;
            currentSettings.header.bgColor = this.value;
            saveState();
        });
        
        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', function() {
                document.querySelector('.preview-header').style.backgroundColor = this.dataset.color;
                currentSettings.header.bgColor = this.dataset.color;
                colorPicker.value = this.dataset.color;
                saveState();
            });
        });
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => closeSettings());
    }
    
    // Настройки карточки товара
    function loadProductSettings() {
        settingsContent.innerHTML = `
            <div class="form-group">
                <label>Название товара:</label>
                <input type="text" id="productNameInput" value="${currentSettings.product.name}" class="form-input">
            </div>
            
            <div class="form-group">
                <label>Цена:</label>
                <input type="number" id="productPriceInput" value="${currentSettings.product.price}" class="form-input" min="0">
            </div>

            <div class="form-group">
                <label>Шрифт названия:</label>
                <select id="productFontSelect" class="form-select">
                    <option value="Arial, sans-serif" ${currentSettings.product.font === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                    <option value="'Roboto', sans-serif" ${currentSettings.product.font === "'Roboto', sans-serif" ? 'selected' : ''}>Roboto</option>
                    <option value="'Open Sans', sans-serif" ${currentSettings.product.font === "'Open Sans', sans-serif" ? 'selected' : ''}>Open Sans</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Размер шрифта: <span id="productFontSizeValue">${currentSettings.product.fontSize}px</span></label>
                <input type="range" id="productFontSizeSlider" min="14" max="24" value="${currentSettings.product.fontSize}" class="form-range">
            </div>
            
            <div class="form-group">
                <label>Цвет фона карточки:</label>
                <input type="color" id="cardBgColor" value="${currentSettings.product.cardBgColor}" class="form-color">
            </div>
            
            <div class="form-group">
                <label>Цвет кнопки:</label>
                <input type="color" id="buttonColor" value="${currentSettings.product.buttonColor}" class="form-color">
            </div>

            <div class="form-group">
                <label>Цвет текста кнопки:</label>
                <input type="color" id="buttonTextColor" value="${currentSettings.product.buttonTextColor || '#FFFFFF'}" class="form-color">
            </div>

            <div class="form-group">
                <label>Цвет ценника:</label>
                <input type="color" id="priceColor" value="${currentSettings.product.priceColor || '#B73131'}" class="form-color">
            </div>
            
            <div class="preview-card-example">
                <div class="preview-card-image"></div>
                <div class="preview-price" id="previewPrice" style="color: ${currentSettings.product.priceColor || '#B73131'};">${formatPrice(currentSettings.product.price)} ₽</div>
                <div class="preview-name" id="previewName">${currentSettings.product.name}</div>
                <button class="preview-add-btn" id="previewButton" style="background-color: ${currentSettings.product.buttonColor}; color: ${currentSettings.product.buttonTextColor || '#FFFFFF'};">Добавить в корзину</button>
            </div>
            
            <div class="settings-buttons">
                <button class="cancel-btn" id="cancelProductBtn">Отмена</button>
                <button class="apply-btn" id="applyProductBtn">Применить ко всем карточкам</button>
            </div>
        `;
        
        const productNameInput = document.getElementById('productNameInput');
        const productPriceInput = document.getElementById('productPriceInput');
        const productFontSelect = document.getElementById('productFontSelect');
        const productFontSizeSlider = document.getElementById('productFontSizeSlider');
        const productFontSizeValue = document.getElementById('productFontSizeValue');
        const cardBgColor = document.getElementById('cardBgColor');
        const buttonColor = document.getElementById('buttonColor');
        const cancelBtn = document.getElementById('cancelProductBtn');
        const applyBtn = document.getElementById('applyProductBtn');
        
        function updateProductPreview() {
            currentSettings.product.name = productNameInput.value;
            currentSettings.product.price = parseInt(productPriceInput.value);
            currentSettings.product.font = productFontSelect.value;
            currentSettings.product.fontSize = parseInt(productFontSizeSlider.value);
            currentSettings.product.cardBgColor = cardBgColor.value;
            currentSettings.product.buttonColor = buttonColor.value;
            currentSettings.product.buttonTextColor = buttonTextColor.value; 
            currentSettings.product.priceColor = priceColor.value; 
            
            // Теперь обновляем preview
            document.getElementById('previewPrice').textContent = formatPrice(currentSettings.product.price) + ' ₽';
            document.getElementById('previewPrice').style.color = currentSettings.product.priceColor;
            document.getElementById('previewName').textContent = currentSettings.product.name;
            document.getElementById('previewName').style.fontFamily = currentSettings.product.font;
            document.getElementById('previewName').style.fontSize = currentSettings.product.fontSize + 'px';
            document.getElementById('previewButton').style.backgroundColor = currentSettings.product.buttonColor;
            document.getElementById('previewButton').style.color = currentSettings.product.buttonTextColor;
    
            
            updateAllProductCards();
            saveState();
        }
        
        productNameInput.addEventListener('input', updateProductPreview);
        productPriceInput.addEventListener('input', updateProductPreview);
        productFontSelect.addEventListener('change', updateProductPreview);
        productFontSizeSlider.addEventListener('input', function() {
            productFontSizeValue.textContent = this.value + 'px';
            updateProductPreview();
        });
        cardBgColor.addEventListener('input', updateProductPreview);
        buttonColor.addEventListener('input', updateProductPreview);
        
        cancelBtn.addEventListener('click', () => closeSettings());
        applyBtn.addEventListener('click', () => {
            saveState();
            closeSettings();
        });
        buttonTextColor.addEventListener('input', updateProductPreview);
        priceColor.addEventListener('input', updateProductPreview);
    }
    
    // Закрытие панели настроек
    function closeSettings() {
        settingsPanel.style.display = 'none';
        settingsPanel.classList.remove('active');
        currentEditingElement = null;
    }
    
    // Открытие настроек товара
    function openProductSettings() {
        openSettings('product', 'Настройки карточки товара');
    }
    
    // Настройка обработчиков событий
    function setupEventListeners() {
        // Клик на фон страницы
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#shopLogo') && 
                !e.target.closest('#shopName') && 
                !e.target.closest('#adsContainer') && 
                !e.target.closest('.product-card') &&
                !e.target.closest('#settingsPanel') &&
                !e.target.closest('.editor-btn') &&
                settingsPanel.style.display === 'none') {
                openSettings('page', 'Настройка фона страницы');
            }
        });
        
        // Клик на шапку
        document.querySelector('.preview-header').addEventListener('click', function(e) {
            if (!e.target.closest('#shopLogo') && !e.target.closest('#shopName')) {
                openSettings('header', 'Настройка шапки');
            }
        });
        
        shopLogo.addEventListener('click', () => openSettings('logo', 'Настройка логотипа'));
        shopName.addEventListener('click', () => openSettings('name', 'Настройка названия магазина'));
        adsContainer.addEventListener('click', () => openSettings('ads', 'Настройка рекламы'));
        
        closeSettingsBtn.addEventListener('click', closeSettings);
        
        // Управление историей
        undoBtn.addEventListener('click', function() {
            if (historyIndex > 0) {
                historyIndex--;
                currentSettings = JSON.parse(JSON.stringify(history[historyIndex]));
                renderPreview();
                updateUndoRedoButtons();
                
                if (currentEditingElement) {
                    loadSettingsForElement(currentEditingElement);
                }
            }
        });
        
        redoBtn.addEventListener('click', function() {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                currentSettings = JSON.parse(JSON.stringify(history[historyIndex]));
                renderPreview();
                updateUndoRedoButtons();
                
                if (currentEditingElement) {
                    loadSettingsForElement(currentEditingElement);
                }
            }
        });
        
        // Кнопки управления
        previewBtn.addEventListener('click', function() {
            alert('Предпросмотр находится в разработке');
        });
        
        adminBtn.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });
        
        saveBtn.addEventListener('click', function() {
            saveSiteDesign(); 
});

    // Функция для сохранения дизайна сайта
    function saveSiteDesign() {
        console.log('Сохранение дизайна сайта...');

        const shopName = currentSettings.name.text.trim();
        // Проверка названия магазина
        if (!shopName || shopName === 'Название магазина' || shopName === '') {
            showErrorNotification('Название магазина обязательно!');
            return; // Прерываем сохранение
        }
        console.log('Текущие баннеры в currentSettings:', {
        array: currentSettings.ads.images,
        length: currentSettings.ads.images.length,
        first: currentSettings.ads.images[0],
        second: currentSettings.ads.images[1],
        third: currentSettings.ads.images[2]
        });
        try {
            // Создаем полный объект дизайна сайта
            const siteDesign = {
                // Основные настройки
                headerColor: currentSettings.header.bgColor,
                siteName: currentSettings.name.text,
                backgroundColor: currentSettings.page.bgColor,
                
                // Логотип
                logo: currentSettings.logo.url || null,
                logoBgColor: currentSettings.logo.bgColor,
                
                // Настройки текста
                name: {
                    text: currentSettings.name.text,
                    font: currentSettings.name.font,
                    size: currentSettings.name.size,
                    color: currentSettings.name.color
                },
                
                // Рекламные баннеры
                ads: currentSettings.ads.images.filter(img => img && img.trim() !== ''),
                
                // Продукты (будут добавляться из админки)
                products: [],
                
                // Стили карточек товаров
                productStyles: {
                    name: currentSettings.product.name,
                    price: currentSettings.product.price,
                    cardBgColor: currentSettings.product.cardBgColor,
                    buttonColor: currentSettings.product.buttonColor,
                    buttonTextColor: currentSettings.product.buttonTextColor || '#FFFFFF',
                    priceColor: currentSettings.product.priceColor || '#B73131',
                    font: currentSettings.product.font,
                    fontSize: currentSettings.product.fontSize
                },
                
                // Метаданные
                savedAt: new Date().toISOString(),
                lastEdited: new Date().toISOString(),
                version: '1.0'
            };
            
            // СОХРАНЯЕМ ГЛАВНЫЙ ОБЪЕКТ - siteDesign
            localStorage.setItem('siteDesign', JSON.stringify(siteDesign));
            
            // Также сохраняем для редактора (на будущее)
            localStorage.setItem('shopSettings', JSON.stringify({
                page: currentSettings.page,
                header: currentSettings.header,
                logo: currentSettings.logo,
                name: currentSettings.name,
                ads: currentSettings.ads,
                product: currentSettings.product
            }));
            
            // Устанавливаем флаг, что сайт готов к просмотру
            localStorage.setItem('siteReady', 'true');
            
            console.log('Дизайн сайта сохранен!', siteDesign);
            showSaveNotification('Дизайн сайта сохранен! Теперь можно посмотреть результат в разделе "Ваш магазин".');
            
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка сохранения: ' + error.message);
        }
    }
 }
    // Функция показа уведомления
    function showSaveNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    // Функция показа ошибки
    function showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }


    // Сжатие существующего изображения
    function compressExistingImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = dataUrl;
            
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                let width = img.width;
                let height = img.height;
                const maxWidth = 600;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedDataUrl);
            };
            
            img.onerror = reject;
        });
    }
    
    // Функция показа уведомления
    function showSaveNotification(message = 'Настройки успешно сохранены!') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 20px;"></i>
            <span>${message}</span>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
// Загрузка сохраненных настроек
function loadSavedSettings() {
    console.log('Попытка загрузить сохраненные настройки...');
    
    // Сначала пробуем загрузить из siteDesign
    const siteDesign = localStorage.getItem('siteDesign');
    
    if (siteDesign) {
        try {
            const loaded = JSON.parse(siteDesign);
            console.log('Найден siteDesign:', loaded);
            
            // Загружаем настройки из сохраненного дизайна
            currentSettings = {
                page: { bgColor: loaded.backgroundColor || '#FFF2F2' },
                header: { bgColor: loaded.headerColor || '#892828' },
                logo: { 
                    url: loaded.logo || null, 
                    bgColor: loaded.logoBgColor || 'rgba(255, 255, 255, 0.1)' 
                },
                name: loaded.name || { 
                    text: 'Название магазина', 
                    font: 'Arial, sans-serif', 
                    size: 24, 
                    color: '#FFFFFF' 
                },
                ads: { images: loaded.ads || [] },
                product: loaded.productStyles || {
                    name: 'Товар',
                    price: 1500,
                    font: 'Arial, sans-serif',
                    fontSize: 18,
                    cardBgColor: '#FFFFFF',
                    buttonColor: '#B73131',
                    buttonTextColor: '#FFFFFF',
                    priceColor: '#B73131'
                }
            };
            
            console.log('Дизайн загружен из siteDesign');
            return;
        } catch (e) {
            console.error('Ошибка загрузки siteDesign:', e);
        }
    }
    
    // Если нет siteDesign, загружаем старые настройки
    const shopSettings = localStorage.getItem('shopSettings');
    if (shopSettings) {
        try {
            const loadedSettings = JSON.parse(shopSettings);
            console.log('Загружены shopSettings:', loadedSettings);
            
            // Обновляем текущие настройки
            if (loadedSettings.page) currentSettings.page = loadedSettings.page;
            if (loadedSettings.header) currentSettings.header = loadedSettings.header;
            if (loadedSettings.logo) currentSettings.logo = loadedSettings.logo;
            if (loadedSettings.name) currentSettings.name = loadedSettings.name;
            if (loadedSettings.ads) currentSettings.ads = loadedSettings.ads;
            if (loadedSettings.product) currentSettings.product = loadedSettings.product;
            
        } catch (e) {
            console.error('Ошибка загрузки shopSettings:', e);
        }
    }
    
    console.log('Используются настройки по умолчанию');
}   
    init();
});

// Вспомогательные функции для работы с цветами
function extractAlphaFromColor(color) {
    if (color.startsWith('rgba')) {
        const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        return match ? parseFloat(match[4]) : 1;
    }
    return 1; 
}

function rgbToHex(rgbaColor) {
    if (rgbaColor.startsWith('#')) return rgbaColor;
    
    const match = rgbaColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
    }
    return '#FFFFFF';
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 255, g: 255, b: 255};
}
