$(function() {
  song = new Audio('gemini.m4a');
  play  = $('#play');
  pause = $('#pause');

  var fileInput = $('#input-files');

  var setupAndBuildPlayer = (function () {
    var deployJumbotron = function() {
      $('.jumbotron').animate({top: 0}, 1000);
    };

    var attachKeyCommands = function() {
      $('body').keyup(function(e){
       if(e.keyCode === 32){

       }
      });
    };

    var bindFileInput = function(){
      $('#open-file').on('click', function(){
        fileInput.click();
      });
    };

    deployJumbotron();
    attachKeyCommands();
    bindFileInput();
  }(fileInput));

  var trackInformation = (function() {
    function readTags(reader, data) {
      return reader.readTagsFromData(data);
    }
    function loadAsBinary(loadedFile){
      var binaryReader = new FileReader();
      binaryReader.onload = function(e){
        var dataView = new jDataView(e.target.result, 0, e.target.length, false);
        var reader = getTagReader(dataView);
        updateTrackInfo(readTags(reader, dataView));
      }
      binaryReader.readAsBinaryString(loadedFile)
    }

    function updateTrackInfo(tags){
      var trackInfo  = $('#track-info');
      song.addEventListener('timeupdate', function(){
        trackInfo.find('.current-time').html(String(this.currentTime).toHHMMSS());
      }, false);
      // could be more efficient if we determine that the time has changed enough to warrant an update
      trackInfo.find(".track").html(tags.title);
      trackInfo.find(".artist").html(tags.artist + ' - ');
      trackInfo.find(".album").html(tags.album);
    }

    function getTagReader(data) {
     // FIXME: improve this detection according to the spec
     return data.getString(7, 4) === "ftypM4A" ? ID4 :
            (data.getString(3, 0) === "ID3" ? ID3v2 : ID3v1);
    }
    return {
      loadTrackInfo: function(loadedFile){
        console.log('load track info');
        loadAsBinary(loadedFile);
      }
    };
  }());

  var setupDragAndDrop = (function (){
    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.dataTransfer.files; // FileList object.
      audioPlayer.loadNewTrack(files[0]);
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }
    var dropZone = document.getElementById('klang');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
  }());

  var watchFileInput = (function (){
    fileInput.on('change', function(e){
      console.log('change');
      var loadedFile = e.target.files[0];
      audioPlayer.loadNewTrack(loadedFile);
    });
  }());

  var audioPlayer = (function(){
    function loadNewAudio(loadedFile) {
      console.log('load new audio');
      var audioReader = new FileReader();
      audioReader.onload = function(e){
        song.setAttribute('src', this.result);
      }
      audioReader.readAsDataURL(loadedFile);
    }
    return {
      loadNewTrack: function(loadedFile){
        trackInformation.loadTrackInfo(loadedFile);
        loadNewAudio(loadedFile);
      }
    };
  }());

  play.on('click', function(e) {
    e.preventDefault();
    $(song).animate({volume: 1}, 200);
    song.play();
    play.toggle();
    pause.toggle();
  });

  $('#track-back').on('click', function(e){
    e.preventDefault();
    song.currentTime = 0;
  });

  $('#rewind').on('click', function(e){
    e.preventDefault();
    song.setAttribute('data-playbackRate', setInterval ((function playbackRate(){
      song.currentTime += -1;
      return playbackRate;
    })(), 500));
    //hack because playback rate reverse is broken in webkit, sigh
  });

  $('#fast-forward').on('click', function(e){
    console.log('fast ffw');
    e.preventDefault();
    if(song.playbackRate === 1){
      song.playbackRate = 4;
    } else{
      song.playbackRate = 1
    }
  });


  pause.on('click', function(e) {
    e.preventDefault();
    $(song).animate({volume: 0}, 800);
    song.pause();
    play.toggle();
    pause.toggle();
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