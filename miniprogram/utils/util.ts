export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

export const addTraveler = (  travelers: Traveler[], newTraveler: Traveler )=>{
  const existingIndex = travelers.findIndex(t => t.idCard === newTraveler.idCard)
  travelers =  existingIndex > -1 
  ? [
      ...travelers.slice(0, existingIndex),
      newTraveler,
      ...travelers.slice(existingIndex + 1)
    ]
  : [...travelers, newTraveler]
  
}


const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
