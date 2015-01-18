jQuery.extend({
    postJSON: function(url, data, callback) {
      return jQuery.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        success: callback,
        dataType: "json",
        contentType: "application/json",
        processData: false
      });
    }
  });

(function() {
  var i = 0;
  var itemWidth = 0;
  var itemMargin = 0;
  var l = 0;
  var slide = 300;
  var fade = 500;
  var canEnter = false;

  $(function() { 
    itemWidth = $("#0").width();

    $("#rb").click(right);
    $(document).bind('keyup', 'right', right);

    $("#lb").click(left);
    $(document).bind('keyup', 'left', left);

    $("#up button").click(like);
    $(document).bind('keyup', 'up', like);

    $("#down button").click(dislike);
    $(document).bind('keyup', 'down', dislike);

    $(document).bind('keyup', 'return', s2d);

    resetClickListeners()

    criticCache = {}
    $('.critic').click(function(e){
      criticCache[$('.critic.selected').data('id')] = $('#main').html();
      
      $('.critic.selected').removeClass('selected');
      $('#highest-grid, #latest-grid, #highest, #newest').removeClass('s')
      $(this).addClass('selected');
      
      id = $(this).data('id');
      if(criticCache[id]){
        $( "#main" ).html( criticCache[id] );
        resetClickListeners();
      }else{
        $.get( "user/"+id+"/template/", function( data ) {
          $( "#main" ).html( data );
          $('#percent').text( $('div[data-id='+id+'] .circle').text() )
          resetClickListeners();
        });
      }
    });


    itemMargin = $("#0").css("margin-right");

    l = ($(window).width()/2-(itemWidth+10)/2);

    $("#carousel").width(($(".item").length)*(itemWidth+10+parseInt(itemMargin))+"px");
    $("#carousel").css("margin-left", ($(window).width()/2-(itemWidth+10)/2));

    layout();
    $(window).resize(function() {
        layout();
    });

    $('#scrollToStage').click(s2s);
    $('#scrollToDash').click(s2d);

    // $("li").hover(function(){
    //   conole.log("hover")
    //   $(this).children(".overlay").fadeToggle('fast');
    // });

  });

  function resetClickListeners(){
    $('#highest, #newest').click(function(e){
      $('#highest, #newest').toggleClass('s');
      $('#highest-grid, #latest-grid').toggleClass('shown');
    });
  }

  function s2s() {
    $("#stage").prependTo("body").slideDown(700, function() {
      $("#dashboard").hide();
    });   
  }

  function s2d() {
    if(canEnter){
      $("#dashboard").show();

      $('html,body').animate({
        scrollTop: $("#dashboard").offset().top
      }, 700, function() {
        $("#stage").hide();
      });
    }
  }

  function layout() {
    $("#dashboard").height($(window).height());
    $("#stage").height($(window).height());
  }

  function right(y) {
    if(i < ($(".item").length-2)) {
      l -= (parseInt(itemWidth)+10+0+parseInt(itemMargin));
      
      if(!!y) {
        $.postJSON('/movie/'+$("#"+i).attr('data-id')+"/review/",
              {'action': ''}, function(e){
              console.log("called back right")
            });
        $('#right').addClass('white');
        $('#right button').addClass('active');
        setTimeout(function() {
          $('#right').removeClass('white', fade);
          $('#right button').removeClass('active', fade);
        }, slide);
      }

      $("<div class=\"dark\"></div>").hide().prependTo("#"+i).fadeIn(fade);
      $("#"+i).children(".mark").addClass( "d", fade, "linear");
      $("#carousel").animate({
        marginLeft: l+"px"
      }, slide, "linear", function() {
      });
      i++;
      $("#"+i).children(".dark").fadeOut(fade);
      $("#"+i).children(".d").removeClass( "d", fade, "linear");
      if(i > 3 && i%4==0){
        loadLowerPane();
        canEnter = true;
        $('#done').fadeIn(fade);
      }
    }
  }

  function left() {
    if(i>=1) {
      l += (parseInt(itemWidth)+10+0+parseInt(itemMargin));
      $('#left').addClass('white');
      $('#left button').addClass('active');
      setTimeout(function() {
        $('#left').removeClass('white', fade);
        $('#left button').removeClass('active', fade);
      }, slide);

      $("<div class=\"dark\"></div>").hide().prependTo("#"+i).fadeIn(fade);
      $("#"+i).children(".mark").addClass( "d", fade, "linear");
      $("#carousel").animate({
        marginLeft: l+"px"
      }, slide, "linear", function() {
      });
      i--;
      $("#"+i).children(".dark").fadeOut(slide);
      $("#"+i).children(".d").removeClass( "d", fade, "linear");
    }
  }

  function like() {
    var $mark = $('#'+i).children(".mark");
    
    $('#up').addClass('white');
    $('#up button').addClass('active');
    setTimeout(function() {
      $('#up').removeClass('white', slide);
      $('#up button').removeClass('active', slide);
    }, slide);

    if($mark.hasClass("x")) {

      $mark.removeClass("x", fade, "linear");
      $mark.addClass("default");
    }
    if($mark.hasClass("check")) {
      $mark.removeClass("check", fade, "linear");
      $mark.addClass("default");
    }
    else {
      $mark.addClass("check", fade, "linear");
      $mark.removeClass("default");
      $.postJSON('/movie/'+$('#'+i).attr('data-id')+"/review/",
            {'action': 'like'}, function(e){
              console.log("called back up")
            });
    }
    right(false);
  }

  function dislike() {
    var $mark = $('#'+i).children(".mark");
    
    $('#down').addClass('white', fade);
    $('#down button').addClass('active', slide);
    setTimeout(function() {
      $('#down').removeClass('white', slide);
      $('#down button').removeClass('active', fade);
    }, slide);

    if($mark.hasClass("check")) {
      $mark.removeClass("check", fade, "linear");
      $mark.addClass("default");
    }
    if($mark.hasClass("x")) {
      $mark.removeClass("x", fade, "linear");
      $mark.addClass("default");
    }
    else {
      $mark.addClass("x", fade, "linear");
      $mark.removeClass("default");
      $.postJSON('/movie/'+$('#'+i).attr('data-id')+"/review/",
            {'action': 'dislike'}, function(e){
              console.log("called back dislike")
            });
    }
    right(false);
  }

  function loadLowerPane(){
    $.get('/user/criticList/', function(data){
      console.log("Loaded lower pane", data)
      for(var i in data){
        $('.critic.selected').removeClass('selected')
        $('.critic[data-num='+i+']').attr('data-id', data[i].id)
        $('.critic[data-num='+i+'] h2').text(data[i].name);
        $('.critic[data-num='+i+'] h3').text(data[i].criticPublication);
        $('.critic[data-num='+i+'] .circle').text(data[i].percent+"%");
      }
      $.get( "user/"+data[0].id+"/template/", function( results ) {
        $( "#main" ).html( results );
        $('#percent').text( $('div[data-id='+data[0].id+'] .circle').text() )
        resetClickListeners();
      });
      $('.critic[data-num=0]').addClass('selected')
    });
  }

})();