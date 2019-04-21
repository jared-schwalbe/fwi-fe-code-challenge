import React from 'react';
import PropTypes from 'prop-types';
import Flags from 'react-world-flags';
import { DataTable, Icon } from 'carbon-components-react';
import { iconEdit, iconDelete } from 'carbon-icons';

import Avatar from '../Avatar';

const { TableRow, TableCell } = DataTable;

const PlayerTableRow = ({ cells, onEdit, onDelete }) => {
  const tableCells = cells.map(cell => {
    let content;
    switch (cell.info.header) {
      case 'imageUrl':
        content = <Avatar src={cell.value} />;
        break;
      case 'winnings':
        content = cell.value.toLocaleString(undefined, {
          style: 'currency',
          currency: 'USD',
        });
        break;
      case 'country':
        content = (
          <div className="country">
            <Avatar>
              <Flags code={cell.value} alt="" />
            </Avatar>
            {cell.value}
          </div>
        );
        break;
      default:
        content = cell.value;
    }
    return <TableCell key={cell.id}>{content}</TableCell>;
  });

  return (
    <TableRow className="player-table-row">
      {tableCells}
      <TableCell key="edit">
        <Icon
          className="action-icon"
          description="Edit Player"
          icon={iconEdit}
          onClick={onEdit}
          role="button"
        />
      </TableCell>
      <TableCell key="delete">
        <Icon
          className="action-icon"
          description="Delete Player"
          icon={iconDelete}
          onClick={onDelete}
          role="button"
        />
      </TableCell>
    </TableRow>
  );
};

PlayerTableRow.propTypes = {
  cells: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      info: PropTypes.shape({
        header: PropTypes.string.isRequired,
      }).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PlayerTableRow;
