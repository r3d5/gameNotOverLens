//@input SceneObject objectWithTweens
//@input Component.LightSource lightSource
var dayColor = new vec3(0.55, 0.55, 0.9)
var nightColor = new vec3(0.05, 0.05, 0.6)
var shouldSwitch = false
var isDay = true
// Toggle between red, white, and blue based on value provided by TweenValue
function toggleColors()
{
    
//    var tweenValue = global.tweenManager.getGenericTweenValue( script.objectWithTweens, "test" );
    var tweenValue = global.tweenManager.getGenericTweenValue( script.objectWithTweens, "generic_tween" );
    var test = new vec3(tweenValue.x, tweenValue.y, tweenValue.z)
    if (script.lightSource != null) { 
        script.lightSource.color = tweenValue;  
    }
   
    if (tweenValue.x == nightColor.x || tweenValue.x == dayColor.x) {
       shouldSwitch = true
    } 
    if (shouldSwitch) {
        if (isDay) {
                global.tweenManager.setStartValue(script.objectWithTweens, "generic_tween", nightColor)
                global.tweenManager.setEndValue(script.objectWithTweens, "generic_tween", dayColor)
                global.tweenManager.resetObject(script.objectWithTweens, "generic_tween")
        } else {
                global.tweenManager.setStartValue(script.objectWithTweens, "generic_tween", dayColor)
                global.tweenManager.setEndValue(script.objectWithTweens, "generic_tween", nightColor)
                global.tweenManager.resetObject(script.objectWithTweens, "generic_tween")
        }
        global.tweenManager.startTween( script.objectWithTweens, "generic_tween" );
        isDay = !isDay
        shouldSwitch = false
    } 
    
    
    
    
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(toggleColors);
