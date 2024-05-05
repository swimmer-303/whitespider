function ajax(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (callback) {
          callback(xhr.responseText);
        }
      } else {
        console.error(`Error ${xhr.status}: ${xhr.statusText}`);
      }
    }
  };

  xhr.open('GET', url + '&nocache=' + new Date().getTime(), true);
  xhr.send();
}
