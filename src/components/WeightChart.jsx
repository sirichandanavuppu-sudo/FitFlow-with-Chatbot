import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import dayjs from 'dayjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function movingAverage(data, window = 3) {
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1)
    return slice.reduce((s, v) => s + v, 0) / slice.length
  })
}

function filterByRange(entries, range) {
  if (range === 'all') return entries
  const days = parseInt(range, 10)
  const cutoff = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
  return entries.filter((e) => e.date >= cutoff)
}

const WeightChart = React.memo(function WeightChart({ entries, range }) {
  const filtered = useMemo(() => filterByRange(entries, range), [entries, range])
  const labels = filtered.map((e) => dayjs(e.date).format('MMM D'))
  const weights = filtered.map((e) => e.weight)
  const trend = movingAverage(weights)

  const data = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: weights,
        borderColor: '#C8FF00',
        backgroundColor: 'rgba(200,255,0,0.07)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#C8FF00',
        pointBorderColor: '#07090F',
        pointBorderWidth: 1.5,
        pointHoverRadius: 6,
      },
      {
        label: '3-pt Avg',
        data: trend,
        borderColor: '#00D4FF',
        borderDash: [5, 4],
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 1.8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#3D4E6A',
          font: { family: 'Outfit', size: 11 },
          boxWidth: 12,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#0D1117',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#D8E4FF',
        bodyColor: '#3D4E6A',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#3D4E6A', font: { family: 'Outfit', size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#3D4E6A', font: { family: 'Outfit', size: 11 } },
      },
    },
  }

  if (filtered.length === 0) {
    return (
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
        No data for this range
      </p>
    )
  }

  return (
    <motion.div
      style={{ height: 240 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <Line data={data} options={options} />
    </motion.div>
  )
})

export default WeightChart
