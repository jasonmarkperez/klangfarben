

$(function() {
  dropZone    = $('#drop-zone');
  audioPlayer = $('#audio-player');

  play  = $('#play');
  pause = $('#pause');
  mute  = $('#mute');
  muted = $('#muted');
  stop  = $('#stop');
  input = $('#inputFiles');
  trackInfo  = $('#track-info')
  song = new Audio('gemini.m4a');
  // console.log(song);



  input.on('change', function(e){
    var binaryReader = new FileReader();

    function getTagReader(data) {
     // FIXME: improve this detection according to the spec
     return data.getString(7, 4) == "ftypM4A" ? ID4 :
            (data.getString(3, 0) == "ID3" ? ID3v2 : ID3v1);
    }

    function readTags(reader, data) {
      return reader.readTagsFromData(data);
    }

    binaryReader.readAsBinaryString(input[0].files[0]);
    binaryReader.onload = function(e){
      var dv = new jDataView(this.result, 0, this.length, false);
      var reader = getTagReader(dv)
      updateTrackInfo(readTags(reader, dv));
    }
  });

  function updateTrackInfo(tags){
    console.log(tags);
    trackInfo.children(".track").append(tags.title);
    trackInfo.children(".artist").append(tags.artist);
    trackInfo.children(".album").append(tags.album);
  }

  play.on('click', function(e) {
    e.preventDefault();
    song.play();
    play.toggle();
    pause.toggle();
  });

  pause.on('click', function(e) {
    e.preventDefault();
    song.pause();
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


  // function supportsFileAPI(){
  //   return window.File && window.FileReader && window.FileList && window.Blob;
  // }

  // if supportsFileAPI(){

  // } else {
  //   console.log('not supported');
  //   return;
  // }

  // function handleDrop(e) {
  //   console.log('drop');
  //   e.stopPropagation();
  //   e.preventDefault();
  //   var files = e.originalEvent.dataTransfer.files, // file list object
  //       i, f;

  //   for(i=0; f = files[i]; i++) {
  //     if(f.type === 'audio/mp3')
  //       audioFiles.push(f);
  //   }
  // }

  // function handleDragOver(e){
  //   console.log('drag over');
  //   e.stopPropagation();
  //   e.preventDefault();
  // }

  // function playFile(index){
  //   var fileReader = new FileReader(),
  //       fileAtIndex = audioFiles[index];

  //   fileReader.onload = function(e){
  //     console.log(audioPlayer);
  //     console.log(e.target.result);
  //     audioPlayer.src = e.target.result;
  //     console.log(audioPlayer.src);
  //     audioPlayer.trigger('play');
  //   };
  //   currentFile = index;
  //   fileReader.readAsDataURL(fileAtIndex);
  // }

  // function handleProgress(e){
  //   console.log('handle progress');
  //   console.log(e.originalEvent);
  //   var total   = e.target.duration,
  //       current = e.target.currentTime;
  //   console.log(total);
  //   console.log(current);
  // }

  // function handlePlay(e){
  //   console.log('handle play');
  //   if(currentFile){
  //     console.log('to play');
  //     audioPlayer.play();
  //   }else{
  //     console.log('to else');
  //     playFile(0);
  //   }
  //   window.setTimeout(function() { return handleProgress({target: audioPlayer}); }, 1000);
  // }


  // function handleStop(){}
  // events
  // dropZone.on('dragover', handleDragOver);
  // dropZone.on('drop', handleDrop);
  // $('#play').on('click', handlePlay);
  // $('#stop').on('click', handleStop);
});