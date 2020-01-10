import React from 'react';
import { Table } from 'semantic-ui-react'
import './MainTable.css';
import _ from 'lodash'

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoints: [
        'https://r6tab.com/api/player.php?p_id=073b088d-7260-4874-baa5-2daf7bdcf28c',
        'https://r6tab.com/api/player.php?p_id=9b89338d-2235-4ecb-8ac6-b761516f0c32',
        'https://r6tab.com/api/player.php?p_id=09fa8f09-4975-4536-ad73-7d29c1c0dcd7',
        'https://r6tab.com/api/player.php?p_id=0a1ebb44-02a2-4d69-8d1f-e3d97639636a',
        'https://r6tab.com/api/player.php?p_id=7ce8459b-70c0-4df3-8011-8ebbf2b260e7',
      ],
      data: [],
      column: null,
      direction: null,
    }
  }
  
  componentDidMount() {
    for (let i = 0; i <= 5; i++) {
      fetch(this.state.endpoints[i])
        .then(res => res.json())
        .then((data) => {
          this.setState({
            data:
              [...this.state.data, {
                id: data.p_id,
                name: data.p_name,
                ranked_kd: (data.ranked.NA_kills/data.ranked.NA_deaths),
                current_mmr: data.p_NA_currentmmr,
                ranked_wp: (data.ranked.NA_wins/(data.ranked.NA_wins + data.ranked.NA_losses)) * 100
              }]
          });
        })
        .catch(console.log)
    }
  }
  handleSort = (clickedColumn) => () => {
    console.log('clicked');
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })
      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render() {
    const { data, column, direction } = this.state;
    return (
      <Table celled sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>IGN</Table.HeaderCell>
            <Table.HeaderCell>Ranked KD</Table.HeaderCell>
            <Table.HeaderCell>Ranked W/L%</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'current_mmr' ? direction : null}
              onClick={this.handleSort('current_mmr')}
            >
              Current MMR
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((player) => (
              <Table.Row key={player.id}>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell>{player.ranked_kd.toFixed(2)}</Table.Cell>
                <Table.Cell>{player.ranked_wp.toFixed(0)}%</Table.Cell>
                <Table.Cell>{player.current_mmr}</Table.Cell>
              </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default MainTable;