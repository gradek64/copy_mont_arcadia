import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import Input from '../../common/FormComponents/Input/Input'
import Select from '../../common/FormComponents/Select/Select'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'
import RadioButton from '../../common/FormComponents/RadioButton/RadioButton'
import Button from '../../common/Button/Button'
import ButtonLink from '../../common/ButtonLink/ButtonLink'
import Message from '../../common/FormComponents/Message/Message'
import UiProgressTracker from './UiProgressTracker'
import Swatches from '../../common/Swatches/SwatchesPrivate'
import Accordion from '../../common/Accordion/Accordion'

// Inline styles are used here so the CSS is not included in the webpack CSS file

const Separator = ({ large }) => (
  <hr style={{ display: 'block', margin: `${large ? 30 : 15}px 0` }} />
)

const brandImagePath = {
  burton: 'https://media.burton.co.uk/wcsstore/Burton',
  dorothyperkins: 'https://media.dorothyperkins.com/wcsstore/DorothyPerkins',
  evans: 'https://media.evans.co.uk/wcsstore/Evans',
  missselfridge: 'https://media.missselfridge.com/wcsstore/MissSelfridge',
  topman: 'https://media.topman.com/wcsstore/TopMan',
  topshop: 'https://media.topshop.com/wcsstore/TopShop',
  wallis: 'https://media.wallis.co.uk/wcsstore/Wallis',
}

const constructSwatch = (brandName, colour) => ({
  imageUrl: `${brandImagePath[brandName]}/images/catalog/swatch/${colour}.jpg`,
  swatchProduct: {
    grouping: 'foo',
  },
})

