import React, { useState } from 'react';
import { MicroFrontendApp } from '../registry/appRegistry';
import { useAppRegistry } from '../context/AppRegistryContext';

const AppRegistrationForm: React.FC = () => {
  const { registerApp } = useAppRegistry();
  const [formData, setFormData] = useState<Omit<MicroFrontendApp, 'iconName'>>({
    name: '',
    path: '',
    appUrl: '',
    displayName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerApp({
      ...formData,
      iconName: 'default'
    });
    
    // Clear form
    setFormData({
      name: '',
      path: '',
      appUrl: '',
      displayName: ''
    });
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3>Register New Micro Frontend</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Application Name (e.g. @spa/my-app):
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            URL Path (e.g. /my-app):
          </label>
          <input
            type="text"
            name="path"
            value={formData.path}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            JavaScript URL:
          </label>
          <input
            type="text"
            name="appUrl"
            value={formData.appUrl}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Display Name:
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            padding: '10px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Register Application
        </button>
      </form>
    </div>
  );
};

export default AppRegistrationForm;
