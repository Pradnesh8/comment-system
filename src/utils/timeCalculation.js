function getCalculatedDateTime(pastDate, currentDate) {
    const dateNow = new Date(currentDate);
    const datePast = new Date(pastDate);

    let seconds = Math.floor((dateNow - (datePast)) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
    console.log(days, hours, minutes, seconds)
    return [days, hours, minutes, seconds];
}

export default getCalculatedDateTime;