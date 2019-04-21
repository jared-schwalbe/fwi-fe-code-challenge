import React from 'react';
import PropTypes from 'prop-types';
import Flags from 'react-world-flags';
import { Icon } from 'carbon-components-react';
import { iconEdit, iconDelete } from 'carbon-icons';

import Avatar from '../Avatar';
import { COUNTRIES } from '../constants';

const TableBody = ({ players, editPlayer, deletePlayer }) => {
  return (
    <table
      id="player-table-body"
      role="presentation"
      className="table table--body"
    >
      <tbody>
        {players.map(player => {
          const { id, name, country, winnings, imageUrl } = player;
          return (
            <tr key={id} role="row" className="table__row">
              <td role="gridcell" className="table__avatar">
                <Avatar src={imageUrl} />
              </td>
              <td role="gridcell" className="table__player">
                {name}
              </td>
              <td role="gridcell" className="table__winnings">
                {winnings.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'USD',
                })}
              </td>
              <td role="gridcell" className="table__native">
                <div className="country">
                  <Avatar>
                    <Flags code={country} alt="" />
                  </Avatar>
                  {country}
                </div>
              </td>
              <td role="gridcell" className="table__edit">
                <Icon
                  className="action-icon"
                  description="Edit Player"
                  icon={iconEdit}
                  onClick={() => editPlayer(player)}
                  role="button"
                />
              </td>
              <td role="gridcell" className="table__delete">
                <Icon
                  className="action-icon"
                  description="Delete Player"
                  icon={iconDelete}
                  onClick={() => deletePlayer(id)}
                  role="button"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

TableBody.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      country: PropTypes.oneOf(Object.keys(COUNTRIES)),
      winnings: PropTypes.number.isRequired,
      imageUrl: PropTypes.string.isRequired,
    })
  ).isRequired,
  editPlayer: PropTypes.func.isRequired,
  deletePlayer: PropTypes.func.isRequired,
};

export default TableBody;
