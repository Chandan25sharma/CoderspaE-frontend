'use client';

import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Zap, Target, Clock, AlertTriangle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TypingMetricsProps {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  errorsCount: number;
  isActive?: boolean;
}

export function TypingMetrics({ wpm, accuracy, timeElapsed, errorsCount, isActive = true }: TypingMetricsProps) {
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setWpmHistory(prev => {
        const newHistory = [...prev, wpm];
        return newHistory.slice(-20); // Keep last 20 data points
      });

      setTimeLabels(prev => {
        const newLabels = [...prev, `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`];
        return newLabels.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [wpm, timeElapsed, isActive]);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'WPM',
        data: wpmHistory,
        borderColor: '#44FF88',
        backgroundColor: 'rgba(68, 255, 136, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1E1E1E',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#44FF88',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: 0,
        max: Math.max(100, Math.max(...wpmHistory) * 1.2),
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#44FF88',
      },
    },
  };

  const metrics = [
    {
      icon: Zap,
      label: 'WPM',
      value: wpm,
      color: 'text-neon-green',
      bgColor: 'bg-neon-green/20',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'text-neon-blue',
      bgColor: 'bg-neon-blue/20',
    },
    {
      icon: Clock,
      label: 'Time',
      value: `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`,
      color: 'text-neon-yellow',
      bgColor: 'bg-neon-yellow/20',
    },
    {
      icon: AlertTriangle,
      label: 'Errors',
      value: errorsCount,
      color: 'text-neon-red',
      bgColor: 'bg-neon-red/20',
    },
  ];

  return (
    <motion.div
      className="bg-cyber-gray rounded-2xl p-4 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
        <motion.div
          className={`w-3 h-3 rounded-full ${isActive ? 'bg-neon-green' : 'bg-gray-500'}`}
          animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className={`${metric.bgColor} rounded-xl p-3 flex items-center gap-3`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className={`w-5 h-5 ${metric.color}`} />
              <div>
                <div className={`text-sm ${metric.color} font-semibold`}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-400">{metric.label}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* WPM Chart */}
      {wpmHistory.length > 1 && (
        <motion.div
          className="h-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-gray-400 mb-2">WPM Over Time</div>
          <Line data={chartData} options={chartOptions} />
        </motion.div>
      )}

      {/* Performance Indicator */}
      <motion.div
        className="flex items-center justify-center gap-2 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {wpm >= 60 && accuracy >= 95 && (
          <motion.div
            className="flex items-center gap-1 text-neon-green"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Elite Performance!</span>
          </motion.div>
        )}
        {wpm >= 40 && wpm < 60 && accuracy >= 90 && (
          <div className="flex items-center gap-1 text-neon-blue">
            <Target className="w-4 h-4" />
            <span>Great Job!</span>
          </div>
        )}
        {(wpm < 40 || accuracy < 90) && (
          <div className="flex items-center gap-1 text-neon-yellow">
            <Clock className="w-4 h-4" />
            <span>Keep Going!</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
