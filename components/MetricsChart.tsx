'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Clock, Zap, Code, TrendingUp, Award, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsData {
  codeLength: number;
  runtime: number; // milliseconds
  memoryUsage: number; // MB
  complexity: number; // cyclomatic complexity
  efficiency: number; // 0-100 score
  timestamp: string;
}

interface MetricsChartProps {
  currentMetrics: MetricsData;
  history: MetricsData[];
  targetMetrics?: Partial<MetricsData>;
  showComparison?: boolean;
  className?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({
  currentMetrics,
  history,
  targetMetrics,
  showComparison = false,
  className = '',
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#E5E7EB',
          font: {
            family: 'JetBrains Mono, monospace',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
    },
  };

  const getMetricColor = (value: number, target?: number) => {
    if (!target) return '#AA00FF';
    const ratio = value / target;
    if (ratio <= 0.8) return '#44FF88'; // Green - excellent
    if (ratio <= 1.2) return '#FFD700'; // Yellow - good
    return '#FF4444'; // Red - needs improvement
  };

  const getEfficiencyLevel = (efficiency: number) => {
    if (efficiency >= 90) return { level: 'Excellent', color: '#44FF88', icon: '🚀' };
    if (efficiency >= 75) return { level: 'Good', color: '#FFD700', icon: '⭐' };
    if (efficiency >= 50) return { level: 'Average', color: '#FFA500', icon: '👍' };
    return { level: 'Needs Work', color: '#FF4444', icon: '🔧' };
  };

  const lineChartData = {
    labels: history.slice(-10).map((_, index) => `Run ${index + 1}`),
    datasets: [
      {
        label: 'Runtime (ms)',
        data: history.slice(-10).map(h => h.runtime),
        borderColor: '#AA00FF',
        backgroundColor: 'rgba(170, 0, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Code Length',
        data: history.slice(-10).map(h => h.codeLength),
        borderColor: '#00AAFF',
        backgroundColor: 'rgba(0, 170, 255, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const barChartData = {
    labels: ['Code Length', 'Runtime', 'Memory', 'Complexity'],
    datasets: [
      {
        label: 'Current',
        data: [
          currentMetrics.codeLength,
          currentMetrics.runtime,
          currentMetrics.memoryUsage,
          currentMetrics.complexity,
        ],
        backgroundColor: [
          'rgba(68, 255, 136, 0.8)',
          'rgba(170, 0, 255, 0.8)',
          'rgba(0, 170, 255, 0.8)',
          'rgba(255, 212, 0, 0.8)',
        ],
        borderColor: [
          '#44FF88',
          '#AA00FF',
          '#00AAFF',
          '#FFD700',
        ],
        borderWidth: 2,
      },
      ...(targetMetrics && showComparison ? [{
        label: 'Target',
        data: [
          targetMetrics.codeLength || 0,
          targetMetrics.runtime || 0,
          targetMetrics.memoryUsage || 0,
          targetMetrics.complexity || 0,
        ],
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: '#FFFFFF',
        borderWidth: 2,
        borderDash: [5, 5],
      }] : []),
    ],
  };

  const efficiencyData = getEfficiencyLevel(currentMetrics.efficiency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 border border-gray-800 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-purple-400" size={24} />
          Code Metrics
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono">{efficiencyData.icon}</span>
          <span 
            className="text-sm font-semibold px-2 py-1 rounded"
            style={{ 
              backgroundColor: `${efficiencyData.color}20`,
              color: efficiencyData.color 
            }}
          >
            {efficiencyData.level}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Code className="text-green-400" size={16} />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Length</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {currentMetrics.codeLength}
          </div>
          <div className="text-xs text-gray-400">characters</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="text-purple-400" size={16} />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Runtime</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {currentMetrics.runtime}
          </div>
          <div className="text-xs text-gray-400">ms</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-blue-400" size={16} />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Memory</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {currentMetrics.memoryUsage.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">MB</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-yellow-400" size={16} />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Score</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {Math.round(currentMetrics.efficiency)}
          </div>
          <div className="text-xs text-gray-400">%</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-400" />
            Performance Trend
          </h4>
          <div className="h-48">
            <Line data={lineChartData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y1: {
                  type: 'linear' as const,
                  display: true,
                  position: 'right' as const,
                  ticks: { color: '#9CA3AF' },
                  grid: { drawOnChartArea: false },
                },
              },
            }} />
          </div>
        </div>

        {/* Current vs Target */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award size={18} className="text-yellow-400" />
            Current Metrics
            {showComparison && <span className="text-sm text-gray-400">vs Target</span>}
          </h4>
          <div className="h-48">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      {currentMetrics.efficiency < 75 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700/30 rounded-lg p-4"
        >
          <h5 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            💡 Optimization Tips
          </h5>
          <ul className="text-xs text-gray-300 space-y-1">
            {currentMetrics.codeLength > 200 && (
              <li>• Try to reduce code length by using more concise algorithms</li>
            )}
            {currentMetrics.runtime > 1000 && (
              <li>• Consider optimizing time complexity (use better data structures)</li>
            )}
            {currentMetrics.memoryUsage > 10 && (
              <li>• Optimize memory usage by reducing variable declarations</li>
            )}
            {currentMetrics.complexity > 5 && (
              <li>• Simplify logic to reduce cyclomatic complexity</li>
            )}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MetricsChart;
