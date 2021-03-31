import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import { PrivacyGuard } from '../privacy-guard'

describe('<PrivacyGuard/>', () => {
  const renderComponent = testComponentHelper(PrivacyGuard)

  describe('@renders', () => {
    it('with select', () => {
      expect(
        renderComponent({
          children: (
            <select>
              <option>option 1</option>
              <option>option 2</option>
            </select>
          ),
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with textarea', () => {
      expect(
        renderComponent({
          children: <textarea>Some mocked word to test.</textarea>,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with text field', () => {
      expect(
        renderComponent({
          children: (
            <input type="text" value="mockedValue" placeholder="test" />
          ),
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with password', () => {
      expect(
        renderComponent({
          children: (
            <input type="password" value="mockedValue" placeholder="test" />
          ),
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with empty div child', () => {
      expect(
        renderComponent({
          children: <div className="test" />,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with div child and text', () => {
      expect(
        renderComponent({
          children: <div className="test divTest">someText</div>,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with span child and number', () => {
      expect(
        renderComponent({
          children: <span className="test spanTest">123</span>,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with text showing a variable', () => {
      const testVar = 'test123'
      expect(
        renderComponent({
          children: (
            <div>
              {' '}
              {testVar} {` ${testVar}`}
            </div>
          ),
        }).getTree()
      ).toMatchSnapshot()
    })
    it('without className', () => {
      expect(
        renderComponent({
          children: <span>some description</span>,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('without protection', () => {
      expect(
        renderComponent({
          children: <div className="test divTest">someText</div>,
          noProtection: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('throws for not having any child', () => {
      expect(() => {
        renderComponent()
      }).toThrowErrorMatchingSnapshot()
    })
    it('throws for not having a text as child', () => {
      expect(() => {
        renderComponent({
          children: 'test',
        })
      }).toThrowErrorMatchingSnapshot()
    })
    it('throws for having children', () => {
      expect(() => {
        renderComponent({
          children: [<div key={1} />, <div key={2} />],
        })
      }).toThrowErrorMatchingSnapshot()
    })
    it('throws for multiple nested children (outer html, must be the most inner)', () => {
      expect(() => {
        renderComponent({
          children: (
            <div>
              <span />
            </div>
          ),
        })
      }).toThrowErrorMatchingSnapshot()
    })
  })
})
