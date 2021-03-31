import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Accordion from '../Accordion/Accordion'
import Button from '../Button/Button'
import Image from '../Image/Image'
import SeoSchema from '../../common/SeoSchema/SeoSchema'
import { showModal } from '../../../actions/common/modalActions'
import {
  getTimeInMinutes,
  getEnglishDate,
  getEarliestCollectionDate,
  isValidTimeRange,
} from './date-time'
import { titleCase } from '../../../lib/string-utils'
import { getMapUrl } from '../../../lib/map'
import { isFeatureCFSIEnabled } from '../../../selectors/featureSelectors'
import { isCFSIEspotEnabled } from '../../../selectors/espotSelectors'
import { isCFSIAvailable } from '../../../selectors/fulfilmentSelectors'

@connect(
  (state, ownProps) => {
    const { storeDetails, storeLocatorType } = ownProps
    return {
      region: state.config.region,
      isMobile: state.viewport.media === 'mobile',
      brandName: state.config.brandName,
      CFSi: isFeatureCFSIEnabled(state),
      isImmediatelyAvailable: isCFSIAvailable(
        state,
        storeDetails,
        storeLocatorType
      ),
      isCFSiEspotEnabled: isCFSIEspotEnabled(state),
      logoVersion: state.config.logoVersion,
    }
  },
  { showModal }
)
class Store extends Component {
  static propTypes = {
    storeDetails: PropTypes.object.isRequired,
    onHeaderClick: PropTypes.func.isRequired,
    onSelectClick: PropTypes.func.isRequired,
    directionsFrom: PropTypes.object,
    storeLocatorType: PropTypes.string,
    region: PropTypes.string,
    selected: PropTypes.bool,
    showModal: PropTypes.func.isRequired,
    brandName: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    onCFSIClick: PropTypes.func,
    CFSi: PropTypes.bool,
    isImmediatelyAvailable: PropTypes.bool,
    isCFSiEspotEnabled: PropTypes.bool,
    logoVersion: PropTypes.string,
    parentElementRef: PropTypes.func,
  }

