import React from 'react';

const KPICard = ({ title, amount, trend, trendColor }) => {
  return (
    <div className="bg-barber-card p-6 rounded-xl border border-barber-gray/20 shadow-lg">
      <h3 className="text-barber-gray text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-barber-light mt-2">{amount}</p>
      <span className={`text-xs ${trendColor} mt-2 block`}>{trend}</span>
    </div>
  );
};

export default KPICard;