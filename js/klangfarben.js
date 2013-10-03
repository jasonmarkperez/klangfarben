$(function() {
  play = $('#play_button');
  pause = $('#pause_button');
  mute = $('#mute_button');
  audioInput = $('.audio-input');

  audioInput.change(function(){
    fileName = $(this).val();
    cleanFileName = fileName.split('\\').pop();
    audio = new Audio(fileName);
    console.log(audio);
  });

  // var fileName = $('.audio-input').val();
  // var clean = fileName.split('\\').pop();
  // var audio = new Audio(clean);


  // console.log(audio);


 	// play.on('click', function(e){
 	// 	e.preventDefault();
 	// 	console.log('play');
  //   audio.play();
 	// });

 	// pause.on('click', function(e){
 	// 	e.preventDefault();
  //   audio.pause();
 	// });

  // mute.on('click', function(e){
  //   e.preventDefault();
  //   audio.volume = 0;
  // });

});