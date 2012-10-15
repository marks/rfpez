// Generated by CoffeeScript 1.3.3
(function() {

  $(document).on("submit", "#add-collaborator-form", function(e) {
    var button, el;
    el = $(this);
    button = el.find("button");
    e.preventDefault();
    return el.ajaxSubmit({
      success: function(data) {
        var new_tr;
        if (data.status === "success") {
          new_tr = $(data.html);
          $(".collaborators-table tbody").append(new_tr);
        } else if (data.status === "already exists") {
          button.flash_button_message("warning", "Collaborator already exists");
        } else if (data.status === "dotgovonly") {
          button.flash_button_message("warning", ".gov email addresses only!");
        } else {
          button.flash_button_message("warning", "Error occurred");
        }
        return el.resetForm();
      }
    });
  });

  $(document).on("click", ".remove-collaborator-button", function(e) {
    var el;
    e.preventDefault();
    el = $(this);
    return $.ajax({
      url: el.attr("href"),
      type: "delete",
      success: function() {
        return el.closest("tr").remove();
      }
    });
  });

  $(function() {
    var typeahead_searching;
    typeahead_searching = false;
    return $("#add-collaborator-form input[name=email]").typeahead({
      minLength: 3,
      source: function(query, process) {
        clearTimeout(typeahead_searching);
        return typeahead_searching = setTimeout(function() {
          var existing_collaborators;
          existing_collaborators = [];
          $(".collaborators-table td.email").each(function() {
            return existing_collaborators.push($(this).text());
          });
          return $.ajax({
            url: "/officers/typeahead",
            data: {
              query: query
            },
            success: function(data) {
              data = $.grep(data, function(value) {
                return existing_collaborators.indexOf(value) === -1;
              });
              return process(data);
            }
          });
        }, 200);
      }
    });
  });

}).call(this);
