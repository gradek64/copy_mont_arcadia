import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { isEmpty } from 'ramda'
import { setFormField } from '../../../actions/common/formActions'
import {
  resetPredictions,
  setSelectedPlace,
  fetchAutocomplete,
  setUserLocatorPending,
  onGetCurrentPositionSuccess,
  resetSearchTerm,
  resetSelectedPlace,
  setUserInputGeoLocation,
  setGetCurrentLocationError,
  clearGeolocationError,
} from '../../../actions/components/UserLocatorActions'
import storeLocatorConsts from '../../../constants/storeLocator'
import Button from '../Button/Button'
import { isFeatureStoreLocatorGpsEnabled } from '../../../selectors/featureSelectors'
import {
  getGeoLocationError,
  getSelectedPlaceId,
  getUserInputGeoLocation,
  getPredictionDescription,
} from '../../../selectors/userLocatorSelectors'
import { getCountry } from '../../../selectors/configSelectors'
import Loader from './../Loader/Loader'
import keys from '../../../constants/keyboardKeys'

@connect(
  (state) => ({
    pending: state.userLocator.pending,
    selectedPlaceId: getSelectedPlaceId(state),
    predictions: state.userLocator.predictions,
    userLocatorSearch: state.forms.userLocator.fields.userLocation.value,
    isFeatureStoreLocatorGpsEnabled: isFeatureStoreLocatorGpsEnabled(state),
    country: getCountry(state),
    geoLocationError: getGeoLocationError(state),
    userInputGeoLocation: getUserInputGeoLocation(state),
    selectedPlaceDetails: state.userLocator.selectedPlaceDetails,
    getPrediction: getPredictionDescription(state),
  }),
  {
    setFormField,
    resetPredictions,
    setSelectedPlace,
    fetchAutocomplete,
    setUserLocatorPending,
    onGetCurrentPositionSuccess,
    resetSearchTerm,
    resetSelectedPlace,
    setUserInputGeoLocation,
    setGetCurrentLocationError,
    clearGeolocationError,
  }
)
class UserLocatorInput extends Component {
  static propTypes = {
    fetchAutocomplete: PropTypes.func,
    onGetCurrentPositionSuccess: PropTypes.func,
    pending: PropTypes.bool,
    predictions: PropTypes.array,
    resetPredictions: PropTypes.func,
    resetSearchTerm: PropTypes.func,
    resetSelectedPlace: PropTypes.func,
    selectedCountry: PropTypes.string,
    selectedPlaceId: PropTypes.object,
    setFormField: PropTypes.func,
    setSelectedPlace: PropTypes.func,
    setUserLocatorPending: PropTypes.func,
    submitAlwaysEnabled: PropTypes.bool,
    userLocatorSearch: PropTypes.string,
    userInputGeoLocation: PropTypes.bool,
    isFeatureStoreLocatorGpsEnabled: PropTypes.bool,
    country: PropTypes.string,
    geoLocationError: PropTypes.any,
    setGetCurrentLocationError: PropTypes.func,
    clearGeolocationError: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    passPlaceDescriptionToStoreFinder: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedItemIndex: 0, //  used to control the dropdown populated by the search results
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.predictions.length && !this.props.predictions.length) {
      document.addEventListener('click', this.onDocumentClick)
    } else if (!nextProps.predictions.length) {
      document.removeEventListener('click', this.onDocumentClick)
    }
    if (nextProps.predictions !== this.props.predictions)
      this.setState({ selectedItemIndex: 0 })
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
  }

  handleKeyDown = (e) => {
    const { predictions } = this.props
    const { selectedItemIndex } = this.state
    if (e.keyCode === keys.UP) {
      if (selectedItemIndex > 0) {
        this.setState((prevState) => ({
          selectedItemIndex: prevState.selectedItemIndex - 1,
        }))
      } else if (selectedItemIndex === 0) {
        this.setState({ selectedItemIndex: predictions.length - 1 })
      }
    } else if (e.keyCode === keys.DOWN) {
      if (selectedItemIndex < predictions.length - 1) {
        this.setState((prevState) => ({
          selectedItemIndex: prevState.selectedItemIndex + 1,
        }))
      } else if (selectedItemIndex === predictions.length - 1) {
        this.setState({ selectedItemIndex: 0 })
      }
    } else if (e.keyCode === keys.ENTER && predictions.length > 0) {
      this.setUserSelectedPlace(predictions[selectedItemIndex])
    }
  }

  onDocumentClick = () => {
    this.props.resetPredictions()
    document.removeEventListener('click', this.onDocumentClick)
    this.setState({ selectedItemIndex: 0 })
  }

  onGetCurrentPositionError = (err) => {
    if (this.input) this.input.focus()
    this.props.setGetCurrentLocationError(err.code)
    this.props.setUserLocatorPending(false)
  }

  getCurrentLocation = (e) => {
    e.preventDefault()
    if (window.navigator.geolocation) {
      this.props.clearGeolocationError()
      this.props.setUserLocatorPending(true)
      window.navigator.geolocation.getCurrentPosition(
        (coords) => {
          this.props.onGetCurrentPositionSuccess(coords)
        },
        (err) => this.onGetCurrentPositionError(err)
      )
    }
  }

  checkGpsLocationEnabled = () => {
    const {
      isFeatureStoreLocatorGpsEnabled,
      country,
      selectedCountry,
    } = this.props

    // selectedCountry is defaulted as a propType United Kingdom
    return !!isFeatureStoreLocatorGpsEnabled && selectedCountry === country
  }

  disableGoButton = () => {
    const {
      submitAlwaysEnabled,
      selectedPlaceId,
      userInputGeoLocation,
      selectedPlaceDetails,
    } = this.props
    if (userInputGeoLocation) {
      return false
    }
    return (
      (!submitAlwaysEnabled && !selectedPlaceId) || !selectedPlaceDetails.key
    )
  }

  setUserSelectedPlace = (place) => {
    const { resetPredictions, setSelectedPlace, setFormField } = this.props
    resetPredictions()
    setSelectedPlace(place)
    setFormField(
      'userLocator',
      'userLocation',
      place.description || place.formatted_address
    )
  }

  focusAndClearLocationInput = (userInputGeoLocation) => {
    if (this.input) this.input.focus()
    if (userInputGeoLocation) {
      this.clearSearchField()
    }
  }

  autoComplete = (e) => {
    const {
      resetSelectedPlace,
      setFormField,
      geoLocationError,
      clearGeolocationError,
    } = this.props

    if (geoLocationError && !isEmpty(geoLocationError)) clearGeolocationError()

    let searchValue = e.target.value
    if (storeLocatorConsts.ukPostCodeRegEx.test(searchValue)) {
      searchValue = searchValue.toUpperCase()
    }
    resetSelectedPlace()
    setFormField('userLocator', 'userLocation', searchValue)
    this.debouncedFetchAutocomplete(searchValue)
  }

  debouncedFetchAutocomplete = debounce((searchValue) => {
    this.props.fetchAutocomplete(searchValue)
  }, 300)

  clearSearchField = (e) => {
    const {
      setFormField,
      resetPredictions,
      resetSearchTerm,
      resetSelectedPlace,
      setUserInputGeoLocation,
    } = this.props
    if (e) e.preventDefault()
    setFormField('userLocator', 'userLocation', '')
    setUserInputGeoLocation(false)
    resetPredictions()
    resetSearchTerm()
    resetSelectedPlace()
  }

  render() {
    const { l } = this.context
    const {
      pending,
      predictions,
      selectedCountry,
      userLocatorSearch,
      userInputGeoLocation,
      geoLocationError,
      submitHandler,
    } = this.props
    const { selectedItemIndex } = this.state
    const isPredictionsListOpen = predictions.length
      ? ' is-predictionsListOpen'
      : ''
    const showInput = selectedCountry === storeLocatorConsts.defaultCountry
    const label = l`Enter town/postcode`
    return (
      <div className="UserLocatorInput">
        <div
          className={`UserLocatorInput-inputContainer${
            showInput ? ' is-visible' : ''
          }${isPredictionsListOpen}`}
        >
          <div className="UserLocatorInput-queryInput">
            <label className="screen-reader-text" htmlFor="UserLocatorInput">
              {label}
            </label>
            <input
              id="UserLocatorInput"
              ref={(input) => {
                this.input = input
              }}
              className={`
                UserLocatorInput-inputField
                ${this.checkGpsLocationEnabled() ? 'is-enabled' : ''}
              `}
              type="search"
              name="searchTerm"
              value={userLocatorSearch}
              onClick={() =>
                this.focusAndClearLocationInput(userInputGeoLocation)
              }
              onKeyDown={this.handleKeyDown}
              placeholder={label}
              onChange={this.autoComplete}
              autoComplete="off"
            />
            <div
              className={`
                UserLocatorInput-suffix
                ${userLocatorSearch ? 'has-text' : ''}
                ${this.checkGpsLocationEnabled() ? 'is-enabled' : ''}
              `}
            >
              {userLocatorSearch && (
                <button
                  title={l`Clear`}
                  type="button"
                  className={`
                    UserLocatorInput-rightIcon
                    UserLocatorInput-clearButton
                    ${this.checkGpsLocationEnabled() ? 'is-enabled' : ''}
                  `}
                  onClick={this.clearSearchField}
                >
                  <span className="screen-reader-text">{l`Clear`}</span>
                </button>
              )}
              {this.checkGpsLocationEnabled() && (
                <button
                  title={l`Get my current location`}
                  type="button"
                  className={`
                    UserLocatorInput-rightIcon
                    UserLocatorInput-currentLocationButton
                    ${pending ? 'is-pending' : ''}
                    ${userInputGeoLocation ? 'is-located' : ''}
                  `}
                  onClick={this.getCurrentLocation}
                >
                  {pending && (
                    <Loader isInInput className={'UserLocatorInput-loader'} />
                  )}
                  <span className="screen-reader-text">{l`Get my current location`}</span>
                </button>
              )}
            </div>
          </div>
          <Button
            title={l`Go`}
            type="submit"
            className="UserLocator-goButton"
            isDisabled={this.disableGoButton()}
          >
            {l`Go`}
          </Button>
          {predictions.length > 0 && (
            <ul className="UserLocatorInput-predictionsList">
              {predictions.map((prediction, i) => (
                <li
                  role="presentation"
                  key={prediction.key}
                  className={`UserLocatorInput-predictionsListItem ${
                    selectedItemIndex !== i
                      ? 'UserLocatorInput-inActive'
                      : 'UserLocatorInput-active'
                  }`}
                  onClick={(event) => {
                    this.setUserSelectedPlace(prediction)
                    submitHandler(event)
                  }}
                >
                  {prediction.description}
                </li>
              ))}
            </ul>
          )}
        </div>
        {geoLocationError && (
          <div className="UserLocator-error">
            <p>{geoLocationError}</p>
            <span className="screen-reader-text">{geoLocationError}</span>
          </div>
        )}
      </div>
    )
  }
}

export default UserLocatorInput
