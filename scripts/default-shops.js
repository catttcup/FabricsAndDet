window.defaultShops = {
    shop1: {
        id: "shop1",
        name: "Мёд Урала",
        description: "Натуральный уральский мед с пасек. Только качественные продукты пчеловодства.",
        products: [1], // ID товаров из productsData
        category: "Продукты питания",
        
        // Стили из нашего редактора
        design: {
            // Фон страницы
            page: { bgColor: '#FFF8E1' },
            
            // Шапка
            header: { bgColor: '#FF9800' },
            
            // Логотип
            logo: { 
                url: null,
                bgColor: 'rgba(255, 255, 255, 0.2)'
            },
            
            // Название
            name: {
                text: 'Мёд Урала',
                font: 'Arial, sans-serif',
                size: 28,
                color: '#FFFFFF'
            },
            
            // Рекламные баннеры (пока пусто)
            ads: { images: [] },
            
            // Настройки карточки товара
            product: {
                name: 'Уральский мед',
                price: 749,
                font: 'Arial, sans-serif',
                fontSize: 18,
                cardBgColor: '#FFFFFF',
                buttonColor: '#FF9800',
                buttonTextColor: '#FFFFFF',
                priceColor: '#FF9800'
            }
        }
    },
    
    shop2: {
        id: "shop2",
        name: "Ювелирный дом",
        description: "Уникальные украшения ручной работы из натуральных камней и драгоценных металлов.",
        products: [2, 3, 4, 5, 6, 7, 8, 9], // Все украшения
        category: "Ювелирные изделия",
        
        design: {
            page: { bgColor: '#F5F5F5' },
            header: { bgColor: '#9C27B0' },
            logo: { 
                url: null,
                bgColor: 'rgba(255, 255, 255, 0.2)'
            },
            name: {
                text: 'Ювелирный дом',
                font: "'Montserrat', sans-serif",
                size: 30,
                color: '#FFFFFF'
            },
            ads: { images: [] },
            product: {
                name: 'Ювелирное украшение',
                price: 3500,
                font: "'Roboto', sans-serif",
                fontSize: 18,
                cardBgColor: '#FFFFFF',
                buttonColor: '#9C27B0',
                buttonTextColor: '#FFFFFF',
                priceColor: '#9C27B0'
            }
        }
    },
    
    shop3: {
        id: "shop3",
        name: "Посуда и утварь",
        description: "Качественная посуда для вашей кухни. От классики до современных дизайнов.",
        products: [10, 11], // Посуда
        category: "Посуда и кухонные принадлежности",
        
        design: {
            page: { bgColor: '#E8F5E9' },
            header: { bgColor: '#4CAF50' },
            logo: { 
                url: null,
                bgColor: 'rgba(255, 255, 255, 0.2)'
            },
            name: {
                text: 'Посуда и утварь',
                font: "'Open Sans', sans-serif",
                size: 26,
                color: '#FFFFFF'
            },
            ads: { images: [] },
            product: {
                name: 'Кухонная утварь',
                price: 2250,
                font: 'Arial, sans-serif',
                fontSize: 18,
                cardBgColor: '#FFFFFF',
                buttonColor: '#4CAF50',
                buttonTextColor: '#FFFFFF',
                priceColor: '#4CAF50'
            }
        }
    },
    
    shop4: {
        id: "shop4",
        name: "Кожаные аксессуары",
        description: "Кожаные кошельки и аксессуары ручной работы. Надежность и стиль.",
        products: [12], // Кошельки
        category: "Кожаные изделия",
        
        design: {
            page: { bgColor: '#FFF2F2' },
            header: { bgColor: '#795548' },
            logo: { 
                url: null,
                bgColor: 'rgba(255, 255, 255, 0.2)'
            },
            name: {
                text: 'Кожаные аксессуары',
                font: 'Arial, sans-serif',
                size: 24,
                color: '#FFFFFF'
            },
            ads: { images: [] },
            product: {
                name: 'Кожаное изделие',
                price: 3000,
                font: 'Arial, sans-serif',
                fontSize: 18,
                cardBgColor: '#FFFFFF',
                buttonColor: '#795548',
                buttonTextColor: '#FFFFFF',
                priceColor: '#795548'
            }
        }
    }
};