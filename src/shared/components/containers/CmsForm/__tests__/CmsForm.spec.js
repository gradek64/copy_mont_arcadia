import testComponentHelper from 'test/unit/helpers/test-component'
import CmsForm from '../CmsForm'
import Select from '../../../common/FormComponents/Select/Select'
import Button from '../../../common/Button/Button'
import RadioButton from '../../../common/FormComponents/RadioButton/RadioButton'
import * as cmsFormContent from './cms-form-content.json'
import * as cmsFormFields from './cms-form-fields.json'

const renderComponent = testComponentHelper(CmsForm.WrappedComponent)

const cmsFormName = 'testCmsForm'
const props = {
  getCmsForm: jest.fn(),
  setFormField: jest.fn(),
  touchedFormField: jest.fn(),
  params: { cmsFormName },
  formContent: { ...cmsFormContent },
  cmsForm: { ...cmsFormFields },
  formName: 'abc',
}

describe('<CmsForm />', () => {
  it('builds form elements from CMS data', () => {
    const { wrapper } = renderComponent(props)
    const formProps = wrapper.find('Form').props()
    Object.keys(cmsFormContent.formAttributes).forEach((key) =>
      expect(formProps[key]).toBeTruthy()
    )
    expect(wrapper.find('input[type="hidden"]')).toHaveLength(
      cmsFormContent.hiddenFields.length
    )
    expect(wrapper.find('.CmsForm-fieldSet')).toHaveLength(
      cmsFormContent.fieldsets.length
    )

    function verifyFieldExists(field) {
      switch (field.type) {
        case 'select':
          expect(wrapper.find(Select)).toHaveLength(3)
          break
        case 'submit':
          expect(wrapper.find(Button)).toHaveLength(1)
          break
        case 'radio':
          expect(wrapper.find(RadioButton)).toHaveLength(2)
          break
        default:
          expect(wrapper.find(`input[name="${field.name}"]`)).toHaveLength(0)
          break
      }
    }

    cmsFormContent.fieldsets.forEach((fieldset) => {
      fieldset.fields.forEach((field) => {
        if (field.dropdowns) {
          field.dropdowns.forEach((dropdown) => {
            verifyFieldExists(dropdown)
          })
        } else {
          verifyFieldExists(field)
        }
      })
    })

    expect(wrapper.find('.CmsForm-title')).toHaveLength(1)
    expect(wrapper.find('.CmsForm-title').text()).toBe(
      cmsFormContent.miscContent.h1
    )
    expect(wrapper.find('.CmsForm-introHTML')).toHaveLength(1)
    expect(
      wrapper
        .find('.CmsForm-introHTML')
        .render()
        .text()
    ).toBe(cmsFormContent.miscContent.introHTML.html)
    expect(wrapper.find('.CmsForm-outroHTML')).toHaveLength(1)
    expect(
      wrapper
        .find('.CmsForm-outroHTML')
        .render()
        .text()
    ).toBe(cmsFormContent.miscContent.outroHTML.html)

    // Radio buttons are rendered and checked according to form model
    expect(wrapper.find(RadioButton)).toHaveLength(2)
    expect(
      wrapper
        .find(RadioButton)
        .at(0)
        .prop('label')
    ).toBe('Yes')
    expect(
      wrapper
        .find(RadioButton)
        .at(1)
        .prop('label')
    ).toBe('No')
  })
})
