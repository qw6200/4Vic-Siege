import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import './MainTable.css';

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    fetch('https://r6tab.com/api/player.php?p_id=073b088d-7260-4874-baa5-2daf7bdcf28c')
      .then(res => res.json())
      .then((data) => {
        console.log('data:', data);
        this.setState({
          data:
            [...this.state.data, {
              id: data.p_id,
              name: data.p_name,
              ranked_kd: data.kd,
              current_mmr: data.p_NA_currentmmr,
            }]
        });
      })
      .catch(console.log)
  }

  render() {
    const { data } = this.state;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>IGN</Table.HeaderCell>
            <Table.HeaderCell>Ranked KD</Table.HeaderCell>
            <Table.HeaderCell>Current MMR</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((player) => (
              <Table.Row>
                <Table.Cell>{player.name}</Table.Cell>
                <Table.Cell>{player.ranked_kd}</Table.Cell>
                <Table.Cell>{player.current_mmr}</Table.Cell>
              </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
  // {data.map((player) => (
  //   <Table.Row>
  //     {player.name}
  //   </Table.Row>
  // ))}
}

export default MainTable;