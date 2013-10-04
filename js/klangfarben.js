$(function() {
  var dropZone    = $('#drop-zone'),
      audioPlayer = $('.audio-player'),
      audioFiles  = [], currentFile;

  // function supportsFileAPI(){
  //   return window.File && window.FileReader && window.FileList && window.Blob;
  // }

  // if supportsFileAPI(){

  // } else {
  //   console.log('not supported');
  //   return;
  // }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    var files = e.originalEvent.dataTransfer.files, // file list object
        i, f;

    for(i=0; f = files[i]; i++) {
      if(f.type === 'audio/mp3')
        audioFiles.push(f);
    }
    console.log(audioFiles);
  }

  function handleDragOver(e){
    console.log('drag over');
    e.stopPropagation();
    e.preventDefault();
  }

  dropZone.on('dragover', handleDragOver);
  dropZone.on('drop', handleDrop);
});