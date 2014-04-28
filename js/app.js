$(document).ready(function() {



    var products = [];
    var input_fields_valid = false;

    $('#window_button').smoothScroll();
    // $("#design_content a[id^='design']").smoothScroll();
    $('#step_2_proceed').smoothScroll();

    function updateModel() {
        var input = $(this).val();
        var product_id = $(this).parent().parent().parent().parent().attr('id');
        var product_index = -1;

        for (var i = 0; i < products.length; i++) {
            var this_product_id = products[i].id;
            if (product_id == this_product_id) {
                product_index = i;
            }
        }

        if ($(this).attr('id') === 'location') {
            products[product_index].location = input;
        } else if ($(this).attr('id') === 'width') {
            products[product_index].width = input;
        } else if ($(this).attr('id') === 'height') {
            products[product_index].height = input;
        } else if ($(this).attr('id') === 'color') {
            products[product_index].color = input;
        }

        return product_index;
    }

    function product(type, location, width, height, design, id) {
        this.type = type;
        this.location = location;
        this.width = width;
        this.height = height;
        this.design = design;
        this.id = id;
    };

    function createNewProduct() {
        var product_id = Math.floor((Math.random() * 100) + 1);
        var selected_design = $(this).attr('id');
        var my_product = new product('window', '', '', '', selected_design, product_id);
        products.push(my_product);
        return product_id
    }

    function validateFields(product) {
        var valid = true;
        if (product.location === '') {
            valid = false;
        } else if (product.width < 300 || product.width > 3000 || product.height < 300 || product.height > 5000) {
            valid = false;
        } else if (isNaN(product.width) || isNaN(product.height)) {
            valid = false;
        } else if (product.width === '' || product.height === '') {
            valid = false;
        }

        if (valid) {
            $("#proceed_to_step_4").show();
        } else {
            $("#proceed_to_step_4").hide();
        }
        return valid;
    }

    function renderProductDataAndDesigns(product) {
        var $step3 = $("#designs");
        var data_fields = "<div id=" + product.id + " class='row'><div class='col-xs-1'></div><div class='col-xs-4'><div class='thumbnail'><div class='input-group'><input id='location' type='text' class='form-control' placeholder='Window name/location'><span class='input-group-addon'></span></div><div class='input-group'><input id='width' type='text' class='form-control' placeholder='Width'><span class='input-group-addon'>milimeters</span></div><div class='input-group'><input id='height' type='text' class='form-control' placeholder='Height'><span class='input-group-addon'>milimeters</span></div><div class='btn-group btn-input clearfix'><button type='button' class='btn btn-default dropdown-toggle form-control' data-toggle='dropdown'><span data-bind='label'>White</span><span class='caret'></span></button><ul class='dropdown-menu' role='menu'><li><a href='#'>White</a></li><li><a href='#'>Cream</a></li><li><a href='#'>Woodgrain</a></li></ul></div></div></div>";
        var str = "<div class='col-xs-4'><div class='thumbnail'><img id='step_3_selected_design' src='images/" + product.design + ".png'></div></div></div>";
        var data_plus_str = data_fields + str;
        var html = $.parseHTML(data_plus_str);
        $step3.append(html);
        var selector_location = '#' + product.id + ' #location';
        $(selector_location).val(product.location);
        var selector_width = '#' + product.id + ' #width';
        $(selector_width).val(product.width);
        var selector_height = '#' + product.id + ' #height';
        $(selector_height).val(product.height);
    }

    $("#step_1_change_selection").hide();
    $("#step_2").hide();
    $("#step_3").hide();
    $("#step_2 a[id^='selected']").hide();
    $("#step_2_proceed").hide();
    $("#proceed_to_step_4").hide();

    $('#step_2_proceed').click(function() {
        $(this).hide();
    });

    $("#window_button").click(function() {
        $('#step_1_content').slideUp();
        $("#step_2").slideDown();
        $("#step_1_change_selection").text('Window .... click to change');
        $("#step_1_change_selection").show('slow');
    });

    $("#door_button").click(function() {
        $('#step_1_content').slideUp();
        $("#step_2").slideDown();
        $("#step_1_change_selection").text('Door .... click to change');
        $("#step_1_change_selection").show('slow');
    });


    $("#step_1_change_selection").click(function() {
        if (typeof my_window != "undefined") {
            delete my_window;
        }

        if (typeof my_door != "undefined") {
            delete my_door;
        }

        var hidden = $('#step_2').is(':hidden');
        if (!hidden) {
            $("#step_2").slideUp();
        }

        $('#step_1_content').slideDown();
        $("#step_1_change_selection").hide('slow');
    });

    $("#design_content a[id^='design']").click(function() {
        var product_id = createNewProduct.call(this);

        $(this).siblings().show();
        $("#step_3").slideDown();

        $('#designs').children().remove();
        $.each(products, function(index, product) {
            renderProductDataAndDesigns(product);
        });

        $('.form-control').bind('keyup', function() {
            var product_index = updateModel.call(this);
            validateFields(products[product_index]);

        });

        $('.dropdown-menu li').on('click', function(event) {
            var $target = $(event.currentTarget);
            var btn_group = $target.closest('.btn-group');
            btn_group.find('[data-bind="label"]').text($target.text());
            var dropdown_toggle = $target.children('.dropdown-toggle');
            dropdown_toggle.dropdown('toggle');
            return false;
        });

        if (products.length === 0) {
            $("#step_2_proceed").hide();
        } else {
            $("#step_2_proceed").show();
        }
    });
});
