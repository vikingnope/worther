

export const TimeZoneShow = (props) => {
    var timeZoneShown = '';
    
    ((props.timeZone === 0) ?
      timeZoneShown = 'GMT' :
    (props.timeZone === -3600) ?
      timeZoneShown = 'GMT-1' :
    (props.timeZone === -7200) ?
      timeZoneShown = 'GMT-2' :
    (props.timeZone === -10800) ?
      timeZoneShown = 'GMT-3' :
    (props.timeZone === -14400) ?
      timeZoneShown = 'GMT-4' :
    (props.timeZone === -18000) ?
      timeZoneShown = 'GMT-5' :
    (props.timeZone === -21600) ?
      timeZoneShown = 'GMT-6' :
    (props.timeZone === -25200) ?
      timeZoneShown = 'GMT-7' :
    (props.timeZone === -28800) ?
      timeZoneShown = 'GMT-8' :
    (props.timeZone === -32400) ?
      timeZoneShown = 'GMT-9' :
    (props.timeZone === -36000) ?
      timeZoneShown = 'GMT-10' :
    (props.timeZone === -39600) ?
      timeZoneShown = 'GMT-11' :
    (props.timeZone === -43200) ?
      timeZoneShown = 'GMT-12' :
    (props.timeZone === 3600) ?
      timeZoneShown = 'GMT+1' :
    (props.timeZone === 7200) ?
      timeZoneShown = 'GMT+2' :
    (props.timeZone === 10800) ?
      timeZoneShown = 'GMT+3' :
    (props.timeZone === 14400) ?
      timeZoneShown = 'GMT+4' :
    (props.timeZone === 18000) ?
      timeZoneShown = 'GMT+5' :
    (props.timeZone === 19800) ?
      timeZoneShown = 'GMT+5:30' :
    (props.timeZone === 21600) ?
      timeZoneShown = 'GMT+6' :
    (props.timeZone === 25200) ?
      timeZoneShown = 'GMT+7' :
    (props.timeZone === 28800) ?
      timeZoneShown = 'GMT+8' :
    (props.timeZone === 32400) ?
      timeZoneShown = 'GMT+9' :
    (props.timeZone === 36000) ?
      timeZoneShown = 'GMT+10' :
    (props.timeZone === 39600) ?
      timeZoneShown = 'GMT+11' :   
    (props.timeZone === 43200) ?
      timeZoneShown = 'GMT+12' :
    (props.timeZone === 46800) ?
      timeZoneShown = 'GMT+13' : 
    (props.timeZone === 50400) ?
      timeZoneShown = 'GMT+14' :                 
    <></> 
    );

    return(
        timeZoneShown
    );
}

export const VisibilityDesc = (props) => {
  var visibilityDescription = '';

  ((props.visibility < 50) ?
  visibilityDescription = 'Dense Fog' :
  (props.visibility >= 50 && props.visibility < 200) ?
    visibilityDescription = 'Thick Fog' :
  (props.visibility >= 200 && props.visibility < 500) ?
    visibilityDescription = 'Moderate Fog' :
  (props.visibility >= 500 && props.visibility < 1000) ?
    visibilityDescription = 'Light Fog' :
  (props.visibility >= 1000 && props.visibility < 2000) ?
    visibilityDescription = 'Thin Fog' :
  (props.visibility >= 2000 && props.visibility < 4000) ?
    visibilityDescription = 'Haze' :
  (props.visibility >= 4000 && props.visibility < 10000) ?
    visibilityDescription = 'Light Haze' :
  (props.visibility === 10000) ?
    visibilityDescription = 'Clear' :
    <></>
  );

  return (
    visibilityDescription
  );
}


export const WindDirection = (props) => {
  var windDirection = '';

  (((props.windDegrees >= 0 && props.windDegrees <= 11.25) || (props.windDegrees  > 348.75)) ? 
          windDirection = 'N'  : 
        (props.windDegrees >= 11.26 && props.windDegrees < 33.75) ?
          windDirection = 'NNE' :
        (props.windDegrees >= 33.75 && props.windDegrees < 56.25) ?
          windDirection = 'NE' :
        (props.windDegrees >= 56.25 && props.windDegrees < 78.75) ?
          windDirection = 'ENE' :
        (props.windDegrees >= 78.75 && props.windDegrees < 101.25) ?
          windDirection = 'E' :
        (props.windDegrees >= 101.25 && props.windDegrees < 123.75) ?
          windDirection = 'ESE' :
        (props.windDegrees >= 123.75 && props.windDegrees < 146.25) ?
          windDirection = 'SE' :
        (props.windDegrees >= 146.25 && props.windDegrees < 168.75) ?
          windDirection = 'SSE' :
        (props.windDegrees >= 168.75 && props.windDegrees < 191.25) ?
          windDirection = 'S' : 
        (props.windDegrees >= 191.25 && props.windDegrees < 213.75) ?
          windDirection = 'SSW' :
        (props.windDegrees >= 213.75 && props.windDegrees < 236.25) ?
          windDirection = 'SW' :
        (props.windDegrees >= 236.25 && props.windDegrees < 258.75) ?
          windDirection = 'WSW' :
        (props.windDegrees >= 258.75 && props.windDegrees < 281.25) ?
          windDirection = 'W' :
        (props.windDegrees >= 281.25 && props.windDegrees < 303.75) ?
          windDirection = 'WNW' :
        (props.windDegrees >= 303.75 && props.windDegrees < 326.25) ?
          windDirection = 'NW' :
        (props.windDegrees >= 326.25 && props.windDegrees < 348.75) ?
          windDirection = 'NNW' :                          
        <> </>
  );

  return (
    windDirection
  );
}