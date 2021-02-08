import { Order } from "./model.js";

var cWidth = $(window).width();

//https://stackoverflow.com/questions/1974788/combine-onload-and-onresize-jquery
$(window).on("load", function () {
  const orderDict = localStorage.getItem("order");
  const order = new Order();
  if (orderDict) {
    order.fromJSON(orderDict);
    var numOrderItems = 0;
    if (order.orderCrepe.length) {
      for (var i in order.orderCrepe) {
        numOrderItems += 1;
      }
    }
    if (order.orderDrink.length) {
      for (var i in order.orderDrink) {
        numOrderItems += 1;
      }
    }
    if (order.orderSide.length) {
      for (var i in order.orderSide) {
        numOrderItems += 1;
      }
    }
    console.log("numOrderItems", numOrderItems);
    $("#ex4").attr("data-count", numOrderItems);
    $("#ex4").find("span").first().attr("data-count", numOrderItems);
    $("#ex4")
      .find("i")
      .first()
      .attr("data-count", "b" + numOrderItems);
  }
  $("body").css({ visibility: "visible" });
  //   $("#ex4").attr("data-count");
  const newWidth = $(window).width();

  if (cWidth < newWidth) {
    cWidth = newWidth;
  }

  if (cWidth <= 576) {
    $("#crepeButtonImage").remove();
    $("#crepeButton").css("background-color", "rgba(251, 35, 49)");
    $("#crepeButton").css("margin-top", "20px");
  }
});
