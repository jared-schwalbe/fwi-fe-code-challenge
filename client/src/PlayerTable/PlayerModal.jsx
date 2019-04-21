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
      winnings: props.player ? props.player.winnings : '',
      country: props.player ? props.player.country : '',
      imageUrl: props.player ? props.player.imageUrl : '',
      invalidValues: {},
    };
  }

  handleNameChange(name) {
    const invalidValues = Object.assign({}, this.state.invalidValues);
    if (!name) {
      invalidValues.name = 'Required';
    } else {
      delete invalidValues.name;
    }

    this.setState({
      name,
      invalidValues,
    });
  }

  handleWinningsChange(winnings) {
    const invalidValues = Object.assign({}, this.state.invalidValues);
    if (!winnings) {
      invalidValues.winnings = 'Required';
    } else if (isNaN(winnings)) {
      invalidValues.winnings = 'Invalid number';
    } else {
      delete invalidValues.winnings;
    }

    this.setState({
      winnings,
      invalidValues,
    });
  }

  handleCountryChange(country) {
    const invalidValues = Object.assign({}, this.state.invalidValues);
    if (!country) {
      invalidValues.country = 'Required';
    } else {
      delete invalidValues.country;
    }

    this.setState({
      country: country ? country.code : '',
      invalidValues,
    });
  }

  submitAndClose() {
    const { onClose, onSubmit, player } = this.props;
    const { name, winnings, country, imageUrl } = this.state;

    onSubmit({
      id: player ? player.id : -1,
      winnings: Number(winnings),
      name,
      country,
      imageUrl,
    });
    onClose();
  }

  render() {
    const { onClose, player } = this.props;
    const { name, winnings, country, imageUrl, invalidValues } = this.state;

    return (
      <Modal
        className="player-modal"
        modalHeading={player ? 'Edit Player' : 'New Player'}
        onRequestClose={onClose}
        onRequestSubmit={this.submitAndClose}
        open={true}
        primaryButtonDisabled={Object.keys(invalidValues).length > 0}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
      >
        <div className="input-wrapper row">
          <TextInput
            className="player-modal__name"
            id="name"
            invalid={Boolean(invalidValues.name)}
            invalidText={invalidValues.name}
            labelText="Name"
            onChange={e => this.handleNameChange(e.target.value)}
            value={name}
          />
          <TextInput
            className="player-modal__winnings"
            id="winnings"
            invalid={Boolean(invalidValues.winnings)}
            invalidText={invalidValues.winnings}
            labelText="Winnings"
            onChange={e => this.handleWinningsChange(e.target.value)}
            value={winnings}
          />
        </div>
        <div className="input-wrapper">
          <FormLabel>Country</FormLabel>
          <ComboBox
            className="player-modal__country"
            initialSelectedItem={this.countryItems.find(
              c => c.code === country
            )}
            invalid={Boolean(invalidValues.country)}
            invalidText={invalidValues.country}
            items={this.countryItems}
            itemToString={item => (item && item.name ? item.name : '')}
            placeholder="Filter..."
            onChange={e => this.handleCountryChange(e.selectedItem)}
            shouldFilterItem={e => e.item.name.includes(e.inputValue)}
          />
        </div>
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
