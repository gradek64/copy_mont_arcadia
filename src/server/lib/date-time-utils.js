import moment from 'moment-timezone'

export function isDayLightSaving() {
  const nowUTC = new Date()
  const nowUTCHours = nowUTC.getUTCHours()
  const nowUTCHoursWithDaylightSaving = moment(nowUTC)
    .tz('Europe/London')
    .format('HH')

  return !!(nowUTCHours - nowUTCHoursWithDaylightSaving)
}
