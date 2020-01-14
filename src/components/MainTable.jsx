import React from 'react';
import { Table, Label, Icon, Header, Image } from 'semantic-ui-react'
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
                ranked_kd: (data.seasons.shifting_tides.regions.ncsa[0].kills) / (data.seasons.shifting_tides.regions.ncsa[0].deaths),
                ranked_wp: (data.seasons.shifting_tides.regions.ncsa[0].wins / (data.seasons.shifting_tides.regions.ncsa[0].wins + data.seasons.shifting_tides.regions.ncsa[0].losses)) * 100,
                games_played: (data.seasons.shifting_tides.regions.ncsa[0].wins + data.seasons.shifting_tides.regions.ncsa[0].losses),
                current_mmr: data.seasons.shifting_tides.regions.ncsa[0].mmr,
                current_rank: data.seasons.shifting_tides.regions.ncsa[0].rank_text,
                rank_svg: data.seasons.shifting_tides.regions.ncsa[0].rank_image,
              }]
          });
          if (this.state.data.length > 4) {
            this.sortData();
            this.sanitizeData();
          }
        })
        .catch(console.log)
    }
  }
  componentDidMount() {
    this.getPlayerData();
  }

  sanitizeData() {
    const { data } = this.state;
    for (let i = 0; i <= 5; i++) {
      let ranked_kd = data[i].ranked_kd;
      let ranked_wp = data[i].ranked_wp;
      let current_mmr = data[i].current_mmr;
      if (isNaN(ranked_kd)) {
        let newData = data.slice();
        newData[i].ranked_kd = 'Unranked';
        this.setState({ data: newData })
      }
      if (isNaN(ranked_wp)) {
        let newData = data.slice();
        newData[i].ranked_wp = 'Unranked';
        this.setState({ data: newData })
      }
      if (current_mmr === 2500) {
        let newData = data.slice();
        newData[i].current_mmr = 'Unranked';
        this.setState({ data: newData })
      }
    }
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

  displayRank(column, round, percentage) {
    if (percentage && column !== 'Unranked') {
      return column.toFixed(round) + '%';
    } else {
      return column === 'Unranked' ? 'Unranked' : column.toFixed(round);
    }
  }

  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;
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

  renderTag(position) {
    switch (position) {
      case 0:
        return (
          <Label as='a' color='blue' image>
            <Icon name='chess king' size='large' />
            King of the North
        </Label>
        )
      case 1:
        return (
          <Label as='a' color='teal' image>
            <Icon name='trophy' size='large' />
            Renowned Player
        </Label>
        )
      case 2:
        return (
          <Label as='a' color='green' image>
            <Icon name='star' size='large' />
            Respectable Soldier
        </Label>
        )
      case 3:
        return (
          <Label as='a' color='orange' image>
            <Icon name='handicap' size='large' />
            Handicapped Player
        </Label>
        )
      case 4:
        return (
          <Label as='a' color='red' image>
            <Icon name='blind' size='large' />
            Jot-Bap Sekki
        </Label>
        )
      default:
        return null;
    }
  }
  
  renderName(ign) {
    switch (ign) {
      case 'CubeheadCC':
        return 'Jacob Lee';
      case 'dannykimbaby':
        return 'Daniel Kim';
      case 'ALSJAE':
        return 'Minjae Cho';
      case 'Sangxue':
        return 'Shane Cho';
      case 'JacobsLeftNut':
        return 'Chris Choi';
      default:
        return 'Unknown Player';
    }
  }
  render() {
    const { data, column, direction } = this.state;
    return (
      <Table celled sortable fixed basic='very' selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>IGN</Table.HeaderCell>
            <Table.HeaderCell>Player</Table.HeaderCell>
            <Table.HeaderCell>Ranked KD</Table.HeaderCell>
            <Table.HeaderCell>Ranked W/L</Table.HeaderCell>
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
          {data.map((player, index) => (
            <Table.Row key={player.id}>
              <Table.Cell>
                <Header as='h3' image>
                  <Image src={player.rank_svg} rounded size='tiny' />
                  <Header.Content>
                    {player.name}
                    <Header.Subheader>{player.current_rank}</Header.Subheader>
                  </Header.Content>
                </Header>
              </Table.Cell>
              <Table.Cell>
                {this.renderName(player.name)}
                {this.renderTag(index)}
              </Table.Cell>
              <Table.Cell>
                {this.displayRank(player.ranked_kd, 2)}
              </Table.Cell>
              <Table.Cell>
                {this.displayRank(player.ranked_wp, 0, true)}
              </Table.Cell>
              <Table.Cell>{player.games_played}</Table.Cell>
              <Table.Cell>{this.displayRank(player.current_mmr)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default MainTable;