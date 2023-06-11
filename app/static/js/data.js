function send_data(notepad_id, user_id, type, data, xcord, ycord) {
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

function process_data(notepad_id) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      let raw_data = xhttp.responseText;
      let data = JSON.parse(raw_data);
      //Process data
      for (i in data) {
        let item = data[i]
        create_item(item);
      }
    }
  };
  xhttp.open("POST", "/data_send/" + notepad_id);
  xhttp.send();
  return false;
}
