document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.card').forEach(function(card) {
    const dateSpan = card.querySelector('.date');
    const timeSpan = card.querySelector('.time');

    if (dateSpan) {
      try {
        const date = new Date(dateSpan.textContent);
        if (!isNaN(date.getTime())) {
          const day = ('0' + date.getDate()).slice(-2);
          const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const month = monthNames[date.getMonth()];
          dateSpan.textContent = `${day}/${month}`;
        }
      } catch (e) {
        console.error('Erro ao formatar data:', e);
      }
    }

    if (timeSpan) {
      try {
        const timeText = timeSpan.textContent.trim();
        if (timeText.includes('202')) { 
          const date = new Date(timeText);
          if (!isNaN(date.getTime())) {
            const hours = ('0' + date.getHours()).slice(-2);
            const minutes = ('0' + date.getMinutes()).slice(-2);
            timeSpan.textContent = `${hours}:${minutes}`;
          }
        } else if (timeText.includes(':')) {
          const [hours, minutes] = timeText.split(':');
          timeSpan.textContent = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        }
      } catch (e) {
        console.error('Erro ao formatar hora:', e);
      }
    }
  });
});
