const print = console.log
$(document).ready(function () {
    initClock();
})


function initClock() {
    setInterval(updateTime, 1 * 1000)
}

function updateTime() {

    const d = new Date()

    const time = new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(d)
    $('.time').html(`${time}`)

    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    $('.date').html(`${mo}-${da}-${ye}`)
}