var folder = "./galerie/";

    $.ajax({
      url : folder,
      success: function (data) {
          $(data).find("a").attr("href", function (i, val) {
              if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                  $("#buffer").append( "<img src='"+ folder + val +"'>" );
              } 
          });
      }
    });