// document.addEventListener("DOMContentLoaded", () => {
//     // Calculation logic
//     const kmInput = document.getElementById('km-input');
//     const floorsInput = document.getElementById('floors-input');
//     const totalArea = document.getElementById('total-area');

//     const floorsKlnInput = document.getElementById('floors-kln-input');
//     const totalKln = document.getElementById('total-kln');

//     kmInput.addEventListener('input', updateAreaTotal);
//     floorsInput.addEventListener('input', updateAreaTotal);
//     floorsKlnInput.addEventListener('input', updateKlnTotal);

//     function updateAreaTotal() {
//         const km = parseFloat(kmInput.value) || 0;
//         const floors = parseFloat(floorsInput.value) || 0;
//         const total = (km * 100 + floors * 300).toFixed(2);
//         totalArea.textContent = total;
//         document.getElementById('price-input').value = total;
//     }

//     function updateKlnTotal() {
//         const floors = parseFloat(floorsKlnInput.value) || 0;
//         const total = (3000 + floors * 300).toFixed(2);
//         totalKln.textContent = total;
//         document.getElementById('price-input').value = total;
//     }

//     // Popup logic
//     const popup = document.getElementById('popup-form');
//     const orderButtons = document.querySelectorAll('.order-btn');
//     const closeForm = document.getElementById('close-form');

//     orderButtons.forEach(button => button.addEventListener('click', () => {
//         popup.classList.remove('hidden');
//     }));

//     closeForm.addEventListener('click', () => {
//         popup.classList.add('hidden');
//     });

//     // Form submission logic
//     const form = document.getElementById('order-form');
//     form.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const customerInfo = {
//             name: document.getElementById('name-input').value,
//             phone: document.getElementById('phone-input').value,
//             email: document.getElementById('email-input').value,
//         };

//         const comment = document.getElementById('comment-input').value;
//         const price = document.getElementById('price-input').value;

//         const orderData = {
//             customerInfo,
//             comment,
//             price,
//         };

//         try {
//             const response = await fetch('/api/orders', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(orderData),
//             });

//             if (response.ok) {
//                 showPopupNotification('Заказ успешно отправлен!');
//                 popup.classList.add('hidden');
//                 form.reset();
//             } else {
//                 const errorData = await response.json();
//                 showPopupNotification(`Ошибка: ${errorData.message}`);
//             }
//         } catch (error) {
//             console.error('Ошибка отправки заказа:', error);
//             showPopupNotification('Не удалось отправить заказ. Попробуйте позже.');
//         }
//     });
// });
document.addEventListener("DOMContentLoaded", () => {
    // Calculation logic
    const kmInput = document.getElementById('km-input');
    const floorsInput = document.getElementById('floors-input');
    const totalArea = document.getElementById('total-area');

    const floorsKlnInput = document.getElementById('floors-kln-input');
    const totalKln = document.getElementById('total-kln');

    kmInput.addEventListener('input', updateAreaTotal);
    floorsInput.addEventListener('input', updateAreaTotal);
    floorsKlnInput.addEventListener('input', updateKlnTotal);

    function updateAreaTotal() {
        const km = parseFloat(kmInput.value) || 0;
        const floors = parseFloat(floorsInput.value) || 0;
        const total = (km * 100 + floors * 300).toFixed(2);
        totalArea.textContent = total;
        document.getElementById('price-input').value = total;
    }

    function updateKlnTotal() {
        const floors = parseFloat(floorsKlnInput.value) || 0;
        const total = (3000 + floors * 300).toFixed(2);
        totalKln.textContent = total;
        document.getElementById('price-input').value = total;
    }

    // Popup logic
    const popup = document.getElementById('popup-form');
    const orderButtons = document.querySelectorAll('.order-btn');
    const closeForm = document.getElementById('close-form');

    orderButtons.forEach(button => button.addEventListener('click', () => {
        popup.classList.remove('hidden');
    }));

    closeForm.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Form submission logic
    const form = document.getElementById('order-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const customerInfo = {
            name: document.getElementById('name-input').value,
            phone: document.getElementById('phone-input').value,
            email: document.getElementById('email-input').value,
        };

        const comment = document.getElementById('comment-input').value;
        const price = document.getElementById('price-input').value;

        const orderData = {
            customerInfo,
            comment,
            price,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                showPopupNotification('Заказ успешно отправлен!', 'success');
                popup.classList.add('hidden');
                form.reset();
            } else {
                const errorData = await response.json();
                showPopupNotification(`Ошибка: ${errorData.message}`, 'error');
            }
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
            showPopupNotification('Не удалось отправить заказ. Попробуйте позже.', 'error');
        }
    });
});

// Popup notification logic
function showPopupNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `popup-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show the notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Hide and remove the notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
