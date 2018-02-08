#include "player.h"
#include <Box2D/Dynamics/b2Fixture.h>
#include <Box2D/Collision/Shapes/b2CircleShape.h>
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2d/Dynamics/b2Body.h>

Player::Player()
{
}

Player::~Player()
{
}

b2Vec2 Player::get_positon()
{
	return body->GetPosition();
}

bool Player::is_colling_below()
{
	return is_colliding_below_;
}

void Player::init(b2World & world, float32 x, float32 y)
{
	// Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.fixedRotation = true;
	body = std::unique_ptr<b2Body>(world.CreateBody(&bodyDef));

	// Three fixtures, two circles and rectangle to form capsule
	b2FixtureDef fixtureDef;
	fixtureDef.density = 1.0f;

	b2CircleShape lower_circle;
	lower_circle.m_p.Set(0.0f, -0.2f);
	lower_circle.m_radius = 0.2f;
	fixtureDef.shape = &lower_circle;
	body->CreateFixture(&fixtureDef);

	b2CircleShape upper_circle;
	upper_circle.m_p.Set(0.0f, 0.2f);
	upper_circle.m_radius = 0.2f;
	fixtureDef.shape = &upper_circle;
	body->CreateFixture(&fixtureDef);

	b2CircleShape jump_sensor;
	jump_sensor.m_p.Set(0.0f, -0.3f);
	jump_sensor.m_radius = 0.2f;
	fixtureDef.shape = &jump_sensor;
	fixtureDef.isSensor = true;
	body->CreateFixture(&fixtureDef);

	b2PolygonShape body_rect;
	body_rect.SetAsBox(0.02f, 0.02f);
	fixtureDef.shape = &body_rect;
	body->CreateFixture(&fixtureDef);
}
