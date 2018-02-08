#include "world_bounds.h"
#include <Box2d/Collision/Shapes/b2PolygonShape.h>

WorldBounds::WorldBounds()
{
}


WorldBounds::~WorldBounds()
{
}

void WorldBounds::init(b2World & world) {
	// Origin
	b2BodyDef originDef;
	originDef.type = b2_staticBody;
	originDef.position.Set(0.0f, 0.0f);
	origin = std::unique_ptr<b2Body>(world.CreateBody(&originDef));

	// Ground Box
	b2PolygonShape boundingBox;
	boundingBox.SetAsBox(1.5f, 0.5f, b2Vec2(0.5f, -0.5f), 0);
	origin->CreateFixture(&boundingBox, 0.0f);

	// Left Box
	boundingBox.SetAsBox(0.5f, 0.5f, b2Vec2(-0.5f, 0.5f), 0);
	origin->CreateFixture(&boundingBox, 0.0f);

	// Right Box
	boundingBox.SetAsBox(0.5f, 0.5f, b2Vec2(1.5f, 0.5f), 0);
	origin->CreateFixture(&boundingBox, 0.0f);

	// Top Box
	boundingBox.SetAsBox(1.5f, 0.5f, b2Vec2(0.5f, 1.5f), 0);
	origin->CreateFixture(&boundingBox, 0.0f);
}
