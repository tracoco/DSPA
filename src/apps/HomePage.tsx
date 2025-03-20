import React from 'react';
import AppRegistrationForm from '../components/AppRegistrationForm';
import { useAppRegistry } from '../context/AppRegistryContext';

const HomePage: React.FC = () => {
  const { apps } = useAppRegistry();
  
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Micro Frontend Dashboard</h2>
      
      <AppRegistrationForm />
      
      <div style={{ 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Registered Applications</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Path</th>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Display Name</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.name}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{app.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{app.path}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{app.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
