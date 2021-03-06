(function( $ ) {

	const module_list = [
		'.et_overlay',
		'.et_pb_button',
		'.et_pb_custom_button_icon',
		'.et_pb_more_button',
		'.et_pb_extra_overlay',
		'.et-pb-icon',
		'.et_pb_shop',
		'.et_pb_dmb_breadcrumbs li[data-icon]',
		'.et_pb_dmb_breadcrumbs a[data-icon]',
		'.dwd-slider-fullscreen button.slick-arrow',
		'.single_add_to_cart_button'
	];

	var icon_list_toggles = [
		'.et-core-control-toggle',
		'.et-fb-form__toggle[data-name="button"]',
		'.et-fb-form__toggle[data-name="button_one"]',
		'.et-fb-form__toggle[data-name="button_two"]',
		'.et-fb-form__toggle[data-name="image"]',
		'.et-fb-form__toggle[data-name="overlay"]',
	];

	const icon_filters = '<div class="dikg_icon_filter dikg_icon_filter--closed">' +
		'<span class="dikg_icon_filter__btn dikg_icon_filter--visible">Filter Icons</span>' +
		'<div class="dikg_icon_filter__controls dikg_icon_filter--hidden">' +
			'<span class="dikg_icon_filter__control_option dikg_icon_filter__control_option--inactive dikg_icon_filter__control_action dikg_icon_filter__all">All</span>' +
			'<span class="dikg_icon_filter__control_option dikg_icon_filter__control_option--inactive dikg_icon_filter__control_action dikg_icon_filter__close">Close</span>' +
		'</div>' +
	'</div>';

	var targetClasses          = module_list.join();
	var icon_font_list         = '.et-fb-font-icon-list';
	var builder_frame_selector = 'et-fb-app-frame';
	icon_list_toggles          = icon_list_toggles.join();

	$(function(){

		hide_icons_dikg();

		setTimeout(function(){
			process_icons_dikg();
			show_icons_dikg();
		}, 100);

		if( et_fb_check() ) {

			var targetNode = document.getElementById( 'et-fb-app' );
			var config = { childList: true, attributes: true, subtree: true };

			var callback = function( mutationsList ) {

				mutationsList.forEach(function (thisMutation) {

					if ( thisMutation.type == 'childList' ) {

						var target = thisMutation.target;

						if (
							target.id === 'et-fb-app' 	||
							target.id === 'et_fb_root' 	||
							target.classList.contains('et_pb_section') 	||
							target.classList.contains('et_pb_row') 		||
							target.classList.contains('et_pb_column')
						) {
			  process_icons_dikg();
			  show_icons_dikg();
						}

						if ( thisMutation.addedNodes.length > 0 ) {
							if(
								$(target).attr('data-name') === 'button'		||
								$(target).attr('data-name') === 'button_one'	||
								$(target).attr('data-name') === 'button_two'	||
								$(target).attr('data-name') === 'image' 		||
								$(target).attr('data-name') === 'overlay'		||
								// Older versions of Divi.
								target.classList.contains('et-fb-form__toggle')
							) {
				process_fb_icon_list_dikg();
				add_filters_dikg();
							}
						}
					}
				});
			};

			var observer = new MutationObserver(callback);
			observer.observe(targetNode, config);
		}
	});

	$(document).on('click', icon_font_list + ' > li', function(e) {
		hide_icons_dikg();
		setTimeout(function(){
			process_icons_dikg();
			process_fb_icon_list_dikg();
			show_icons_dikg();
		}, 100);
	});

	$(document).on('click', icon_list_toggles, function(e) {
		setTimeout(function(){
			process_fb_icon_list_dikg();
		}, 100);
	});

	$(document).ajaxComplete(function() {
		hide_icons_dikg();
		setTimeout(function(){
			process_fb_icon_list_dikg();
      process_icons_dikg();
      show_icons_dikg();
		}, 100);
	});

	// Refresh icons on Woocommerce cart update.
	$(document.body).on('updated_cart_totals', function() {
		hide_icons_dikg();
		setTimeout(function(){
		process_fb_icon_list_dikg();
		process_icons_dikg();
		show_icons_dikg();
		}, 100);
	});

	/**
	 * Detect if the FB is active.
	 */
	function et_fb_check() {
    	return $("#et-fb-app").length > 0;
	}

	function hide_icons_dikg() {
		// Check if the iframe exists (Divi 3.18.x)
    if( et_fb_check() && $('iframe#' + builder_frame_selector).length ) {
      var builder_frame = $('iframe#' + builder_frame_selector);
      $( targetClasses, builder_frame.contents() ).addClass('hide_icon');
    } else {
      $( targetClasses ).addClass('hide_icon');
    }
  }

  function show_icons_dikg() {
		// Check if the iframe exists (Divi 3.18.x)
    if( et_fb_check() && $('iframe#' + builder_frame_selector).length ) {
      var builder_frame = $('iframe#' + builder_frame_selector);
      $( targetClasses, builder_frame.contents() ).removeClass('hide_icon');
    } else {
      $( targetClasses ).removeClass('hide_icon');
    }
  }

	/**
	 * Parse icon data and display icons on the front end.
	 */
	function process_icons_dikg() {

		var builder_frame;
    var module;
    var target_element;
    var icon_data;
    var icon_parts;
    var icon_modules;

    var is_et_fb = false;

		// Check if the iframe exists (Divi 3.18.x)
    if( et_fb_check() && $('iframe#' + builder_frame_selector).length ) {
      is_et_fb = true;
      builder_frame = $('iframe#' + builder_frame_selector);
      icon_modules = $( targetClasses, builder_frame.contents() );
    } else {
      icon_modules = $( targetClasses );
    }

		// Loop through modules and work with icon data.
		for( i = 0; i < icon_modules.length; i++ ) {

			module = icon_modules[i];

      if( is_et_fb ) {
        target_element = $( module, builder_frame.contents() );
      } else {
        target_element = $( module );
      }

      // If the module isn't found, skip this iteration.
      if( ! target_element.length ) {
        continue;
      }

			// If the module has a 'data-icon' attribute set, we'll use it.
			if ( target_element.data('icon') !== undefined ) {

				var icon_data = target_element.attr( 'data-icon');
				icon_data = icon_data.split("~|");

				if( icon_data.length >= 2 ) {
					target_element.attr( 'data-icon', icon_data[0] );
				}

			// Otherwise the icon information is in the html.
			} else {

				var icon_data = target_element.html();
				icon_data = icon_data.split("~|");

				if( icon_data.length >= 2  ) {
					target_element.html( icon_data[0] );
				}
      }

      target_element.attr('data-family', icon_data[2]);
      target_element.removeClass('divi_et_icon_gtm divi_elegant-themes_icon_gtm divi_font-awesome_icon_gtm divi_material_icon_gtm divi_undefined_icon_gtm');
      target_element.addClass( 'divi_' + icon_data[2] + '_icon_gtm' );

      if( target_element.is('[data-family]') ) {
        var this_fam = target_element.attr('data-family');
        if( ! target_element.hasClass('divi_' + this_fam + '_icon_gtm' ) ) {
          target_element.addClass('divi_' + this_fam + '_icon_gtm' );
        }
			}

		}
	}

	function process_fb_icon_list_dikg() {

		var icon_list_ul = $(icon_font_list);
    var icon_list_children = icon_list_ul.children();
    var icon_data;
    var icon_set_name;

    var icon_set_list = [];
    for( var i = 0; i < icon_list_children.length; i++ ) {
      var icon_item = icon_list_children[i];

      if( $(icon_item).not('.divi_icon_king_gtm') || $(icon_item).hasClass('active') ) {

        icon_data = $(icon_item).data('icon') + '';
        icon_data = icon_data.split("~|");

        if( icon_data.length > 1 ) {

          icon_set_name = icon_data[2];

          $(icon_item).attr({
            "data-icon" : icon_data[0],
            "data-family" : icon_data[2],
            "data-name" : icon_data[1],
            "title" : icon_data[1]
          });

          $(icon_item).addClass( 'divi_icon_king_gtm divi_' + icon_data[2] + '_icon_gtm' );
        } else {
          icon_set_name = 'elegant-themes';
          $(icon_item).attr( "data-family", icon_set_name );
        }
      }

      var icon_set_found = $.inArray( icon_set_name, icon_set_list );
      if (icon_set_found < 0) {
        icon_set_list.push( icon_set_name );
      }
    }

    // Add available icons to ul element for the filter to use.
    var icon_set_list_string = icon_set_list.join(',');
    $( icon_list_ul ).attr( "data-icon-sets", icon_set_list_string );
  }

  function add_filters_dikg(){
    if( !$('.et-fb-option--select-icon') ) {return;}

    var et_fb_icon_container = '.et-fb-form__toggle-opened .et-fb-option--select-icon .et-fb-option-container';

    if ( ! $('.dikg_icon_filter').parents( et_fb_icon_container ).length == 1 ) {
      $( et_fb_icon_container ).append( icon_filters );

      var available_icon_sets = $(icon_font_list).attr('data-icon-sets');
      available_icon_sets = available_icon_sets.split(',');
      $.each( available_icon_sets, function(){
        $('.dikg_icon_filter__controls').prepend('<span class="dikg_icon_filter__control_option dikg_icon_filter__control_option--inactive dikg_icon_filter__control_family" data-value="' + this + '">' + this + '</span>');
      });
    }
  }
})(jQuery);
