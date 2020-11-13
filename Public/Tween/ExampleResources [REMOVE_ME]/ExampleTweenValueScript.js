//@input SceneObject objectWithTweens
//@input Component.LightSource lightSource

// Toggle between red, white, and blue based on value provided by TweenValue
function toggleColors()
{
    
//    var tweenValue = global.tweenManager.getGenericTweenValue( script.objectWithTweens, "test" );
    var tweenValue = global.tweenManager.getGenericTweenValue( script.objectWithTweens, "generic_tween" );
    print( tweenValue);
//    print(tweenValue.toString())
    if (script.lightSource != null) { 
        script.lightSource.color = tweenValue;  
    }
    
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(toggleColors);
