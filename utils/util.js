export const formateDate = (datetime, type) => {
  const year = datetime.getFullYear()
  const month = ('0' + (datetime.getMonth() + 1)).slice(-2)
  const date = ('0' + datetime.getDate()).slice(-2)
  const hour = ('0' + datetime.getHours()).slice(-2)
  const minute = ('0' + datetime.getMinutes()).slice(-2)
  const second = ('0' + datetime.getSeconds()).slice(-2)
  let result = ''
  if (type === 'Y-M-D h:min:s') {
    result = year + '-'+ month +'-'+ date +' '+ hour +':'+ minute +':' + second
  } else if (type === 'Y-M-D') {
    result = year + '-'+ month +'-'+ date
  } if (type === 'h:min:s') {
    result = hour +':'+ minute +':' + second
  }
  return result
}