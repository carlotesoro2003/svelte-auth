<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';
  
    Chart.register(...registerables);
  
    let barChart: Chart | null = null;
    let lineChart: Chart | null = null;
  
    // Sample data for charts
    const barChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Monthly Sales',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    };
  
    const lineChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Monthly Users',
          data: [12, 19, 3, 5, 2, 3],
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1,
        },
      ],
    };
  
    // Options for charts
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  
    // Create charts when the component mounts
    onMount(() => {
      const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
      const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
  
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: barChartData,
        options: options,
      });
  
      lineChart = new Chart(lineCtx, {
        type: 'line',
        data: lineChartData,
        options: options,
      });
    });
  </script>
  
  <div class="min-h-screen bg-base-300 overflow-y-auto p-8">
    <div class="flex flex-col items-center justify-center">
      <div class="max-w-5xl w-full text-center">
        <h1 class="text-white font-bold text-4xl mb-6">Admin Dashboard</h1>
  
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="rounded-lg shadow-md p-4">
            <h2 class="text-white-800 text-2xl">Sales Overview</h2>
            <div class="h-64">
              <canvas id="barChart"></canvas>
            </div>
          </div>
  
          <div class="rounded-lg shadow-md p-4">
            <h2 class="text-white-800 text-2xl">User Growth</h2>
            <div class="h-64">
              <canvas id="lineChart"></canvas>
            </div>
          </div>
        </div>
  
        <!-- Add more charts as needed -->
      </div>
    </div>
  </div>
  
  <style>
    canvas {
      max-width: 100%;
      margin: 0 auto;
    }
  </style>
  