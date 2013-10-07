var klangFarben = $(function() {
  song = new Audio();
  play  = $('#play');
  pause = $('#pause');
  var fileInput = $('#input-files');

  var setupAndBuildPlayer = (function () {
    var deployJumbotron = function() {
      $('.jumbotron').animate({top: 0}, 1000);
    };

    var bindFileInput = function(){
      $('#open-file').on('click', function(){
        fileInput.click();
      });
    };

    deployJumbotron();
    bindFileInput();
  }());

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
      if(typeof tags.track != 'undefined') {
        trackInfo.find(".track").html(tags.title);
      } else {
        trackInfo.find(".track").html("Blank");
      }
      if(typeof tags.artist != 'undefined'){
        trackInfo.find(".artist").html(tags.artist + ' - ');
      } else {
        trackInfo.find(".artist").html("Blank");
      }
      if(typeof tags.album != 'undefined'){
        trackInfo.find(".album").html(tags.album);
      } else {
        trackInfo.find(".album").html("Blank");
      }//super hack to fix last minute bug when loading an mp3 with missing tags
      //never do this in real life
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
    var dropZone = document.getElementById('klang');
    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.dataTransfer.files; // FileList object.
      audioPlayer.loadNewTrack(files[0]);
      $(dropZone).removeClass('dragover');
    }

    function handleDragOver(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      $(dropZone).addClass('dragover')
      evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    }

    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    //kind of a hack, was having trouble using jQuerys event listeners and not having the browser load
    //the file on drop
  }());

  var watchFileInput = (function (){
    fileInput.on('change', function(e){
      var loadedFile = e.target.files[0];
      audioPlayer.loadNewTrack(loadedFile);
    });
  }());

  var audioPlayer = (function(){
    function loadNewAudio(loadedFile) {
      var audioReader = new FileReader();
      audioReader.onload = function(e){
        song.setAttribute('src', this.result);
      }
      audioReader.readAsDataURL(loadedFile);
    }
    return {
      loadNewTrack: function(loadedFile){
        play.removeClass('playable');
        trackInformation.loadTrackInfo(loadedFile);
        loadNewAudio(loadedFile);
      },
      songIsLoaded: function(){
        return (!$(song).attr('src') == '');
      },
      songIsPlaying: function(){
        return !(song.paused);
      }
    };
  }());

  play.on('click', function(e) {
    e.preventDefault();
    if(audioPlayer.songIsLoaded()){
      $(song).animate({volume: 1}, 200);
      song.play();
    }
  });

  $('#track-back').on('click', function(e){
    e.preventDefault();
    if(audioPlayer.songIsLoaded()){
      song.currentTime = 0;
    }
  });


  var rewinding = false;
  $('#rewind').on('click', function(e){
    e.preventDefault();
    if(audioPlayer.songIsLoaded() && audioPlayer.songIsPlaying()){
      if(rewinding === false){
          $(this).addClass('active');
         var direction = -1; // or -1 for reverse
          song.setAttribute('data-playbackRate', setInterval((function playbackRate () {
             song.currentTime += direction;
             return playbackRate; // allows us to run the function once and setInterval
          })(), 500));
          rewinding = true;
      } else {
        $(this).removeClass('active');
        rewinding = false;
        clearInterval(song.getAttribute('data-playbackRate'));
      }
    }
  });

  $('#fast-forward').on('click', function(e){
    e.preventDefault();
    if(audioPlayer.songIsLoaded() && audioPlayer.songIsPlaying()){
      if(song.playbackRate === 1){
        $(this).addClass('active');
        song.playbackRate = 4;
      } else{
        $(this).removeClass('active');
        song.playbackRate = 1
      }
    }
  });


  $(song).on("canplaythrough", function(){
    play.addClass('playable');
  });

  pause.on('click', function(e) {
    e.preventDefault();
    if(audioPlayer.songIsLoaded()){
      $(song).animate({volume: 0}, 800);
      song.pause();
    }
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