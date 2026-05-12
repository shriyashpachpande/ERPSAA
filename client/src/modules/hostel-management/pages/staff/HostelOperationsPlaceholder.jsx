import React from 'react';
import { AlertCircle } from 'lucide-react';

const PlaceholderPage = ({ title }) => (
  <div className="h-96 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8" />
    </div>
    <h2 className="text-2xl font-black text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500">This module is under implementation and will be available shortly.</p>
  </div>
);

export const OccupancyAnalyticsPage = () => <PlaceholderPage title="Occupancy Analytics" />;
export const CheckInCheckOutPage = () => <PlaceholderPage title="Check-In / Out Operations" />;
export const HostelComplaintsPage = () => <PlaceholderPage title="Hostel Complaints" />;
export const MaintenanceRequestsPage = () => <PlaceholderPage title="Maintenance Requests" />;
export const RoomDetailsPage = () => <PlaceholderPage title="Room & Bed Details" />;
export const EmergencyContactsPage = () => <PlaceholderPage title="Hostel Emergency Contacts" />;
