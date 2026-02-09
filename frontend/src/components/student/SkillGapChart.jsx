import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SkillGapChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-muted">No missing skills for the selected job.</div>;
  }

  const safeData = data.filter((item) => item?.skill && Number.isFinite(Number(item?.weight)));
  if (safeData.length === 0) {
    return <div className="text-muted">No missing skills for the selected job.</div>;
  }

  const chartKey = safeData.map((item) => `${item.skill}:${Number(item.weight)}`).join('|');

  const chartData = {
    labels: safeData.map((item) => item.skill),
    datasets: [
      {
        label: 'Missing Skill Weight',
        data: safeData.map((item) => Number(item.weight)),
        backgroundColor: '#f97066'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        title: { display: true, text: 'Missing Skills' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Weight' }
      }
    }
  };

  return <Bar key={chartKey} data={chartData} options={options} />;
};

export default SkillGapChart;
