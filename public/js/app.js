function loadSlobGlobs(){
  $.ajax({
    method:"GET", 
    url:"/api/clobProject/slobGlobs",
    success: function(slobGlobs){
      
      var $globs = $('#globs');
      $globs.empty();
      slobGlobs.forEach(function(glob) {
        var glob_span = $('<span/>').text(glob)
        var remove_a = 
          $('<a>', {"href":"#", "title":"Remove Glob", "style":"color: inherit ; margin-left: 5px;"})
            .append($('<span/>', {"class":"remove-glob glyphicon glyphicon-trash"}))
            .click(removeGlobEventHandler);

        $globs.append($('<li/>')
          .append(glob_span)
          .append(remove_a)
        );
      });
    }
  });
}

function removeGlobEventHandler(event){
  if(confirm('Are you sure you want to remove this Glob?')) {

    var glob_to_remove = $(event.target).parent().prev("span").text();

    $.ajax({
        method:"POST", 
        contentType: "application/json",
        processData :false,
        url:"/api/clobProject/slobGlobs/remove",
        data:JSON.stringify({slobGlob:glob_to_remove}),
        success: loadSlobGlobs
    });
  }
}

$(document).ready(function(){

  var socket = io();
  
  socket.on('clob', function(msg){

   var new_list_item = $("<li></li>");
   
   var bootstrap_class = msg.result==='success'?'success':'danger';
   var d = new Date();
   
   new_list_item.append(
     $('<div>', {"class":"panel panel-"+bootstrap_class})
     .append( 
       $('<div>', {"class":"panel-heading"})
       .append(
         $('<div>', {"class":"panel-title"}).text(msg.clobFile)
       )
     ).append(
       $('<div>', {"class":"panel-body"}).append($('<strong>').text(msg.file_location))
       
       .append(
         $('<p/>').text(d.toLocaleString())
       )
       .append(
          msg.err?$('<p>').text(JSON.stringify(msg.err)):"" 
       )   
     )
   );

   
   $('#clobs').prepend(new_list_item);


    
  });

  socket.on('status_message', function(msg){
    $('#status_message').text(msg)
  });

  socket.on('status', function(msg){
    $('#status').text(msg)
  });

  $('#stop').click(function(){
    $.ajax({
      method:"DELETE",
      url:"/api/clobWatch"
    });
    return false;
  });

  $('#start').click(function(){
    $.ajax({
      method:"PUT",
      url:"/api/clobWatch"
    });
    return false;
  });
  
  $('#addGlob').click(function(){
    
    var globToAdd = $('#globToAdd').val();
    
    $.ajax({
      method:"POST", 
      contentType: "application/json",
      processData :false,
      url:"/api/clobProject/slobGlobs",
      data:JSON.stringify({slobGlob:globToAdd}),
      success: loadSlobGlobs
    });
  });
  
  $.ajax({
    method:"GET", 
    url:"/api/clobProject",
    success: function(projectData){
      $('#projectName').text(projectData.projectName);
      $('#codeSourcePath').text(projectData.scriptrunner.codeSourcePath);
      $('#scriptRunnerLocation').text(projectData.scriptrunner.jarLocation);
    }
  });
  
  loadSlobGlobs();
});
