document.addEventListener('DOMContentLoaded', () => {
    const handleStatusChange = async (orderId, field, value, row) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ field, value }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update order');
        }
  
        showPopupNotification('Order updated successfully', 'success');
      } catch (error) {
        showPopupNotification(`Error: ${error.message}`, 'error');
      }
  
      // Обновление стилей после изменения статуса
      updateRowClasses(row);
    };
  
    const updateRowClasses = (row) => {
        const paymentCell = row.querySelector('td:nth-child(6)');
        const orderCell = row.querySelector('td:nth-child(7)');
        const paymentSelect = paymentCell.querySelector('select');
        const orderSelect = orderCell.querySelector('select');
      
        // Очистка старых классов
        paymentCell.classList.remove('cell-oplacheno', 'cell-ne-oplacheno');
        orderCell.classList.remove('cell-vypolnyaetsya', 'cell-zavershen', 'cell-otmenyon');
      
        // Добавление новых классов на основе значений
        if (paymentSelect.value === 'оплачено') {
          paymentCell.classList.add('cell-oplacheno');
        } else if (paymentSelect.value === 'не оплачено') {
          paymentCell.classList.add('cell-ne-oplacheno');
        }
      
        if (orderSelect.value === 'выполняется') {
          orderCell.classList.add('cell-vypolnyaetsya');
        } else if (orderSelect.value === 'завершен') {
          orderCell.classList.add('cell-zavershen');
        } else if (orderSelect.value === 'отменён') {
          orderCell.classList.add('cell-otmenyon');
        }
      };
      
  
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const selects = row.querySelectorAll('select');
      selects.forEach((select) => {
        select.addEventListener('change', () => {
          const orderId = row.querySelector('td').textContent.trim();
          const field = select.getAttribute('onchange').includes('paymentStatus') ? 'paymentStatus' : 'orderStatus';
          const value = select.value;
          handleStatusChange(orderId, field, value, row);
        });
      });
  
      // Обновление классов и стилей при загрузке
      updateRowClasses(row);
    });
  });
  