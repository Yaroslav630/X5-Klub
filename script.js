document.addEventListener('DOMContentLoaded', function() {
    const gallery = {
        track: document.querySelector('.gallery-track'),
        slides: document.querySelectorAll('.gallery-slide'),
        dots: document.querySelectorAll('.dot'),
        prevBtn: document.querySelector('.gallery-prev'),
        nextBtn: document.querySelector('.gallery-next'),
        
        current: 0,
        total: 6,
        autoDelay: 8000,
        timer: null,
        
        init() {
            if (!this.track || this.slides.length === 0) return;
            this.update();
            this.bindEvents();
            this.startAuto();
            console.log('🟢 Галерея загружена:', this.total, 'слайд(ов)');
        },
        
        update() {
            this.track.style.transform = `translateX(-${this.current * 100}%)`;
            this.slides.forEach((s, i) => s.classList.toggle('active', i === this.current));
            this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
        },
        
        goTo(index) {
            this.current = (index + this.total) % this.total;
            this.update();
            this.resetAuto();
        },
        
        next() { this.goTo(this.current + 1); },
        prev() { this.goTo(this.current - 1); },
        
        bindEvents() {
            this.prevBtn?.addEventListener('click', () => this.prev());
            this.nextBtn?.addEventListener('click', () => this.next());
            this.dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    this.goTo(parseInt(e.currentTarget.dataset.slide));
                });
            });
            const wrapper = document.querySelector('.pyaterochka-gallery');
            wrapper?.addEventListener('mouseenter', () => this.stopAuto());
            wrapper?.addEventListener('mouseleave', () => this.startAuto());
        },
        
        startAuto() {
            this.stopAuto();
            this.timer = setInterval(() => this.next(), this.autoDelay);
        },
        stopAuto() { if (this.timer) clearInterval(this.timer); },
        resetAuto() { this.stopAuto(); this.startAuto(); }
    };
    
    gallery.init();
});

class ModalManager {
    constructor() {
        this.modal = document.getElementById('modalOverlay');
        this.closeButton = document.getElementById('modalClose');
        this.openButton = document.querySelector('.join-button');
        this.form = document.getElementById('clubForm');
        
        this.init();
    }
    
    init() {
        // Открытие модального окна
        this.openButton.addEventListener('click', () => this.openModal());
        
        // Закрытие по крестику
        this.closeButton.addEventListener('click', () => this.closeModal());
        
        // Закрытие по клику на оверлей
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen()) {
                this.closeModal();
            }
        });
        
        // Блокировка прокрутки body при открытом модальном окне
        this.modal.addEventListener('wheel', (e) => {
            const modalWindow = this.modal.querySelector('.modal-window');
            const isAtTop = modalWindow.scrollTop === 0;
            const isAtBottom = modalWindow.scrollTop + modalWindow.clientHeight >= modalWindow.scrollHeight;
            
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Обработка формы
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Маска для телефона
        this.initPhoneMask();
    }
    
    // Открытие модального окна
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        
        // Анимация появления
        setTimeout(() => {
            this.modal.querySelector('.modal-window').style.transform = 'translateY(0)';
        }, 10);
        
        // Фокус на первом поле ввода
        setTimeout(() => {
            document.getElementById('phoneInput').focus();
        }, 300);
    }
    
    // Закрытие модального окна
    closeModal() {
        this.modal.querySelector('.modal-window').style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.style.overflow = ''; // Возвращаем прокрутку
        }, 200);
        
        // Очистка формы
        this.form.reset();
    }
    
    // Проверка открыто ли модальное окно
    isModalOpen() {
        return this.modal.classList.contains('active');
    }
    
    // Маска для телефона
    initPhoneMask() {
        const phoneInput = document.getElementById('phoneInput');
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '+7 (';
            
            if (value.length > 1) {
                formattedValue += value.substring(1, 4);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Обработка отправки формы
    handleFormSubmit(e) {
        e.preventDefault();
        
        const phone = document.getElementById('phoneInput').value;
        const email = document.getElementById('emailInput').value;
        
        // Простая валидация
        if (!phone || phone.length < 10) {
            this.showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }
        
        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Пожалуйста, введите корректный email', 'error');
            return;
        }
        
        // Имитация отправки данных
        this.showNotification('🎉 Поздравляем! Вы успешно вступили в Х5 Клуб!', 'success');
        
        // Закрываем модальное окно через 2 секунды
        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }
    
    // Валидация email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Уведомления
    showNotification(message, type = 'info') {
        // Удаляем старое уведомление если есть
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        // Создаем новое уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стили для уведомления
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '2000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            backgroundColor: type === 'success' ? '#4CAF50' : 
                           type === 'error' ? '#f44336' : '#2196F3',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
        });
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new ModalManager();
});

