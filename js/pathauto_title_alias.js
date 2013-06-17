/**
 * Custom JS file for pathauto_title_alias
 */
(function($){
  Drupal.behaviors.pathautoTitleAlias = {
    attach: function (context, settings) {
      // Find each field of that type and run our javascript.
      $('.field-type-pathauto-title-alias').each(function() {

        // Set variables for each element that is worked with.
        var elGenerateAlias = $(this).find('.form-checkbox');
        var elAlias = $(this).find('.form-text');
        var elTitle = $('#edit-title');

        // Add the throbber.
        $(elAlias).after('<span class="ajax-progress-throbber" style="display:none; padding: 7px"></span>');

        // Run when a keyup action is done on the title field.
        $(elTitle).keyup(function() {
          if ($(elGenerateAlias).is(':checked')) {
            // Get the title's value
            title = $(this).val();

            // Wait for the user to stop typing before running.
            Drupal.pathautoTitleAlias.delay(function() {
              // Set the alias to what has been typed.
              Drupal.pathautoTitleAlias.lookup(title, elAlias);
            }, 1000);
          }
        });

        // Run when a keyup action is done on the title field.
        $(elAlias).keyup(function() {
          // Get the title's value
          title = $(this).val();

          // Wait for the user to stop typing before running.
          Drupal.pathautoTitleAlias.delay(function() {
            // Set the alias to what has been typed.
            Drupal.pathautoTitleAlias.lookup(title, elAlias);
          }, 1000);
        });


        // Set the alias to the title if the generate alias checkbox becomes checked.
        $(elGenerateAlias).click(function() {
          if ($(this).is(':checked')) {
            // Get the title, set the alias, and hide the update link.
            title = $(elTitle).val();
            Drupal.pathautoTitleAlias.lookup(title, elAlias);
          }
        });
      });
    }
  };

  // Namespace our functions.
  Drupal.pathautoTitleAlias = Drupal.pathautoTitleAlias || {};

  // Lookup the alias and set the alias field to it.
  Drupal.pathautoTitleAlias.lookup = function (title, elAlias) {
    // Find the throbber and show it.
    throbber = $(elAlias).siblings('.ajax-progress-throbber');
    $(throbber).show();

    // Lookup alias.
    $.get(Drupal.settings.basePath + 'pathauto-title-alias-lookup/' + title, function(data) {
      // Set the alias to the return value.
      $(elAlias).val(data);

      // Hide the throbber.
      $(throbber).hide();
    });
  };

  // Create a function that allows us to set a delay for keyup.
  Drupal.pathautoTitleAlias.delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();
})(jQuery);