@connect((state) => ({
  brandName: state.config.brandName,
}))
class UI extends Component {
  render() {
    const { brandName } = this.props
    const swatchColours = [
      'ffffff',
      '1f2c47',
      '297aa3',
      '525f7a',
      '521429',
      'cc0000',
      'd6cfc2',
    ]
    const swatches = swatchColours.map(constructSwatch.bind(null, brandName)) // eslint-disable-line react/jsx-no-bind

    return (
      <div className="UI">
        <Helmet meta={[{ name: 'robots', content: 'noindex' }]} />
        <h1>H1 title example</h1>
        <h2>h2 title example</h2>
        <h3>h3 title example</h3>
        <h4>h4 title example</h4>
        <h5>h5 title example</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <Separator />

        <h2>Buttons</h2>

        <Separator />

        <ButtonLink>Button link</ButtonLink>

        <Button className="Button">Button primary</Button>
        <br />
        <Button className="Button" isDisabled>
          Button primary disabled
        </Button>

        <Separator />

        <Button className="Button Button--secondary">Button secondary</Button>
        <br />
        <Button className="Button Button--secondary" isDisabled>
          Button secondary disabled
        </Button>

        <Separator />

        <Button className="Button Button--tertiary">Button tertiary</Button>
        <br />
        <Button className="Button Button--tertiary" isDisabled>
          Button tertiary disabled
        </Button>

        <Separator />

        <div style={{ display: 'flex', flexRow: 'row wrap' }}>
          <Button className="Button Button--halfWidth">Button</Button>
          <Button className="Button Button--halfWidth" isDisabled>
            Button disabled
          </Button>
        </div>

        <Separator />

        <div style={{ display: 'flex', flexRow: 'row wrap' }}>
          <Button className="Button Button--secondary Button--halfWidth">
            Button secondary
          </Button>
          <Button
            className="Button Button--secondary Button--halfWidth"
            isDisabled
          >
            Button secondary disabled
          </Button>
        </div>

        <Separator />

        <div style={{ display: 'flex', flexRow: 'row wrap' }}>
          <Button className="Button Button--tertiary Button--halfWidth">
            Button tertiary
          </Button>
          <Button
            className="Button Button--tertiary Button--halfWidth"
            isDisabled
          >
            Button tertiary disabled
          </Button>
        </div>

        <Separator />

        <h2>Forms</h2>

        <Separator />

        <Input
          field={{}}
          type="text"
          errors={{}}
          name="test"
          label={'Input Label'}
          placeholder="Example will stay untouched"
          setField={() => () => {}}
          touchedField={() => () => {}}
        />
        <Input
          field={{ isTouched: true }}
          type="text"
          errors={{}}
          name="test"
          label={'Input touched'}
          placeholder="Placeholder"
          setField={() => () => {}}
          touchedField={() => () => {}}
        />
        <Input
          field={{ isTouched: true, value: 'success' }}
          type="text"
          errors={{}}
          name="errorEx"
          label={'Input success'}
          placeholder="Placeholder"
          setField={() => () => {}}
          touchedField={() => () => {}}
        />
        <Input
          field={{ isTouched: true }}
          type="text"
          errors={{ errorEx: 'An error message' }}
          name="errorEx"
          label={'Input error'}
          placeholder="Placeholder"
          setField={() => () => {}}
          touchedField={() => () => {}}
        />
        <Input
          field={{}}
          type="text"
          errors={{}}
          name="test"
          label={'Input Label Disabled'}
          placeholder="Placeholder"
          setField={() => () => {}}
          touchedField={() => () => {}}
          isDisabled
        />
        <Input
          field={{}}
          name="test"
          type="password"
          errors={{}}
          label={'Password'}
          placeholder="***************"
          setField={() => () => {}}
          touchedField={() => () => {}}
        />

        <Separator large />

        <Select
          firstDisabled="Select a value"
          label={'Select label'}
          options={['Catalog', 'Team', 'Is', 'The', 'Best', 'Team']}
          name="select"
          value={''}
          onChange={() => {}}
        />

        <Select
          label={'Select label'}
          options={['Catalog', 'Team', 'Is', 'The', 'Best', 'Team']}
          name="select"
          value={''}
          onChange={() => {}}
        />

        <Select
          firstDisabled="Select a value"
          label={'Select error'}
          options={['Catalog', 'Team', 'Is', 'The', 'Best', 'Team']}
          name="selectError"
          errors={{ selectError: 'Select error' }}
          field={{ isTouched: true }}
          value={''}
          onChange={() => {}}
        />

        <Select
          label={'Select disabled'}
          options={['Catalog', 'Team', 'Is', 'The', 'Best', 'Team']}
          name="select"
          value={''}
          onChange={() => {}}
          isDisabled
        />

        <Separator large />

        <Checkbox
          checked={{ value: true }}
          label={'Radio label'}
          name={''}
          onChange={() => {}}
        >
          Checkbox checked
        </Checkbox>

        <Checkbox
          checked={{ value: false }}
          label={'Radio label'}
          name={''}
          onChange={() => {}}
        >
          Checkbox unchecked
        </Checkbox>

        <Checkbox
          checked={{ value: false }}
          label={'Radio label'}
          name={''}
          onChange={() => {}}
          isDisabled
        >
          Checkbox disabled with a very very long label that appears on multiple
          lines.
        </Checkbox>

        <Checkbox
          checked={{ value: false }}
          label={'Radio label'}
          name="checkboxError"
          onChange={() => {}}
          field={{ isTouched: true }}
          errors={{ checkboxError: 'There has been an error' }}
        >
          Checkbox error
        </Checkbox>

        <Separator />

        <RadioButton
          checked
          label={'Radio label'}
          name={''}
          onChange={() => {}}
        />

        <RadioButton
          checked={false}
          label={'Radio label'}
          name={''}
          onChange={() => {}}
        />

        <RadioButton
          checked={false}
          label={'Radio label'}
          name={''}
          onChange={() => {}}
          isDisabled
        />

        <Separator large />

        <Message message={'Message normal'} type={'normal'} />

        <Message message={'Message error'} type={'error'} />

        <Message message={'Message success'} type={'confirm'} />

        <Separator large />

        <UiProgressTracker />

        <Separator large />

        <h2 id="swatches">Swatches</h2>

        <h3>Showing all</h3>
        <Swatches
          swatches={swatches}
          maxSwatches={swatches.length}
          productId={28389340}
        />

        <h3>Paginated</h3>
        <Swatches swatches={swatches} maxSwatches={4} productId={28371551} />

        <Separator large />

        <h2 id="accordions">Accordions</h2>

        <h3>Primary</h3>
        <Accordion
          accordionName="primary-left"
          header="Primary arrow, left-aligned"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            scelerisque lacus sed tortor tristique aliquet. Maecenas luctus
            velit rutrum nunc elementum eleifend. Phasellus nunc ligula,
            fermentum et varius ac, molestie et sapien.
          </p>
        </Accordion>
        <Accordion
          accordionName="primary-right"
          header="Primary arrow, right-aligned"
          arrowPosition="right"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            scelerisque lacus sed tortor tristique aliquet. Maecenas luctus
            velit rutrum nunc elementum eleifend. Phasellus nunc ligula,
            fermentum et varius ac, molestie et sapien.
          </p>
        </Accordion>

        <h3>Secondary</h3>
        <Accordion
          accordionName="secondary-left"
          header="Secondary  arrow, left-aligned"
          arrowStyle="secondary"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            scelerisque lacus sed tortor tristique aliquet. Maecenas luctus
            velit rutrum nunc elementum eleifend. Phasellus nunc ligula,
            fermentum et varius ac, molestie et sapien.
          </p>
        </Accordion>
        <Accordion
          accordionName="secondary-right"
          header="Secondary arrow, right-aligned"
          arrowStyle="secondary"
          arrowPosition="right"
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            scelerisque lacus sed tortor tristique aliquet. Maecenas luctus
            velit rutrum nunc elementum eleifend. Phasellus nunc ligula,
            fermentum et varius ac, molestie et sapien.
          </p>
        </Accordion>
      </div>
    )
  }
}

export default UI
