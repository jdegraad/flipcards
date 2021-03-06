MAX_TIME = 45;
startTime = 0;
remainingTime = null;
timer = null;

pictures = gon.links;
finalPictures = []

$.map(pictures, function(picture, index) {
  finalPictures.push(picture);
  finalPictures.push(picture);
})

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function gameOver(message, outcome){
  window.clearTimeout(timer);
  setTimeout( function() {
    $(".overlay").show();
    $('.buttons').show();
    $('#score_board').show();
    $('#score_board').prepend('<p class="btn btn-' + outcome + ' disabled message">' + message + '</p>')  
    if(outcome === 'success'){
      $('#time').val("" + (remainingTime * 100));
    } else {
      $('#inputSuccess').hide();
    }
    $('#score_board').append('<a href="javascript: window.location.reload();" id="replay" class="btn btn-info start">Play Again?</a>')
    $('#play_button').remove();

    //do the click binding here  or other option live event listener
    // $('#replay').on('click', function (event) {
    //   location.reload(true);
    // });

  }, 250);
}

 // DEALS WITH CARD FLIPPING LIBRARY IN JQUERY.FLIP.JS-------------

function toggle_card (card) {
  if(card.data('flipped') === false){
    card.flip(true);
    card.data('flipped', true);
  } else {
    card.flip(false);
    card.data('flipped', false);
  }
}

function isSameCard(card1, card2) {                       
  return card1.data('name') === card2.data('name');               // function to see if cards have same name/url
}

 // JQUERY LISTENING BEGINS-------------------------------------

$(document).ready(function() { 
  $('.progress').hide();
  $('#score_board').hide();

 // GENERATING CARDS-------------------------------------

  $.each(shuffle(finalPictures), function (index, picture) {
    var newCard = $('#card-template').clone();
    newCard.removeAttr("id");
    $('.row').append(newCard);
    newCard.data('name', picture);
    newCard.data('flipped', false);
    // var name_path = "url('images/" + picture + ".jpg')";
    // newCard.find('.back').css("background-image", name_path);
    newCard.find('.back').css('background-image', 'url(' + picture + ')');
    newCard.flip({
      trigger: 'manual'
    });
  });

 // FLIPPING CARDS AND MATCHING LOGIC-------------------------------------

 var mouseClicks = null;
 var matches = null;

  $('.flip').on('click', function() {                              // calling the div with the flip class once clickedm STATE 1
    var currentCard = $(this);                                    // setting current card to flip div
    if(!$(this).hasClass('match') && !$(this).hasClass('phlipped')) {                           //if card does not have class phlipped
      mouseClicks ++;
      if(mouseClicks <= 2){
        currentCard.addClass("phlipped");                             // then assign to flip  
        var phlippedCards = $(".phlipped");                         // assigns a variable to an array containing all class phlipped elements  
        toggle_card($(this));                                       // this is what flips the card  STATE 2
        if(phlippedCards.length === 2){                             // STATE 2.5
          if(isSameCard($(phlippedCards[0]),$(phlippedCards[1]))){    // if cards match go to STATE 4 
            phlippedCards.each(function (index,element){
              $(element).addClass('match');
              $(element).removeClass('phlipped');
              mouseClicks = 0;
              matches ++;
            });
          } else {                                                     // STATE 3
            setTimeout( function() {
              phlippedCards.each(function (index,element){
                toggle_card($(element))
                $(element).removeClass("phlipped")
                mouseClicks = 0
              });
            }, 1000);
          }
        } 
      }
    }
    if(matches === 16){
      gameOver("You Win!", 'success');
    }
});

  //TIMER FUNCTIONALITY---------------------------------------------

  var playButton = document.getElementById('play_button');

  $(playButton).on('click', function (event) {
    $(".overlay").hide();
    $('.buttons').hide();
    $('.message').hide();
    $(this).hide();
    $('.progress').show();
    startTimer();
  });

  

  function startTimer() {
    startTime = Math.round((currentTime() * 100 ) / 100 );
    timer = window.setInterval(updateTime, 100);
  }

  function currentTime(){
   return new Date().getTime() / 1000;
    // return Math.round( cTime * 100 / 100)
  }

  function updateTime(){
    var elapsedTime = currentTime() - startTime;
    remainingTime = MAX_TIME - elapsedTime;
    $('#timer').html("Time: " + remainingTime);
    var percentage = Math.round((remainingTime / MAX_TIME) * 100);
    var pageWidth = $('body').css('width');
    pageWidth = parseInt(pageWidth);

    if(parseInt($('#remaining-bar').css('width')) > (pageWidth * 0.7) ) {
      $('#remaining-bar').removeClass('progress-bar-warning')
      $('#remaining-bar').addClass('progress-bar-danger')
    }

    $('#remaining-bar').css('width', (100 - percentage) + '%');
    $('.progress-bar-success').css('width', percentage + '%');

    if (remainingTime <= 0){
      gameOver("You Lose", 'danger');
    }
  }

});

