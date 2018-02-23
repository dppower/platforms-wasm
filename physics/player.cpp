#include "player.h"
#include <Box2D/Dynamics/b2Fixture.h>
#include <Box2D/Collision/Shapes/b2CircleShape.h>
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Body.h>
#include <Box2D/Common/b2Math.h>

Player::Player()
{
}

Player::~Player()
{
}

b2Vec2 Player::get_positon()
{
	return body_->GetPosition();
}

bool Player::is_colling_below()
{
	return is_colliding_below_;
}

void Player::init(b2World& world, RenderData* data_ptr)
{
	render_data_ = data_ptr;
	
	float x = render_data_->x;
	float y = render_data_->y;
	float hw = render_data_->w / 2;
	float hh = render_data_->h / 2;

	// Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.fixedRotation = true;
	body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&bodyDef), 
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Three fixtures, two circles and rectangle to form capsule
	b2FixtureDef fixtureDef;
	fixtureDef.density = 1.0f;

	b2CircleShape lower_circle;
	lower_circle.m_p.Set(0.0f, -hh);
	lower_circle.m_radius = hw;
	fixtureDef.shape = &lower_circle;
	body_->CreateFixture(&fixtureDef);

	b2CircleShape upper_circle;
	upper_circle.m_p.Set(0.0f, hh);
	upper_circle.m_radius = hw;
	fixtureDef.shape = &upper_circle;
	body_->CreateFixture(&fixtureDef);

	b2CircleShape jump_sensor;
	jump_sensor.m_p.Set(0.0f, -hh - 0.1f);
	jump_sensor.m_radius = hw;
	fixtureDef.shape = &jump_sensor;
	fixtureDef.isSensor = true;
	body_->CreateFixture(&fixtureDef);

	b2PolygonShape body_rect;
	body_rect.SetAsBox(hw, hh);
	fixtureDef.shape = &body_rect;
	body_->CreateFixture(&fixtureDef);
}

void Player::updateRenderData()
{
	b2Transform transform = body_->GetTransform();
	render_data_->x = transform.p.x;
	render_data_->y = transform.p.y;
}


