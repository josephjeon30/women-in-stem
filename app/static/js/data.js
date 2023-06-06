function send_data (data) {
  jQuery.ajax({
    url: '/process_sent_data',
    type: 'POST',
    data: {
      data: data
    }
  });
}

function process_data () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        let data = xhttp.responseText;
        //Process data
      }
    };
    xhttp.open(formElement.method, formElement.action, true); //stuff
    // var data_form = new FormData(formElement);
    xhttp.send();//data_form);
    return false;
}
