import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connectAdvanced } from 'react-redux';
import shallowEqual from 'shallowequal';
import { Button, DataTable } from 'carbon-components-react';

import { COUNTRIES } from '../constants';
import {
  fetchPlayersSuccess,
  createPlayerSuccess,
  editPlayerSuccess,
  deletePlayerSuccess,
} from '../appState/actions';

import './PlayerTable.scss';
import PlayerTableRow from './PlayerTableRow';
import PlayerModal from './PlayerModal';

const {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableHeader,
} = DataTable;

class PlayerTable extends PureComponent {
  constructor(props) {
    super(props);

    this.createPlayer = this.createPlayer.bind(this);
    this.editPlayer = this.editPlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
    this.togglePlayerModal = this.togglePlayerModal.bind(this);

    this.state = {
      playerToEdit: null,
      showPlayerModal: false,
    };
  }

  componentDidMount() {
    const { fetchPlayersSuccess } = this.props;
    fetch('http://localhost:3001/players', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data && data.players) {
          fetchPlayersSuccess(data.players);
          return data;
        }
        throw new Error(data.message);
      });
  }

  createPlayer(player) {
    const { createPlayerSuccess } = this.props;
    fetch(`http://localhost:3001/players`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(player),
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
        throw new Error(`New player was not created.`);
      })
      .then(data => {
        if (data) {
          createPlayerSuccess(data);
          return data;
        }
        throw new Error(`New player was not created.`);
      });
  }

  editPlayer(player) {
    const { editPlayerSuccess } = this.props;
    fetch(`http://localhost:3001/players/${player.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(player),
    }).then(response => {
      if (response.status === 200) {
        editPlayerSuccess(player);
        return response;
      }
      throw new Error(`Player ${player.id} was not updated.`);
    });
  }

  deletePlayer(id) {
    const { deletePlayerSuccess } = this.props;
    fetch(`http://localhost:3001/players/${id}`, {
      method: 'DELETE',
    }).then(response => {
      if (response.status === 204) {
        deletePlayerSuccess(id);
        return response;
      }
      throw new Error(`Player ${id} was not deleted.`);
    });
  }

  togglePlayerModal(show, player = null) {
    this.setState({
      showPlayerModal: show,
      playerToEdit: player,
    });
  }

  submitModal(player) {
    const { playerToEdit } = this.state;

    if (playerToEdit) {
      this.editPlayer(player);
    } else {
      this.createPlayer(player);
    }
  }

  render() {
    const { players } = this.props;
    const { playerToEdit, showPlayerModal } = this.state;

    const headers = [
      { key: 'imageUrl', header: '' },
      { key: 'name', header: 'Player' },
      { key: 'winnings', header: 'Winnings' },
      { key: 'country', header: 'Native of' },
    ];

    return (
      <div className="player-table">
        <div className="player-table__toolbar">
          <span className="title">Poker Players Table</span>
          <Button onClick={() => this.togglePlayerModal(true)}>
            Add Player
          </Button>
        </div>
        <DataTable
          headers={headers}
          render={({ getHeaderProps, headers, rows }) => (
            <TableContainer>
              <Table zebra={false}>
                <TableHead>
                  <TableRow>
                    {headers.map(header => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader />
                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => {
                    const player = players.find(player => player.id === row.id);
                    return (
                      <PlayerTableRow
                        cells={row.cells}
                        key={row.id}
                        onEdit={() => this.togglePlayerModal(true, player)}
                        onDelete={() => this.deletePlayer(row.id)}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          rows={players}
        />
        {showPlayerModal && (
          <PlayerModal
            onClose={() => this.togglePlayerModal(false)}
            onSubmit={player => this.submitModal(player)}
            player={playerToEdit}
          />
        )}
      </div>
    );
  }
}

PlayerTable.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country: PropTypes.oneOf(Object.keys(COUNTRIES)),
      winnings: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
  fetchPlayersSuccess: PropTypes.func.isRequired,
  createPlayerSuccess: PropTypes.func.isRequired,
  editPlayerSuccess: PropTypes.func.isRequired,
  deletePlayerSuccess: PropTypes.func.isRequired,
};

export default connectAdvanced(dispatch => {
  let result;
  const actions = bindActionCreators(
    {
      fetchPlayersSuccess,
      createPlayerSuccess,
      editPlayerSuccess,
      deletePlayerSuccess,
    },
    dispatch
  );

  return (state, props) => {
    const players = state.playerIds.map(id => state.players[id]);

    const nextResult = { ...props, ...actions, players };

    if (!shallowEqual(result, nextResult)) {
      result = nextResult;
    }

    return result;
  };
})(PlayerTable);
