function getDateTime(){
    const d = new Date()
    const dt = d.getDate() + '-' + d.getMonth() + "-" + d.getFullYear() + " " + + d.getHours() + ':' + d.getMinutes() + ':' +d.getSeconds()
    return dt
}

module.exports = {getDateTime}