// Дополнительная функция для быстрого создания модального окна
function showQuickModal(title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalWindow = modal.querySelector('.modal-window');
    
    // Сохраняем оригинальный контент
    const originalContent = modalWindow.innerHTML;
    
    // Обновляем контент
    modalWindow.innerHTML = `
        <button class="modal-close" onclick="document.querySelector('.modal-overlay').classList.remove('active')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <div class="modal-body">
            <h2>${title}</h2>
            <p>${content}</p>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Возвращаем оригинальный контент при закрытии
    const closeHandler = () => {
        modalWindow.innerHTML = originalContent;
        modal.removeEventListener('click', closeHandler);
    };
    
    modal.addEventListener('click', closeHandler);
}

      document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('feedbackForm');
            
            // DOM-элементы
            const fullNameInput = document.getElementById('fullName');
            const ratingInput = document.getElementById('rating');
            const phoneInput = document.getElementById('phone');
            const reviewInput = document.getElementById('review');
            const charCount = document.getElementById('charCount');
            const stars = document.querySelectorAll('.star');
            
            // Элементы ошибок
            const nameError = document.getElementById('nameError');
            const ratingError = document.getElementById('ratingError');
            const phoneError = document.getElementById('phoneError');
            const reviewError = document.getElementById('reviewError');

            // --- Валидация Имени и Фамилии (только буквы, нельзя цифры) ---
            fullNameInput.addEventListener('input', function(e) {
                // Удаляем цифры и недопустимые символы прямо при вводе
                this.value = this.value.replace(/[0-9!@#$%^&*()_+\=\[\]{};:"\\|,.<>\/?~]/g, '');
                
                validateName();
            });

            function validateName() {
                const value = fullNameInput.value.trim();
                const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-']+$/;
                
                if (!value) {
                    showError(nameError, 'Пожалуйста, укажите имя и фамилию');
                    return false;
                }
                if (value.length < 3) {
                    showError(nameError, 'Введите минимум 3 символа');
                    return false;
                }
                if (!nameRegex.test(value)) {
                    showError(nameError, 'Используйте только буквы');
                    return false;
                }
                if (!value.includes(' ')) {
                    showError(nameError, 'Введите имя и фамилию через пробел');
                    return false;
                }
                
                hideError(nameError);
                fullNameInput.classList.add('valid');
                return true;
            }

            // --- Валидация Оценки (только цифры 1-5) ---
            ratingInput.addEventListener('input', function(e) {
                // Удаляем все нецифровые символы и ограничиваем диапазон
                let value = this.value.replace(/[^0-9]/g, '');
                
                if (value.length > 0) {
                    const num = parseInt(value);
                    if (num > 5) value = '5';
                    if (num === 0 && value.length === 1) value = ''; // убираем 0
                }
                
                this.value = value;
                validateRating();
                highlightStars(value);
            });

            // Клик по звездам
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const value = parseInt(this.getAttribute('data-value'));
                    ratingInput.value = value;
                    validateRating();
                    highlightStars(value);
                });
            });

            function highlightStars(value) {
                stars.forEach(star => {
                    const starValue = parseInt(star.getAttribute('data-value'));
                    if (starValue <= value) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            }

            function validateRating() {
                const value = parseInt(ratingInput.value);
                
                if (!ratingInput.value) {
                    showError(ratingError, 'Поставьте оценку от 1 до 5');
                    return false;
                }
                if (isNaN(value) || value < 1 || value > 5) {
                    showError(ratingError, 'Оценка должна быть от 1 до 5');
                    return false;
                }
                
                hideError(ratingError);
                ratingInput.classList.add('valid');
                return true;
            }

            // --- Валидация Телефона ---
            phoneInput.addEventListener('input', function(e) {
                // Маска для телефона
                let value = this.value.replace(/[^0-9+]/g, '');
                
                if (!value.startsWith('+')) {
                    value = '+' + value;
                }
                
                // Ограничиваем длину
                if (value.length > 12) value = value.slice(0, 12);
                
                // Форматируем
                if (value.length > 2) {
                    value = value.slice(0, 2) + ' (' + value.slice(2);
                }
                if (value.length > 7) {
                    value = value.slice(0, 7) + ') ' + value.slice(7);
                }
                if (value.length > 12) {
                    value = value.slice(0, 12) + '-' + value.slice(12);
                }
                if (value.length > 15) {
                    value = value.slice(0, 15) + '-' + value.slice(15);
                }
                
                this.value = value;
                validatePhone();
            });

            function validatePhone() {
                const value = phoneInput.value.replace(/[^0-9+]/g, '');
                const phoneRegex = /^\+7\d{10}$/;
                
                if (!phoneInput.value.trim()) {
                    showError(phoneError, 'Укажите номер телефона');
                    return false;
                }
                if (!phoneRegex.test(value)) {
                    showError(phoneError, 'Введите номер в формате +7 (XXX) XXX-XX-XX');
                    return false;
                }
                
                hideError(phoneError);
                phoneInput.classList.add('valid');
                return true;
            }

            // --- Подсчет символов отзыва ---
            reviewInput.addEventListener('input', function() {
                const length = this.value.length;
                charCount.textContent = length;
                
                if (length > 500) {
                    charCount.style.color = '#e74c3c';
                } else if (length > 450) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#95a5a6';
                }
                
                validateReview();
            });

            function validateReview() {
                const value = reviewInput.value.trim();
                
                if (!value) {
                    showError(reviewError, 'Напишите ваш отзыв');
                    return false;
                }
                if (value.length < 10) {
                    showError(reviewError, 'Отзыв должен содержать минимум 10 символов');
                    return false;
                }
                if (value.length > 500) {
                    showError(reviewError, 'Максимальная длина отзыва — 500 символов');
                    return false;
                }
                
                hideError(reviewError);
                reviewInput.classList.add('valid');
                return true;
            }

            // --- Отправка формы ---
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const isNameValid = validateName();
                const isRatingValid = validateRating();
                const isPhoneValid = validatePhone();
                const isReviewValid = validateReview();
                
                if (isNameValid && isRatingValid && isPhoneValid && isReviewValid) {
                    // Сбор данных
                    const formData = {
                        fullName: fullNameInput.value.trim(),
                        rating: parseInt(ratingInput.value),
                        phone: phoneInput.value.trim(),
                        review: reviewInput.value.trim()
                    };
                    
                    // Имитация отправки
                    console.log('Данные формы:', formData);
                    
                    // Показываем сообщение об успехе
                    showSuccessMessage();
                    
                    // Сброс формы
                    form.reset();
                    stars.forEach(star => star.classList.remove('active'));
                    charCount.textContent = '0';
                    
                    // Убираем подсветку валидных полей
                    document.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
                } else {
                    // Прокрутка к первой ошибке
                    const firstError = document.querySelector('.error-message:not([style*="display: none"]):not([style*="display:none"])');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });

            function showSuccessMessage() {
                // Удаляем предыдущее сообщение, если есть
                const oldMessage = document.querySelector('.success-message');
                if (oldMessage) oldMessage.remove();
                
                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.innerHTML = `
                    <span class="success-icon">✓</span>
                    <div>
                        <strong>Спасибо за ваш отзыв!</strong>
                        <p>Мы очень ценим ваше мнение. Оно поможет нам стать лучше.</p>
                    </div>
                `;
                
                const formWrapper = document.querySelector('.form-wrapper');
                formWrapper.insertBefore(successDiv, form);
                
                // Удаляем сообщение через 5 секунд
                setTimeout(() => {
                    successDiv.style.opacity = '0';
                    successDiv.style.transform = 'translateY(-10px)';
                    setTimeout(() => successDiv.remove(), 300);
                }, 5000);
            }

            // Вспомогательные функции
            function showError(element, message) {
                element.textContent = message;
                element.style.display = 'block';
            }

            function hideError(element) {
                element.textContent = '';
                element.style.display = 'none';
            }
        });