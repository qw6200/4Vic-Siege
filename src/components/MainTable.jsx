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
    fetch('https://r6tab.com/api/search.php?platform=uplay&search=CubeheadCC')
      .then(res => res.json())
      .then((data) => {
        console.log('data:', data.results[0]);
        this.setState({ data: data.results });
      })
      .catch(console.log)
  }

  render() {
    const { data } = this.state;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Header</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(player => (
            <Table.Row key={player.p_id}>
              {player.p_name}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

}

export default MainTable;