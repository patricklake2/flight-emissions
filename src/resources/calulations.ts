function getBearing([lat1, lon1, lat2, lon2]: number[]): number {
    [lat1, lon1, lat2, lon2] = [lat1, lon1, lat2, lon2].map(degrees => degrees * Math.PI / 180);
    const y: number = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x: number = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let bearing: number = Math.atan2(y, x);
    bearing = bearing * 180 / Math.PI;  //back to degrees
    bearing = (bearing + 360) % 360;    //normalise
    return Math.round(bearing * 100) / 100; //round to a decent number of d.p
}

export { getBearing };