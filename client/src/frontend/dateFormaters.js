function todayDate_DatePicker(noTime) {
    var d = new Date(),
        month = addZero(d.getMonth() + 1),
        day = addZero(d.getDate()),
        year = d.getFullYear(),
        hour = addZero(d.getHours()),
        minute = addZero(d.getMinutes());
    if (noTime) {
        return [year, month, day].join('-');
    } else {
        return [year, month, day].join('-') + 'T' + hour + ':' + minute;
    }

}

const dateTimeFormatter_DatePicker = (date) => {
    let arr = date ? date.slice(0, -8) : ''
    return arr;
}

const dateFormatter_DatePicker = (inputDate) => {
    var d = new Date(inputDate),
        month = addZero(d.getMonth() + 1),
        day = addZero(d.getDate()),
        year = d.getFullYear();
    return [year, month, day].join('-');
}

function formatDate_Application(inputDate) {
    var d = new Date(inputDate),
        month = addZero(d.getMonth() + 1),
        day = addZero(d.getDate()),
        year = d.getFullYear();
    return [day, month, year].join('/');
}

function formatDateTime_Application(inputDate) {
    var d = new Date(inputDate),
        month = addZero(d.getMonth() + 1),
        day = addZero(d.getDate()),
        year = d.getFullYear(),
        hour = addZero(d.getHours()),
        minute = addZero(d.getMinutes());
    return [day, month, year].join('/') + ',' + hour + ':' + minute;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
module.exports = {
    todayDate_DatePicker,
    dateTimeFormatter_DatePicker,
    dateFormatter_DatePicker,
    formatDate_Application,
    formatDateTime_Application
}
