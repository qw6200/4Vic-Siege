import React from 'react';
import { Table } from 'semantic-ui-react'
import './MainTable.css';
import _ from 'lodash'

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoints: [
        'https://api2.r6stats.com/public-api/stats/CubeheadCC/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/dannykimbaby/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/ALSJAE/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/JacobsLeftNut/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/Sangxue/pc/seasonal',
      ],
      data: [],
      column: null,
      direction: 'descending',
    }
  }

  getPlayerData() {
    for (let i = 0; i <= 5; i++) {
      fetch(this.state.endpoints[i], {
        headers: new Headers({
          // eslint-disable-next-line no-useless-concat
          'Authorization': 'Bearer ' + 'f889606e-8bc5-4f1c-b941-084aefd16a90',
        })
      })
        .then(res => res.json())
        .then((data) => {
          this.setState({
            data:
              [...this.state.data, {
                id: data.ubisoft_id,
                name: data.username,
                current_mmr: data.seasons.shifting_tides.regions.ncsa[0].mmr,
                ranked_kd: (data.seasons.shifting_tides.regions.ncsa[0].kills) / (data.seasons.shifting_tides.regions.ncsa[0].deaths),
                ranked_wp: (data.seasons.shifting_tides.regions.ncsa[0].wins / (data.seasons.shifting_tides.regions.ncsa[0].wins + data.seasons.shifting_tides.regions.ncsa[0].losses)) * 100,
                games_played: (data.seasons.shifting_tides.regions.ncsa[0].wins + data.seasons.shifting_tides.regions.ncsa[0].losses),
              }]
          });
          if (this.state.data.length > 4) {
            this.sortData();
          }
        })
        .catch(console.log)
    }
  }
  componentDidMount() {
    this.getPlayerData();
  }

  sortData() {
    const { data } = this.state;
    this.setState({
      column: 'current_mmr',
      data: _.sortBy(data, ['current_mmr']),
      direction: 'descending',
    });
    this.reverseData();
  }

  reverseData() {
    const { data } = this.state;
    this.setState({
      data: data.reverse()
    });
  }

  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;
    console.log('direction:', direction);
    console.log(clickedColumn);
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'descending',
      })
      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'descending' ? 'ascending' : 'descending',
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
            <Table.HeaderCell>Games Played</Table.HeaderCell>
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
              <Table.Cell>{player.games_played}</Table.Cell>
              <Table.Cell>{player.current_mmr}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default MainTable;