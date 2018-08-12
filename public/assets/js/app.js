// Whenever someone clicks a "Notes" button
$(document).on("click", ".btn-modal", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the button
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/getNotes/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#note-title").empty();
      $("#note-title").append("<h2>" + data.title + "</h2>");

      $("#savenote").attr("data-id", data._id);
      // If there's a note in the article
      if (data.notes) {
        for (let i = 0; i < data.notes.length; i++) {
          $("#notes").append("<div class='card' id='currentNotes'><div class='card-body'><div class='card-header' id='noteTitle'>"+data.notes[i].title+"</div><p id='noteBody'> "+data.notes[i].body+"</p><button type='button' class='btn btn-primary btn-sm' id='deleteNote' article-id='"+data._id+"' note-id='"+data.notes[i]._id+"'>DELETE</button></div></div>");
        }
      }
    });
});

// Whenever someone clicks the "Save Note" button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//click event to delete a note from a saved article
$(document).on('click', '#deleteNote', function (e){
  e.stopPropagation();
  let thisItem = $(this);
  let ids= {
    noteId: $(this).attr('note-id'),
    articleId: $(this).attr('article-id')
  };

  $.ajax({
    url: '/deleteNote',
    type: 'POST',
    data: ids,
    success: function (response) {
      console.log(response);
      thisItem.parent().remove();
    }
  });
});



// function changeStatus() {
// 	var status = $(this).attr("value");
// 	if (status === "Saved") {
// 		$(this).html("Unsave");
// 	}
// };

// function changeBack() {
// 	$(this).html($(this).attr("value"));
// };

// $("#status").hover(changeStatus, changeBack);

