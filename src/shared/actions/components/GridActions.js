import * as swatchesActions from '../common/swatchesActions'
import { analyticsPlpClickEvent } from '../../analytics/tracking/site-interactions'

function setGrid(columns) {
  return (dispatch) => {
    analyticsPlpClickEvent(`setgrid-${columns}`)
    dispatch({
      type: 'SET_GRID_LAYOUT',
      columns,
    })
  }
}

export function setGridLayout(grid) {
  return (dispatch) => {
    dispatch(setGrid(grid))
    dispatch(swatchesActions.resetSwatchesPage())
  }
}
