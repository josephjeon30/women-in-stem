function send_data (notepad_id, user_id, type, data, xcord, ycord) {
  jQuery.ajax({
    url: '/process_sent_data',
    type: 'POST',
    data: {
      notepad_id: notepad_id,
      user_id: user_id,
      type: type,
      data: data,
      xcord: xcord,
      ycord: ycord
    }
  });
}

function process_data () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        let data = xhttp.responseText;
        //Process data
        console.log(data);
      }
    };
    xhttp.open("POST", "/data_send");
    xhttp.send();
    return false;
}
