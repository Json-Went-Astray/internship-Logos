$(document).ajaxComplete(() => {
  if (!$("#shipping_method_0_flexible_shipping_single9").is(":checked")) {
    $(".shipping-method-description").hide();
  }
});

