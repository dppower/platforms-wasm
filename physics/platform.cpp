#include "platform.h"
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Fixture.h>
#include <Box2D/Dynamics/Joints/b2PrismaticJoint.h>
#include <cmath>

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
	float hw = render_data_->w / 2;
	float hh = render_data_->h / 2;
	float angle = std::atan2(render_data_->s, render_data_->c);

	// Platform Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.angle = angle;
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

	// Start Point Body
	b2BodyDef startBodyDef;
	startBodyDef.type = b2_staticBody;
	startBodyDef.position.Set(render_data_->start_x, render_data_->start_y);
	startBodyDef.angle = angle;
	start_point_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&startBodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Start Point Fixture: None or else a sensor to detect point in rect

	// End Point
	b2BodyDef endBodyDef;
	endBodyDef.type = b2_staticBody;
	endBodyDef.position.Set(render_data_->end_x, render_data_->end_y);
	endBodyDef.angle = angle;
	end_point_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&endBodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// End Point Fixture: None or else a sensor to detect point in rect, moveable? Not in play mode.

	// Wheel Joint between start point and platform:
	b2PrismaticJointDef jointDef;
	jointDef.bodyA = start_point_.get();
	jointDef.bodyB = platform_body_.get();
	jointDef.localAxisA.Set(1, 0);
	jointDef.localAnchorA.Set(render_data_->start_x, render_data_->start_y);
	jointDef.localAnchorB.Set(x, y);
	jointDef.enableLimit = true;
	jointDef.lowerTranslation = 0;
	jointDef.upperTranslation = b2Distance(startBodyDef.position, endBodyDef.position);
}

void Platform::update(float dt)
{
	if (input_component_->wasButtonDown("left")) {
		bool test_point = platform_body_->GetFixtureList()->TestPoint(input_component_->previous_position);

		if (test_point) {
			float magnitude = platform_body_->GetMass() * 5;
			b2Vec2 impulse(magnitude * input_component_->dx, magnitude * input_component_->dy);
			platform_body_->ApplyLinearImpulse(impulse, input_component_->previous_position, true);
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
