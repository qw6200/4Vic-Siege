import React from 'react';
import MainTable from './components/MainTable';
import TopTab from './components/TopTab';
import './App.css';

function App() {
  return (
    <div className="App">
      <TopTab>
        <MainTable></MainTable>
      </TopTab>
    </div>
  );
}

export default App;
