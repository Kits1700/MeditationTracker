document.addEventListener('DOMContentLoaded', () => {
    const meditationForm = document.getElementById('meditationForm');
    const meditationChart = document.getElementById('meditationChart').getContext('2d');
    
    // Retrieve meditation data from localStorage if available
    let meditationData = JSON.parse(localStorage.getItem('meditationData')) || [];
  
    meditationForm.addEventListener('submit', e => {
        e.preventDefault();
        const date = document.getElementById('meditationDate').value;
        const minutes = parseInt(document.getElementById('meditationMinutes').value);
    
        if (date && minutes) {
          meditationData.push({ date, minutes });
          updateLocalStorage();
          updateChart();
          meditationForm.reset();
        } else {
          alert('Please enter both date and minutes.');
        }
      });
    
      function updateLocalStorage() {
        localStorage.setItem('meditationData', JSON.stringify(meditationData));
      }
    
  
    function updateChart() {
      const weeklyData = aggregateDataByInterval('week');
      const monthlyData = aggregateDataByInterval('month');
  
      renderChart(weeklyData, 'Weekly Meditation Minutes', 'weekChart');
      renderChart(monthlyData, 'Monthly Meditation Minutes', 'monthChart');
    }
  
    function aggregateDataByInterval(interval) {
        const startDate = new Date('2024-01-08'); // Start date: 8th January 2024
        const now = new Date(startDate); // Create a copy of the start date
        const intervalMap = {
          'week': 30,
          'month': new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
        };
        const intervalDays = intervalMap[interval];
      
        const dataByInterval = [];
        for (let i = 0; i < intervalDays; i++) {
          const dateStr = now.toISOString().split('T')[0];
          const filteredData = meditationData.filter(data => data.date === dateStr);
          const totalMinutes = filteredData.reduce((acc, curr) => acc + curr.minutes, 0);
          dataByInterval.push({ date: dateStr, minutes: totalMinutes });
          now.setDate(now.getDate() + 1); // Move to the next day
        }
        return dataByInterval;
      }
      
  
    function renderChart(data, label, canvasId) {
      new Chart(meditationChart, {
        type: 'bar',
        data: {
          labels: data.map(entry => entry.date),
          datasets: [{
            label: label,
            data: data.map(entry => entry.minutes),
            backgroundColor: '#ead3dd',
            borderColor: '#ead3dd',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Initial visualization on page load
    updateChart();
  });
  