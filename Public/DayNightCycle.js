// Input the light:
// @input Component.LightSource light
// Name you put on the tween value script:
// @input string tweenName
// Object that is holding the tween value script component:
// @input SceneObject objectWithTweens
// Update event is fired every frame
var event = script.createEvent('UpdateEvent')

event.bind(function(eventData) {
  // get the tween value:
  var tweenValue = global.tweenManager.getGenericTweenValue(
    script.objectWithTweens,
    script.tweenName
  )
  // set the light's intensity to the tween value:
  script.light.color = tweenValue
})