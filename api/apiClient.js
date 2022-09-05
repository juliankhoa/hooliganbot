window.onload = function() {
    $.getJSON(document.URL, function(data) {
        console.log('API response received');
        $('#data').append(data);
    });
};