#include "platform.h"
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Fixture.h>
#include <cmath>

Platform::Platform()
{
}


Platform::~Platform()
{
}

Platform::Platform(Platform && platform) :
	body_(std::move(platform.body_))
{
}

void Platform::init(b2World & world, RenderData * data_ptr, int index)
{
	render_data_ = data_ptr + index;
	platform_index_ = index;

	float x = render_data_->x;
	float y = render_data_->y;
	float hw = render_data_->w / 2;
	float hh = render_data_->h / 2;
	float angle = std::atan2(render_data_->s, render_data_->c);

	// Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.angle = angle;
	body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&bodyDef),
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	b2FixtureDef fixtureDef;
	fixtureDef.density = 1.0f;

	b2PolygonShape body_rect;
	body_rect.SetAsBox(hw, hh);
	fixtureDef.shape = &body_rect;
	body_->CreateFixture(&fixtureDef);
}

void Platform::updateRenderData()
{
	b2Transform transform = body_->GetTransform();
	render_data_->x = transform.p.x;
	render_data_->y = transform.p.y;
	render_data_->c = transform.q.c;
	render_data_->s = transform.q.s;
}
