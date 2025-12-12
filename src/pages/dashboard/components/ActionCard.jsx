import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ActionCard = ({ title, description, icon, route, stats, gradient = "from-blue-500 to-purple-600" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-gradient-to-br ${gradient} p-6 rounded-xl text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
          <Icon name={icon} size={24} />
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold">{stats?.value}</div>
            <div className="text-sm opacity-80">{stats?.label}</div>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      
      <div className="mt-4 flex items-center text-sm">
        <span className="mr-2">Get started</span>
        <Icon name="ArrowRight" size={16} />
      </div>
    </div>
  );
};

export default ActionCard;