$(function() {


  function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
    console
    // files is a FileList of File objects. List some properties.
    // var output = [];
    // for (var i = 0, f; f = files[i]; i++) {
    //   output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
    //               f.size, ' bytes, last modified: ',
    //               f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
    //               '</li>');
    // }
    // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  // Setup the dnd listeners.
  var dropZone = document.getElementById('klang');
  dropZone.addEventListener('dragover', handleDragOver, false);
  dropZone.addEventListener('drop', handleFileSelect, false);


  // audioPlayer = $('#audio-player');

  play  = $('#play');
  pause = $('#pause');
  mute  = $('#mute');
  muted = $('#muted');
  stop  = $('#stop');
  input = $('#input-files');
  song = new Audio('gemini.m4a');


  $('body').keyup(function(e){
   if(e.keyCode == 32){
    console.log('space bar');
   }
  });



  $('.jumbotron').animate({top: 0}, 1000);

  $('#open-file').on('click', function(e){
    input.click();
  });

  input.on('change', function(e){
    // console.log(e);
    loadedFile = e.target.files[0];
    var audioReader = new FileReader();
    audioReader.onload = function(e){
      song.setAttribute('src', this.result)
    }
    audioReader.readAsDataURL(loadedFile);

    var binaryReader = new FileReader();
    binaryReader.onload = function(e){
      var dv = new jDataView(this.result, 0, this.length, false);
      var reader = getTagReader(dv)
      updateTrackInfo(readTags(reader, dv));
    }
    binaryReader.readAsBinaryString(loadedFile);

    function getTagReader(data) {
     // FIXME: improve this detection according to the spec
     return data.getString(7, 4) == "ftypM4A" ? ID4 :
            (data.getString(3, 0) == "ID3" ? ID3v2 : ID3v1);
    }

    function readTags(reader, data) {
      return reader.readTagsFromData(data);
    }
  });

  function readURL(input) {

    var reader = new FileReader();
    console.log(reader);
    reader.onload = function (e) {
      console.log(e);
    }

    reader.readAsDataURL(input);
  }


  function updateTrackInfo(tags){
    trackInfo  = $('#track-info');
    song.addEventListener('timeupdate', function(e){
      trackInfo.find('.current-time').html(String(this.currentTime).toHHMMSS());
    }, false);
    // could be more efficient if we determine that the time has changed enough to warrant an update
    trackInfo.find(".track").html(tags.title);
    trackInfo.find(".artist").html(tags.artist + ' - ');
    trackInfo.find(".album").html(tags.album);
  }

  play.on('click', function(e) {
    e.preventDefault();
    song.play();
    play.toggle();
    pause.toggle();
    song
  });

  pause.on('click', function(e) {
    e.preventDefault();
    $(song).animate({volume: 0}, 800);
    song.pause;
    play.toggle();
    pause.toggle();
  });

  mute.on('click', function(e) {
    e.preventDefault();
    song.volume = 0;
    play.toggle();
    mute.toggle()
  });

  // unmute.on('click'm,)

  stop.on('click', function(e) {
    e.preventDefault();
    //set duration
  });

});

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second parm
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var time    = hours+':'+minutes+':'+seconds;
  return time;
}