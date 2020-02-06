/* eslint-disable no-loop-func */
/* eslint-disable array-callback-return */
import React from 'react'
import { Message, Table, Header, Image, Statistic, Dimmer, Loader, Segment } from 'semantic-ui-react'
import './MMRCalculator.css';

let names = ['Mochi.4Vic', 'SnoopyBoy.4Vic', 'OT.4Vic', 'CeeCee.4Vic', 'SO.4Vic', 'TrendSetto.4Vic'];

class MMRCalculator extends React.Component {
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
      ],
      data: [],
      mmrList: [],
      indexComboList: [],
      team1: [],
      team2: [],
      team1Players: [],
      team2Players: [],
      team1Avg: null,
      team2Avg: null,
      loaded: false,
    }
  }

  componentDidMount() {
    this.getPlayerData();
  }

  getPlayerData() {
    const { data, endpoints, mmrList } = this.state;
    for (let i = 0; i < endpoints.length; i++) {
      fetch(this.state.endpoints[i], {
        headers: new Headers({
          // eslint-disable-next-line no-useless-concat
          'Authorization': 'Bearer ' + 'f889606e-8bc5-4f1c-b941-084aefd16a90',
        })
      })
        .then(res => res.json())
        .then((data) => {
          let season = data.seasons.shifting_tides.regions.ncsa[0];
          this.setState({
            data:
              [...this.state.data, {
                name: data.username,
                current_mmr: season.mmr,
                rank_svg: season.rank_image,
                current_rank: season.rank_text,
              }]
          });
          if (this.state.data.length >= endpoints.length) {
            this.state.data.map((player) => {
              mmrList.push(player.current_mmr);
            });
            this.getBestTeams();
          }
        })
        .catch(console.log)
    }
  }
  k_combinations(set, k) {
    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
      return [];
    }

    if (k === set.length) {
      return [set];
    }

    if (k === 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      head = set.slice(i, i + 1);
      tailcombs = this.k_combinations(set.slice(i + 1), k - 1);
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  }
  getBestTeams() {
    const { mmrList } = this.state;
    const add = (a, b) => a + b;
    let allCombos = this.k_combinations(mmrList, 3);
    let leastDiff = 10000;
    let tempList = mmrList.slice(0);
    let bestTeam1, bestTeam2;
    for (let i = 0; i < allCombos.length; i++) {
      let comboGroup = allCombos[i];
      for (let j = 0; j < 3; j++) {
        tempList.splice(tempList.indexOf(comboGroup[j]), 1);
      }
      let _team1Avg = comboGroup.reduce(add) / 3;
      let _team2Avg = tempList.reduce(add) / 3;
      let teamDiff = Math.abs(_team1Avg - _team2Avg);
      if (teamDiff < leastDiff) {
        bestTeam1 = comboGroup.slice(0);
        bestTeam2 = tempList.slice(0);
        _team1Avg = comboGroup.reduce(add) / 3;
        _team2Avg = tempList.reduce(add) / 3;
        leastDiff = teamDiff;
        this.setState({
          team1: bestTeam1,
          team2: bestTeam2,
          team1Avg: _team1Avg,
          team2Avg: _team2Avg,
        })
      }
      tempList = mmrList.slice(0);
    }
    this.matchTeams();
  }
  displayRank(column, round, percentage) {
    if (percentage && column !== 'Unranked') {
      return column.toFixed(round) + '%';
    } else {
      return column === 'Unranked' ? 'Unranked' : column.toFixed(round);
    }
  }

  matchTeams() {
    const { team1Players, team2Players, team1, team2, data } = this.state;
    for (let i = 0; i < team1.length; i++) {
      data.map((player) => {
        if (team1[i] === player.current_mmr) {
          this.setState({
            team1Players:
              [...this.state.team1Players, {
                name: player.name,
                current_mmr: player.current_mmr,
                rank_svg: player.rank_svg,
                current_rank: player.current_rank,
              }]
          });
        }
      });
    }

    for (let i = 0; i < team2.length; i++) {
      data.map((player) => {
        if (team2[i] === player.current_mmr) {
          this.setState({
            team2Players:
              [...this.state.team2Players, {
                name: player.name,
                current_mmr: player.current_mmr,
                rank_svg: player.rank_svg,
                current_rank: player.current_rank,
              }]
          });
        }
      });
    }
    this.setState({ loaded: true })
  }

  showLoader() {
    return (
      <div>
        <Segment style={{ 'height': '708px', 'width': '80%', 'margin': 'auto'}}>
          <Dimmer style={{ 'height': '708px', 'width': '80%', 'margin': 'auto'}} active inverted>
            <Loader inverted style={{'margin-left': '10%'}} size='large'>Calculating...</Loader>
          </Dimmer>
        </Segment>
      </div>
    );
  }

  render() {
    const { loaded, data, team1Players, team2Players, team1Avg, team2Avg } = this.state;
    return (
      !loaded ? this.showLoader() :
      <div>
        <Message info>
          <Message.Header>3v3 Team Calculator</Message.Header>
          <p>
            This page is used to calculate the least difference of average MMRs between the six 4Vic players when in two groups of 3.
            Why is this necessary you ask? Well, if we have six people playing, we can queue up as 3 and start a ranked match at the same time.
            Queuing up with the least difference of MMRs will increase our chances of getting matched up against each other.
          </p>
        </Message>
        <br />
        <div id='mmr-container'>
          <Table id='mmr-table'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '8%' }} width={1}>IGN</Table.HeaderCell>
                <Table.HeaderCell width={1}>MMR</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {team1Players.map((player) => (
                <Table.Row key={player.id}>
                  <Table.Cell className='ign-col' style={{ width: '8%' }}>
                    <Header as='h3' image>
                      <Image src={player.rank_svg} rounded size='tiny' />
                      <Header.Content>
                        {player.name}
                        <Header.Subheader>{player.current_rank}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{player.current_mmr}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Statistic style={{ 'float': 'right', 'marginBottom': '25px' }}>
              <Statistic.Value style={{ 'fontSize': '25px', 'color': '#3c44de' }}>{team1Avg !== null && team1Avg.toFixed(0)}</Statistic.Value>
              <Statistic.Label style= {{ 'fontSize': '15px' }}>Average MMR</Statistic.Label>
            </Statistic>
          </Table>
          <Table id='mmr-table2'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={{ width: '8%' }} width={1}>IGN</Table.HeaderCell>
                <Table.HeaderCell width={1}>MMR</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {team2Players.map((player) => (
                <Table.Row key={player.id}>
                  <Table.Cell className='ign-col' style={{ width: '8%' }}>
                    <Header as='h3' image>
                      <Image src={player.rank_svg} rounded size='tiny' />
                      <Header.Content>
                        {player.name}
                        <Header.Subheader>{player.current_rank}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{player.current_mmr}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Statistic style={{ 'float': 'right', 'marginBottom': '25px' }}>
              <Statistic.Value style={{ 'fontSize': '25px', 'color': '#3c44de' }}>{team2Avg !== null && team2Avg.toFixed(0)}</Statistic.Value>
              <Statistic.Label style= {{ 'fontSize': '15px' }}>Average MMR</Statistic.Label>
            </Statistic>
          </Table>
        </div>
      </div>
    );
  }
}

export default MMRCalculator;
