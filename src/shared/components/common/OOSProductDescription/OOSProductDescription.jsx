import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Accordion from '../../common/Accordion/Accordion'
import { heDecode } from '../../../lib/html-entities'

const OOSProductDescription = ({ description, header }) => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)
  const onAccordionToggle = () => setIsAccordionExpanded(!isAccordionExpanded)

  return (
    <Accordion
      expanded={isAccordionExpanded}
      header={header}
      className="OOSProductDescription"
      accordionName="productDescription"
      onAccordionToggle={onAccordionToggle}
    >
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: heDecode(description) }}
      />
    </Accordion>
  )
}

OOSProductDescription.propTypes = {
  description: PropTypes.string.isRequired,
  header: PropTypes.string.isRequired,
}

export default OOSProductDescription
