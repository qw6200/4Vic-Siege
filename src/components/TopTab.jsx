import React from 'react'
import { Tab } from 'semantic-ui-react'
import MainTable from './MainTable';
import MMRCalculator from './MMRCalculator';
import './TopTab.css';

const panes = [
  {
    menuItem: {key: 'members', icon: 'users', content: '4Vic Members'},
    render: () => <Tab.Pane attached={false}><MainTable></MainTable></Tab.Pane>,
  },
  {
    menuItem: {key: '3v3 Calculator', icon: 'handshake', content: '3v3 Team Calculator'},
    render: () => <Tab.Pane attached={false}><MMRCalculator></MMRCalculator></Tab.Pane>,
  },
]

const TopTab = () => 
  <Tab 
    menu={{ pointing: true, color: 'blue', inverted: true }} 
    panes={panes} 
  />

export default TopTab
