// -----JS CODE-----
//  @input SceneObject redCar
//  @input SceneObject blueCar

var wayPoints = [];
wayPoints.push(new vec3(-100,0,-800))
wayPoints.push(new vec3(-25,0,-2800))
wayPoints.push(new vec3(-280,0,-3900))
wayPoints.push(new vec3(550,0,-5000))
wayPoints.push(new vec3(1100,0,-5100))
wayPoints.push(new vec3(2000,275, -5050))
// Function runs at the start of every frame
var progress = 0;
var nextWayPoint = 0;
var check = false;
function Update() {
        progress += 0.02
    if (progress < 0.85) {
        script.blueCar.getTransform()
        var xy = getPositionAlongTheLine(script.blueCar.getTransform().getLocalPosition().x, script.blueCar.getTransform().getLocalPosition().y, script.blueCar.getTransform().getLocalPosition().z, wayPoints[nextWayPoint].x, wayPoints[nextWayPoint].y, wayPoints[nextWayPoint].z, progress);
        script.blueCar.getTransform().setLocalPosition(new vec3(xy.x, xy.y, xy.z))
      
        check = true;
    } else {
        if (check) {
            nextWayPoint++;
            print(nextWayPoint);
            var Yangle = CalcAngle(script.blueCar.getTransform().getLocalPosition().x, script.blueCar.getTransform().getLocalPosition().z , wayPoints[nextWayPoint].x, wayPoints[nextWayPoint].z)
            var Xangle = CalcAngle(script.blueCar.getTransform().getLocalPosition().y, script.blueCar.getTransform().getLocalPosition().z , wayPoints[nextWayPoint].y, wayPoints[nextWayPoint].z)
            var test = quat.fromEulerAngles(-Xangle, -Yangle, script.blueCar.getTransform().getLocalRotation().toEulerAngles().z)
            var spinTransform = script.blueCar.getTransform();
            spinTransform.setWorldRotation( quat.quatFromEuler( -Xangle, -Yangle, 0.0 ).invert() );
//            script.blueCar.getTransform().setWorldRotation(test.invert())
            check = false;
            progress = 0;
        }
    }

}

function CalcAngle(px, py, ax, ay)
{
    return Math.atan((ax-px)/(ay-py));
}

function getPositionAlongTheLine(x1, y1, z1, x2, y2, z2, percentage) {
    return {x : x1 * (1.0 - percentage) + x2 * percentage, z: z1 * (1.0 - percentage) + z2 * percentage, y : y1 * (1.0 - percentage) + y2 * percentage};
}

 
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(Update);