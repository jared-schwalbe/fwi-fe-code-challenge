import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  DataTable,
  PaginationV2,
  Loading,
} from 'carbon-components-react';

import { COUNTRIES } from '../constants';
import {
  changePage,
  changePageSize,
  changeSort,
  fetchPlayers,
  createPlayer,
  editPlayer,
  deletePlayer,
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

    this.handleCustomSort = this.handleCustomSort.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.togglePlayerModal = this.togglePlayerModal.bind(this);
    this.submitModal = this.submitModal.bind(this);

    this.state = {
      playerToEdit: null,
      showPlayerModal: false,
    };
  }

  componentDidMount() {
    const { fetchPlayers } = this.props;
    fetchPlayers();
  }

  // the DataTable doesn't really allow server side sorting so we'll
  // hack it by fetching based on the arrow direction
  handleCustomSort(evt, sortBy) {
    const { changePage, changeSort, fetchPlayers } = this.props;

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

    changePage(1);
    changeSort({ sortBy, sortOrder });
    fetchPlayers();
  }

  handlePaginationChange(event) {
    const { changePage, changePageSize, fetchPlayers } = this.props;

    changePage(event.page);
    changePageSize(event.pageSize);
    fetchPlayers();
  }

  togglePlayerModal(show, player = null) {
    this.setState({
      showPlayerModal: show,
      playerToEdit: player,
    });
  }

  submitModal(player) {
    const { createPlayer, editPlayer } = this.props;
    const { playerToEdit } = this.state;

    playerToEdit ? editPlayer(player) : createPlayer(player);
  }

  render() {
    const {
      loading,
      page,
      pageSize,
      players,
      totalPlayers,
      deletePlayer,
    } = this.props;
    const { playerToEdit, showPlayerModal } = this.state;

    if (loading) {
      return <Loading />;
    }

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
                        onDelete={() => deletePlayer(row.id)}
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
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
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
  fetchPlayers: PropTypes.func.isRequired,
  createPlayer: PropTypes.func.isRequired,
  addToast: PropTypes.func.isRequired,
};

export default connect(
  store => ({
    loading: store.players.loading,
    page: store.players.page,
    pageSize: store.players.pageSize,
    sortBy: store.players.sortBy,
    sortOrder: store.players.sortOrder,
    players: store.players.players,
    totalPlayers: store.players.total,
  }),
  dispatch => ({
    changePage: page => dispatch(changePage(page)),
    changePageSize: pageSize => dispatch(changePageSize(pageSize)),
    changeSort: sort => dispatch(changeSort(sort)),
    fetchPlayers: options => dispatch(fetchPlayers(options)),
    editPlayer: player => dispatch(editPlayer(player)),
    createPlayer: player => dispatch(createPlayer(player)),
    deletePlayer: id => dispatch(deletePlayer(id)),
    addToast: options => dispatch(addToast(options)),
  })
)(PlayerTable);
