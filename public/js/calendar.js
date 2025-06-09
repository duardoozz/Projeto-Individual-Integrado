document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const timeSlots = document.getElementById('time-slots');
  const availableRooms = document.getElementById('available-rooms');
  const makeReservationBtn = document.getElementById('make-reservation');
  const bookingDescription = document.getElementById('booking-description');
  
  let selectedDate = null;
  let selectedTime = null;
  let selectedRoom = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    height: 'auto',
    selectable: true,
    select: function(info) {
      console.log('Data selecionada:', info.startStr);
      selectedDate = info.startStr;
      
      clearSelections();
    
      loadAvailableTimes(selectedDate);
    },
    dateClick: function(info) {
      console.log('Data clicada:', info.dateStr);
      selectedDate = info.dateStr;
      
      const allDates = document.querySelectorAll('.fc-daygrid-day');
      allDates.forEach(date => date.classList.remove('selected-date'));
      info.dayEl.classList.add('selected-date');
      
      clearSelections();
      
      loadAvailableTimes(selectedDate);
    }
  });

  calendar.render();

  function clearSelections() {
    timeSlots.innerHTML = '';
    availableRooms.innerHTML = '';
    selectedTime = null;
    selectedRoom = null;
    makeReservationBtn.disabled = true;
  }

  function loadAvailableTimes(date) {
    fetch(`/api/bookings-by-date?date=${date}`)
      .then(response => response.json())
      .then(bookings => {
        const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        const bookedTimes = {};
        
        times.forEach(time => {
          bookedTimes[time] = 0;
        });
        
        bookings.forEach(booking => {
          let bookingTime;
          
          if (typeof booking.start_time === 'string') {
            bookingTime = booking.start_time.substring(0, 5);
          } else {
            bookingTime = String(booking.start_time);
          }
          
          if (bookedTimes[bookingTime] !== undefined) {
            bookedTimes[bookingTime]++;
          }
        });
        
        fetch('/api/rooms')
          .then(response => response.json())
          .then(rooms => {
            const totalRooms = rooms.length;
            
            timeSlots.innerHTML = '';
            times.forEach(time => {
              const button = document.createElement('button');
              button.textContent = time;
              button.dataset.time = time;
              
              const isUnavailable = bookedTimes[time] >= totalRooms;
              
              if (isUnavailable) {
                button.classList.add('unavailable');
                button.disabled = true;
              } else {
                button.addEventListener('click', function() {
                  console.log('Horário selecionado:', this.dataset.time);
                  
                  document.querySelectorAll('#time-slots button.selected').forEach(btn => {
                    btn.classList.remove('selected');
                  });
                  
                  this.classList.add('selected');
                  selectedTime = this.dataset.time;
                  
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

  function loadAvailableRooms(date, time) {
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
        
        fetch('/api/rooms')
          .then(response => response.json())
          .then(allRooms => {
            const availableRoomIds = new Set(availableRooms.map(room => room.id));
            
            allRooms.forEach(room => {
              const button = document.createElement('button');
              button.textContent = `Sala ${room.id}`;
              button.dataset.roomId = room.id;
              
              const isAvailable = availableRoomIds.has(room.id);
              
              if (!isAvailable) {
                button.classList.add('unavailable');
                button.disabled = true;
              } else {
                button.addEventListener('click', function() {
                  console.log('Sala selecionada:', this.dataset.roomId);
                  
                  document.querySelectorAll('#available-rooms button.selected').forEach(btn => {
                    btn.classList.remove('selected');
                  });
                  
                  this.classList.add('selected');
                  selectedRoom = this.dataset.roomId;
                  
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

    const formattedDate = formatDate(selectedDate);
    
    console.log('Dados antes do redirecionamento:', {
      sala: selectedRoom,
      data: formattedDate,
      hora: selectedTime,
      descricao: description
    });
    
    window.location.href = `/confirm?sala=${encodeURIComponent(selectedRoom)}&data=${encodeURIComponent(formattedDate)}&hora=${encodeURIComponent(selectedTime)}&descricao=${encodeURIComponent(description)}`;
  });

  function formatDate(dateStr) {
    console.log('Data antes da formatação:', dateStr);
    
    const [year, month, day] = dateStr.split('-').map(Number);
    
    const date = new Date(year, month - 1, day);
    
    console.log('Objeto Date criado:', date);
    
    const formattedDay = ('0' + date.getDate()).slice(-2);
    
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const formattedMonth = monthNames[date.getMonth()];
    
    const formattedDate = `${formattedDay}/${formattedMonth}`;
    console.log('Data após formatação:', formattedDate);
    return formattedDate;
  }
});
