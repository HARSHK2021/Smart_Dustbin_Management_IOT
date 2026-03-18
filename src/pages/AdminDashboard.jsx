import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dustbinAPI, complaintAPI, messageAPI } from '../services/api';
import { getSocket } from '../services/socket';
import AdminSidebar from '../components/AdminSidebar';
import DashboardStats from '../components/DashboardStats';
import DustbinManagement from '../components/DustbinManagement';
import ComplaintManagement from '../components/ComplaintManagement';
import MessageManagement from '../components/MessageManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dustbins, setDustbins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }

    loadData();

    const socket = getSocket();

    socket.on('dustbinUpdate', handleDustbinUpdate);
    socket.on('dustbinAdded', handleDustbinAdded);
    socket.on('dustbinDeleted', handleDustbinDeleted);
    socket.on('newComplaint', handleNewComplaint);
    socket.on('complaintUpdate', handleComplaintUpdate);
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('dustbinUpdate');
      socket.off('dustbinAdded');
      socket.off('dustbinDeleted');
      socket.off('newComplaint');
      socket.off('complaintUpdate');
      socket.off('newMessage');
    };
  }, [navigate]);

  const loadData = async () => {
    try {
      const [dustbinsData, complaintsData, messagesData] = await Promise.all([
        dustbinAPI.getAll(),
        complaintAPI.getAll(),
        messageAPI.getAll()
      ]);
      setDustbins(dustbinsData);
      setComplaints(complaintsData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDustbinUpdate = (updatedDustbin) => {
    setDustbins(prev => {
      const index = prev.findIndex(d => d.id === updatedDustbin.id);
      if (index >= 0) {
        const newDustbins = [...prev];
        newDustbins[index] = updatedDustbin;
        return newDustbins;
      }
      return [...prev, updatedDustbin];
    });
  };

  const handleDustbinAdded = (newDustbin) => {
    setDustbins(prev => [...prev, newDustbin]);
  };

  const handleDustbinDeleted = (deletedId) => {
    setDustbins(prev => prev.filter(d => d.id !== deletedId));
  };

  const handleNewComplaint = (newComplaint) => {
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const handleComplaintUpdate = (updatedComplaint) => {
    setComplaints(prev =>
      prev.map(c => c.complaintId === updatedComplaint.complaintId ? updatedComplaint : c)
    );
  };

  const handleNewMessage = (newMessage) => {
    setMessages(prev => [newMessage, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="admin-content">
        <div className="admin-header">
          <h1>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'dustbins' && 'Dustbin Management'}
            {activeTab === 'complaints' && 'Complaint Management'}
            {activeTab === 'messages' && 'Messages & Alerts'}
          </h1>
        </div>

        <div className="admin-body">
          {activeTab === 'dashboard' && (
            <DashboardStats
              dustbins={dustbins}
              complaints={complaints}
              messages={messages}
            />
          )}

          {activeTab === 'dustbins' && (
            <DustbinManagement dustbins={dustbins} onRefresh={loadData} />
          )}

          {activeTab === 'complaints' && (
            <ComplaintManagement complaints={complaints} onRefresh={loadData} />
          )}

          {activeTab === 'messages' && (
            <MessageManagement messages={messages} />
          )}
        </div>
      </div>
    </div>
  );
}
