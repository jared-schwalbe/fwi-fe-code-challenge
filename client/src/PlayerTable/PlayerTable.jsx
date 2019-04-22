import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, DataTable, PaginationV2 } from 'carbon-components-react';

import { COUNTRIES } from '../constants';
import {
  fetchPlayersSuccess,
  editPlayerSuccess,
  addToast,
} from '../appState/actions';

import './PlayerTable.scss';
import PlayerTableRow from './PlayerTableRow';
import PlayerModal from './PlayerModal';

const {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} = DataTable;

class PlayerTable extends PureComponent {
  constructor(props) {
    super(props);

    this.createPlayer = this.createPlayer.bind(this);
    this.editPlayer = this.editPlayer.bind(this);
    this.deletePlayer = this.deletePlayer.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleCustomSort = this.handleCustomSort.bind(this);
    this.togglePlayerModal = this.togglePlayerModal.bind(this);
    this.submitModal = this.submitModal.bind(this);

    this.state = {
      page: 1,
      pageSize: 10,
      sortBy: null,
      sortOrder: null,
      playerToEdit: null,
      showPlayerModal: false,
    };
  }

  componentDidMount() {
    this.fetchPlayers();
  }

  fetchPlayers() {
    const { fetchPlayersSuccess, addToast } = this.props;
    const { pageSize, page, sortBy, sortOrder } = this.state;

    const size = pageSize;
    const from = pageSize * (page - 1);
    let url = `http://localhost:3001/players?size=${size}&from=${from}`;
    if (sortBy && sortOrder) {
      url += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    }

    fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('There was an error when fetching the players list.');
        }
      })
      .then(data => {
        if (data) {
          fetchPlayersSuccess(data);
          return data;
        } else {
          throw new Error('There was an error when fetching the players list.');
        }
      })
      .catch(error => {
        addToast({
          title: 'Error',
          subtitle: error.toString(),
          kind: 'error',
        });
      });
  }

  createPlayer(player) {
    const { addToast } = this.props;

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
          addToast({
            title: 'Success',
            subtitle: 'New player was successfully added.',
            kind: 'success',
          });
          this.fetchPlayers();
          return response;
        } else {
          throw new Error('There was an error when adding a new player.');
        }
      })
      .catch(error => {
        addToast({
          title: 'Error',
          subtitle: error.toString(),
          kind: 'error',
        });
      });
  }

  editPlayer(player) {
    const { editPlayerSuccess, addToast } = this.props;

    fetch(`http://localhost:3001/players/${player.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
      body: JSON.stringify(player),
    })
      .then(response => {
        if (response.status === 200) {
          editPlayerSuccess(player);
          addToast({
            title: 'Success',
            subtitle: `Player ${player.id} was successfully updated.`,
            kind: 'success',
          });
          return response;
        } else {
          throw new Error(
            `There was an error when updating player ${player.id}.`
          );
        }
      })
      .catch(error => {
        addToast({
          title: 'Error',
          subtitle: error.toString(),
          kind: 'error',
        });
      });
  }

  deletePlayer(id) {
    const { players, addToast } = this.props;
    const { page } = this.state;

    fetch(`http://localhost:3001/players/${id}`, { method: 'DELETE' })
      .then(response => {
        if (response.status === 204) {
          addToast({
            title: 'Success',
            subtitle: `Player ${id} was successfully deleted.`,
            kind: 'success',
          });
          if (players.length <= 1 && page > 1) {
            // go to the previous page if the last one is now empty
            this.setState(
              prevState => ({
                page: prevState.page - 1,
              }),
              () => this.fetchPlayers()
            );
          } else {
            this.fetchPlayers();
          }
          return response;
        } else {
          throw new Error(`There was an error when deleting player ${id}.`);
        }
      })
      .catch(error => {
        addToast({
          title: 'Error',
          subtitle: error.toString(),
          kind: 'error',
        });
      });
  }

  // the DataTable doesn't really allow server side sorting so we'll
  // hack it by fetching based on the arrow direction
  handleCustomSort(evt, sortBy) {
    const arrow = evt.target
      .closest('[aria-sort]')
      .getElementsByClassName('bx--table-sort-v2__icon')[0]
      .getAttribute('aria-label');

    let sortOrder = null;
    if (arrow.includes('ascending')) {
      sortOrder = 'asc';
    } else if (arrow.includes('descending')) {
      sortOrder = 'desc';
    } else {
      return;
    }

    this.setState(
      {
        page: 1,
        sortBy,
        sortOrder,
      },
      () => this.fetchPlayers()
    );
  }

  handlePaginationChange(event) {
    const { page, pageSize } = event;

    this.setState(
      {
        page,
        pageSize,
      },
      () => this.fetchPlayers()
    );
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
    const { players, totalPlayers } = this.props;
    const { page, pageSize, playerToEdit, showPlayerModal } = this.state;

    const headers = [
      { key: 'imageUrl', header: '', isSortable: false },
      { key: 'name', header: 'Player', isSortable: true },
      { key: 'winnings', header: 'Winnings', isSortable: true },
      { key: 'country', header: 'Native of', isSortable: true },
    ];

    return (
      <div className="player-table">
        <div className="player-table__toolbar">
          <span className="player-table__toolbar__title">
            Poker Players Table
          </span>
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
                      <TableHeader
                        {...getHeaderProps({
                          header,
                          onClick: evt =>
                            this.handleCustomSort(evt, header.key),
                        })}
                        isSortable={header.isSortable && rows.length > 0}
                        key={header.key}
                      >
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
                  {!rows.length && (
                    <TableRow>
                      <TableCell className="player-table__empty" colSpan={6}>
                        There are no poker players listed. Try adding one using
                        the button above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          rows={players}
        />
        {totalPlayers > 0 && (
          <PaginationV2
            onChange={this.handlePaginationChange}
            page={page}
            pageSize={pageSize}
            pageSizes={[10, 25, 50]}
            totalItems={totalPlayers}
          />
        )}
        {showPlayerModal && (
          <PlayerModal
            onClose={() => this.togglePlayerModal(false)}
            onSubmit={this.submitModal}
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
  totalPlayers: PropTypes.number.isRequired,
  fetchPlayersSuccess: PropTypes.func.isRequired,
  editPlayerSuccess: PropTypes.func.isRequired,
  addToast: PropTypes.func.isRequired,
};

export default connect(
  store => ({
    players: store.players.players,
    totalPlayers: store.players.total,
  }),
  dispatch => ({
    fetchPlayersSuccess: data => dispatch(fetchPlayersSuccess(data)),
    editPlayerSuccess: player => dispatch(editPlayerSuccess(player)),
    addToast: options => dispatch(addToast(options)),
  })
)(PlayerTable);
