import React from 'react'
import { Tab } from 'semantic-ui-react'
import MainTable from './MainTable';
import './TopTab.css';

const panes = [
  {
    menuItem: {key: 'members', icon: 'users', content: '4Vic Members'},
    render: () => <Tab.Pane attached={false}><MainTable></MainTable></Tab.Pane>,
  },
  {
    menuItem: 'Tab 2',
    render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
  },
]

const TopTab = () => 
  <Tab 
    menu={{ pointing: true, color: 'blue', inverted: true }} 
    panes={panes} 
  />

export default TopTab
