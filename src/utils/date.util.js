const startOfDay = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

const endOfDay = (date) => {
    const d = new Date(date)
    d.setHours(23, 59, 59, 999)
    return d
}

const addDays = (date, days) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
}

export { startOfDay, endOfDay, addDays }
