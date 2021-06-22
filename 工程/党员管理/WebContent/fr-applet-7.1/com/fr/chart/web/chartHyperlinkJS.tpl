$.ajax({
    url : '${servletURL}?op=chartrelate&cmd=${chartCMD}&sessionID=${sessionID}&ChartHyperlink_ID=${sourceID}${paraPath}',
    type : 'GET',
    dataType : 'json',
    data : {_time : new Date().getTime()},// IE»º´æ
    ${successFunction}
});
