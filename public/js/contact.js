// Инициализация кнопки и всплывающего окна
const contactBtn = document.getElementById('contact-btn');
const contactInfo = document.getElementById('contact-info');
const notification = document.getElementById('notification');

// Показать или скрыть контактное окно
contactBtn.addEventListener('click', () => {
  const isHidden = contactInfo.style.display === 'none';
  contactInfo.style.display = isHidden ? 'block' : 'none';
});

// Функция для копирования в буфер обмена и показа уведомления
// Функция для копирования в буфер обмена и показа уведомления
// Функция для копирования в буфер обмена и показа уведомления
function copyToClipboard(text, event) {
    if (!navigator.clipboard) {
        console.error("Clipboard API не поддерживается.");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            console.log("Текст скопирован в буфер обмена:", text);

            // Создаем отдельный элемент уведомления
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = "Скопировано!";
            document.body.appendChild(notification);

            // Устанавливаем позицию уведомления относительно курсора
            const cursorX = event.clientX;
            const cursorY = event.clientY;

            notification.style.left = `${cursorX}px`;
            notification.style.top = `${cursorY}px`;
            notification.style.transform = 'translate(-50%, -50%)';
            notification.style.opacity = '1';

            // Плавное исчезновение уведомления через 0.5 секунды
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translate(-50%, -60%)'; // Легкое смещение вверх
                setTimeout(() => {
                    notification.remove(); // Удаляем уведомление из DOM
                }, 300); // Ждем завершения анимации
            }, 500);
        })
        .catch(err => {
            console.error("Ошибка копирования в буфер обмена:", err);
        });
}






// Добавление событий для элементов с классом clickable
document.querySelectorAll('.clickable').forEach(span => {
    span.addEventListener('click', (event) => {
        copyToClipboard(span.textContent.trim(), event);
    });
});



  

// Добавление событий для всех элементов с классом clickable
// Добавление событий для всех элементов с классом clickable
document.querySelectorAll('#contact-info .clickable').forEach(span => {
    let activeTimeout; // Для отслеживания времени
  
    span.addEventListener('mousedown', () => {
      span.classList.add('active');
    });
  
    span.addEventListener('mouseup', () => {
      copyToClipboard(span.textContent.trim());
  
      // Устанавливаем задержку для удаления класса через 1 секунду
      activeTimeout = setTimeout(() => {
        span.classList.remove('active');
      }, 1000);
    });
  
    span.addEventListener('mouseleave', () => {
      // Если мы в активном состоянии, оставляем underline
      if (!span.classList.contains('active')) {
        span.classList.remove('active');
      }
    });
  
    // Ожидание, пока не пройдет 1 секунда после клика, чтобы удалить underline
    span.addEventListener('mouseenter', () => {
      if (span.classList.contains('active')) {
        clearTimeout(activeTimeout); // Очищаем предыдущий таймер, если пользователь снова наведет мышь на элемент
      }
    });
  });
  
  
