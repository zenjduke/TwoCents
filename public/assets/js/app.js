// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < 20; i++) {
    // Display the apropos information on the page
    var scrapedArticle = ("<div class='card'><div class='card-body'><h3 class='card-title'>"+ data[i].title + "</h3><br /><a href='"+ data[i].link + "' target='_blank'><button class='btn btn-primary'>Read</button></a><button type='button' class='btn btn-modal btn-primary' data-id='" + data[i]._id + "' data-toggle='modal' data-target='#noteModal'>Notes</button><button type='button' class='btn btn-primary' data-id='" + data[i]._id + "' id='save-article'>Save</button></div></div>");

    $("#articles").append(scrapedArticle);
    
  }
});

// Grab the SAVED articles as a json
$.getJSON("/articles/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    if (data[i].saved = true) {
    // Display the apropos information on the page
    var scrapedArticle = ("<div class='card'><div class='card-body'><h3 class='card-title'>"+ data[i].title + "</h3><br /><a href='"+ data[i].link + "' target='_blank'><button class='btn btn-primary'>Read</button></a><button type='button' class='btn btn-modal btn-primary' data-id='" + data[i]._id + "' data-toggle='modal' data-target='#noteModal'>Notes</button><button type='button' class='btn btn-primary' data-id='" + data[i]._id + "' id='del-article'>Delete</button></div></div>");

    $("#myarticles").append(scrapedArticle);
    }
  }
});

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
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#note-title").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Title'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body' placeholder='Note'></textarea>");
      $("#savenote").attr("data-id", data._id);
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
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
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Whenever someone clicks the "Save Article" button
$(document).on("click", "#save-article", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  $(this).text("Saved");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/myarticles/" + thisId,
    data: {
      saved: true,
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });
});

// Whenever someone clicks the "Save Article" button
$(document).on("click", "#del-article", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/savedarticles/" + thisId,
      data: {
        saved: false,
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        window.location.reload();
      });
  });