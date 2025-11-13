
import React from 'react';
import { Notification as NotificationType } from '../types';

const Notification: React.FC<Omit<NotificationType, 'id'>> = ({ message, type }) => {
  const baseClasses = "flex items-center gap-3 p-3 rounded-lg shadow-lg text-sm font-semibold animate-fade-in-right";

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-cyan-500 text-slate-900",
  };
  
  const icons = {
      success: "fa-solid fa-check-circle",
      error: "fa-solid fa-exclamation-triangle",
      info: "fa-solid fa-info-circle"
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <i className={icons[type]}></i>
      <span>{message}</span>
    </div>
  );
};

export default Notification;
