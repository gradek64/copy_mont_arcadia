export default function extractCategoryTitle(title) {
  if (!title) return ''
  return title.split('|')[0].trim()
}
