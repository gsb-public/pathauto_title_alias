/**
 * Custom JS file for pathauto_title_alias
 */
(function($){
  // Create a function that allows us to set a delay for keyup.
  var pathautoTitleAliasDelay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  Drupal.behaviors.pathautoTitleAlias = {
    attach: function (context, settings) {
      // Set the url to lookup aliases.
      var lookupPath = Drupal.settings.basePath + 'pathauto-title-alias-lookup/';

      // Find each field of that type and run our javascript.
      $('.field-type-pathauto-title-alias').each(function() {

        // Set variables for each element that is worked with.
        var elGenerateAlias = $(this).find('.form-checkbox');
        var elAlias = $(this).find('.form-text');
        var elTitle = $('#edit-title');

        $(elAlias).after(' <a class="pathauto-title-alias-update" href="#">' + Drupal.t('Update with pathauto settings') + '</a>');
        var elUpdate = $(this).find('a.pathauto-title-alias-update');

        // If the generate checkbox is checked hide the update link.
        if ($(elGenerateAlias).is(':checked')) {
          $(elUpdate).addClass('element-hidden');
        }

        // Run when a keyup action is done on the title field.
        $(elTitle).keyup(function() {
          if ($(elGenerateAlias).is(':checked')) {
            // Get the title's value
            title = $(this).val();

            // Wait 500ms for the user to stop typing before running.
            pathautoTitleAliasDelay(function() {
              // Set the alias to what has been typed.
              Drupal.pathautoTitleAlias.lookup(title, elAlias, lookupPath);
            }, 500);
          }
        });

        // Set the alias to the title if the generate alias checkbox becomes checked.
        $(elGenerateAlias).click(function() {
          if ($(this).is(':checked')) {
            // Get the title, set the alias, and hide the update link.
            title = $(elTitle).val();
            Drupal.pathautoTitleAlias.lookup(title, elAlias, lookupPath);
            $(elUpdate).addClass('element-hidden');
          }
          else {
            // If it becomes unchecked unhide the element link.
            $(elUpdate).removeClass('element-hidden');
          }
        });

        // If someone clicks the update link then update the alias.
        $(elUpdate).click(function() {
          title = $(elAlias).val();
          Drupal.pathautoTitleAlias.lookup(title, elAlias, lookupPath);
          return false;
        });
      });
    }
  };

  // Namespace our functions.
  Drupal.pathautoTitleAlias = Drupal.pathautoTitleAlias || {};

  // Lookup the alias and set the alias field to it.
  Drupal.pathautoTitleAlias.lookup = function (title, elAlias, lookupPath) {
    $.get(lookupPath + title, function(data) {
      $(elAlias).val(data);
    });
  };
})(jQuery);
