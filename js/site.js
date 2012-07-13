// JavaScript Document
//GESCHREVEN DOOR MICHAEL VANDERPOORTEN (c)

$(function(){
	$("#balk").hover(
	function(){
		$(this).animate({"left":"-20"}, 500);
	},
	function(){
		$(this).animate({"left":"-180px"}, 500);
	});
	
});