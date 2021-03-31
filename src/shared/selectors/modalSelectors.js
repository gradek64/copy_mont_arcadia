import { pathOr } from 'ramda'

const isModalOpen = (state) => pathOr(false, ['modal', 'open'], state)

const modalMode = (state) => pathOr('', ['modal', 'mode'], state)

export { isModalOpen, modalMode }