  static defaultProps = {
    parentElementRef: () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  onHeaderSelectButtonClick = (event) => {
    event.stopPropagation()
    this.props.onSelectClick()
  }

  getEarliestCollectionDateTime = () => {
    const { collectFromStore, brandId } = this.props.storeDetails
    const dates = []
    if (collectFromStore.express) {
      dates.push(...collectFromStore.express.dates)
    }
    if (collectFromStore.standard) {
      dates.push(...collectFromStore.standard.dates)
    }

    const earliestDate = getEarliestCollectionDate(dates)
    if (earliestDate) {
      const collectionDate = getEnglishDate(earliestDate).split(',')[0]
      const isParcelShop = brandId === 14000
      return isParcelShop
        ? `6pm ${collectionDate} (latest)`
        : `1pm ${collectionDate}`
    }
  }

  getOpeningHours(dayIndex) {
    const { openingHours } = this.props.storeDetails
    return [
      openingHours.sunday,
      openingHours.monday,
      openingHours.tuesday,
      openingHours.wednesday,
      openingHours.thursday,
      openingHours.friday,
      openingHours.saturday,
    ][dayIndex]
  }

  getDirectionsUrl() {
    const { directionsFrom, storeDetails } = this.props
    const destinationLocationParam = `${storeDetails.latitude},${
      storeDetails.longitude
    }`
    const originLocationParam = directionsFrom
      ? `${directionsFrom.latitude},${directionsFrom.longitude}`
      : ''

    return `http://maps.apple.com/?saddr=${originLocationParam}&daddr=${destinationLocationParam}`
  }

  getStoreDistance() {
    const { l } = this.context
    const {
      region,
      storeDetails: { distance },
    } = this.props

    const units = region === 'uk' ? l`miles` : l`kilometres`
    return !isNaN(distance) && distance !== 0 && `${distance} ${units}`
  }

  getIconSrc = () => {
    const { brandName, storeDetails, logoVersion } = this.props
    return storeDetails.brandName === 'Hermes'
      ? `/assets/${brandName}/images/parcelshop-marker-icon.svg?version=${logoVersion}`
      : `/assets/${brandName}/images/store-marker-icon.svg?version=${logoVersion}`
  }

  hasLocation() {
    return (
      this.props.storeDetails.latitude !== 0 ||
      this.props.storeDetails.longitude !== 0
    )
  }

  showOpeningHours = () => {
    this.props.showModal(
      <div>
        <h3 className="Store-openingHoursModalTitle">
          {this.props.storeDetails.name}
        </h3>
        {this.renderOpeningHours()}
      </div>
    )
  }

  renderOpeningHoursRow(day, openingHours) {
    if (openingHours) {
      return (
        <div key={day} className="Store-openingHoursRow">
          <span className="Store-openingHoursDay">{day}</span>
          {openingHours}
        </div>
      )
    }
  }

  renderOpeningHours() {
    const { l } = this.context
    const { openingHours } = this.props.storeDetails

    const arrWeekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

    const weekDays = arrWeekday.every(
      (day) => openingHours[day] === openingHours.friday
    )
      ? this.renderOpeningHoursRow(l`Monday to Friday`, openingHours.monday)
      : arrWeekday.map((day) =>
          this.renderOpeningHoursRow(l(day), openingHours[day])
        )

    if (openingHours.monday || openingHours.saturday || openingHours.sunday) {
      return (
        <div className="Store-openingHours Store-detailsSection">
          <h2 className="Store-openingHoursTitle">
            {this.props.isMobile ? l`Opening hours` : l`Store opening times`}
          </h2>
          {weekDays}
          {this.renderOpeningHoursRow(l`Saturday`, openingHours.saturday)}
          {this.renderOpeningHoursRow(l`Sunday`, openingHours.sunday)}
        </div>
      )
    }
  }

  getTodaysOpeningTimes(openingHoursToday, currentHours, currentMinutes) {
    if (!isValidTimeRange(openingHoursToday)) return null

    const { l } = this.context
    const [openAt, closedAt] = openingHoursToday.split('-')
    const [closedAtHours, closedAtMinutes] = closedAt.split(':')
    const [openAtHours, openAtMinutes] = openAt.split(':')

    const currentTimeInMinutes = getTimeInMinutes(currentHours, currentMinutes)
    const closedAtInMinutes = getTimeInMinutes(closedAtHours, closedAtMinutes)
    const openTimeInMinutes = getTimeInMinutes(openAtHours, openAtMinutes)

    if (currentTimeInMinutes < openTimeInMinutes) {
      // not open yet
      return [
        <span key={1} className="Store-error">{`${l`Closed now.`} `}</span>,
        <span key={2} className="Store-openAt">
          {l`Opens today at`} {openAt}
        </span>,
      ]
    } else if (currentTimeInMinutes + 60 < closedAtInMinutes) {
      // closes in > 1 hour
      return (
        <span className="Store-success">
          {l`Open today until`} {closedAt}
        </span>
      )
    } else if (currentTimeInMinutes < closedAtInMinutes) {
      // closes in < 1 hour
      return (
        <span className="Store-closingSoon">
          {l`Closing soon at`} {closedAt}
        </span>
      )
    }

    return null
  }

  renderOpenNowInfo() {
    const currentDate = new Date()
    const currentDayIndex = currentDate.getDay()
    const currentHours = currentDate.getHours()
    const currentMinutes = currentDate.getMinutes()
    const openingHoursToday = this.getOpeningHours(currentDayIndex)

    const openingTimes = this.getTodaysOpeningTimes(
      openingHoursToday,
      currentHours,
      currentMinutes
    )

    return openingTimes || this.getTomorrowOpeningTimes(currentDayIndex)
  }

  getTomorrowOpeningTimes(currentDayIndex) {
    const { l } = this.context
    // closed
    const tomorrowOpeningHours =
      this.getOpeningHours((currentDayIndex + 1) % 7) || null

    const tomorrowOpenAt = isValidTimeRange(tomorrowOpeningHours)
      ? tomorrowOpeningHours.split('-')
      : null

    return [
      tomorrowOpeningHours && (
        <span key={1} className="Store-error">{`${l`Closed today.`} `}</span>
      ),
      tomorrowOpenAt && (
        <span key={2} className="Store-openAt">
          {l`Opens tomorrow at`} {tomorrowOpenAt[0]}
        </span>
      ),
    ]
  }

  renderHeaderDetailsInfo() {
    const { storeLocatorType } = this.props
    const openNowInfo = this.renderOpenNowInfo()
    const storeLocator = {
      FIND_IN_STORE: 'findInStore',
      STORE_SEARCH: 'storeSearch',
    }

    if (storeLocatorType === storeLocator.FIND_IN_STORE) {
      return this.renderStockData()
    } else if (storeLocatorType === storeLocator.STORE_SEARCH && openNowInfo) {
      return <div className="Store-openNowInfo">{openNowInfo}</div>
    }
    return null
  }

  getCollectionTime() {
    const {
      CFSi,
      storeDetails: { collectFromStore },
      isImmediatelyAvailable,
    } = this.props

    if (CFSi && isImmediatelyAvailable) {
      return `Collect today`
    }

    const collectionDateTime =
      collectFromStore && this.getEarliestCollectionDateTime()
    return collectionDateTime && `Collect from ${collectionDateTime}`
  }

  renderStoreHeader() {
    const { l } = this.context

    const {
      storeLocatorType,
      selected,
      storeDetails: { name, brandName },
      isMobile,
      isCFSiEspotEnabled,
      onCFSIClick,
    } = this.props

    const renderAddress = !this.hasLocation() ? this.renderStoreAddress() : ''
    const storeName = `${titleCase(brandName)} ${name}`

    if (storeLocatorType === 'collectFromStore') {
      const collectionDateTime = this.getCollectionTime()

      return (
        <div className="Store-header">
          {!isMobile && (
            <Image
              className="Store-leftIcon Store-leftIcon--withHeight"
              src={this.getIconSrc()}
            />
          )}
          <div className="Store-headerDetails">
            <h2 className="Store-name">{storeName}</h2>
            {collectionDateTime && (
              <p className="Store-info">{collectionDateTime}</p>
            )}
          </div>
          <p className="Store-iconDistance">
            {isMobile && (
              <Image className="Store-rightIcon" src={this.getIconSrc()} />
            )}
            {this.getStoreDistance()}
          </p>
          {isCFSiEspotEnabled && (
            <div className="Store-selectButtonContainer">
              <Button
                isDisabled={selected}
                className="Store-headerSelectButton"
                clickHandler={this.onHeaderSelectButtonClick}
              >{l`Select`}</Button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="Store-header">
        <div className="Store-headerContainer">
          <Image
            className="Store-iconDesktop"
            src={this.getIconSrc()}
            width="20"
            height="20"
          />
          <div className="Store-distanceContainer">
            <div className="Store-distance">{this.getStoreDistance()}</div>
          </div>
        </div>
        <div className="Store-headerDetails">
          <h2 className="Store-name">{storeName}</h2>
          <div />
          {this.renderHeaderDetailsInfo()}
          {renderAddress}
        </div>

        {isCFSiEspotEnabled &&
          storeLocatorType === 'findInStore' && (
            <div
              className="Store-selectButtonContainer"
              style={{ display: 'none' }}
            >
              <Button
                isDisabled={selected}
                className="Store-headerSelectButton"
                clickHandler={onCFSIClick}
              >{l`Select`}</Button>
            </div>
          )}
      </div>
    )
  }

  renderViewMapAndTelephoneButtons() {
    const { l } = this.context
    const {
      isMobile,
      storeDetails: { telephoneNumber, latitude, longitude },
      storeLocatorType,
    } = this.props
    const mapUrl = getMapUrl()
    if (
      this.hasLocation() &&
      telephoneNumber &&
      storeLocatorType !== 'collectFromStore'
    ) {
      const text = l`Call ${telephoneNumber}`
      let detailsSectionButton

      if (isMobile) {
        switch (storeLocatorType) {
          case 'findInStore':
            detailsSectionButton = (
              <a
                href={`tel:${telephoneNumber}`}
                className="Button Button--secondary Store-button Store-mapButton Button--linkButton"
              >
                {text}
              </a>
            )
            break
          case 'storeSearch':
            detailsSectionButton = (
              <a
                href={this.getDirectionsUrl()}
                className="Button Button--secondary Store-button Store-mapButton Button--linkButton"
              >{l`Get Directions`}</a>
            )
            break
          default:
        }
      }

      return (
        <div className="Store-mapButtons Store-detailsSection">
          <a
            href={`http://${mapUrl}/?q=${latitude},${longitude}`}
            className="Button Button--secondary Store-button Store-mapButton Button--linkButton"
          >
            {l`View in maps`}
          </a>
          {detailsSectionButton}
        </div>
      )
    }
  }

  renderTelephoneNumber() {
    const { l } = this.context
    const {
      isMobile,
      storeDetails: { telephoneNumber },
      storeLocatorType,
    } = this.props

    if (telephoneNumber) {
      const text = l`Call ${telephoneNumber}`
      return (
        <div className="Store-detailsSection Store-phone">
          {storeLocatorType === 'storeSearch' && isMobile ? (
            <a
              href={`tel:${telephoneNumber}`}
              className="Button Store-button Button--linkButton"
            >
              {text}
            </a>
          ) : (storeLocatorType === 'findInStore' ||
            storeLocatorType === 'storeSearch') &&
          !isMobile ? (
            <a href={`tel:${telephoneNumber}`}>{text}</a>
          ) : (
            ''
          )}
        </div>
      )
    }
  }

  renderStockData() {
    const { l } = this.context
    const {
      storeDetails: { stock },
    } = this.props
    return (
      <p className="Store-stockInformation">
        {stock > 0 ? (
          <span className="Store-success">{l`In Stock`}</span>
        ) : (
          <span className="Store-error">{l`Not available at this store`}</span>
        )}
      </p>
    )
  }

  renderStoreAddress() {
    const {
      storeDetails: { address },
    } = this.props

    return (
      <div className="Store-address">
        {address.line1 && (
          <span className="Store-address">{address.line1}, </span>
        )}
        {address.line2 && (
          <span className="Store-address">{address.line2}, </span>
        )}
        {address.city && (
          <span className="Store-address">{address.city}, </span>
        )}
        {address.postcode && (
          <span className="Store-address">{address.postcode}</span>
        )}
      </div>
    )
  }

  renderStoreDetails() {
    const { l } = this.context
    const {
      isMobile,
      storeLocatorType,
      onSelectClick,
      onCFSIClick,
      storeDetails: { address, collectFromStore, brandId },
      CFSi,
      collectionDay,
    } = this.props
    const openingHours = this.renderOpeningHours()

    if (storeLocatorType === 'collectFromStore') {
      const earliestExpressDate =
        collectFromStore.express &&
        getEarliestCollectionDate(collectFromStore.express.dates)
      const expressCollectDate =
        earliestExpressDate && getEnglishDate(earliestExpressDate)
      const earliestStandardDate =
        collectFromStore.standard &&
        getEarliestCollectionDate(collectFromStore.standard.dates)
      const standardCollectDate =
        earliestStandardDate && getEnglishDate(earliestStandardDate)

      return (
        <div className="Store-details">
          <h3 className="Store-detailsTitle">
            {address.line1}, {address.city}, {address.postcode}
          </h3>
          {CFSi &&
            collectionDay === 'today' && (
              <p className="Store-collectFrom">
                Collect {getEnglishDate(new Date())}
              </p>
            )}
          {expressCollectDate && (
            <p className="Store-collectFrom">
              Collect from {expressCollectDate} -{' '}
              {brandId !== 14000 ? '(Express)' : ''}
            </p>
          )}
          {standardCollectDate && (
            <p className="Store-collectFrom">
              Collect from {standardCollectDate} - (Standard)
            </p>
          )}
          {isMobile ? (
            <button
              className="Store-openingTimesButton"
              onClick={this.showOpeningHours}
            >{l`Store opening times`}</button>
          ) : (
            openingHours
          )}
          <div className="Store-selectButtonContainer Store-selectButtonDetails">
            <Button clickHandler={onSelectClick}>{l`Select store`}</Button>
          </div>
        </div>
      )
    }

    const viewMapAndTelephoneButtons = this.renderViewMapAndTelephoneButtons()
    const renderTelephoneNumberButton = this.renderTelephoneNumber()
    const renderAddress = this.hasLocation() ? this.renderStoreAddress() : ''

    if (
      openingHours ||
      viewMapAndTelephoneButtons ||
      renderTelephoneNumberButton
    ) {
      const { CFSi, storeLocatorType } = this.props

      return (
        <div className="Store-details">
          {renderAddress}
          {CFSi && storeLocatorType === 'findInStore' ? (
            <div
              className="Store-selectButtonContainer Store-selectButtonDetails"
              style={{ display: 'none' }}
            >
              <Button clickHandler={onCFSIClick}>{l`Select store`}</Button>
            </div>
          ) : (
            renderTelephoneNumberButton
          )}
          {openingHours}
          {viewMapAndTelephoneButtons}
        </div>
      )
    }
  }

  render() {
    const {
      parentElementRef,
      storeDetails,
      onHeaderClick,
      selected,
      storeLocatorType,
    } = this.props

    return (
      <div
        ref={parentElementRef}
        className={`Store Store-${storeDetails.storeId} ${
          selected ? 'is-selected' : ''
        } Store--${storeLocatorType}`}
      >
        <SeoSchema type="Store" data={this.props.storeDetails} />
        <Accordion
          className="Accordion--storeLocator"
          header={this.renderStoreHeader()}
          accordionName={`store-${this.props.storeDetails.storeId}`}
          onAccordionToggle={onHeaderClick}
          noContentPadding
        >
          {storeDetails.collectFromStore && this.renderStoreDetails()}
        </Accordion>
      </div>
    )
  }
}

export default Store
