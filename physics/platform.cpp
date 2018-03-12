#include "platform.h"
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Fixture.h>
#include <Box2D/Dynamics/Joints/b2PrismaticJoint.h>
#include <Box2D/Dynamics/Joints/b2RevoluteJoint.h>
#include <cmath>
#include <emscripten/emscripten.h>

Platform::Platform()
{
}


Platform::~Platform()
{
}

Platform::Platform(Platform && platform) :
	platform_body_(std::move(platform.platform_body_)),
	start_point_(std::move(platform.start_point_)),
	end_point_(std::move(platform.end_point_))
{
}

void Platform::init(b2World & world, PlatformData * data_ptr, int index, InputComponent* input_component)
{
	render_data_ = data_ptr + index;
	platform_index_ = index;
	input_component_ = input_component;

	float x = render_data_->x;
	float y = render_data_->y;
	float hw = render_data_->hw;
	float hh = render_data_->hh;
	float platform_angle = std::atan2(render_data_->s, render_data_->c);

	// Platform Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.angle = platform_angle;
	bodyDef.angularDamping = 2.5f;
	bodyDef.linearDamping = 1.6f;
	bodyDef.gravityScale = 0;
	platform_body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&bodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Platform Fixture
	b2FixtureDef fixtureDef;
	fixtureDef.density = 2.6f;
	b2PolygonShape body_rect;
	body_rect.SetAsBox(hw, hh);
	fixtureDef.shape = &body_rect;
	fixtureDef.userData = nullptr;
	platform_body_->CreateFixture(&fixtureDef);

	// Path
	b2Vec2 start(render_data_->start_x, render_data_->start_y);
	b2Vec2 end(render_data_->end_x, render_data_->end_y);
	b2Vec2 path = end - start;
	path.Normalize();
	float path_angle = std::atan2(path.y, path.x);

	// Pivot Body
	b2BodyDef pivotBodyDef;
	pivotBodyDef.type = b2_dynamicBody;
	pivotBodyDef.position.Set(x, y);
	pivotBodyDef.angle = path_angle;
	pivotBodyDef.linearDamping = 1.6f;
	pivotBodyDef.gravityScale = 0;
	pivot_body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&pivotBodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Pivot Fixture
	b2FixtureDef pivotFixtureDef;
	pivotFixtureDef.density = 2.6f;
	b2PolygonShape pivot_rect;
	pivot_rect.SetAsBox(1.0f, 0.75f);
	pivotFixtureDef.shape = &pivot_rect;
	pivotFixtureDef.userData = nullptr;
	pivot_body_->CreateFixture(&pivotFixtureDef);

	// Start Point Body
	b2BodyDef startBodyDef;
	startBodyDef.type = b2_staticBody;
	startBodyDef.position.Set(start.x, start.y);
	startBodyDef.angle = path_angle;
	start_point_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&startBodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Start Point Fixture: None or else a sensor to detect point in rect

	// End Point
	b2BodyDef endBodyDef;
	endBodyDef.type = b2_staticBody;
	endBodyDef.position.Set(end.x, end.y);
	endBodyDef.angle = path_angle;
	end_point_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&endBodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// End Point Fixture: None or else a sensor to detect point in rect, moveable? Not in play mode.
	
	// Revolute Joint
	b2RevoluteJointDef rJointDef;
	rJointDef.bodyA = pivot_body_.get();
	rJointDef.bodyB = platform_body_.get();
	//rJointDef.motorSpeed = 0.0f;
	//rJointDef.enableMotor = true;

	revolute_joint_ = std::unique_ptr<b2Joint, std::function<void(b2Joint*)>>(
		world.CreateJoint(&rJointDef),
		[&world](b2Joint*  joint) { world.DestroyJoint(joint); }
	);

	// Prismatic Joint between start point and platform:
	b2PrismaticJointDef pJointDef;
	pJointDef.bodyA = start_point_.get();
	pJointDef.bodyB = pivot_body_.get();
	pJointDef.localAxisA.Set(1, 0);
	pJointDef.localAnchorA.Set(0, 0);
	pJointDef.localAnchorB.Set(0, 0);
	pJointDef.enableLimit = true;
	pJointDef.lowerTranslation = 0;
	pJointDef.upperTranslation = b2Distance(start, end);
	//pJointDef.maxMotorForce = 5.0f;
	//pJointDef.motorSpeed = 0.0f;
	//pJointDef.enableMotor = true;

	prismatic_joint_= std::unique_ptr<b2Joint, std::function<void(b2Joint*)>>(
		world.CreateJoint(&pJointDef),
		[&world](b2Joint*  joint) { world.DestroyJoint(joint); }
	);
}

void Platform::update(float dt)
{
	if (input_component_->wasButtonDown("left")) {
		bool test_point = pivot_body_->GetFixtureList()->TestPoint(input_component_->previous_position());

		if (test_point) {			
			float magnitude = pivot_body_->GetMass() * 6.5;
			b2Vec2 impulse(magnitude * input_component_->dx(), magnitude * input_component_->dy());
			pivot_body_->ApplyLinearImpulse(impulse, input_component_->previous_position(), true);
		}
		else {
			test_point = platform_body_->GetFixtureList()->TestPoint(input_component_->previous_position());

			if (test_point) {
				float magnitude = platform_body_->GetInertia() * 0.9;
				b2Vec2 force(magnitude * input_component_->dx(), magnitude * input_component_->dy());
				b2Vec2 arm = input_component_->previous_position() - platform_body_->GetWorldCenter();
				float32 impulse = b2Cross(arm, force);
				platform_body_->ApplyAngularImpulse(impulse, true);
			}
		}
	}
}

void Platform::updateRenderData()
{
	b2Transform transform = platform_body_->GetTransform();
	render_data_->x = transform.p.x;
	render_data_->y = transform.p.y;
	render_data_->c = transform.q.c;
	render_data_->s = transform.q.s;
}
