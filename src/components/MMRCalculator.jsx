/* eslint-disable array-callback-return */
import React from 'react'
import { Message } from 'semantic-ui-react'
import './MMRCalculator.css';
import { thisExpression } from '@babel/types';

let names = ['CubeheadCC', 'Circadia.4Vic', 'ALSJAE', 'CeeCee.4Vic', 'SO.4Vic', 'TrendSetto.4Vic', 'JjinSSu'];

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
        'https://api2.r6stats.com/public-api/stats/' + names[6] + '/pc/seasonal',
      ],
      data: [],
      mmrList: [],
      indexComboList: [],
    }
  }

  componentDidMount() {
    this.getPlayerData();
  }

  getPlayerData() {
    const { data, endpoints, indexComboList, mmrList } = this.state;
    for (let i = 0; i <= endpoints.length; i++) {
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
    for (let i = 0; i <= allCombos.length; i++) {
      let tempList = mmrList;
      let comboGroup = allCombos[i];
      for (let j = 0; j <= 3; j++) {

      console.log('mmr:', this.state.mmrList);
        tempList.splice(tempList.indexOf(comboGroup[j]), 1);

      console.log('mmr2:', this.state.mmrList);
      }
      tempList = mmrList;
      console.log('comboGroup:', comboGroup);
      console.log('tempList:', tempList);
      let team1Avg = comboGroup.reduce(add)/3;
      let team2Avg = tempList.reduce(add)/3;
      let teamDiff = Math.abs(team1Avg - team2Avg);
      console.log('team1Avg:', team1Avg);
      console.log('team2Avg:', team2Avg);
      if (teamDiff < leastDiff) {
        console.log('leastDiff:', leastDiff);
        console.log('teamDiff:', teamDiff);
        leastDiff = teamDiff;
      }
    }
  }

  render() {
    return (
      <Message info>
      <Message.Header>3v3 Team Calculator</Message.Header>
      <p>
        This page is used to calculate the least difference of average MMRs between the six 4Vic players when in two groups of 3.
        Why is this necessary you ask? Well, if we have six people playing, we can queue up as 3 and start a ranked match at the same time.
        Queuing up with the least difference of MMRs will increase our chances of getting matched up against each other.
        <br/>
        Work in progress.
      </p>
    </Message>
    
    );
  }
}

export default MMRCalculator;
