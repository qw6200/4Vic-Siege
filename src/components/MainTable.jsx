import React from 'react';
import { Table, Label, Icon, Header, Image, Statistic, Popup, Dimmer, Loader, Segment } from 'semantic-ui-react'
import './MainTable.css';
import _ from 'lodash'

let names = ['Mochi.4Vic', 'SnoopyBoy.4Vic', 'OT.4Vic', 'CeeCee.4Vic', 'SO.4Vic', 'TrendSetto.4Vic', 'Circadia.4Vic'];

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoints: [
        'https://api2.r6stats.com/public-api/stats/' + names[0] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[1] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[2] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[3] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[4] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[5] + '/pc/seasonal',
        'https://api2.r6stats.com/public-api/stats/' + names[6] + '/pc/seasonal',
      ],
      data: [],
      column: null,
      direction: 'descending',
      loaded: false,
    }
  }

  getPlayerData() {
    const { endpoints } = this.state;
    for (let i = 0; i < endpoints.length; i++) {
      fetch(this.state.endpoints[i], {
        headers: new Headers({
          // eslint-disable-next-line no-useless-concat
          'Authorization': 'Bearer ' + 'f889606e-8bc5-4f1c-b941-084aefd16a90',
        })
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          let season = data.seasons.shifting_tides.regions.ncsa[0];
          let lastSession = data.seasons.shifting_tides.regions.ncsa[1];
          if (season.mmr === 2500 || data.seasons.shifting_tides.regions.ncsa.length < 2) {
            this.setState({
              data:
                [...this.state.data, {
                  id: data.ubisoft_id,
                  name: data.username,
                  ranked_kd: (season.kills) / (season.deaths),
                  ranked_wp: (season.wins / (season.wins + season.losses)) * 100,
                  games_played: (season.wins + season.losses),
                  current_mmr: season.mmr,
                  next_rank: season.next_rank_mmr - season.mmr,
                  current_rank: season.rank_text,
                  rank_svg: season.rank_image,
                  last_mmr: 0,
                  last_kd: 0,
                }]
            });
          } else {
            console.log((season.kills - lastSession.kills) / (season.deaths - lastSession.deaths));
            this.setState({
              data:
                [...this.state.data, {
                  id: data.ubisoft_id,
                  name: data.username,
                  ranked_kd: (season.kills) / (season.deaths),
                  ranked_wp: (season.wins / (season.wins + season.losses)) * 100,
                  games_played: (season.wins + season.losses),
                  current_mmr: season.mmr,
                  next_rank: season.next_rank_mmr - season.mmr,
                  current_rank: season.rank_text,
                  rank_svg: season.rank_image,
                  last_mmr: lastSession.mmr,
                  last_kd: (season.kills - lastSession.kills) / (season.deaths - lastSession.deaths)
                }]
            });
          }
          if (this.state.data.length === endpoints.length) {
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
    const { data, endpoints } = this.state;
    for (let i = 0; i < endpoints.length; i++) {
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
      if (current_mmr === 0 || isNaN(current_mmr)) {
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
    },
      this.setState({
        loaded: true
      })
    );
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

  lastSessionDiff(current_stat, last_stat, kd) {
    if (isNaN(current_stat)) {
      return 'Unranked';
    }
    if (isNaN(last_stat)) {
      return 'None';
    }
    let diff;
    if (kd) {
      diff = current_stat - last_stat;
      diff = last_stat.toFixed(3);
    }
    if (diff < current_stat) {
      return (
        <Statistic color='red'>
          <Statistic.Value>{diff}</Statistic.Value>
        </Statistic>
      )
    } else {
      return (
        <Statistic color='green'>
          <Statistic.Value>{diff}</Statistic.Value>
        </Statistic>
      )
    }
  }
  mmrChange(current_mmr, last_mmr) {
    if (isNaN(current_mmr)) {
      return 'Unranked';
    }
    if (isNaN(last_mmr)) {
      return 'None';
    }
    let diff = current_mmr - last_mmr
    if (diff < 0) {
      return (
        <Statistic color='red'>
          <Statistic.Value>{diff}</Statistic.Value>
        </Statistic>
      )
    } else {
      return (
        <Statistic color='green'>
          <Statistic.Value>{diff}</Statistic.Value>
        </Statistic>
      )
    }
  }
  renderTag(position) {
    switch (position) {
      case 0:
        return (
          <Label as='a' color='blue' image>
            <Icon name='chess king' size='large' />
            Supreme Leader
        </Label>
        )
      case 1:
        return (
          <Label as='a' color='teal' image>
            <Icon name='trophy' size='large' />
            General of the Army
        </Label>
        )
      case 2:
        return (
          <Label as='a' color='green' image>
            <Icon name='star' size='large' />
            Brigadier General
        </Label>
        )
      case 3:
        return (
          <Label as='a' color='yellow' image>
            <Icon name='low vision' size='large' />
            1st Lieutenant
        </Label>
        )
      case 4:
        return (
          <Label as='a' color='orange' image>
            <Icon name='handicap' size='large' />
            Staff Sergeant
        </Label>
        )
      case 5:
        return (
          <Label as='a' color='brown' image>
            <Icon name='trash alternate' size='large' />
            Private First Class
        </Label>
        )
      case 6:
        return (
          <Label as='a' color='red' image>
            <Icon name='blind' size='large' />
           Very low Smurf
          </Label>
        )
      default:
        return null;
    }
  }

  renderName(ign) {
    switch (ign) {
      case names[0]:
        return 'Jacob Lee';
      case names[1]:
        return 'Daniel Kim';
      case names[2]:
        return 'Minjae Cho';
      case names[3]:
        return 'Chris Choi';
      case names[4]:
        return 'Shane Cho';
      case names[5]:
        return 'Paul Han';
      case names[6]:
        return 'Smurf';
      default:
        return 'Unknown Player';
    }
  }

  showLoader() {
    return (
      <div>
        <Segment style={{ 'height': '600px', 'width': '80%', 'margin': 'auto'}}>
          <Dimmer style={{ 'height': '600px', 'width': '80%', 'margin': 'auto'}} active inverted>
            <Loader inverted style={{'margin-left': '10%'}} size='large'>Loading</Loader>
          </Dimmer>
        </Segment>
      </div>
    );
  }

  render() {
    const { data, column, direction, loaded } = this.state;
    return (
      !loaded ? this.showLoader() : <Table className='main' celled sortable fixed basic='very' selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ width: '15%' }}>IGN</Table.HeaderCell>
            <Table.HeaderCell>Player</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'ranked_kd' ? direction : null}
              onClick={this.handleSort('ranked_kd')}
            >
              Ranked KD
            </Table.HeaderCell>
            <Table.HeaderCell>Ranked W/L</Table.HeaderCell>
            <Table.HeaderCell>Games Played</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'current_mmr' ? direction : null}
              onClick={this.handleSort('current_mmr')}
            >
              Current MMR
            </Table.HeaderCell>
            <Table.HeaderCell>MMR For Promo</Table.HeaderCell>
            <Table.HeaderCell>
              MMR Change
              <Popup
                trigger={<Icon size='tiny' circular name='question' />}
                content='This change is based on your MMR in the last 16-24 hours.'
                size='small'
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              Last Session KD
              <Popup
                trigger={<Icon size='tiny' circular name='question' />}
                content='This change is based on your KD in the last 16-24 hours.'
                size='small'
              />
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
              <Table.Cell>{player.next_rank}</Table.Cell>
              <Table.Cell>{this.mmrChange(player.current_mmr, player.last_mmr)}</Table.Cell>
              <Table.Cell>{this.lastSessionDiff(player.ranked_kd, player.last_kd, true)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

export default MainTable;