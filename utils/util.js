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
  } else if (type === 'h:min:s') {
    result = hour +':'+ minute +':' + second
  } else if (type === 'MD') {
    result = month + '月' + date + '日'
  } else if (type === 'week') {
    console.log('foramteDate week : ', datetime)
    switch (datetime.toString().substr(0, 3)) {
      case 'Mon':
        result = '星期一'
        break
      case 'Tue':
        result = '星期二'
        break
      case 'Wed':
        result = '星期三'
        break
      case 'Thu':
        result = '星期四'
        break
      case 'Fri':
        result = '星期五'
        break
      case 'Sat':
        result = '星期六'
        break
      case 'Sun':
        result = '星期日'
        break
    }
    console.log(datetime.toString().substr(0, 3))
  }
  return result
}