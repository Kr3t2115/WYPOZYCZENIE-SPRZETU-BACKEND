const renderTemplate = (template, data = {}) => {
    return template.replace(/{{\s*([\w.]+)\s*}}/g, (match, key) => {
        const value = getNestedValue(data, key)
        return value !== undefined ? String(value) : match
    })
}

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj)
}

export { renderTemplate }
