import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, TextInput, ComboBox, FormLabel } from 'carbon-components-react';

import './PlayerModal.scss';
import { COUNTRIES } from '../constants';

class PlayerModal extends PureComponent {
  constructor(props) {
    super(props);

    const countryItems = [];
    for (let cc in COUNTRIES) {
      countryItems.push({
        code: cc,
        name: COUNTRIES[cc],
      });
    }
    this.countryItems = countryItems;

    this.submitAndClose = this.submitAndClose.bind(this);

    this.state = {
      name: props.player ? props.player.name : '',
      winnings: props.player ? props.player.winnings : 0,
      country: props.player ? props.player.country : '',
      imageUrl: props.player ? props.player.imageUrl : '',
    };
  }

  submitAndClose() {
    const { onClose, onSubmit, player } = this.props;

    const playerToSubmit = { ...this.state };
    if (player) {
      playerToSubmit.id = player.id;
    }

    onSubmit(playerToSubmit);
    onClose();
  }

  render() {
    const { onClose, player } = this.props;
    const { name, winnings, country, imageUrl } = this.state;

    return (
      <Modal
        className="player-modal"
        modalHeading={player ? 'Edit Player' : 'New Player'}
        onRequestClose={onClose}
        onRequestSubmit={this.submitAndClose}
        open={true}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
      >
        <div className="wrapper">
          <TextInput
            className="player-modal__name"
            id="name"
            labelText="Name"
            onChange={e => this.setState({ name: e.target.value })}
            value={name}
          />
          <TextInput
            className="player-modal__winnings"
            id="winnings"
            labelText="Winnings"
            onChange={e => this.setState({ winnings: e.target.value })}
            value={winnings}
          />
        </div>
        <FormLabel>Country</FormLabel>
        <ComboBox
          className="player-modal__country"
          initialSelectedItem={this.countryItems.find(
            item => item.code === country
          )}
          items={this.countryItems}
          itemToString={item => (item && item.name ? item.name : '')}
          placeholder="Filter..."
          onChange={e => this.setState({ country: e.selectedItem.code })}
          shouldFilterItem={e => e.item.name.includes(e.inputValue)}
        />
        <TextInput
          className="player-modal__image-url"
          id="winnings"
          labelText="Image URL"
          onChange={e => this.setState({ imageUrl: e.target.value })}
          value={imageUrl}
        />
      </Modal>
    );
  }
}

PlayerModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    country: PropTypes.oneOf(Object.keys(COUNTRIES)),
    winnings: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),
};

export default PlayerModal;
