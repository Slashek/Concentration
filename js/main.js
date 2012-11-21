$("select, input, button, textarea").uniform();

var form = function(){
    return $('form');
}();

var concentration = function(){

    var options = {
        music: 0,
        randomBoard: 0,
        countdown: 0,
        timer: 1
    }


    return {
        init: function () {
                  options.music = $('input[name=option-music]:checked', '#form').val();
                  options.randomBoard = $('input[name=option-random-board]:checked', '#form').val();
                  options.countdown = $('input[name=option-countdown]:checked', '#form').val();
                  options.timer = $('input[name=option-timer]:checked', '#form').val();
                  board.draw();
              },
        getOptions: function(){ return options}
    };
}();

var board = function(){

    var numbers_length = 99;
var numbers = [13, 63, 93, 29, 82, 38, 39, 28, 86, 35, 
    26, 2, 51, 91, 40, 96, 54, 14, 41, 83, 55, 22, 95, 
    60, 37, 68, 73, 8, 88, 31, 44, 49, 79, 6, 24, 12, 10, 
    65, 42, 59, 0, 81, 18, 46, 78, 7, 11, 36, 53, 1, 80, 
    75, 52, 90, 58, 34, 62, 15, 20, 77, 33, 25, 72, 85, 98, 
    23, 84, 56, 99, 97, 45, 89, 32, 71, 5, 50, 64, 17, 48, 
    3, 16, 27, 87, 69, 47, 30, 74, 61, 57, 76, 92, 67, 70, 
    19, 94, 21, 4, 43, 66, 9];
    var container =  $('#board');
    var draw_number = 0;
    var current_number = 0;

    var init = function(){
        var shuffle = function ( myArray ) {
            var i = myArray.length;
            if ( i == 0 ) return false;
            while ( --i ) {
                var j = Math.floor( Math.random() * ( i + 1 ) );
                var tempi = myArray[i];
                var tempj = myArray[j];
                myArray[i] = tempj;
                myArray[j] = tempi;
            }
            return myArray;
        }
        for(var i=0;i<100;i++){
            numbers.push(i);
        }
        if(concentration.getOptions().randomBoard==1){
            numbers = shuffle(numbers);
        }
        addMusicIfNeeded();
    };

    var getRandomNumber = function(){
        number =  numbers[draw_number++];
        if(number < 10){
            number = "0" + number;
        }
        return number;
    };

    var listenToField = function(field){
        field.click(function(){
            if(current_number==parseInt(field.text())){
                current_number++;
                if(hasAlreadyWon()){
                    board.gameover();
                } else{
                    field.attr("class", "checked");
                }
            }
        });
    }

    var hasAlreadyWon = function(){
        return (current_number==(numbers_length+1) ? true : false);
    }

    var addMusicIfNeeded = function(){
        if(concentration.getOptions().music==1){
            container.append('<audio autoplay="true" src="mp3/sound.mp3">Your browser does not support the audio element.</audio>');
        }
    }

    return{
        draw: function(){
                  init();
                  var i,j=0;
                  var table = $("<table id='game-board'></table>");
                  for(var i=0;i<10;i++){
                      var tr = $('<tr class="game-row"></tr>');
                      for(var j=0;j<10;j++){
                          var td = $('<td class="game-cell"></td>')
                              var button = $('<button class="field">' + getRandomNumber() + '</button>');
                          listenToField(button);
                          td.append(button);
                          tr.append(td);
                      }
                      table.append(tr);
                  }
                  container.prepend(table).show();
                  form.hide();
                  timer.init();
              },
        gameover: function(){
                      timer.stop();
                      timer.hide();
                      board.drawFinalScreen();
                      $('.field').unbind('click');
                  },
        drawFinalScreen: function(){
                             var h1;
                             if(hasAlreadyWon()){
                                 h1 = $("<h1>You have won! Congratulations!</h1>");

                             } else{
                                 h1 = $("<h1>Better luck next time</h1>");
                             }
                             var table = $("<table id='result-table'></table>");
                             if(hasAlreadyWon()){
                                 var row3 = $("<tr><td>Time used</td><td>" + timer.getFinishTime() + "</td></tr>");
                                 table.append(row3);
                             } else{
                                 var row1 = $("<tr><td>Score</td><td>" + (current_number) + "</td></tr>");
                                 table.append(row1);
                             }
                             var row2= $("<tr><td colspan='2'><a href=''>Try again?</a></td></tr>");
                             table.append(row2);
                             container.innerHTML = "";
                             container.append(h1);
                             container.append(table);
                         }
    }
}();

var timer = function(){

    var game_length_in_seconds = 120;
    var start_time;
    var current_time_in_seconds;
    var container = $('#timer');
    var interval_int;

    var normalizeTime = function(start, end){
        var seconds = Math.round(end - start);
        if(seconds <0){
            seconds = seconds * (-1);
        } else{
            seconds = Math.round(start);
        }
        var minutes = Math.floor(seconds / 60);
        var seconds = seconds - (minutes * 60);
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        return minutes + ":" + seconds;
    }

    return {
        init: function(){
                  start_time = new Date().getTime();
                  current_time_in_seconds = 0;
                  interval_int = self.setInterval(function(){timer.tick()},1000);
                  if(concentration.getOptions().timer==0){
                      timer.hide();
                  }
                  timer.tick();
              },
            tick: function(){
                      current_time_in_seconds = (new Date().getTime() - start_time)/1000;
                      if(current_time_in_seconds >= game_length_in_seconds){
                          board.gameover();
                      } else{
                          timer.draw();
                      }
                  },
            draw: function(){
                      current_time_in_seconds = (new Date().getTime() - start_time)/1000;
                      container.text("Time left: " + normalizeTime(game_length_in_seconds, current_time_in_seconds)); 
                  },
            stop: function(){
                      window.clearInterval(interval_int);
                  },
            getFinishTime: function(){
                               current_time_in_seconds = (new Date().getTime() - start_time)/1000;
                               return normalizeTime(current_time_in_seconds,game_length_in_seconds);
                           },
            hide: function(){
                      container.hide();
                  }
    }
}();

$('#form').submit(function(event){
    event.preventDefault();
    concentration.init();   
});
