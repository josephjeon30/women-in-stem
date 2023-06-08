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
      // new_data(notepad_id, user_id, type, data, xcord, ycord)
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
    xhttp.open(formElement.method, formElement.action, true); //stuff
    // var data_form = new FormData(formElement);
    xhttp.send();//data_form);
    return false;
}
