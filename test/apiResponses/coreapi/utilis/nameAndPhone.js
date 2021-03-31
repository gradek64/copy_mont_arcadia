import randomstring from 'randomstring'

const randomName = () =>
  randomstring
    .generate({
      length: 6,
      charset: `alphabetic`,
    })
    .toLowerCase()

const randomPhone = () =>
  `07${randomstring.generate({
    length: 8,
    charset: `numeric`,
  })}`

const nameAndPhone = ({ title, firstName, lastName, telephone } = {}) => ({
  title: title || 'Mr',
  firstName: firstName || randomName(),
  lastName: lastName || randomName(),
  telephone: telephone || randomPhone(),
})

export default nameAndPhone
