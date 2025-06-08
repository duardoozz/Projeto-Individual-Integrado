document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const timeSlots = document.getElementById('time-slots');
  const availableRooms = document.getElementById('available-rooms');
  const makeReservationBtn = document.getElementById('make-reservation');
  const bookingDescription = document.getElementById('booking-description');
  
  let selectedDate = null;
  let selectedTime = null;
  let selectedRoom = null;

  // Inicializar o calendário
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    selectable: true,
    select: function(info) {
      selectedDate = info.startStr;
      
      // Limpar seleções anteriores
      clearSelections();
      
      // Carregar horários disponíveis automaticamente
      loadAvailableTimes(selectedDate);
    },
    dateClick: function(info) {
      // Manter a data selecionada visualmente
      const allDates = document.querySelectorAll('.fc-daygrid-day');
      allDates.forEach(date => date.classList.remove('selected-date'));
      info.dayEl.classList.add('selected-date');
    }
  });

  calendar.render();

  // Função para limpar seleções
  function clearSelections() {
    timeSlots.innerHTML = '';
    availableRooms.innerHTML = '';
    selectedTime = null;
    selectedRoom = null;
    makeReservationBtn.disabled = true;
  }

  // Carregar horários disponíveis para a data selecionada
  function loadAvailableTimes(date) {
    // Primeiro, buscar as reservas existentes para esta data
    fetch(`/api/bookings-by-date?date=${date}`)
      .then(response => response.json())
      .then(bookings => {
        const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        const bookedTimes = {};
        
        // Inicializar contagem de reservas para cada horário
        times.forEach(time => {
          bookedTimes[time] = 0;
        });
        
        // Contar quantas salas estão reservadas para cada horário
        bookings.forEach(booking => {
          let bookingTime;
          
          // Garantir que temos uma string de hora válida
          if (typeof booking.start_time === 'string') {
            // Pegar apenas HH:MM se for uma string mais longa
            bookingTime = booking.start_time.substring(0, 5);
          } else {
            // Se não for string, converter para string
            bookingTime = String(booking.start_time);
          }
          
          if (bookedTimes[bookingTime] !== undefined) {
            bookedTimes[bookingTime]++;
          }
        });
        
        // Obter o número total de salas
        fetch('/api/rooms')
          .then(response => response.json())
          .then(rooms => {
            const totalRooms = rooms.length;
            
            timeSlots.innerHTML = '';
            times.forEach(time => {
              const button = document.createElement('button');
              button.textContent = time;
              button.dataset.time = time;
              
              // Verificar se todas as salas estão reservadas neste horário
              const isUnavailable = bookedTimes[time] >= totalRooms;
              
              if (isUnavailable) {
                button.classList.add('unavailable');
                button.disabled = true;
              } else {
                button.addEventListener('click', function() {
                  // Remover seleção anterior
                  document.querySelectorAll('#time-slots button.selected').forEach(btn => {
                    btn.classList.remove('selected');
                  });
                  
                  // Adicionar seleção atual
                  this.classList.add('selected');
                  selectedTime = this.dataset.time;
                  
                  // Carregar salas disponíveis automaticamente
                  loadAvailableRooms(selectedDate, selectedTime);
                });
              }
              
              timeSlots.appendChild(button);
            });
          });
      })
      .catch(error => {
        console.error('Erro ao carregar horários disponíveis:', error);
      });
  }

  // Carregar salas disponíveis para a data e horário selecionados
  function loadAvailableRooms(date, time) {
    // Fazer uma requisição AJAX para verificar salas disponíveis
    fetch(`/api/available-rooms?date=${date}&time=${time}`)
      .then(response => response.json())
      .then(availableRooms => {
        const roomsContainer = document.getElementById('available-rooms');
        roomsContainer.innerHTML = '';
        
        if (availableRooms.length === 0) {
          const message = document.createElement('p');
          message.textContent = 'Nenhuma sala disponível neste horário.';
          roomsContainer.appendChild(message);
          return;
        }
        
        // Obter todas as salas
        fetch('/api/rooms')
          .then(response => response.json())
          .then(allRooms => {
            // Criar um conjunto de IDs de salas disponíveis para verificação rápida
            const availableRoomIds = new Set(availableRooms.map(room => room.id));
            
            allRooms.forEach(room => {
              const button = document.createElement('button');
              button.textContent = `Sala ${room.id}`;
              button.dataset.roomId = room.id;
              
              // Verificar se a sala está disponível
              const isAvailable = availableRoomIds.has(room.id);
              
              if (!isAvailable) {
                button.classList.add('unavailable');
                button.disabled = true;
              } else {
                button.addEventListener('click', function() {
                  // Remover seleção anterior
                  document.querySelectorAll('#available-rooms button.selected').forEach(btn => {
                    btn.classList.remove('selected');
                  });
                  
                  // Adicionar seleção atual
                  this.classList.add('selected');
                  selectedRoom = this.dataset.roomId;
                  
                  // Habilitar botão de reserva
                  makeReservationBtn.disabled = false;
                });
              }
              
              roomsContainer.appendChild(button);
            });
          });
      })
      .catch(error => {
        console.error('Erro ao carregar salas disponíveis:', error);
      });
  }

  // Evento para o botão de reserva
  makeReservationBtn.addEventListener('click', function() {
    if (!selectedDate || !selectedTime || !selectedRoom) {
      alert('Por favor, selecione data, horário e sala.');
      return;
    }

    const description = bookingDescription.value.trim();
    if (!description) {
      alert('Por favor, adicione uma descrição para a reunião.');
      return;
    }

    // Redirecionar para a página de confirmação com os parâmetros selecionados
    window.location.href = `/confirm?sala=${selectedRoom}&data=${formatDate(selectedDate)}&hora=${selectedTime}&descricao=${encodeURIComponent(description)}`;
  });

  // Função para formatar a data para exibição
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = ('0' + date.getDate()).slice(-2);
    // Array com os nomes dos meses abreviados em português
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = monthNames[date.getMonth()];
    return `${day}/${month}`;
  }
});
